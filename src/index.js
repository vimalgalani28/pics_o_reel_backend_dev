import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/mongoose.js";
import entryRouter from "./routes/entry.js";
import entryPublicRouter from "./routes/entryPublic.js";
import morgan from "morgan";
import userRouter from "./routes/user.js";
import voteRouter from "./routes/vote.js";
dotenv.config();

connectDB();

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/entry", entryRouter);
app.use("/entries", entryPublicRouter);
app.use("/user", userRouter);
app.use("/vote", voteRouter);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App is on port ${port}`);
});
