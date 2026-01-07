import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import productRoutes from "./routes/product";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);

const PORT = 5001;
const MONGO_URI = "mongodb://localhost:27017/productsdb";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB - products");
    app.listen(PORT, () => console.log(`Products service running on ${PORT}`));
  })
  .catch((err) => console.error(err));
