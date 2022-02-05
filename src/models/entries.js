import mongoose from "mongoose";

const entrySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageBucketLink: {
      type: String,
      required: true,
    },
    imageThumbLink: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    ownerName: {
      type: String,
      required: true,
    },
    ownerPhone: {
      type: String,
      required: true,
    },
    section: {
      type: String,
      required: true,
      validate(value) {
        if (
          value !== "Painting" &&
          value !== "Photography" &&
          value !== "Crafts" &&
          value !== "Others"
        ) {
          throw new Error("Only Painting & Photography is allowed");
        }
      },
    },
    voteCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Entry = mongoose.model("Entry", entrySchema);
export default Entry;
