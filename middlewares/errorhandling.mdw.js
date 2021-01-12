const handlingError = (app) => {
  app.use((req, res, next) => {
    res.status(404).json({
      success: false,
      message: "Page Not Found",
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
