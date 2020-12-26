import express from "express";
import morgan from "morgan";
import cors from "cors";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const configUtilities = (app) => {
  app.use(express.static(`${__dirname}/public`));

  app.use(express.json());

  app.use(morgan("dev"));

  app.use(cors());
};

export default configUtilities;
