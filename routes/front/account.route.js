import express from "express";
import bodyParser from "body-parser";
const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

import {
  handle_register_get,
  handle_register_post,
  handle_otp_get,
  handle_otp_post,
  handle_is_available_get,
  handle_login_get,
  handle_login_post,
} from "../../controllers/auth.controller.js";

// HANDLE REGISTER FEATURE:
router.route("/register").get(handle_register_get);

router.route("/register").post(urlencodedParser, handle_register_post);

router.route("/otp").get(handle_otp_get);

router.route("/otp").post(urlencodedParser, handle_otp_post);

// Handle ajax call to validate in register form:
router.route("/is-available").get(urlencodedParser, handle_is_available_get);

// HANDLE LOGIN FEATURE:
router.route("/login").get(handle_login_get);

router.route("/login").post(urlencodedParser, handle_login_post);

export default router;
