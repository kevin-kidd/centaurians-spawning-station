import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../env/server.mjs";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import moment from "moment";
import type { MsgExecuteContractEncodeObject } from "cosmwasm";
import { toUtf8 } from "cosmwasm";
import { GasPrice, Secp256k1HdWallet, SigningCosmWasmClient } from "cosmwasm";
import { CONTRACTS, RPC_ENDPOINT } from "../../config";

const faucet = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = req.body;
  if (!body.address) {
    return res.status(500).send("You must provide an address.");
  }
  const address = body.address;
  const supabase = createClient(
    "https://msvnkzrbqnjknulgqbal.supabase.co",
    env.SUPABASE_KEY_PRIVATE
  );
  const { data, error } = await supabase
    .from("faucet")
    .select()
    .eq("address", address);
  if (error) {
    return res.status(500).send(error.message);
  }
  if (data[0] && data[0].created_at) {
    const days = moment().diff(moment(data[0].created_at), "days");
    if (days < 1) {
      return res
        .status(500)
        .send("You may only use the faucet once every 24 hours.");
    }
  }

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
  try {
    const mintMsg = {
      mint_to: {
        recipient: address,
      },
    };
    const mintFemaleMsg: MsgExecuteContractEncodeObject = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: env.BACKEND_ADDRESS,
        contract: CONTRACTS.female.minter,
        msg: toUtf8(JSON.stringify(mintMsg)),
        funds: [],
      }),
    };
    const mintMaleMsg: MsgExecuteContractEncodeObject = {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: env.BACKEND_ADDRESS,
        contract: CONTRACTS.male.minter,
        msg: toUtf8(JSON.stringify(mintMsg)),
        funds: [],
      }),
    };
    await cosmWasmClient.signAndBroadcast(
      env.BACKEND_ADDRESS,
      [...Array(5).fill(mintFemaleMsg), ...Array(5).fill(mintMaleMsg)],
      "auto"
    );
  } catch (error) {
    return res.status(500).send("Failed to mint the NFTs. Try again later.");
  }
  // Update DB with new timestamp
  const newRow = {
    address: address,
    created_at: moment(),
  };
  const { error: upsertError } = await supabase.from("faucet").upsert(newRow);
  if (upsertError) {
    console.error({ upsertError });
  }
  return res.status(200).send("Successfully minted 5 male and 5 female NFTs!");
};

export default faucet;
