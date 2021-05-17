import express from "express";
import auth from "../middlewares/auth.js";
import Entry from "../models/entries.js";
import User from "../models/user.js";

const router = new express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user._id });
    if (!user) {
      return res.status(404).send();
    }
    if (req.body.votedEntries === undefined && req.body.section === undefined) {
      return res.status(404).send();
    }

    if (req.body.section.toLowerCase() === "painting") {
      if (!user.hasVotedPainting) {
        req.body.votedEntries.map(async (id) => {
          const entry = await Entry.findOne({ _id: id });
          if (!entry) {
            return res.status(404).send();
          }
          if (entry.section.toLowerCase() !== req.body.section.toLowerCase()) {
            return res.send("Section mismatch!");
          }

          entry.voteCount += 1;

          await entry.save();
        });
      } else {
        return res.send({ error: "Already Voted" });
      }
      user.hasVotedPainting = true;
      await user.save();
      return res.send(user.hasVotedPainting);
    } else if (req.body.section.toLowerCase() === "photography") {
      if (!user.hasVotedPhotography) {
        req.body.votedEntries.map(async (id) => {
          const entry = await Entry.findOne({ _id: id });
          if (!entry) {
            return res.status(404).send();
          }
          if (entry.section.toLowerCase() !== req.body.section.toLowerCase()) {
            return res.send("Section mismatch!");
          }

          entry.voteCount += 1;

          await entry.save();
        });
      } else {
        return res.send({ error: "Already Voted" });
      }

      user.hasVotedPhotography = true;
      await user.save();
      return res.send(user.hasVotedPhotography);
    } else if (req.body.section.toLowerCase() === "independence") {
      if (!user.hasVotedIndependence) {
        req.body.votedEntries.map(async (id) => {
          const entry = await Entry.findOne({ _id: id });
          if (!entry) {
            return res.status(404).send();
          }
          if (entry.section.toLowerCase() !== req.body.section.toLowerCase()) {
            return res.send("Section mismatch!");
          }
          console.log("here");

          entry.voteCount += 1;

          await entry.save();
        });
      } else {
        return res.send({ error: "Already Voted" });
      }
      user.hasVotedIndependence = true;
      await user.save();
      return res.send(user.hasVotedIndependence);
    }
  } catch (e) {
    res.send(e);
  }
});

export default router;
