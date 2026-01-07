import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import adRoutes from "./routes/ad";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/ads", adRoutes);

const PORT = 5002;
const MONGO_URI = "mongodb://localhost:27017/adsdb";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB - ads");
    app.listen(PORT, () => console.log(`Ads service running on ${PORT}`));
  })
  .catch((err) => console.error(err));
