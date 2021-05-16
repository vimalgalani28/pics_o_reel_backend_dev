import Entry from "../models/entries.js";
import multer from "multer";
import express from "express";
import auth from "../middlewares/auth.js";
import imageThumbnail from "image-thumbnail";
import { getEntries } from "../utils/entries.js";
import AWS from "aws-sdk";

const router = new express.Router();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const upload = multer({
  limits: {
    fileSize: 7000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|jpg|png|svg)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(undefined, true);
  },
});

router.post(
  "/upload",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    const existentries = await Entry.find({
      owner: req.user._id,
      section: req.body.section,
    });

    if (existentries.length >= 2) {
      return res.send({
        status: 400,
        error:
          "You have already submitted 2 entries in this section. No more entries allowed",
      });
    }
    let options = { percentage: 25 };
    const thumbnail = await imageThumbnail(req.file.buffer, options);
    const fileType = req.file.mimetype.split("/")[1];
    const number = existentries.length + 1;
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${req.user.displayName}_${req.body.section}_${number}.${fileType}`,
      Body: req.file.buffer,
    };
    s3.upload(params, (error, data) => {
      if (error) {
        return res.send({
          status: 500,
          error,
        });
      }
      const imageBucketLink = data.Location;
      const thumbParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${req.user.displayName}_${req.body.section}_${number}_thumb.${fileType}`,
        Body: thumbnail,
      };
      s3.upload(thumbParams, async (errorThumb, dataThumb) => {
        if (errorThumb) {
          return res.send({
            status: 500,
            error: errorThumb,
          });
        }
        const imageThumbLink = dataThumb.Location;
        const entryObject = {
          title: req.body.title,
          description: req.body.description,
          owner: req.user._id,
          ownerName: req.user.displayName,
          ownerPhone: req.body.ownerPhone,
          section: req.body.section,
          imageBucketLink,
          imageThumbLink,
        };
        const entry = new Entry(entryObject);
        await entry.save();
        res.send(getEntries(entry));
      });
    });
  },
  (error, req, res, next) => {
    res.send({
      status: 402,
      error: error.message,
    });
  }
);

router.patch("/:id", auth, upload.single("avatar"), async (req, res) => {
  try {
    const myEntry = await Entry.findOne({
      owner: req.user._id,
      _id: req.params.id,
    });
    if (!myEntry) {
      return res.send({
        status: 404,
        error: "Entry Not Found",
      });
    }
    if (req.body.section) {
      const existentries = await Entry.find({
        owner: req.user._id,
        section: req.body.section,
      });
      if (existentries.length >= 2) {
        return res.send({
          status: 400,
          error:
            "You have already submitted 2 entries in this section. No more entries allowed",
        });
      }
    }
    const updates = Object.keys(req.body);
    const allowedupdates = [
      "title",
      "description",
      "ownerYear",
      "ownerPhone",
      "section",
    ];
    const operation = updates.every((update) =>
      allowedupdates.includes(update)
    );
    if (!operation) {
      return res.send({
        status: 400,
        error: "Invalid updates!",
      });
    }
    if (req.file) {
      await drive.files.delete({
        fileId: myEntry.driveId,
      });
      const response = await drive.files.create({
        resource: {
          name: req.file.originalname,
        },
        media: {
          mimeType: req.file.mimetype,
          body: await sharp(req.file.buffer).png(),
        },
      });
      const fileId = response.data.id;
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });
      const links = await drive.files.get({
        fileId,
        fields: "webViewLink, webContentLink",
      });
      myEntry.imageViewLink = links.data.webViewLink;
      myEntry.imageContentLink = links.data.webContentLink;
      myEntry.driveId = fileId;
    }
    updates.forEach((update) => (myEntry[update] = req.body[update]));
    await myEntry.save();
    res.send(getEntries(myEntry));
  } catch (e) {
    res.send({
      status: 500,
      error: "Something went wrong!",
    });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const entry = await Entry.find({
      owner: req.user._id,
    });

    res.send(entry.map((ent) => getEntries(ent)));
  } catch (e) {
    res.status(500).send({
      error: e,
    });
  }
});

export default router;
