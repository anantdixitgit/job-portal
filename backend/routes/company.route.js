import express from "express";
import verifyJWT from "../middleware/Auth.middleware.js";
import {
  getCompany,
  getCompanyId,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(verifyJWT, registerCompany);
router.route("/get").get(verifyJWT, getCompany);
router.route("/get/:id").get(verifyJWT, getCompanyId);
router.route("/update/:id").put(verifyJWT, singleUpload, updateCompany);

// router.route("/register").post(register);
// router.route("/login").post(login);
// router.route("/profile/update").post(verifyJWT, updateProfile);
// router.route("/logout").get(logout);

export default router;
