import { config } from "dotenv";
import cookieParser from "cookie-parser";
if (process.env.NODE_ENV != "development") {
  config();
}
import express from "express";
import session from "express-session";
import { connectDatabase } from "./util/db-con.js";

// routers
import userRouter from "./route/user.js";
import companyRouter from "./route/company.js";
import branchRouter from "./route/branch.js";
import attendanceRouter from "./route/attendance.js";
import shiftRouter from "./route/shift.js";
import contectRouter from "./route/contact.js";
import roleRouter from "./route/role.js";

//middlewares
import { isLoggedInCheck, onlyLoggedInUser } from "./middleware/auth.js";

const app = express();
const port = process.env.PORT || "8000";
const SECRET = process.env.SESSION_SECRET || "KEYBOARD & mE!";
const MONGO_URI = process.env.MONGO_URI;

connectDatabase(MONGO_URI);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionConfig = {
  secret: SECRET,
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 1 * 60 * 60 * 1000 },
  name: "payinsight.void",
};
if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessionConfig.cookie.secure = true; // serve secure cookies
}
app.use(session(sessionConfig));

app.use(isLoggedInCheck);

app.get("/api", (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(200).send({ user: null });
  }
  return res.status(200).send({ user: user });
});

app.use("/api/user", userRouter);
app.use("/api/company", onlyLoggedInUser, companyRouter);
app.use("/api/branch", onlyLoggedInUser, branchRouter);
app.use("/api/attendance", onlyLoggedInUser, attendanceRouter);
app.use("/api/shift", onlyLoggedInUser, shiftRouter);
app.use("/api/role", onlyLoggedInUser, roleRouter);
app.use("/api/contact", contectRouter);

app.use((err, req, res, next) => {
  console.log(err);
  const { status = 500, message } = err;
  res.status(status).send({ error: message, status: status });
});

app.listen(port, () => {
  console.log(`attendance app listening on port ${port}`);
});

// oops!
