import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../env/server.mjs";

const getTournaments = async (req: NextApiRequest, res: NextApiResponse) => {
  const body: {
    key: string;
  } = req.body;
  if (!body.key || body.key !== env.TOURNAMENT_KEY) {
    return res.status(400).send("You must provide a valid key.");
  }
  const supabase = createClient(
    "https://msvnkzrbqnjknulgqbal.supabase.co",
    env.SUPABASE_KEY_PRIVATE
  );
  const { data, error } = await supabase.from("tournaments").select();
  if (error) {
    console.error({ error });
    return res.status(400).send(error.message);
  }
  return res.status(200).json({ data });
};

export default getTournaments;
