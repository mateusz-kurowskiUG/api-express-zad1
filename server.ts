import express from "express";
import cors from "cors";
import dbo from "mongodb";
require("dotenv").config({ path: "./config.env" });
import conn, { run, client } from "./db/scripts/connect";
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response): void => {
  return;
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  run();
});
