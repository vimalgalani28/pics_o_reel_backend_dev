import express from "express";
import auth from "../middlewares/auth.js";
import Entry from "../models/entries.js";
import User from "../models/user.js";

const router = new express.Router();

const vote = (entries, section) => {
  entries.map(async (id) => {
    const entry = await Entry.findOne({ _id: id });
    if (!entry) {
      return res.status(404).send();
    }
    if (entry.section !== section) {
      return res.send("Section mismatch!");
    }

    entry.voteCount += 1;

    await entry.save();
  });
};

router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).send();
    }

    if (req.body.votedEntries) {
      if (req.body.section.toLowerCase() === "painting") {
        if (!user.hasVotedPainting) {
          vote(req.body.votedEntries, req.body.section.toLowerCase());
        } else {
          return res.send({ error: "Already Voted" });
        }
        user.hasVotedPainting = true;
      } else {
        if (!user.hasVotedPhotography) {
          vote(req.body.votedEntries, req.body.section.toLowerCase());
        } else {
          return res.send({ error: "Already Voted" });
        }
        user.hasVotedPhotography = true;
      }
    }

    await user.save();
    res.send(user);
  } catch (e) {
    res.send(e);
  }
});

export default router;
