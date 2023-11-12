import express, { NextFunction, Request, Response } from "express";
import vars from "../server";
const userRoute = express.Router();

userRoute.get("/", async (req: Request, res: Response, next: NextFunction) => {
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
});

export default userRoute;
