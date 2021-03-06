import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import Student from "../models/students.model.js";
import Teacher from "../models/teachers.model.js";
import Admin from "../models/admins.model.js";

import { getCategories } from "../controllers/category.controller.js";

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

export const handle_register_get = (req, res) => {
  res.render("vwAccount/register", {
    layout: "account.hbs",
    title: "Project | Register",
  });
};

export const handle_otp_get = (req, res) => {
  res.render("vwAccount/otp", {
    layout: "account.hbs",
    title: "Project | OTP",
  });
};

export const handle_login_get = (req, res) => {
  res.render("vwAccount/login", {
    layout: "account.hbs",
    title: "Project | Login",
  });
};

export const handle_login_post = async (req, res) => {
  const { role, username, password } = req.body;
  let user;
  let url;

  switch (role) {
    case "student":
      user = await Student.findOne(
        { username: username },
        "password name username isClock"
      ).exec();
      url = "/";
      break;
    case "teacher":
      user = await Teacher.findOne(
        { username: username },
        "password name username isClock"
      ).exec();
      url = "/teacher/welcome";
      break;
    case "admin":
      user = await Admin.findOne(
        { username: username },
        "password name username"
      ).exec();
      url = "/admin";
      break;
  }

  if (user === null) {
    res.render("vwAccount/login", {
      layout: "account.hbs",
      title: "Project | Login",
      err_message: "Invalid username!",
    });
  } else if (role !== "admin" && user.isClock) {
    res.render("vwAccount/login", {
      layout: "account.hbs",
      title: "Project | Login",
      err_message: "Your account is clocked!",
    });
  } else {
    const isMatch = bcrypt.compareSync(password, user.password);

    if (false === isMatch) {
      res.render("vwAccount/login", {
        layout: "account.hbs",
        title: "Project | Login",
        err_message: "Invalid password!",
      });
    } else {
      req.session.isAuth = true;
      req.session.name = user.name;
      req.session.username = user.username;
      req.session.role = role;
      res.redirect(url);
    }
  }
};

export const handle_register_post = (req, res) => {
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
};

export const handle_otp_post = async (req, res) => {
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
      layout: "account.hbs",
      title: "Project | OPT",
      err_message: "OPT is wrong @_@",
    });
  }
};

export const handle_is_available_get = async (req, res) => {
  const username = req.query.username;
  const email = req.query.email;

  const isUsernameExist = await Student.exists({ username: username });
  const isEmailExist = await Student.exists({ email: email });

  res.json({
    isUsernameExist,
    isEmailExist,
  });
};

export const handle_change_password_get = (req, res) => {
  if (req.session.isAuth !== true) {
    res.render("404", {
      title: "Project | 404",
      layout: "account.hbs",
    });
  } else {
    console.log(`username: ${req.session.username}`);
    console.log(`role: ${req.session.role}`);
    res.render("vwAccount/changePassword", {
      title: "Project | Change password",
      layout: "account.hbs",
    });
  }
};

export const handle_change_password_post = async (req, res) => {
  const { newPassword } = req.body;
  const username = req.session.username;
  const role = req.session.role;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  switch (role) {
    case "student":
      await Student.findOneAndUpdate(
        { username: username },
        { password: hashedPassword }
      );
      break;
    case "teacher":
      await Teacher.findOneAndUpdate(
        { username: username },
        { password: hashedPassword }
      );
      break;
    case "admin":
      await Admin.findOneAndUpdate(
        { username: username },
        { password: hashedPassword }
      );
      break;
  }

  res.redirect("/account/login");
};

export const handle_password_is_correct_get = async (req, res) => {
  const password = req.query.password;
  let user;

  switch (req.session.role) {
    case "student":
      user = await Student.findOne(
        { username: req.session.username },
        "password"
      ).exec();
      break;
    case "teacher":
      user = await Teacher.findOne(
        { username: req.session.username },
        "password"
      ).exec();
      break;
    case "admin":
      user = await Admin.findOne(
        { username: req.session.username },
        "password"
      ).exec();
      break;
  }

  const isMatch = bcrypt.compareSync(password, user.password);

  res.json({
    isCorrectPassword: isMatch,
  });
};

export const handle_change_personal_info_get = async (req, res) => {
  if (req.session.isAuth !== true) {
    res.render("404", {
      title: "Project | 404",
      layout: "account.hbs",
    });
  } else {
    const username = req.session.username;
    const role = req.session.role;
    let info;

    switch (role) {
      case "student":
        info = await Student.findOne(
          { username: username },
          "name email"
        ).exec();
        break;
      case "teacher":
        info = await Teacher.findOne(
          { username: username },
          "name email"
        ).exec();
        break;
      case "admin":
        info = await Admin.findOne({ username: username }, "name email").exec();
        break;
    }

    res.render("vwAccount/changeInfo", {
      title: "Project | Change personal information",
      layout: "account.hbs",
      name: info.name,
      email: info.email,
    });
  }
};

export const handle_change_personal_info_post = async (req, res) => {
  const { newName, newEmail } = req.body;
  const username = req.session.username;
  const role = req.session.role;
  let url;

  switch (role) {
    case "student":
      await Student.findOneAndUpdate(
        { username: username },
        { name: newName, email: newEmail }
      );
      url = "/";
      break;
    case "teacher":
      await Teacher.findOneAndUpdate(
        { username: username },
        { name: newName, email: newEmail }
      );
      url = "/teacher/welcome";
      break;
    case "admin":
      await Admin.findOneAndUpdate(
        { username: username },
        { name: newName, email: newEmail }
      );
      url = "/admin";
      break;
  }

  res.redirect(url);
};

export const handle_is_available_email_get = async (req, res) => {
  const newEmail = req.query.newEmail;
  const username = req.session.username;
  const role = req.session.role;
  let info;
  let isExistEmail;

  switch (role) {
    case "student":
      isExistEmail = await Student.exists({ email: newEmail });
      info = await Student.findOne({ username: username }, "email").exec();
      break;
    case "teacher":
      isExistEmail = await Teacher.exists({ email: newEmail });
      info = await Teacher.findOne({ username: username }, "email").exec();
      break;
    case "admin":
      isExistEmail = await Admin.exists({ email: newEmail });
      info = await Admin.findOne({ username: username }, "email").exec();
      break;
  }

  if (newEmail === info.email) {
    isExistEmail = false;
  }

  res.json({
    isExistEmail,
  });
};

export const getUsername = (req, res) => {
  res.json({ username: req.session.username });
};

export const getPersonalProfile = async (req, res) => {
  const username = req.query.username;

  const student = await Student.findOne({ username })
    .populate("watchList")
    .populate("joinedCourses")
    .lean();
  const categories = await getCategories();
  const props = {
    ...student,
    categories: [...categories],
  };

  res.render("vwAccount/profile", props);
};

export const handle_logout_get = (req, res) => {
  req.session.isAuth = false;
  req.session.username = "";
  req.session.name = "";
  req.session.role = "";

  res.redirect("/");
};
