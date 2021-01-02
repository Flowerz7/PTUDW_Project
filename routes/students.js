import express from "express";
import * as StudentController from '../controllers/student.controller.js'
import Student from "../models/students.model.js";
const router = express.Router();

router.route('/').get(StudentController.loadSingleStudent)
router.route('/update/watchList/add').get(StudentController.addToWatchList)
router.route('/update/watchList/remove').get(StudentController.removeFromWatchList)
router.route('/update/watchList/check').get(StudentController.checkWatchList)

router.route('/update/joinedCourses/check').get(StudentController.checkJoinedCourses)
router.route('/update/joinedCourses/add').get(StudentController.addToJC)

export default router;
