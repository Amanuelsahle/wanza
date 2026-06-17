import { MongoClient, type Db } from "mongodb";
import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");
const options = {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
};

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient> | undefined;

async function connectMongo(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
  }

  const client = new MongoClient(uri, options);
  return client.connect();
}

function getClientPromise(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = connectMongo();
    }
    return global._mongoClientPromise;
  }

  if (!clientPromise) {
    clientPromise = connectMongo();
  }

  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const connectedClient = await getClientPromise();
  return connectedClient.db(process.env.MONGODB_DB ?? "wanza");
}
