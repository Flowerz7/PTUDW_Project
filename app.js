import express from "express";
import exphbs from "express-handlebars";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

import adminsRouter from "./routes/admins.js";
import teachersRouter from "./routes/teachers.js";
import studentsRouter from "./routes/students.js";
import coursesRouter from "./routes/courses.js";
import categoriesRouter from "./routes/categories.js";

// import Middlewares:
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(`${__dirname}/public`));
app.engine(
  "hbs",
  exphbs({
    defaultLayout: false,
  })
);
app.set("view engine", "hbs");
dotenv.config();

app.use("./admins", adminsRouter);
app.use("./students", studentsRouter);
app.use("./teachers", teachersRouter);
app.use("./courses", coursesRouter);
app.use("./categories", categoriesRouter);

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
