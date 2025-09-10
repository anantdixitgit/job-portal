import express from "express";
import verifyJWT from "../middleware/Auth.middleware.js";
import { singleUpload } from "../middleware/multer.js";

import {
  getAdminJobs,
  getAllJobs,
  postJob,
  getJobById,
  deleteJob,
} from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(verifyJWT, postJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(verifyJWT, getAdminJobs);
router.route("/get/:id").get(verifyJWT, getJobById);
router.route("/deletejob").delete(verifyJWT, deleteJob);

export default router;
