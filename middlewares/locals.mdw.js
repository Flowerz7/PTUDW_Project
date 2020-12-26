const useLocalsOfRequest = (app) => {
  app.use(async (req, res, next) => {
    if (typeof req.session.isAuth === "undefined") {
      req.session.isAuth = false;
    }

    res.locals.isAuth = req.session.isAuth;
    next();
  });
};

export default useLocalsOfRequest;
