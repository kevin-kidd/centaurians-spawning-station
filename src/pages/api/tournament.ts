import { createClient } from "@supabase/supabase-js";
import { isAfter, parse } from "date-fns";
import type { NextApiRequest, NextApiResponse } from "next";
import { env } from "../../env/server.mjs";

const tournament = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
      await addWinner(req.body);
      return res.status(200).send("Success.");
    } else if (req.method === "GET") {
      let isActive = false;
      // Check if tournament is active
      const supabase = createClient(
        "https://msvnkzrbqnjknulgqbal.supabase.co",
        env.SUPABASE_KEY_PRIVATE
      );
      const { data, error } = await supabase.from("tournaments").select();
      if (error) throw new Error(error.message);
      if (data.length > 0) {
        isActive = checkIfActive(data as Row[]);
      }
      return res.status(200).send(isActive);
    } else {
      return res.status(500).send("Invalid method.");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send(error);
  }
};

type Row = {
  id: number;
  start: string;
  end: string;
};

const addWinner = async (body: { winner: string; key: string }) => {
  // Add winner
  if (!body.winner) {
    throw new Error("You must provide an address.");
  }
  if (!body.key || body.key !== env.TOURNAMENT_KEY) {
    throw new Error("You must provide a valid key.");
  }
  const supabase = createClient(
    "https://msvnkzrbqnjknulgqbal.supabase.co",
    env.SUPABASE_KEY_PRIVATE
  );
  const { error } = await supabase
    .from("tournament_winners")
    .insert({ winner: body.winner });
  if (error) throw new Error(error.message);
};

const checkIfActive = (data: Row[]) => {
  const date = new Date();
  for (const row of data) {
    const startDate = parse(row.start, "HH:mm:ssx", new Date());
    const endDate = parse(row.end, "HH:mm:ssx", new Date());
    if (isAfter(date, startDate) && isAfter(endDate, date)) {
      return true;
    }
  }
  return false;
};

export default tournament;
