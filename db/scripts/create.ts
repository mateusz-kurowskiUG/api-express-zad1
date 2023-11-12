import { Collection, Db } from "mongodb";
import exampleData from "../data/exampleData";

const prepareCollection = async (dbo: Db): Promise<void> => {
  const collection = process.env.COLLECTION || "";
  const collections = await dbo.collections();
  const found = collections.find((coll) => coll.collectionName === collection);
  if (found) {
    console.log("Collection found!");
    await dbo.dropCollection(collection);
    console.log("Collection dropped!");
  }

  await createCollection(dbo, collection);
};

const createCollection = async (db: Db, collectionName) => {
  try {
    const newCollection = await db.createCollection(collectionName);
    console.log("Collection created!");
    await addData(newCollection);
  } catch (e) {
    console.log(e);
  }
};
const addData = async (collection: Collection) => {
  try {
    await collection.insertMany(exampleData);
    console.log("Data inserted!");
  } catch (e) {
    console.log(e);
  }
};

export default prepareCollection;
