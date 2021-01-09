import express from "express";
import * as CourseController from '../controllers/courses.controller.js'
import bodyParser from "body-parser";

const urlEncodedParser = bodyParser.urlencoded({ extended: true });

const router = express.Router();

router.route('/').get(CourseController.loadSingleCourse)
router.route('/all').get(CourseController.loadAllCourses)
router.route('/search').get(CourseController.loadQueriedCourse)
router.route('/:category/:subcategory').get(CourseController.loadCoursesByCategory)
router.route('/:category').get(CourseController.loadCoursesByCategory)

router.route('/feedback/create').post(urlEncodedParser, CourseController.createFeedback)

export default router;
