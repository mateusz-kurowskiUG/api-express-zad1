import express, { NextFunction, Request, Response } from "express";
import vars from "../server";
import Item from "../db/classes/Item.class";
import { ItemInterface } from "../db/interfaces/Item.model";
const userRoute = express.Router();

userRoute
  .get("/", async (req: Request, res: Response, next: NextFunction) => {
    const { sort, filter } = req.query;
    const collection = process.env.COLLECTION || "";
    const dbo = await vars.dbo;
    if (!dbo) {
      res.status(500).send({ error: "No connection with DB!" });
      return;
    }
    const cursor = await dbo.collection(collection);

    if (!sort && !filter) {
      const products = await cursor.find({}).toArray();
      res.status(200).send(products);
      return;
    } else if (sort && filter) {
      const [sortBy, sortOrder] = sort.toString().split(",");
      let [filterBy, filterValue] = filter.toString().split(",");
      let filterVal;
      if (filterBy === "quantity" || filterBy === "price") {
        filterVal = +filterValue;
      } else {
        filterVal = filterValue;
      }
      const products = await cursor
        .find({ [filterBy]: filterVal })
        .sort({ [sortBy]: +sortOrder })
        .toArray();
      res.status(200).send(products);
    } else if (sort && !filter) {
      const [sortBy, sortOrder] = sort.toString().split(",");
      const products = await cursor
        .find({})
        .sort({ [sortBy]: +sortOrder })
        .toArray();
      res.status(200).send(products);
    } else {
      const [filterBy, filterValue] = filter.toString().split(",");
      let filterVal;
      if (filterBy === "quantity" || filterBy === "price") {
        filterVal = +filterValue;
      } else {
        filterVal = filterValue;
      }

      const products = await cursor.find({ [filterBy]: filterVal }).toArray();
      res.status(200).send(products);
    }
  })
  .post("/", async (req: Request, res: Response, next: NextFunction) => {
    const { name, price, description, quantity, measure } = req.body;
    if (!name || !price || !description || !quantity || !measure) {
      res.status(500).send("WRONG POST! ADD ALL OF THE ARGUMENTS");
      return;
    }
    const collection = process.env.COLLECTION || "";
    const dbo = await vars.dbo;
    if (!dbo) {
      res.status(500).send("Cannot connect to DB");
      return;
    }
    const exists =
      (await dbo.collection(collection).find({ name: name }).toArray())
        .length >= 1;

    if (exists) {
      res.status(500).send("Item already exists!");
      return;
    }
    const newItem: Item = new Item(name, price, description, quantity, measure);
    const result = await dbo.collection(collection).insertOne(newItem);

    res
      .status(200)
      .send(`Item: ${JSON.stringify(newItem)} added?:${result.acknowledged}`);
  });

export default userRoute;
