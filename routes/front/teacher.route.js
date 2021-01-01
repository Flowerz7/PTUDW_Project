import express from "express";
import bodyParser from "body-parser";
const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

import * as teacher from "../../controllers/teacher.controller.js";

router.route("/").get(teacher.handle_teacher_page_get);

router.route("/add").get(teacher.handle_add_course_get);

router.route("/add").post(urlencodedParser, teacher.handle_add_course_post);

export default router;
