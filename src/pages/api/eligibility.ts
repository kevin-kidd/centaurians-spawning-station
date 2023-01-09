import { type NextApiRequest, type NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { env } from "../../env/server.mjs";
import type { Inventory, Parents } from "../../components/SpawningCard.jsx";

const eligibility = async (req: NextApiRequest, res: NextApiResponse) => {
  const body = JSON.parse(req.body);
  const inventory: Inventory = body.inventory;
  if (!inventory || !inventory.male || !inventory.female) {
    return res.status(500).send("Inventory was not included in the request!");
  }
  const supabase = createClient(
    "https://msvnkzrbqnjknulgqbal.supabase.co",
    env.SUPABASE_KEY
  );
  const { data: femalesData, error: femalesError } = await supabase
    .from("females")
    .select()
    .filter(
      "token_id",
      "in",
      `(${inventory.female.map((a: string) => JSON.stringify(a)).join()})`
    );
  const { data: malesData, error: malesError } = await supabase
    .from("males")
    .select()
    .filter(
      "token_id",
      "in",
      `(${inventory.male.map((a: string) => JSON.stringify(a)).join()})`
    );
  if (malesError || femalesError) {
    return res.status(500).send("An unexpected error occurred - 1");
  }
  if (!malesData || !femalesData) {
    return res.status(500).send("An unexpected error occurred - 2");
  }
  const eligibleParents: Parents[] = [];
  // Find matching parents
  const males: NFT_DATA[] = malesData.filter((male: NFT_DATA) => male.fertile);
  const females: NFT_DATA[] = femalesData.filter(
    (male: NFT_DATA) => male.fertile
  );
  if (!males || !females) {
    // If there isn't any fertile males or females
    return res.status(500).json({ parents: [] });
  }
  for (const male of males) {
    const femaleIndex = females.findIndex(
      (female: NFT_DATA) => female.skin_tone === male.skin_tone
    );
    const female = females[femaleIndex];
    if (female) {
      eligibleParents.push({
        male: male.token_id.toString(),
        female: female.token_id.toString(),
        skin_tone: female.skin_tone,
      });
      females.splice(femaleIndex, 1);
    }
  }
  res.status(200).json({ parents: eligibleParents });
};

type NFT_DATA = {
  token_id: number;
  fertile: boolean;
  skin_tone: string;
};

export default eligibility;
