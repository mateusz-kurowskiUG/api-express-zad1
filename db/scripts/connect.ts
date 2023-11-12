import { Db, MongoClient } from "mongodb";
import prepareCollection from "./create";
const dbString = process.env.DB || "";

async function connect(client: MongoClient): Promise<MongoClient | void> {
  try {
    const conn = await client.connect();
    console.log("Connected to Atlas!");
    return conn;
  } catch (e) {
    console.error(e);
    return;
  }
}
async function useDb(connection: MongoClient): Promise<Db | void> {
  if (connection) {
    const db = await connection.db(dbString);
    if (db) {
      console.log("Connected to DB");

      return db;
    }
    return;
  }
  return;
}

async function run(): Promise<Db | void> {
  const connectionString = process.env.ATLAS_URI || "";
  const client = await new MongoClient(connectionString);

  const conn = await connect(client);
  if (!conn) {
    throw new Error("couln't connect");
  }
  const dbo = await useDb(conn);
  if (!dbo) {
    throw new Error("couln't connect");
  }

  await prepareCollection(dbo);
  return dbo;
}
export default run;
