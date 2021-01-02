import express from "express";
import bodyParser from "body-parser";
const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

import * as auth from "../../controllers/auth.controller.js";

// HANDLE REGISTER FEATURE:
router.route("/register").get(auth.handle_register_get);

router.route("/register").post(urlencodedParser, auth.handle_register_post);

router.route("/otp").get(auth.handle_otp_get);

router.route("/otp").post(urlencodedParser, auth.handle_otp_post);

// Handle ajax call to validate in register form:
router
  .route("/is-available")
  .get(urlencodedParser, auth.handle_is_available_get);

// HANDLE LOGIN FEATURE:
router.route("/login").get(auth.handle_login_get);

router.route("/login").post(urlencodedParser, auth.handle_login_post);

// Hanle change password:
router.route("/change-password").get(auth.handle_change_password_get);

router
  .route("/change-password")
  .post(urlencodedParser, auth.handle_change_password_post);

router
  .route("/password-is-correct")
  .get(urlencodedParser, auth.handle_password_is_correct_get);

// Update persional infomation:
router.route('/view').get(auth.getPersonalProfile)
router.route('/').get(auth.getUsername)
router.route("/change-personal-info").get(auth.handle_change_personal_info_get);

router
  .route("/is-available-email")
  .get(urlencodedParser, auth.handle_is_available_email_get);

router
  .route("/change-personal-info")
  .post(urlencodedParser, auth.handle_change_personal_info_post);

router.route("/logout").get(auth.handle_logout_get);

export default router;
