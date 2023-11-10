import { MongoClient, ServerApiVersion } from "mongodb";
require("dotenv").config({ path: "./config.env" });
import { log } from "console";
// const url = process.env.URI!;
const creds = process.env.CREDS!;

export const client: MongoClient = new MongoClient(creds, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let conn;
export async function run() {
  try {
    conn = await client.connect();
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

export default conn;
