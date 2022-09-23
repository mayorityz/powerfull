import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 4000;

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

app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!");
});

try {
  app.listen(PORT, () => {
    console.log(`running on port ${PORT}`);
  });
} catch (error) {
  console.log(error.message);
}
