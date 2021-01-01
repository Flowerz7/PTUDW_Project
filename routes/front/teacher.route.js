import express from "express";
import bodyParser from "body-parser";
const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

import * as teacher from "../../controllers/teacher.controller.js";

router.route("/").get(teacher.handle_teacher_page_get);

router.route("/add").get(teacher.handle_add_course_get);

router.route("/add").post(urlencodedParser, teacher.handle_add_course_post);

router.route("/upload/:courseID").get(teacher.handle_upload_videos_get);

router
  .route("/upload/:courseID")
  .post(urlencodedParser, teacher.handle_upload_videos_post);

router.route("/update/:courseID").get(teacher.handle_update_course_get);

router
  .route("/update/:courseID")
  .post(urlencodedParser, teacher.handle_update_course_post);

export default router;
