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
      numberOfCourse,
    });
  }

  console.log(categoriesHBS);

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
