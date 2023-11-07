import express from "express";
import cors from "cors";
import dbo from "mongodb";
require("dotenv").config({ path: "./config.env" });
import { run, client } from "./db/scripts/connect";
import { log } from "console";
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  run();

});
