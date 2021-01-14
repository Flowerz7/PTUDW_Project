export const studentAuth = (req, res, next) => {
  if (req.session.isAuth === true) {
    if (req.session.role === "admin" || req.session.role === "teacher") {
      return res.redirect("account/login");
    }
  }

  next();
};

export const adminAuth = (req, res, next) => {
  if (req.session.isAuth === false || req.session.role !== "admin") {
    return res.redirect("/account/login");
  }

  next();
};

export const teacherAuth = (req, res, next) => {
  if (req.session.isAuth === false || req.session.role !== "teacher") {
    return res.redirect("/account/login");
  }

  next();
};
