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
  const { command, meterNo } = req.query;
  try {
    let response = await CommandModel.findOneAndUpdate(
      { meterNo },
      { command },
      { new: true, runValidators: true }
    );
    if (!response) {
      response = await CommandModel.create({ command, meterNo });
    }
    res.status(200).json({ response });
  } catch (e) {
    next(e);
  }
});

app.get("/get-command", async (req, res, next) => {
  const { meterNo } = req.query;
  try {
    const command = await CommandModel.findOne({ meterNo });
    res.status(200).json({ command });
  } catch (e) {
    next(e);
  }
});

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

app.use((error, req, res, next) => {
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
