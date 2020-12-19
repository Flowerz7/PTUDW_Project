import express from "express";
import exphbs from "express-handlebars";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
//#region Set up the __dirname variable
import { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(`${__dirname}/public`));
//#endregion

// To declare environment in .env file
dotenv.config();
app.use(cors());
app.use(express.json());

//#region Set up the logger Morgan
app.use(morgan("dev"));
//#endregion

// connect to MongooDB database:
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

//#region Set up the view engine
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
//#endregion

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/authen/login", (req, res) => {
  res.render("authentication/login");
});

app.get("/authen/signup", (req, res) => {
  res.render("authentication/signup");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started listening on ${port}`);
});
