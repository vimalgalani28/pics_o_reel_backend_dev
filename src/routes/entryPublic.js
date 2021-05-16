import express from "express";
import Entry from "../models/entries.js";
import authcoord from "../middlewares/authCoord.js";
import auth from "../middlewares/auth.js";
import User from "../models/user.js";

const router = new express.Router();

router.get("/allentries", auth, async (req, res) => {
  try {
    if (!req.query.section) {
      const entries = await Entry.find({});
      return res.send(entries);
    }
    const section = req.query.section;
    const entries = await Entry.find({ section });
    res.send(entries);
  } catch (e) {
    res.send({
      status: 500,
      error: "Something went wrong!",
    });
  }
});

router.get("/count", authcoord, async (req, res) => {
  try {
    if (!req.query.section) {
      const entries = await Entry.count();
      const users = await User.count();
      const name = req.user.displayName;
      return res.send({ entries, users, name });
    }
    const section = req.query.section;
    const entries = await Entry.find({ section });
    res.send(entries);
  } catch (e) {
    res.send({
      status: 500,
      error: "Something went wrong!",
    });
  }
});

export default router;
