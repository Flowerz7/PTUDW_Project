import express from "express";
import exphbs from "express-handlebars";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";
import hbsSectons from "express-handlebars-sections";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

import accountRouter from "./routes/front/account.route.js";

// import Middlewares:
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(`${__dirname}/public`));
app.engine(
  "hbs",
  exphbs({
    defaultLayout: false,
    helpers: {
      section: hbsSectons(),
    },
  })
);
app.set("view engine", "hbs");
dotenv.config();

// Auth route
app.use("/account", accountRouter);

// Connect to MongooDB database:
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.get("/", (req, res) => {
  res.render("home");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started listening on ${port}`);
});
