require("dotenv").config({ path: "./config.env" });
import express from "express";
import cors from "cors";
import run from "./db/scripts/connect";
import userRoute from "./routes/products";

const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use('/products',userRoute);

const dbo = run()
  .then()
  .catch((e) => {
    throw e;
  });
const server = app.listen(port, async () => {
  console.log(port);
  // const dbo = await run();
});

export default {
  server,
  app,
  dbo,
};
