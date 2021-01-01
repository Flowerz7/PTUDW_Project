import Category from "../models/categories.model.js";
import Course from "../models/courses.model.js";
import Student from "../models/students.model.js";
import Teacher from "../models/teachers.model.js";
import CategoryLevel from "../models/categoryLevels.model.js";
import bcrypt from "bcryptjs";

export const handle_admin_get = (req, res) => {
  res.render("vwAdmin/dashboard", {
    layout: "admin.hbs",
    title: "Project | Dashboard",
  });
};

export const handle_categories_get = async (req, res) => {
  const categories = await Category.find({}, "categoryName categoryLevel");

  const categoriesHBS = [];
  for (let i = 0; i < categories.length; i++) {
    const name = categories[i].categoryName;
    const order = i + 1;
    const numberOfCourse = await Course.count({ category: name });
    const levelName = categories[i].categoryLevel;

    categoriesHBS.push({
      name,
      order,
      levelName,
      numberOfCourse: +numberOfCourse,
    });
  }

  res.render("vwAdmin/categories", {
    layout: "admin.hbs",
    title: "Project | Categories",
    categories: categoriesHBS,
    //categorylevelName: categoryLevelsHBS,
  });
};

export const handle_courses_get = async (req, res) => {
  const courses = await Course.find({}, "title numOfStudent");

  const coursesHBS = [];

  for (let i = 0; i < courses.length; i++) {
    const title = courses[i].title;
    const order = i + 1;
    const numOfStudent = courses[i].numOfStudent;
    const courseID = courses[i]._id;

    coursesHBS.push({
      title,
      order,
      numOfStudent,
      courseID,
    });
  }

  res.render("vwAdmin/courses", {
    layout: "admin.hbs",
    title: "Project | Courses",
    courses: coursesHBS,
  });
};

export const handle_detail_course_get = async (req, res) => {
  const { courseID } = req.body;

  const course = await Course.findOne({ _id: courseID });

  console.log(`Course detail: ${JSON.stringify(course)}`);

  res.render("vwAdmin/courseDetail", {
    title: "Project | Course detail",
    layout: "admin.hbs",
  });
};

export const handle_delete_course_post = async (req, res) => {
  const { courseID } = req.body;

  await Course.deleteOne({ _id: courseID });

  res.redirect("/admin/courses");
};

export const handle_add_category_get = async (req, res) => {
  const categoryLevels = await CategoryLevel.find({}, "levelName");
  const levelName = categoryLevels.map((categoryLevel) => {
    return categoryLevel.levelName;
  });

  res.render("vwAdmin/addCategory", {
    layout: "admin.hbs",
    title: "Project | Create Category",
    levelName,
  });
};

export const handle_is_available_category_name = async (req, res) => {
  const categoryName = req.query.categoryName;

  const isExistCategoryName = await Category.exists({
    categoryName: categoryName,
  });

  res.json({ isExistCategoryName });
};

export const handle_is_available_category_level = async (req, res) => {
  const levelName = req.query.levelName;

  const isExistLevelName = await CategoryLevel.exists({
    levelName: levelName,
  });

  res.json({ isExistLevelName });
};

export const handle_add_category_post = async (req, res) => {
  const { categoryName, categoryDetail, levelName } = req.body;

  const newCategory = new Category({
    categoryLevel: levelName,
    categoryName: categoryName,
    categoryDetail: categoryDetail,
  });
  await newCategory.save();

  res.redirect("/admin/categories");
};

export const handle_delete_category_post = async (req, res) => {
  const { categoryName } = req.body;

  await Category.deleteOne({ categoryName: categoryName });

  res.redirect("/admin/categories");
};

export const handle_update_category_get = async (req, res) => {
  const { categoryName } = req.query;

  const category = await Category.findOne(
    { categoryName: categoryName },
    "categoryName categoryDetail"
  );

  const categoryLevels = await CategoryLevel.find({}, "levelName");
  const levelName = categoryLevels.map((categoryLevel) => {
    return categoryLevel.levelName;
  });

  res.render("vwAdmin/updateCategory", {
    layout: "admin.hbs",
    title: "Project | Update Category",
    name: category.categoryName,
    detail: category.categoryDetail,
    levelName,
  });
};

