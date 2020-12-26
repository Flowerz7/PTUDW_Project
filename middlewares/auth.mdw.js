export const adminAuth = (req, res, next) => {
  if (req.session.isAuth === false || req.session.role !== "admin") {
    return res.redirect("/account/login");
  }

  next();
};
