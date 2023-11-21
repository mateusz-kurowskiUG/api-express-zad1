import express, { NextFunction, Request, Response } from "express";
import vars from "../server";
import Item from "../db/classes/Item.class";
import { ItemInterface } from "../db/interfaces/Item.model";
import { ObjectId } from "mongodb";
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
      return;
    } else if (sort && !filter) {
      const [sortBy, sortOrder] = sort.toString().split(",");
      const products = await cursor
        .find({})
        .sort({ [sortBy]: +sortOrder })
        .toArray();
      res.status(200).send(products);
      return;
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
      return;
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
    return;
  })
  .put("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, price, description, quantity, measure } = req.body;
    const propArray = [name, price, description, quantity, measure];

    if (
      !id ||
      !ObjectId.isValid(id) ||
      propArray.filter((e) => e !== undefined).length === 0
    ) {
      res.status(500).send("Please enter valid item's id");
      return;
    }
    const propObject = { name, price, description, quantity, measure };
    const updateFilter = Object.entries(propObject).reduce((acc, currVal) => {
      const [key, val] = currVal;
      if (val) acc[key] = val;
      return acc;
    }, {});

    const collection = process.env.COLLECTION || "";
    const dbo = await vars.dbo;
    if (!dbo) {
      throw Error("Couldn't connect to db ");
    }

    await dbo
      .collection(collection)
      .updateMany({ _id: new ObjectId(id) }, { $set: updateFilter })
      .then((x) => {
        if (x.modifiedCount) {
          res.status(200).send({
            success: x.modifiedCount === 1,
            modified: x.modifiedCount,
          });
          return;
        } else if (x.matchedCount) {
          res.status(403).send("This product already has such properties !");
          return;
        } else {
          res.status(404).send("Product with that id not found!");
          return;
        }
      })
      .catch((e) => {
        res.status(500).send({ error: e });
      });
  })
  .delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    if (!id || !ObjectId.isValid(id)) {
      res.status(404).send("Please enter valid _id");
      return;
    }
    const collection = process.env.COLLECTION || "";
    const dbo = await vars.dbo;
    if (!dbo) {
      res.status(500).send("Couldn't connect to DB");
      return;
    }
    const result = await dbo
      .collection(collection)
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount) {
      res.status(200).send({ deleted: result.deletedCount });
      return;
    } else {
      res.status(404).send({ deleted: result.deletedCount });
      return;
    }
  })
  .get("/report", async (req: Request, res: Response, next: NextFunction) => {
    const collection = process.env.COLLECTION || "";

    const dbo = await vars.dbo;
    if (!dbo) {
      res.send(400).send("Couldn't connect to DB");
      return;
    }
    try {
      const report = await dbo
        .collection(collection)
        .aggregate([
          {
            $group: {
              _id: "$name",
              totalQuantity: { $sum: "$quantity" },
            },
          },
          {
            $project: {
              _id: 1,
              totalQuantity: 1,
              totalPrice: { $multiply: ["$price", "$totalQuantity"] },
            },
          },
          { $sort: { totalQuantity: 1 } },
        ])
        .toArray();
      res.status(200).json(report);
      return;
    } catch (error) {
      res.status(500).send(error);
      return;
    }
  });

export default userRoute;
