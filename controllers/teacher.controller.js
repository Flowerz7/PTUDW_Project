import Teacher from "../models/teachers.model.js";
import Course from "../models/courses.model.js";
import Category from "../models/categories.model.js";
import CategoryLevel from "../models/categoryLevels.model.js";
import multer from "multer";

export const handle_teacher_page_get = async (req, res) => {
  const courses = await Course.find({}, "title numOfStudent isFinish");

  const coursesHBS = [];

  const length = courses.length;
  for (let i = 0; i < length; i++) {
    const order = i + 1;
    const title = courses[i].title;
    const numOfStudent = courses[i].numOfStudent;
    const status = courses[i].isFinish ? "Finish" : "Unfinished";

    coursesHBS.push({
      order,
      title,
      numOfStudent,
      status,
    });
  }

  res.render("vwTeacher/dashboard", {
    title: "Project | Dashboard",
    layout: "teacher.hbs",
    courses: coursesHBS,
  });
};

export const handle_add_course_get = async (req, res) => {
  const username = req.session.username;
  const teacher = await Teacher.findOne({ username: username }, "_id").exec();
  const categoryLevels = await CategoryLevel.find({}, "levelName");

  const categories = [];

  for (let i = 0; i < categoryLevels.length; i++) {
    const levelName = categoryLevels[i].levelName;
    const categoriesInSpecifiedLevel = await Category.find(
      { categoryLevel: levelName },
      "categoryName"
    );

    const categoryNames = categoriesInSpecifiedLevel.map(
      (category) => category.categoryName
    );

    categories.push({
      levelName,
      categoryNames,
    });
  }

  res.render("vwTeacher/addCourse", {
    title: "Project | Add course",
    layout: "teacher.hbs",
    teacherID: teacher._id,
    categories,
  });
};

export const handle_add_course_post = async (req, res) => {
  const imgStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/images/`);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + "-" + Date.now());
    },
  });

  const uploadImg = multer({ storage: imgStorage });
  uploadImg.single("image")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.log(`Multer error: ${err}`);
    } else if (err) {
      console.log(`Error: ${err}`);
    } else {
      console.log(`Upload img successful`);

      const {
        title,
        briefDescription,
        description,
        price,
        teacherID,
        category,
      } = req.body;

      const newCourse = new Course({
        teacherID,
        title,
        avatarLink: req.file.filename,
        price,
        category,
        isFinish: false,
        briefDescription,
        description,
        numOfStudent: 0,
      });

      console.log(`course id: ${newCourse._id}`);

      await newCourse.save();
    }
  });

  res.redirect("/teacher");
};
