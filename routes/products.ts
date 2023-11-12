import express, { NextFunction, Request, Response } from "express";
import vars from "../server";
const userRoute = express.Router();

userRoute.get("/", async (req: Request, res: Response, next: NextFunction) => {
  const { sort, filter } = req.query;
  if (!sort && !filter) {
    return;
  }

  const collection = process.env.COLLECTION || "";
  const dbo = await vars.dbo;
  if (!dbo) {
    res.status(500).send({ error: "No connection with DB!" });
    return;
  }
  const products = await dbo
    .collection(collection)
    .find({}, { sort: { [sort]: 1 } })
    .toArray();
  res.status(200).send(products);
});

export default userRoute;
