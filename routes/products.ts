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
  }
  if (sort && filter) {
    const [sortBy, sortOrder] = sort.toString().split(",");
    const [filterBy, filterValue] = filter.toString().split(",");
    console.log(sortBy, sortOrder);
    console.log(filterBy, filterValue);
    const products = await cursor
      .find({ [filterBy]: +filterValue })
      .sort({ [sortBy]: +sortOrder })
      .toArray();
    console.log();

    res.status(200).send(products);
  }
});

export default userRoute;
