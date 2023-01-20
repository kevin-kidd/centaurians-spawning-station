import { createClient } from "@supabase/supabase-js";
import { SigningCosmWasmClient, Secp256k1HdWallet, GasPrice } from "cosmwasm";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Parents } from "../../components/SpawningCard";
import { CONTRACTS, RPC_ENDPOINT } from "../../config";
import { env } from "../../env/server.mjs";

export type Child = {
  token_id: number;
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
    console.error({ femaleError });
    console.error({ maleError });
    return res
      .status(500)
      .send("An unexpected error occurred, please try again. 001");
  }
  if (femaleData.length === 0 || maleData.length === 0) {
    console.error({ parents });
    return res
      .status(500)
      .send("An unexpected error occurred, please try again. 002");
  }
  const female: {
    token_id: number;
    fertile: boolean;
    skin_tone: string;
  } = femaleData[0];
  const male: {
    token_id: number;
    fertile: boolean;
    skin_tone: string;
  } = maleData[0];
  // Get the parents skin tone from DB
  if (female.skin_tone !== male.skin_tone) {
    return res
      .status(500)
      .send("These parents do not have matching skin tones");
  }
  if (!female.fertile || !male.fertile) {
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
      { gasPrice: GasPrice.fromString("0ustars") }
    );
  } catch (error) {
    console.error({ error });
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
    return res
      .status(500)
      .send("Failed to grab NFT data from Stargaze chain. Try again later.");
  }
  const femaleOwner = femaleOwnerResponse.owner;
  const maleOwner = maleOwnerResponse.owner;
  if (femaleOwner !== maleOwner) {
    return res
      .status(500)
      .send("Both parent NFTs must be owned by the same wallet address.");
  }
  // Get all children with that skin tone from DB
  const { data: childrenData, error: childrenError } = await supabase
    .from("children")
    .select()
    .filter("skin_tone", "eq", skinTone);
  if (childrenError) {
    console.error({ childrenError });
    return res
      .status(500)
      .send("An unexpected error occurred, please try again. 004");
  }
  const randomChild: {
    token_id: number;
    skin_tone: string;
  } = childrenData[Math.floor(Math.random() * childrenData.length) + 1];
  // Attempt to mint 1 randomly chosen child from the list
  console.log(`Minting Child #${randomChild.token_id} to: ${femaleOwner}`);
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
  } catch (error: unknown) {
    console.error({ error });
    if (error instanceof Error) {
      if (error.message.includes("already sold")) {
        return res
          .status(500)
          .send(`Token ID ${randomChild.token_id} already minted.`);
      }
    }
    return res
      .status(500)
      .send("An unexpected error occurred, please try again. 006");
  }
  // Call PG function to spawn child in DB
  const { error: pgFunctionError } = await supabase.rpc("spawned_child", {
    female_token_id: female.token_id,
    male_token_id: male.token_id,
    child_token_id: randomChild.token_id,
  });
  if (pgFunctionError) {
    console.error({ pgFunctionError });
    // TODO -- send to logging service
  }
  const child: Child = {
    token_id: randomChild.token_id,
    skin_tone: randomChild.skin_tone,
  };
  // Make parents infertile
  return res.status(200).json({ child: child });
};

export default claim;
