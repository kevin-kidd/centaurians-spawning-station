import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../env/server.mjs";

const tournament = async (req: NextApiRequest, res: NextApiResponse) => {
  const body: {
    winner: string;
    key: string;
  } = req.body;
  if (!body.winner) {
    return res.status(500).send("You must provide an address.");
  }
  if (!body.key || body.key !== env.TOURNAMENT_KEY) {
    return res.status(500).send("You must provide a valid key.");
  }
  const supabase = createClient(
    "https://msvnkzrbqnjknulgqbal.supabase.co",
    env.SUPABASE_KEY_PRIVATE
  );
  const { data, error } = await supabase
    .from("tournaments")
    .insert({ winner: body.winner });
  if (error) {
    console.error({ error });
    return res.status(500).send(error.message);
  }
  return res.status(200).send("Success!");
};

export default tournament;
