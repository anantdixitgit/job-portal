import { User } from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    //console.log(fullname, email, phoneNumber, password, role);

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "something is missing",
        success: false,
      });
    }

    const file = req.file;

    let cloudResponse;
    if (file) {
      // Upload the local file directly
      cloudResponse = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto", // let Cloudinary detect type
        folder: "resumes",
        public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
        access_mode: "public",
      });

      // After upload, delete local file to save space
      fs.unlinkSync(file.path);
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exist with this email",
        success: false,
      });
    }

    await User.create({
      fullname,
      email,
      phoneNumber,
      password,
      role,
      profile: {
        profilePhoto: cloudResponse?.secure_url,
      },
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error is saving user in database",
      error,
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log("[LOGIN] Incoming login request:", { email, role });
    console.log("[LOGIN] Request headers:", req.headers);
    console.log("[LOGIN] Request origin:", req.headers.origin);

    if (!email || !password || !role) {
      console.log("[LOGIN] Missing fields");
      return res.status(400).json({
        message: "something is missing",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("[LOGIN] User not found");
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await user.isPasswordCorrect(password);

    if (!isPasswordMatch) {
      console.log("[LOGIN] Password mismatch");
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    if (role !== user.role) {
      console.log("[LOGIN] Role mismatch");
      return res.status(400).json({
        message: "account not exist with current role",
        success: false,
      });
    }
    const token = user.generateAccessToken();

    const loggedInUser = await User.findOne({ email }).select("-password");

    const options = {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };
    console.log("[LOGIN] Setting cookie with options:", options);
    const response = res
      .status(200)
      .cookie("token", token, options)
      .json({
        message: `welcome back ${loggedInUser.fullname}`,
        loggedInUser,
        success: true,
      });
    console.log("[LOGIN] Response sent, check browser for cookie");
    return response;
  } catch (error) {
    console.log("[LOGIN] Error:", error);
    res.status(500).json({
      error,
      message: "internal  server error",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const options = {
      maxAge: 0,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    };
    return res.status(200).cookie("token", "", options).json({
      message: "logout successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;

    let cloudResponse;
    if (file) {
      // Upload the local file directly
      cloudResponse = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto", // let Cloudinary detect type
        folder: "resumes",
        public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
        access_mode: "public",
      });

      // After upload, delete local file to save space
      fs.unlinkSync(file.path);
    }

    let skillsArray;
    if (skills) {
      skillsArray = skills.split(",");
    }

    const userId = req._id;
    let user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skillsArray;

    //resume comes later here.....

    if (cloudResponse) {
      user.profile.resume = cloudResponse.secure_url;
      user.profile.resumeOriginalName = file.originalname;
    }

    await user.save();

    // user.fullname = fullname;
    // user.email = email;
    // user.phoneNumber = phoneNumber;
    // user.profile.bio = bio;
    // user.profile.skills = skillsArray;
    const updatedUser = await User.findOne({ userId }).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
