import express from "express";
import * as CourseController from '../controllers/courses.controller.js'
const router = express.Router();

router.route('/').get(CourseController.loadSingleCourse)
router.route('/all').get(CourseController.loadAllCourses)
router.route('/search').get(CourseController.loadQueriedCourse)

export default router;
