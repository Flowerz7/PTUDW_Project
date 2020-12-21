import express from "express";
import bcrypt from "bcryptjs";
import Student from "../../models/students.model.js";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: true });

const sendMailTo = (mailAddress, OTP) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "edu.project.tods@gmail.com",
      pass: "matkhaukhongbaomat",
    },
  });

  const mailOption = {
    from: "edu.project.tods@gmail.com",
    to: mailAddress,
    subject: "Activate email from Edu",
    text: `Your OPT code: ${OTP}`,
  };

  transporter.sendMail(mailOption, (err, data) => {
    if (err) {
      console.log("Error occurs when send mail!");
    } else {
      console.log("Mail sent");
    }
  });
};

// HANDLE REGISTER FEATURE:
router.route("/register").get((req, res) => {
  res.render("vwAccount/register", {
    layout: "main.bootstrap.hbs",
    title: "Project | Register",
  });
});

router.route("/register").post(urlencodedParser, (req, res) => {
  const otp = Math.floor(Math.random() * 90000) + 10000;
  const { username, password, name, email } = req.body;

  // Adding register info and otp in session:
  req.session.otp = otp;
  req.session.username = username;
  req.session.password = password;
  req.session.name = name;
  req.session.email = email;

  sendMailTo(email, otp);

  const url = "/account/otp";
  res.redirect(url);
});

router.route("/otp").get((req, res) => {
  res.render("vwAccount/otp", {
    layout: "main.bootstrap.hbs",
    titlt: "Project | OTP",
  });
});

router.route("/otp").post(urlencodedParser, async (req, res) => {
  const givenOTP = +req.body.otp;
  const OTP = req.session.otp;

  if (givenOTP === OTP) {
    const { username, password, name, email, otp } = req.session;
    delete req.session.username;
    delete req.session.password;
    delete req.session.name;
    delete req.session.email;
    delete req.session.otp;

    // Hashing password:
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save student account to database:
    const newStudent = new Student({
      username,
      password: hashedPassword,
      name,
      email,
    });

    newStudent
      .save()
      .then(() => console.log(`student added!`))
      .catch((err) => res.status(400).json(`Error: ${err}`));

    // Redirect to login:
    const url = "/account/login";
    res.redirect(url);
  } else {
    res.render("vwAccount/otp", {
      layout: "main.bootstrap.hbs",
      title: "Project | OPT",
      err_message: "OPT is wrong @_@",
    });
  }
});

// Handle ajax call to validate in register form:
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

// HANDLE LOGIN FEATURE:
router.route("/login").get((req, res) => {
  res.render("vwAccount/login", {
    layout: "main.bootstrap.hbs",
    title: "Project | Login",
  });
});

router.route("/login").post(urlencodedParser, async (req, res) => {
  const { username, password } = req.body;

  // Username is exist ?
  const document = await Student.findOne(
    { username: username },
    "password name"
  ).exec();

  if (document === null) {
    res.render("vwAccount/login", {
      layout: "main.bootstrap.hbs",
      title: "Project | Login",
      err_message: "Invalid username",
    });
  } else {
    // Check password is match in database:
    const isMatch = bcrypt.compareSync(password, document.password);

    if (false === isMatch) {
      res.render("vwAccount/login", {
        layout: "main.bootstrap.hbs",
        title: "Project | Login",
        err_message: "Invalid password",
      });
    } else {
      // Save auth info into session:
      req.session.isAuth = true;
      req.session.name = document.name;

      let url = "/";
      res.redirect(url);
    }
  }
});

export default router;
