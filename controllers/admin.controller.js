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
  const courses = await Course.find().populate("teacherID").lean();

  const subcategories = await SubCategory.find().lean();
  const teachers = await Teacher.find().lean();

  res.render("vwAdmin/courses", {
    layout: "admin.hbs",
    title: "Project | Courses",
    courses: courses,
    subcategories,
    teachers,
  });
};

export const handle_filter_courses_post = async (req, res) => {
  const { teacherID, category } = req.body;

  const courses =
    teacherID === "all"
      ? await Course.find().lean()
      : await Course.find({ teacherID: teacherID }).lean();

  const subcategories = await SubCategory.find().lean();
  const teachers = await Teacher.find().lean();

  let [...filterCourses] = courses;

  if (category !== "all") {
    filterCourses = filterCourses.filter(
      (course) => course.category === category
    );
  }

  res.render("vwAdmin/courses", {
    layout: "admin.hbs",
    title: "Project | Courses",
    courses: filterCourses,
    subcategories,
    teachers,
  });
};

export const handle_detail_course_get = async (req, res) => {
  const { courseID } = req.body;

  const course = await Course.findOne({ _id: courseID });

  res.render("vwAdmin/courseDetail", {
    title: "Project | Course detail",
    layout: "admin.hbs",
    ...course,
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

export const toggleCourseDisabling = async (req, res) =>{
  const { courseID } = req.body;
  const course = await Course.findById(courseID);

  course.disabled = !course.disabled

  await course.save()
  res.json({isSuccess : true})
}

export const getAllCategories = async (req, res) => {
  const categories = await Category.find().populate("subCategories").lean();

  categories.map(item => {
      item.deletable = true
      item.subCategories.map(subcate => {
      if (subcate.numOfCourses !== 0){
        item.deletable = false
      }
    })
  })

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
  const cate = await Category.findOne({ name: name }).populate("subCategories").lean();

  await cate.subCategories.map(async (item) => {
    await SubCategory.deleteOne({ name: item.name });
  });

  await Category.deleteOne({ name: name });

  res.redirect("/admin/categories");


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
  const students = await Student.find().lean();

  res.render("vwAdmin/students", {
    layout: "admin.hbs",
    title: "Project | Students",
    students: students,
  });
};

export const handle_delete_student_post = async (req, res) => {
  const { studentID } = req.body;

  await Student.deleteOne({ _id: studentID });

  res.redirect("/admin/students");
};

export const handle_teachers_get = async (req, res) => {
  const teachers = await Teacher.find().lean();

  res.render("vwAdmin/teachers", {
    layout: "admin.hbs",
    title: "Project | Teacher",
    teachers: teachers,
  });
};

export const handle_delete_teacher_post = async (req, res) => {
  const { teacherID } = req.body;

  await Teacher.deleteOne({ _id: teacherID });

  res.redirect("/admin/teachers");
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

export const handle_clock_student_post = async (req, res) => {
  const id = req.body.studentID;

  await Student.updateOne({ _id: id }, { isClock: true });

  res.redirect("/admin/students");
};

export const handle_unclock_student_post = async (req, res) => {
  const id = req.body.studentID;

  await Student.updateOne({ _id: id }, { isClock: false });

  res.redirect("/admin/students");
};

export const handle_clock_teacher_post = async (req, res) => {
  const id = req.body.teacherID;

  await Teacher.updateOne({ _id: id }, { isClock: true });

  res.redirect("/admin/teachers");
};

export const handle_unclock_teacher_post = async (req, res) => {
  const id = req.body.teacherID;

  await Teacher.updateOne({ _id: id }, { isClock: false });

  res.redirect("/admin/teachers");
};

export const handle_update_teacher_get = async (req, res) => {
  const id = req.query.teacherID;

  const teacher = await Teacher.findById(id);

  res.render("vwAdmin/updateTeacher", {
    title: "Project | Update teacher",
    layout: "account.hbs",
    id,
    name: teacher.name,
    email: teacher.email,
  });
};

export const handle_update_teacher_post = async (req, res) => {
  const { newName, newEmail, id } = req.body;

  await Teacher.findByIdAndUpdate(id, { name: newName, email: newEmail });

  res.redirect("/admin/teachers");
};
