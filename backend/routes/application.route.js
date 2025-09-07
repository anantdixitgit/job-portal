import express from "express";
import verifyJWT from "../middleware/Auth.middleware.js";
import {
  applyJob,
  getAllApplicants,
  getAppliedJobs,
  updateStatus,
} from "../controllers/application.controller.js";

const router = express.Router();

router.route("/apply/:id").get(verifyJWT, applyJob);
router.route("/appliedJobs").get(verifyJWT, getAppliedJobs);
router.route("/:id/applicants").get(verifyJWT, getAllApplicants);
router.route("/status/:id/update").post(verifyJWT, updateStatus);

export default router;
