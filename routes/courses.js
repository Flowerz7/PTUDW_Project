import express from "express";
import Course from "../models/courses.model.js";
import * as CourseController from '../controllers/courses.controller.js'
const router = express.Router();

router.route('/').get(CourseController.handleQuery)
router.route('/all').get(CourseController.loadAllCourses)

export default router;
