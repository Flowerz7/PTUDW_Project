import express from "express";
import dotenv from "dotenv";
import useSession from "./middlewares/session.mdw.js";
import useHBS from "./middlewares/view.mdw.js";
import routing from "./middlewares/route.mdw.js";
import handlingError from "./middlewares/errorhandling.mdw.js";
import connectMongoDB from "./middlewares/connectDB.mdw.js";
import configUtilities from "./middlewares/config.mdw.js";
import useLocalsOfRequest from "./middlewares/locals.mdw.js";

const app = express();
configUtilities(app);
useHBS(app);
useSession(app);
useLocalsOfRequest(app);
routing(app);
handlingError(app);
connectMongoDB();

dotenv.config();
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started listening on ${port}`);
});
