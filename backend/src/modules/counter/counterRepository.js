import { getDb } from "../../db/mongoClient.js";

export async function insertCounterValue(value) {
  const db = await getDb();
  const document = {
    value,
    createdAt: new Date(),
  };

  const result = await db.collection("counter_events").insertOne(document);
  return {
    id: result.insertedId.toString(),
    value: document.value,
    createdAt: document.createdAt,
  };
}

export async function getCounterTotal() {
  const db = await getDb();
  const summary = await db
    .collection("counter_events")
    .aggregate([{ $group: { _id: null, total: { $sum: "$value" } } }])
    .next();

  return summary?.total ?? 0;
}

export async function getCounterEventCount() {
  const db = await getDb();
  return db.collection("counter_events").countDocuments();
}
