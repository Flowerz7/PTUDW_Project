import Category from "../models/categories.model.js";
import Course from "../models/courses.model.js";

export const handle_admin_get = (req, res) => {
  res.render("vwAdmin/dashboard", {
    layout: "admin.hbs",
    title: "Project | Dashboard",
  });
};

export const handle_categories_get = async (req, res) => {
  const categories = await Category.find({}, "categoryName");
  const count = await Course.count({ category: "Web" });

  console.log(`count: ${count}`);

  const categoriesHBS = [];

  for (let i = 0; i < categories.length; i++) {
    const name = categories[i].categoryName;
    const order = i + 1;
    const numberOfCourse = await Course.count({ category: name });

    categoriesHBS.push({
      name,
      order,
      numberOfCourse: +numberOfCourse,
    });
  }

  res.render("vwAdmin/categories", {
    layout: "admin.hbs",
    title: "Project | Categories",
    categories: categoriesHBS,
  });
};

export const handle_courses_get = (req, res) => {
  res.render("vwAdmin/courses", {
    layout: "admin.hbs",
    title: "Project | Courses",
  });
};

export const handle_add_category_get = (req, res) => {
  res.render("vwAdmin/addCategory", {
    layout: "admin.hbs",
    title: "Project | Create Category",
  });
};

export const handle_is_available_category_name = async (req, res) => {
  const categoryName = req.query.categoryName;

  const isExistCategoryName = await Category.exists({
    categoryName: categoryName,
  });

  res.json({ isExistCategoryName });
};

export const handle_add_category_post = async (req, res) => {
  const { categoryName, categoryDetail } = req.body;

  const newCategory = new Category({
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

  res.render("vwAdmin/updateCategory", {
    layout: "admin.hbs",
    title: "Project | Update Category",
    name: category.categoryName,
    detail: category.categoryDetail,
  });
};

export const handle_update_category_post = async (req, res) => {
  const { categoryName, categoryDetail } = req.body;

  await Category.updateOne(
    { categoryName: categoryName },
    { categoryDetail: categoryDetail }
  );

  res.redirect("/admin/categories");
};

export const handle_students_get = (req, res) => {
  res.render("vwAdmin/students", {
    layout: "admin.hbs",
    title: "Project | Students",
  });
};

export const handle_teachers_get = (req, res) => {
  res.render("vwAdmin/teachers", {
    layout: "admin.hbs",
    title: "Project | Teacher",
  });
};
