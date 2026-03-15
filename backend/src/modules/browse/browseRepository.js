import { getDb } from "../../db/mongoClient.js";

export async function getListings({ search, genre }) {
  const db = await getDb();

  const query = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (genre) {
    query.genre = genre;
  }
  const results = await db
    .collection("listings")
    .find(query)
    .toArray();

  return results;
}
