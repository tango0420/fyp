import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
if (!uri) throw new Error("Please define the MONGODB_URI environment variable");

let client = global._mongoClient;
if (!client) {
  client = new MongoClient(uri);
  global._mongoClient = client;
}
const clientPromise = client.connect();

export default clientPromise;
