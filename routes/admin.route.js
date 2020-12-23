import express from "express";
const router = express.Router();

import {
  handle_admin_get,
  handle_categories_get,
  handle_courses_get,
  handle_students_get,
  handle_teachers_get,
} from "../controllers/admin.controller.js";

router.route("/").get(handle_admin_get);

router.route("/categories").get(handle_categories_get);

router.route("/courses").get(handle_courses_get);

router.route("/students").get(handle_students_get);

router.route("/teachers").get(handle_teachers_get);

export default router;
