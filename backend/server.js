import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./utils/db.js";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import companyRouter from "./routes/company.route.js";
import jobRouter from "./routes/job.route.js";
import applicationRouter from "./routes/application.route.js";

const app = express();

dotenv.config({});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: [
    "https://job-portal-frontend-mq47.onrender.com",
    "http://localhost:5173",
    ,
  ],
  credentials: true,
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;

//api
app.use("/api/v1/user", userRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

const serverinit = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  } catch (error) {
    console.log("mongodb connection failed:", error);
  }
};

serverinit();
