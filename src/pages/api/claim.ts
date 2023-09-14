import { createClient } from "@supabase/supabase-js";
import { SigningCosmWasmClient, Secp256k1HdWallet, GasPrice } from "cosmwasm";
import type { NextApiRequest, NextApiResponse } from "next";
import pino from "pino";
import { createWriteStream } from "pino-logflare";
import type { Parents } from "../../components/SpawningCard";
import { CONTRACTS, RPC_ENDPOINT } from "../../config";
import { env } from "../../env/server.mjs";

export type Child = {
  token_id: number;
  skin_tone: string;
};

// create pino-logflare logger
const logStream = createWriteStream({
  apiKey: env.LOGFLARE_API_KEY,
  sourceToken: env.LOGFLARE_SOURCE_TOKEN,
});
const logger = pino({}, logStream);

type Parent = {
  token_id: number;
  fertile: boolean;
  skin_tone: string;
};

const claim = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;
  if (!body.parents || !body.parents.female || !body.parents.male) {
    return res.status(500).send("Incorrect arguments provided.");
  }
  const parents: Parents = body.parents;
  const supabase = createClient(
    "https://msvnkzrbqnjknulgqbal.supabase.co",
    env.SUPABASE_KEY_PRIVATE
  );
  // Check parents are eligible
  const { data: femaleData, error: femaleError } = await supabase
    .from("females")
    .select()
    .eq("token_id", parseInt(parents.female));
  const { data: maleData, error: maleError } = await supabase
    .from("males")
    .select()
    .eq("token_id", parseInt(parents.male));
  if (femaleError || maleError) {
    logger.error(
      new Error("Failed to find parents in datbaase."),
      `female error: ${femaleError?.message} |  male error: ${maleError?.message}`
    );
    return res
      .status(500)
      .send("An unexpected error occurred, please try again. 001");
  }
  if (femaleData.length === 0 || maleData.length === 0) {
    logger.error(
      new Error("Failed to find parents in database"),
      `father: ${parents.male}, mother: ${parents.female}`
    );
    return res
      .status(500)
      .send("An unexpected error occurred, please try again. 002");
  }
  const female = femaleData[0] as Parent;
  const male = maleData[0] as Parent;
  // Get the parents skin tone from DB
  if (female.skin_tone !== male.skin_tone) {
    logger.error(
      new Error("Mismatching parents skin tone"),
      `father: ${parents.male} - ${male.skin_tone}, mother: ${parents.female} - ${female.skin_tone}`
    );
    return res
      .status(500)
      .send("These parents do not have matching skin tones");
  }
  if (!female.fertile || !male.fertile) {
    logger.error(
      new Error(`Both parents must be fertile`),
      `father: ${parents.male}, mother: ${parents.female}`
    );
    return res.status(500).send("Both parents must be fertile.");
  }
  const skinTone = female.skin_tone;
  // Check stars address for both parents is the same
  let cosmWasmClient: SigningCosmWasmClient;
  try {
    const wallet = await Secp256k1HdWallet.fromMnemonic(env.MNEMONIC, {
      prefix: "stars",
    });
    cosmWasmClient = await SigningCosmWasmClient.connectWithSigner(
      RPC_ENDPOINT,
      wallet,
      { gasPrice: GasPrice.fromString("1ustars") }
    );
  } catch (error) {
    logger.error(
      new Error("Failed to create signing client"),
      `father: ${parents.male}, mother: ${parents.female}`
    );
    return res
      .status(500)
      .send("Failed to connect to Stargaze chain. Try again later.");
  }
  const femaleOwnerResponse = await cosmWasmClient.queryContractSmart(
    CONTRACTS.female.sg721,
    {
      owner_of: { token_id: parents.female },
    }
  );
  const maleOwnerResponse = await cosmWasmClient.queryContractSmart(
    CONTRACTS.female.sg721,
    {
      owner_of: { token_id: parents.female },
    }
  );
  if (!femaleOwnerResponse.owner || !maleOwnerResponse.owner) {
    logger.error(
      new Error("Failed to grab NFT data from Stargaze chain."),
      `father: ${parents.male}, mother: ${parents.female}`
    );
    return res
      .status(500)
      .send("Failed to grab NFT data from Stargaze chain. Try again later.");
  }
  const femaleOwner = femaleOwnerResponse.owner;
  const maleOwner = maleOwnerResponse.owner;
  if (femaleOwner !== maleOwner) {
    logger.error(
      new Error("Both parent NFTs must be owned by the same wallet address."),
      `Male owner: ${maleOwner}, Female owner: ${femaleOwner} | father: ${parents.male}, mother: ${parents.female}`
    );
    return res
      .status(500)
      .send("Both parent NFTs must be owned by the same wallet address.");
  }
  // Get all children with that skin tone from DB
  const { data: childrenData, error: childrenError } = await supabase
    .from("children")
    .select()
    .filter("skin_tone", "eq", skinTone);
  if (childrenError || !childrenData) {
    logger.error(
      new Error(`Failed to get child with skin tone (${skinTone})`),
      `Owner: ${femaleOwner} | father: ${parents.male}, mother: ${parents.female}`
    );
    return res
      .status(500)
      .send("An unexpected error occurred, please try again. 004");
  }
  const randomChild = childrenData[
    Math.floor(Math.random() * childrenData.length) + 1
  ] as Child;
  if (!randomChild) {
    logger.error(
      new Error("Failed to choose a random child."),
      `Owner: ${femaleOwner} | father: ${parents.male}, mother: ${parents.female}`
    );
    return res
      .status(500)
      .send("An unexpected error occurred, please try again. 005");
  }
  // Call PG function to spawn child in DB
  const { error: pgFunctionError } = await supabase.rpc("spawn_child", {
    female_token_id: female.token_id,
    male_token_id: male.token_id,
    child_token_id: randomChild.token_id,
  });
  if (pgFunctionError) {
    logger.error(
      new Error("Failed to execute PG function (spawn_child)"),
      `Owner: ${femaleOwner} | father: ${parents.male}, mother: ${parents.female}, child: ${randomChild.token_id} - ${pgFunctionError.message}`
    );
    return res
      .status(500)
      .send("An unexpected error occurred, please try again. 006");
  }
  // Attempt to mint 1 randomly chosen child from the list
  logger.info(
    `Minting Child #${randomChild.token_id} to: ${femaleOwner} | father: ${parents.male}, mother: ${parents.female}`
  );
  try {
    await cosmWasmClient.execute(
      env.BACKEND_ADDRESS,
      CONTRACTS.children.minter,
      {
        mint_for: {
          token_id: randomChild.token_id,
          recipient: femaleOwner,
        },
      },
      "auto"
    );
    const child: Child = {
      token_id: randomChild.token_id,
      skin_tone: randomChild.skin_tone,
    };
    return res.status(200).json({ child: child });
  } catch (error: unknown) {
    console.error({ error });
    logger.error(
      new Error(`Failed to mint child (${randomChild.token_id})`),
      `Owner: ${femaleOwner} | father: ${parents.male}, mother: ${parents.female}`
    );
    // Call PG function to unspawn child in DB
    const { error: pgFunctionError } = await supabase.rpc("unspawn_child", {
      female_token_id: female.token_id,
      male_token_id: male.token_id,
      child_token_id: randomChild.token_id,
      child_skin_tone: randomChild.skin_tone,
    });
    if (pgFunctionError) {
      logger.error(
        new Error("Failed to execute PG function (unspawn_child)"),
        `Owner: ${femaleOwner} | father: ${parents.male}, mother: ${parents.female}, child: ${randomChild.token_id} - ${pgFunctionError.message}`
      );
    } else {
      logger.info(
        `Unspawned child ${randomChild.token_id} for owner: ${femaleOwner} | father: ${parents.male}, mother: ${parents.female}`
      );
    }
    if (error instanceof Error) {
      if (error.message.includes("already sold")) {
        logger.error(
          new Error(`Child already minted (${randomChild.token_id})`),
          `Owner: ${femaleOwner} | father: ${parents.male}, mother: ${parents.female}`
        );
        return res
          .status(500)
          .send(`Token ID ${randomChild.token_id} already minted.`);
      }
      logger.error(
        new Error(`Failed to mint child (${randomChild.token_id})`),
        `Owner: ${femaleOwner} | father: ${parents.male}, mother: ${parents.female} - ${error.message}`
      );
    }
    return res
      .status(500)
      .send("An unexpected error occurred, please try again. 007");
  }
};

export default claim;
