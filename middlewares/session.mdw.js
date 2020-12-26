import session from "express-session";

const useSession = (app) => {
  app.set("trust proxy", 1);
  app.use(
    session({
      secret: "SECRET_KEY",
      resave: false,
      saveUninitialized: true,
      cookie: {
        //secure: true
      },
    })
  );
};

export default useSession;
