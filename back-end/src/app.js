import { config } from "dotenv";
import cookieParser from "cookie-parser";
if (process.env.NODE_ENV != "development") {
  config();
}
import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import { connectDatabase } from "./utils/db-con.js";
import { randomUUID } from "crypto";

// routers
import userRouter from "./routes/user.js";
import companyRouter from "./routes/company.js";
import branchRouter from "./routes/branch.js";
import attendanceRouter from "./routes/attendance.js";
import shiftRouter from "./routes/shift.js";
import contectRouter from "./routes/contact.js";
import roleRouter from "./routes/role.js";
import paymentRouter from "./routes/payment.js";

//middlewares
import { isLoggedInCheck, onlyLoggedInUser } from "./middlewares/auth.js";
import { handleRazorpayWebhook } from "./services/razorpay.js";
import wrapAsync from "./utils/wrap-async.js";

const app = express();
const port = process.env.PORT || "8000";
const SECRET = process.env.SESSION_SECRET || "KEYBOARD & mE!";
const MONGO_URI = process.env.MONGO_URI;

connectDatabase(MONGO_URI);
const store = MongoStore.create({
  mongoUrl: MONGO_URI,
  touchAfter: 2 * 3600,
  crypto: {
    secret: SECRET,
  },
  ttl: 7 * 24 * 60 * 60,
});

store.on("error", (err) => {
  console.log("ERROR WHILE STORING SESSIONS!", err);
});

const sessionOptions = {
  store,
  secret: SECRET,
  genid: () => {
    return randomUUID();
  },
  resave: true,
  saveUninitialized: false,
  cookie: { maxAge: 2 * 3600 * 1000 },
  name: "payinsight.void",
};

app.set("trust proxy", 1);
app.use(session(sessionOptions));
app.use(cookieParser());

app.use(isLoggedInCheck);

// api route for checking if user is logged in
app.get("/api", (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(200).send({ user: null });
  }
  return res.status(200).send({ user: user });
});

// payment webhook
app.post(
  "/api/razorpay/webhook",
  express.raw({ type: "application/json" }),
  wrapAsync(handleRazorpayWebhook)
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRouter);
app.use("/api/company", onlyLoggedInUser, companyRouter);
app.use("/api/branch", onlyLoggedInUser, branchRouter);
app.use("/api/attendance", onlyLoggedInUser, attendanceRouter);
app.use("/api/shift", onlyLoggedInUser, shiftRouter);
app.use("/api/role", onlyLoggedInUser, roleRouter);
app.use("/api/payment", onlyLoggedInUser, paymentRouter);
app.use("/api/contact", contectRouter);

app.use((err, req, res, next) => {
  console.log(err);
  const { status = 500, message } = err;
  res
    .status(status)
    .send({ message: message, status: status, code: "ServerError" });
});

app.listen(port, () => {
  console.log(`attendance app listening on port ${port}`);
});

// oops!
