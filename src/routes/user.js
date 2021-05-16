import express from "express";
import { decode } from "jsonwebtoken";
import User from "../models/user.js";
import auth from "../middlewares/auth.js";

const router = new express.Router();

router.post("/login", async (req, res) => {
  try {
    const info = await decode(req.body.idToken)
    if (info.aud !== process.env.MICROSOFT_CLIENT_ID) {
      return res.send({
        status: 401,
        error: "Unauthorised Request!"
      })
    }
    const arr = info.preferred_username.split("@")
    if (!arr[1].startsWith('pictsctr') && !arr[1].startsWith('ms.pict')) {
      return res.send({
        status: 401,
        error: "The Account Doesn't belong to PICT."
      })
    }
    const existUser = await User.findOne({ email: info.preferred_username })
    if (existUser) {
      const token = await existUser.generateAuthToken();
      return res.send({
        user: existUser,
        token,
      })
    }
    const user = new User({
      email: info.preferred_username,
      displayName: info.name,
    })
    await user.save()
    const token = await user.generateAuthToken()
    res.send({
      user,
      token,
    })
  } catch (e) {
    res.send({
      status: 500,
      error: 'Something went wrong!'
    })
  }
})

router.get("/", auth, (req, res) => {
  try {
    res.send({
      user: req.user,
      token: req.token,
    })
  } catch (e) {
    res.send({
      status: 500,
      error: 'Something went wrong!'
    })
  }
})

router.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send({
      message: 'logout'
    });
  } catch (e) {
    res.send({
      status: 500,
      error: 'Something went wrong!'
    })
  }
});

export default router;
