const handlingError = (app) => {
  app.use((req, res, next) => {
    res.status(404).json({
      success: false,
      message: "Page Not Found",
    });
  });
};

export default handlingError;
