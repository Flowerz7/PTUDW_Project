import exphbs from "express-handlebars";
import hbsSectons from "express-handlebars-sections";

const useHBS = (app) => {
  app.engine(
    "hbs",
    exphbs({
      defaultLayout: "main.hbs",
      helpers: {
        section: hbsSectons(),
        inc : (value) => {
          return parseInt(value) + 1
        },
        incBy2 : (value) => {
          return parseInt(value) + 2
        },
        dec : (value) => {
          return parseInt(value) - 1
        }
      },
    })
  );
  app.set("view engine", "hbs");
};

export default useHBS;
