import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: `16kb` }));
app.use(bodyParser.urlencoded({ extended: true, limit: `16kb` }));
app.use(express.static("public"));
app.use(cookieParser());

// using routes from here
import userRouter from "./routes/user.routes.js";

//routes declarations
app.use("/api/v1/users", userRouter);

export { app };
