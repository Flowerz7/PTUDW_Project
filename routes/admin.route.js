import express from "express";
import bodyParser from "body-parser";
const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

import * as admin from "../controllers/admin.controller.js";

router.route("/").get(admin.handle_admin_get);

router.route("/categories").get(admin.getAllCategories);
router.route("/categories/check").get(admin.isCategoryExist);
router.route("/categories/add").get(admin.getAddCategoryView);
router.route("/categories/add").post(urlencodedParser, admin.addCategory);
router.route("/categories/update").get(admin.getCategoryForUpdate);
router.route("/categories/update").post(urlencodedParser, admin.updateCategory);
router.route("/categories/delete").post(urlencodedParser, admin.deleteCategory);

router.route("/subCategories/check").get(admin.isSubCategoryExist);
router.route("/subCategories/add").get(admin.getAddSubcategoryView);
router.route("/subCategories/add").post(urlencodedParser, admin.addSubCategory);
router.route("/subCategories/update").get(admin.getSubCategoryForUpdate);
router
  .route("/subCategories/update")
  .post(urlencodedParser, admin.updateSubCategory);
router
  .route("/subCategories/delete")
  .post(urlencodedParser, admin.deleteSubCategory);

router.route("/courses").get(admin.handle_courses_get);

router
  .route("/courses")
  .post(urlencodedParser, admin.handle_filter_courses_post);

router
  .route("/courses/disable")
  .post(urlencodedParser, admin.toggleCourseDisabling);

router
  .route("/courses/delete")
  .post(urlencodedParser, admin.handle_delete_course_post);

router.route("/students").get(admin.handle_students_get);

router
  .route("/students/delete")
  .post(urlencodedParser, admin.handle_delete_student_post);

router
  .route("/students/clock")
  .post(urlencodedParser, admin.handle_clock_student_post);

router
  .route("/students/unclock")
  .post(urlencodedParser, admin.handle_unclock_student_post);

router.route("/teachers").get(admin.handle_teachers_get);

router
  .route("/teachers/delete")
  .post(urlencodedParser, admin.handle_delete_teacher_post);

router
  .route("/teachers/clock")
  .post(urlencodedParser, admin.handle_clock_teacher_post);

router
  .route("/teachers/unclock")
  .post(urlencodedParser, admin.handle_unclock_teacher_post);

router.route("/teachers/add").get(admin.handle_add_teacher_get);

router
  .route("/teachers/is-available")
  .get(urlencodedParser, admin.handle_is_available_teacher);

router
  .route("/teachers/add")
  .post(urlencodedParser, admin.handle_add_teacher_post);

router
  .route("/teachers/update")
  .get(urlencodedParser, admin.handle_update_teacher_get);

router
  .route("/teachers/update")
  .post(urlencodedParser, admin.handle_update_teacher_post);

export default router;
