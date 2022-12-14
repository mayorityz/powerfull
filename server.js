import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { CommandModel } from "./models.js";

const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || "";

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/with-params", (req, res, next) => {
  let params = req.query;
  res.status(200).json({
    status: 200,
    parameters: params,
  });
});

app.post("/for-posts", (req, res, next) => {
  let params = req.query;
  let body = req.body;

  res.status(200).json({
    status: 200,
    parameters: params,
    body,
  });
});

app.get("/", (req, res, next) => {
  res.status(200).json({
    to_whom: "Albright",
    message: "This is a server response",
  });
});

app.get("/set-command", async (req, res, next) => {
  const { cmd, meterNumber, SODNumber, broadcastAddress } = req.query;
  try {
    let response = await CommandModel.findOneAndUpdate(
      { meterNumber },
      { cmd, SODNumber, broadcastAddress },
      { new: true, runValidators: true }
    );
    if (!response) {
      response = await CommandModel.create({
        cmd,
        meterNumber,
        SODNumber,
        broadcastAddress,
      });
    }
    res.status(200).json({ response });
  } catch (e) {
    next(e);
  }
});

app.get("/get-command", async (req, res, next) => {
  const { meterNumber } = req.query;
  try {
    const response = await CommandModel.findOne({ meterNumber });
    if (!response) {
      return res.status(404).send("No command");
    }
    res.status(200).send(response.command);
  } catch (e) {
    next(e);
  }
});

app.get("/set-reply", async (req, res, next) => {
  const { reply, meterNumber } = req.query;
  try {
    const response = await CommandModel.findOneAndUpdate(
      { meterNumber },
      { meterResponse: reply },
      { new: true, runValidators: true }
    );
    if (!response) {
      return res.status(404).send("No command was set for this meter");
    }
    res.status(200).send("Success");
  } catch (e) {
    next(e);
  }
});

app.get("/get-command-details", async (req, res, next) => {
  const { meterNumber } = req.query;
  try {
    const response = await CommandModel.findOne({ meterNumber });
    if (!response) {
      return res.status(404).json({ message: "No info found for this meter" });
    }
    res.status(200).json(response);
  } catch (e) {
    next(e);
  }
});

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.use((error, req, res, next) => {
  console.log(error);
  if (error instanceof mongoose.Error.ValidationError) {
    let { errors: validationErrors } = error;
    const errors = Object.values(validationErrors).map(({ path, message }) => {
      return { path, message };
    });
    return res.status(422).json({ errors });
  }
  res.status(500).json({ message: "Internal Server Error" });
});

try {
  mongoose.connect(MONGO_URI).then(() => {
    console.log("Connected to database.");
    app.listen(PORT, () => {
      console.log(`running on port ${PORT}`);
    });
  });
} catch (error) {
  console.log(error.message);
}