export const handle_update_category_post = async (req, res) => {
  const { categoryName, categoryDetail, levelName } = req.body;

  await Category.updateOne(
    { categoryName: categoryName },
    { categoryDetail: categoryDetail, categoryLevel: levelName }
  );

  res.redirect("/admin/categories");
};

export const handle_students_get = async (req, res) => {
  const students = await Student.find({}, "username email");

  const studentsHBS = [];

  for (let i = 0; i < students.length; i++) {
    const username = students[i].username;
    const order = i + 1;
    const email = students[i].email;
    const studentID = students[i]._id;

    studentsHBS.push({
      username,
      order,
      email,
      studentID,
    });
  }
  res.render("vwAdmin/students", {
    layout: "admin.hbs",
    title: "Project | Students",
    students: studentsHBS,
  });
};

export const handle_detail_student_get = async (req, res) => {
  const { studentID } = req.body;

  const student = await Student.findOne({ _id: studentID });

  console.log(`Student detail: ${JSON.stringify(student)}`);

  res.render("vwAdmin/studentDetail", {
    title: "Project | Student detail",
    layout: "admin.hbs",
  });
};

export const handle_delete_student_post = async (req, res) => {
  const { studentID } = req.body;

  await Student.deleteOne({ _id: studentID });

  res.redirect("/admin/students");
};

export const handle_teachers_get = async (req, res) => {
  const teachers = await Teacher.find({}, "username email");

  const teachersHBS = [];

  for (let i = 0; i < teachers.length; i++) {
    const username = teachers[i].username;
    const order = i + 1;
    const email = teachers[i].email;
    const teacherID = teachers[i]._id;

    teachersHBS.push({
      username,
      order,
      email,
      teacherID,
    });
  }
  res.render("vwAdmin/teachers", {
    layout: "admin.hbs",
    title: "Project | Teacher",
    teachers: teachersHBS,
  });
};

export const handle_delete_teacher_post = async (req, res) => {
  const { teacherID } = req.body;

  await Teacher.deleteOne({ _id: teacherID });

  res.redirect("/admin/teachers");
};

export const handle_detail_teacher_get = async (req, res) => {
  const { teacherID } = req.body;

  const teacher = await Teacher.findOne({ _id: teacherID });

  console.log(`Teacher detail: ${JSON.stringify(teacher)}`);

  res.render("vwAdmin/teacherDetail", {
    title: "Project | Teacher detail",
    layout: "admin.hbs",
  });
};

export const handle_add_teacher_get = (req, res) => {
  res.render("vwAdmin/addTeacher", {
    layout: "admin.hbs",
    title: "Project | Add teacher",
  });
};

export const handle_is_available_teacher = async (req, res) => {
  const username = req.query.username;
  const email = req.query.email;

  const isUsernameExist = await Teacher.exists({ username: username });
  const isEmailExist = await Teacher.exists({ email: email });

  res.json({
    isUsernameExist,
    isEmailExist,
  });
};

export const handle_add_teacher_post = async (req, res) => {
  const { username, password, name, email } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newTeacher = new Teacher({
    username,
    password: hashedPassword,
    name,
    email,
  });

  newTeacher
    .save()
    .then(() => console.log(`teacher added!`))
    .catch((err) => res.status(400).json(`Error: ${err}`));

  const url = "/admin/teachers";
  res.redirect(url);
};

export const handle_add_category_level_get = (req, res) => {
  res.render("vwAdmin/addCategoryLevel", {
    title: "Project | Category levels",
    layout: "admin.hbs",
  });
};

export const handle_add_category_level_post = async (req, res) => {
  const levelName = req.body.levelName;

  const newCategorylevel = new CategoryLevel({
    levelName,
  });

  await newCategorylevel.save();

  res.redirect(`/admin/categories`);
};
