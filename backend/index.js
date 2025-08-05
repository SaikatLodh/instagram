import dotenv from "dotenv";
import { server, app } from "./src/socket/socket.js";
import connectDB from "./src/db/db.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";

dotenv.config({
  path: ".env",
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || process.env.SECOND_CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Origin",
    process.env.CORS_ORIGIN || process.env.SECOND_CORS_ORIGIN
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS,HEAD,PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.set("trust proxy", 1);

import userRoute from "./src/routes/userRouter.js";
import postRouter from "./src/routes/postRouter.js";
import commentRouter from "./src/routes/commentRouter.js";
import messageRouter from "./src/routes/messageRouter.js";
import searchRouter from "./src/routes/searchRoutes.js";
import reelsRouter from "./src/routes/ReelsRouter.js";
import reelsCommentRouter from "./src/routes/rellsCommentRouter.js";
import storyRoute from "./src/routes/storyRoute.js";

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/search", searchRouter);
app.use("/api/v1/reels", reelsRouter);
app.use("/api/v1/reelscomment", reelsCommentRouter);
app.use("/api/v1/story", storyRoute);

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8000, () => {
      console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
