import express from "express";
import bodyParser from "body-parser";
const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

import {
  handle_admin_get,
  handle_categories_get,
  handle_courses_get,
  handle_students_get,
  handle_teachers_get,
  handle_add_category_get,
  handle_add_category_post,
  handle_delete_category_post,
  handle_update_category_get,
  handle_update_category_post,
  handle_is_available_category_name,
  handle_delete_course_post,
  handle_delete_student_post,
  handle_detail_course_get,
  handle_detail_student_get,
  handle_delete_teacher_post,
  handle_detail_teacher_get,
  handle_add_teacher_get,
  handle_add_teacher_post,
  handle_is_available_teacher,
} from "../controllers/admin.controller.js";

router.route("/").get(handle_admin_get);

router.route("/categories").get(handle_categories_get);

router.route("/categories/add").get(handle_add_category_get);

router.route("/categories/is-available").get(handle_is_available_category_name);

router
  .route("/categories/add")
  .post(urlencodedParser, handle_add_category_post);

router
  .route("/categories/delete")
  .post(urlencodedParser, handle_delete_category_post);

router
  .route("/categories/update")
  .get(urlencodedParser, handle_update_category_get);

router
  .route("/categories/update")
  .post(urlencodedParser, handle_update_category_post);

router.route("/courses").get(handle_courses_get);

router
  .route("/courses/detail")
  .post(urlencodedParser, handle_detail_course_get);

router
  .route("/courses/delete")
  .post(urlencodedParser, handle_delete_course_post);

router.route("/students").get(handle_students_get);

router
  .route("/students/detail")
  .post(urlencodedParser, handle_detail_student_get);

router
  .route("/students/delete")
  .post(urlencodedParser, handle_delete_student_post);

router.route("/teachers").get(handle_teachers_get);

router
  .route("/teachers/delete")
  .post(urlencodedParser, handle_delete_teacher_post);

router
  .route("/teachers/detail")
  .post(urlencodedParser, handle_detail_teacher_get);

router.route("/teachers/add").get(handle_add_teacher_get);

router
  .route("/teachers/is-available")
  .get(urlencodedParser, handle_is_available_teacher);

router.route("/teachers/add").post(urlencodedParser, handle_add_teacher_post);

export default router;
