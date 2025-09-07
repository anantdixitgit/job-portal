import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    // console.log("token", token);
    if (!token) {
      return res.status(401).json({
        message: "unauthorised access",
        success: false,
      });
    }

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    // console.log("decoded_data", decodedToken);
    if (!decodedToken) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    // console.log("user", user);
    if (!user) {
      return res.status(501).json({
        message: "user not found",
        success: false,
      });
    }

    req._id = decodedToken._id;
    next();
  } catch (error) {
    console.log(error);
  }
};

export default verifyJWT;
