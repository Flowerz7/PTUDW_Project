import accountRouter from "../routes/front/account.route.js";
import adminRouter from "../routes/admin.route.js";
import { adminAuth } from "./auth.mdw.js";

const routing = (app) => {
  app.use("/account", accountRouter);
  app.use("/admin", adminAuth, adminRouter);

  app.get("/", (req, res) => {
    res.render("home", {
      layout: "main.hbs",
    });
  });
};

export default routing;
