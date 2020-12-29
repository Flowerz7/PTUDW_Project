import accountRouter from "../routes/front/account.route.js";
import adminRouter from "../routes/admin.route.js";
import homeRouter from "../routes/front/home.route.js";
import courseRouter from "../routes/courses.js";
import teacherRouter from "../routes/front/teacher.route.js";
import * as authPage from "./auth.mdw.js";

const routing = (app) => {
  app.use("/account", accountRouter);
  app.use("/admin", authPage.adminAuth, adminRouter);
  app.use("/account", accountRouter);
  app.use("/courses", courseRouter);
  app.use("/teacher", authPage.teacherAuth, teacherRouter);

  app.use("/", homeRouter);
};

export default routing;
