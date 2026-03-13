import { getDb } from "../../db/mongoClient.js";

export async function getListings() {
  const db = await getDb();
  const results = await db
    .collection("listings")
    .find({})
    .toArray();

  return results;
}
