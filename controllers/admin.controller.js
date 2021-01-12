import Category from "../models/categories.model.js";
import Course from "../models/courses.model.js";
import Student from "../models/students.model.js";
import Teacher from "../models/teachers.model.js";
import SubCategory from "../models/subCategory.model.js";
import bcrypt from "bcryptjs";

export const handle_admin_get = (req, res) => {
  const name = req.session.name;

  res.render("vwAdmin/dashboard", {
    layout: "admin.hbs",
    title: "Project | Dashboard",
    name,
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
  const course = await Course.findById(courseID);

  const subcategory = await SubCategory.findOne({ name: course.category });
  subcategory.numOfCourses -= 1;
  await subcategory.save();

  await course.remove();
  res.redirect("/admin/courses");
};

export const getAllCategories = async (req, res) => {
  const categories = await Category.find().populate("subCategories").lean();

  res.render("vwAdmin/categories", {
    layout: "admin.hbs",
    title: "Project | Categories",
    categories: [...categories],
  });
};

export const isCategoryExist = async (req, res) => {
  const name = req.query.name;

  const isExist = await Category.exists({
    name: name,
  });

  res.json({ isExist });
};

export const isSubCategoryExist = async (req, res) => {
  const name = req.query.name;

  const isExist = await SubCategory.exists({
    name: name,
  });

  res.json({ isExist });
};

export const addSubCategory = async (req, res) => {
  const { name, parentName, detail } = req.body;
  const parentCategory = await Category.findOne({ name: parentName }).lean();

  const newSubCategory = new SubCategory({
    name: name,
    detail: detail,
    subscribe: 0,
    numOfCourses: 0,
    parent: parentCategory._id,
  });

  await newSubCategory.save();

  const subCate = await SubCategory.findOne({ name }).lean();

  const parent = await Category.findOne({ name: parentName });
  parent.subCategories = [...parent.subCategories, subCate._id];
  await parent.save();

  res.redirect("/admin/categories");
};

export const deleteSubCategory = async (req, res) => {
  const { name } = req.body;
  const subCate = await SubCategory.findOne({ name }).lean();

  const parentID = subCate.parent;
  const parent = await Category.findById(parentID);
  const index = parent.subCategories.indexOf(subCate._id);
  if (index > -1) parent.subCategories.splice(index, 1);
  await parent.save();

  await SubCategory.findOneAndDelete({ name });

  res.redirect("/admin/categories");
};

export const getSubCategoryForUpdate = async (req, res) => {
  const name = req.query.name;
  const subCate = await SubCategory.findOne({ name }).lean();

  const categories = await Category.find().lean();
  const names = categories.map((value) => value.name);

  res.render("vwAdmin/updateSubcategory", {
    layout: "admin.hbs",
    title: "Project | Update Subcategory",
    categories: [...names],
    ...subCate,
  });
};

export const updateSubCategory = async (req, res) => {
  const { name, parentName, detail } = req.body;

  const subCate = await SubCategory.findOne({ name });
  const oldParent = await Category.findById(subCate.parent);

  if (oldParent.name != parentName) {
    oldParent.subCategories.splice(
      oldParent.subCategories.indexOf(subCate._id),
      1
    );
    await oldParent.save();

    const newParent = await Category.findOne({ name: parentName });
    newParent.subCategories = [...newParent.subCategories, subCate._id];

    subCate.parent = newParent._id;

    await newParent.save();
  }

  subCate.name = name;
  subCate.detail = detail;

  await subCate.save();

  res.redirect("/admin/categories");
};

export const addCategory = async (req, res) => {
  const { name, detail } = req.body;

  const newCategory = new Category({
    name: name,
    detail: detail,
    subscribe: 0,
    subCategories: [],
  });

  await newCategory.save();

  res.redirect("/admin/categories");
};

export const deleteCategory = async (req, res) => {
  const { name } = req.body;
  const cate = await Category.findOne({ name: name })
    .populate("subCategories")
    .lean();

  var canBeDeleted = true;
  cate.subCategories.map((item) => {
    if (item.numOfCourses !== 0) {
      canBeDeleted = false;
    }
  });

  if (canBeDeleted === true) {
    await cate.subCategories.map(async (item) => {
      await SubCategory.deleteOne({ name: item.name });
    });

    await Category.deleteOne({ name: name });

    res.json({ isSuccess: true });
  } else {
    res.json({ isSuccess: false });
  }
};

export const getAddSubcategoryView = async (req, res) => {
  const categories = await Category.find().lean();
  const names = categories.map((value) => value.name);

  res.render("vwAdmin/addSubcategory", {
    layout: "admin.hbs",
    title: "Project | Add Category",
    names: [...names],
  });
};

export const getAddCategoryView = (req, res) => {
  res.render("vwAdmin/addCategory", {
    layout: "admin.hbs",
    title: "Project | Add Category",
  });
};

export const getCategoryForUpdate = async (req, res) => {
  const name = req.query.name;

  const category = await Category.findOne({ name })
    .populate("subCategories")
    .lean();

  res.render("vwAdmin/updateCategory", {
    layout: "admin.hbs",
    title: "Project | Update Category",
    ...category,
  });
};

export const updateCategory = async (req, res) => {
  const { name, detail } = req.body;

  const category = await Category.findOne({ name });

  category.name = name;
  category.detail = detail;

  await category.save();

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
