import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.MONGODB_DB_NAME || "app_db";

let client;
let database;
let mongooseConnectionPromise;

export async function connectMongoose() {
  if (!mongooseConnectionPromise) {
    mongooseConnectionPromise = mongoose.connect(uri, {
      dbName,
    });
  }

  await mongooseConnectionPromise;
  return mongoose.connection;
}

// TODO: remove once everything is migrated to mongoose
export async function getDb() {
  if (database) {
    return database;
  }

  client = new MongoClient(uri);
  await client.connect();
  database = client.db(dbName);

  return database;
}
