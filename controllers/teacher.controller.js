import Teacher from "../models/teachers.model.js";
import Course from "../models/courses.model.js";
import Category from "../models/categories.model.js";
import SubCategory from "../models/subCategory.model.js";
import multer from "multer";

export const handle_welcome_get = (req, res) => {
  const name = req.session.name;

  res.render("vwTeacher/welcome", {
    layout: "teacher.hbs",
    title: "Project | Welcome",
    name,
  });
};

export const handle_teacher_page_get = async (req, res) => {
  const username = req.session.username;
  const teacher = await Teacher.findOne({ username: username }, "_id");
  const teacherID = teacher._id;
  const courses = await Course.find(
    { teacherID: teacherID },
    "title numOfStudent isFinish category"
  );

  const coursesHBS = [];

  const length = courses.length;
  for (let i = 0; i < length; i++) {
    const order = i + 1;
    const title = courses[i].title;
    const numOfStudent = courses[i].numOfStudent;
    const status = courses[i].isFinish ? "Finish" : "Unfinished";
    const courseID = courses[i]._id;
    const category = courses[i].category;
    const isFinish = courses[i].isFinish;

    coursesHBS.push({
      order,
      title,
      numOfStudent,
      status,
      courseID,
      category,
      isFinish,
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

  const subcategories = await SubCategory.find().lean();
  const subcategoryNames = subcategories.map((value) => value.name);

  res.render("vwTeacher/addCourse", {
    title: "Project | Add course",
    layout: "teacher.hbs",
    teacherID: teacher._id,
    subcategoryNames,
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
        view: 0,
        avatarLink: req.file.filename,
        price,
        category,
        lastUpdate : Date.now(),
        isFinish: false,
        disabled: false,
        briefDescription,
        description,
        numOfStudent: 0,
      });

      await newCourse.save();

      const subcate = await SubCategory.findOne({ name: category });
      subcate.numOfCourses += 1;

      await subcate.save();

      res.redirect(`/teacher/upload/${newCourse._id}`);
    }
  });
};

export const handle_upload_videos_get = async (req, res) => {
  const courseID = req.params.courseID;

  const course = await Course.findOne({ _id: courseID }, "isFinish videos");
  const isFinish = course.isFinish;

  if (isFinish) {
    res.render("404");
  } else {
    const chapterNumber = course.videos.length + 1;

    res.render("vwTeacher/uploadVideos", {
      title: "Project | Upload Videos",
      layout: "teacher.hbs",
      chapterNumber,
    });
  }
};

export const handle_upload_videos_post = (req, res) => {
  const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, `./public/videos/`);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + "-" + Date.now());
    },
  });

  const uploadVideo = multer({ storage: videoStorage });
  uploadVideo.single("video")(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.log(`Multer error: ${err}`);
    } else if (err) {
      console.log(`Error: ${err}`);
    } else {
      console.log(`Upload video successful`);

      const { title, description } = req.body;
      const courseID = req.params.courseID;

      const newVideo = {
        title,
        description,
        link: req.file.filename,
      };

      await Course.updateOne(
        { _id: courseID },
        { $push: { videos: newVideo, lastUpdate : Date.now() } }
      );

      res.redirect(`/teacher/upload/${courseID}`);
    }
  });
};

export const handle_update_course_get = async (req, res) => {
  const courseID = req.params.courseID;
  const course = await Course.findById(courseID);

  res.render("vwTeacher/updateCourse", {
    layout: "teacher.hbs",
    title: "Project | Update course",
    courseTitle: course.title,
    category: course.category,
    overview: course.briefDescription,
    description: course.description,
    price: course.price,
  });
};

export const handle_update_course_post = async (req, res) => {
  const { title, briefDescription, description, price } = req.body;
  const courseID = req.params.courseID;

  await Course.updateOne(
    { _id: courseID },
    {
      title: title,
      briefDescription: briefDescription,
      description: description,
      price: price,
    }
  );

  res.redirect("/teacher");
};

export const handle_get_videos_get = async (req, res) => {
  const courseID = req.params.courseID;

  const course = await Course.findOne({ _id: courseID }, "videos").exec();

  const videos = [];
  for (let i = 0; i < course.videos.length; i++) {
    const chapterNumber = i + 1;
    const title = course.videos[i].title;
    const description = course.videos[i].description;

    videos.push({ chapterNumber, title, description });
  }

  res.render("vwTeacher/showVideos", {
    title: "Project | Videos",
    layout: "Teacher.hbs",
    courseID,
    videos,
  });
};

export const handle_complete_course = async (req, res) => {
  const courseID = req.params.courseID;
  await Course.updateOne({ _id: courseID }, { isFinish: true });

  res.redirect("/teacher");
};
