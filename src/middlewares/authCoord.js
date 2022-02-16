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
      user.displayName === "32159_Ashutosh_21_22" ||
      user.displayName === "31406_Rohin_21_22" ||
      user.displayName === "31127_Vimal_21_22" ||
      user.displayName === "31230_Sharayu_21_22" ||
      user.displayName === "32118_Meghna_21_22" ||
      user.displayName === "32162_Rhuchita_21_22"
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
