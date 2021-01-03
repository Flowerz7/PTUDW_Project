import express from "express";
import * as StudentController from '../controllers/student.controller.js'
import bodyParser from "body-parser";

const router = express.Router();
const urlEncodedParser = bodyParser.urlencoded({ extended: true });

router.route('/update/watchList/check').get(StudentController.checkWatchList)
router.route('/update/watchList/add').post(urlEncodedParser, StudentController.addToWatchList)
router.route('/update/watchList/remove').post(urlEncodedParser, StudentController.removeFromWatchList)

router.route('/update/joinedCourses/check').get(StudentController.checkJoinedCourses)
router.route('/update/joinedCourses/add').post(urlEncodedParser, StudentController.addToJC)

export default router;
