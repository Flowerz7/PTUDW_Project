import exphbs from "express-handlebars";
import hbsSectons from "express-handlebars-sections";

const useHBS = (app) => {
  app.engine(
    "hbs",
    exphbs({
      defaultLayout: "main.hbs",
      helpers: {
        section: hbsSectons(),
      },
    })
  );
  app.set("view engine", "hbs");
};

export default useHBS;
