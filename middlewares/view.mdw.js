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
        },
        decBy2 : (value) => {
          return parseInt(value) - 2
        },
        log : value => console.log(value),
        ifEqualLimit : function (value, opts) {
          if (value = 5){
            return opts.fn(this)
          }
          else {
            return opts.inverse(this)
          }
        },
        ifLessThanOrEqualLimit : function (value, opts) {
          if (value < 5){
            return opts.fn(this)
          }
          else {
            return opts.inverse(this)
          }
        }
      },
    })
  );
  app.set("view engine", "hbs");
};

export default useHBS;
