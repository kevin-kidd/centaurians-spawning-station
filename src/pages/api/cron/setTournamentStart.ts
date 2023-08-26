import type {
  NextApiRequest,
  NextApiResponse,
} from "next/dist/shared/lib/utils";
import { getDatabaseInstance } from "../../../utils/firebaseAdmin";

export default async function handler(
  requst: NextApiRequest,
  response: NextApiResponse
) {
  const db = getDatabaseInstance();

  try {
    const ref = db.ref();
    await ref.update({
      Tournament: 1,
    });
    console.log("Tournament started");
  } catch (error) {
    console.error("Error updating the database:", error);
    return response.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : error,
    });
  }

  return response.status(200).json({ success: true });
}
