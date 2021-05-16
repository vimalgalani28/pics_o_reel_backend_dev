import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authCoord = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decode._id, "tokens.token": token });
    if (!user) {
      throw new Error();
    }
    if (
      user.displayName === "22161_Ashutosh" ||
      user.displayName === "22151_Rushikesh" ||
      user.displayName === "22162_Devangini" ||
      user.displayName === "21127_Vimal" ||
      user.displayName === "23217_Megha" ||
      user.displayName === "33362_Rohit"
    ) {
      req.user = user;
      req.token = token;
      next();
    } else {
      throw new Error();
    }
  } catch (e) {
    res.send({
      status: 401,
      error: "Not authenticated",
    });
  }
};

export default authCoord;
