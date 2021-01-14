const handlingError = (app) => {
  app.use((req, res, next) => {
    res.render("404.hbs", {
      layout: "error.hbs",
      title: "404 | Page not found",
    });
  });

  app.use((err, req, res, next) => {
    console.log(`ERROR: ${err.stack}`);
    res.status(404).json({
      success: false,
      message: "Page Not Found",
    });
  });
};

export default handlingError;
