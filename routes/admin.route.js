import express from "express";
import bodyParser from "body-parser";
const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

import * as admin from "../controllers/admin.controller.js";

router.route("/").get(admin.handle_admin_get);

router.route("/categories").get(admin.handle_categories_get);

router.route("/categories/add").get(admin.handle_add_category_get);

router
  .route("/categories/is-available")
  .get(admin.handle_is_available_category_name);

router.route("/category-levels/add").get(admin.handle_add_category_level_get);

router
  .route("/category-levels/add")
  .post(urlencodedParser, admin.handle_add_category_level_post);

router
  .route("/category-levels/is-available")
  .get(admin.handle_is_available_category_level);

router
  .route("/categories/add")
  .post(urlencodedParser, admin.handle_add_category_post);

router
  .route("/categories/delete")
  .post(urlencodedParser, admin.handle_delete_category_post);

router
  .route("/categories/update")
  .get(urlencodedParser, admin.handle_update_category_get);

router
  .route("/categories/update")
  .post(urlencodedParser, admin.handle_update_category_post);

router.route("/courses").get(admin.handle_courses_get);

router
  .route("/courses/detail")
  .post(urlencodedParser, admin.handle_detail_course_get);

router
  .route("/courses/delete")
  .post(urlencodedParser, admin.handle_delete_course_post);

router.route("/students").get(admin.handle_students_get);

router
  .route("/students/detail")
  .post(urlencodedParser, admin.handle_detail_student_get);

router
  .route("/students/delete")
  .post(urlencodedParser, admin.handle_delete_student_post);

router.route("/teachers").get(admin.handle_teachers_get);

router
  .route("/teachers/delete")
  .post(urlencodedParser, admin.handle_delete_teacher_post);

router
  .route("/teachers/detail")
  .post(urlencodedParser, admin.handle_detail_teacher_get);

router.route("/teachers/add").get(admin.handle_add_teacher_get);

router
  .route("/teachers/is-available")
  .get(urlencodedParser, admin.handle_is_available_teacher);

router
  .route("/teachers/add")
  .post(urlencodedParser, admin.handle_add_teacher_post);

export default router;
