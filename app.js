import express from "express";
import exphbs from "express-handlebars";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";
import hbsSectons from "express-handlebars-sections";
import session from "express-session";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

import accountRouter from "./routes/front/account.route.js";
import adminRouter from "./routes/admin.route.js";

// import Middlewares:
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static(`${__dirname}/public`));
app.set("trust proxy", 1);
app.use(
  session({
    secret: "SECRET_KEY",
    resave: false,
    saveUninitialized: true,
    cookie: {
      //secure: true
    },
  })
);
app.engine(
  "hbs",
  exphbs({
    defaultLayout: "main.hbs",
    helpers: {
      section: hbsSectons(),
    },
  })
);
app.set("view engine", "hbs");
dotenv.config();

// Auth route
app.use("/account", accountRouter);
app.use("/admin", adminRouter);

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

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Page Not Found",
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started listening on ${port}`);
});
