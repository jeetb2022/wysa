import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";

const verifyJWT = async (req, res, next) => {
  const token = req.cookies.token || (req.header("Authorization")?.replace("Bearer ", ""));
  // console.log(token);
  
  if (!token) {
    throw new Error("No Token Found");
  }

  try {
      const isVerified = jwt.verify(token, process.env.JWT_SECRET);
      // console.log(isVerified);

    const user = await UserModel.findById(isVerified.user_id);
    req.user = {
      user_id: user._id,
      username: user.username,
      email: user.email
    };
    next();
  } catch (error) {
    throw new Error( "Access Denied");
  }
};

export default verifyJWT;
