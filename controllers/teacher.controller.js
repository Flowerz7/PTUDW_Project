export const handle_teacher_page_get = (req, res) => {
  res.render("vwTeacher/dashboard", {
    title: "Project | Dashboard",
    layout: "teacher.hbs",
  });
};
