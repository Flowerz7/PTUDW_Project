import express from "express";
import bcrypt from "bcryptjs";
import Student from "../../models/students.model.js";
import bodyParser from "body-parser";

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

router.route("/register").get((req, res) => {
  res.render("vwAccount/register", {
    layout: "main.bootstrap.hbs",
    title: "Project | Register",
  });
});

// handle posting register data:
router.route("/register").post(urlencodedParser, async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newStudent = new Student({
    username: req.body.username,
    password: hashedPassword,
    name: req.body.name,
    email: req.body.email,
  });

  newStudent
    .save()
    .then(() => console.log(`student added!`))
    .catch((err) => res.status(400).json(`Error: ${err}`));

  res.render("vwAccount/register", {
    layout: "main.bootstrap.hbs",
    title: "Project | Register",
  });
});

router.route("/is-available").get(urlencodedParser, async (req, res) => {
  const username = req.query.username;
  const email = req.query.email;

  const isUsernameExist = await Student.exists({ username: username });
  const isEmailExist = await Student.exists({ email: email });

  res.json({
    isUsernameExist,
    isEmailExist,
  });
});

export default router;
