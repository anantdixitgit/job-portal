import multer from "multer";
import path from "path";

// Storage on local "uploads" folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // create "uploads" folder in backend root
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Middleware for single file
export const singleUpload = multer({ storage }).single("file");
