import express from "express";
import * as HomeController from '../../controllers/home.controller.js'


const router = express.Router();

router.route('/').get(HomeController.loadCourses)

export default router;
