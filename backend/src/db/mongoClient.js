import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGODB_DB_NAME || "app_db";

let client;
let database;

export async function getDb() {
  if (database) {
    return database;
  }

  client = new MongoClient(uri);
  await client.connect();
  database = client.db(dbName);

  return database;
}
