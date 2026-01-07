import { Router, Request, Response } from "express";
import Ad from "../models/ad";

const router = Router();

// Get all active ads
router.get("/", async (_req: Request, res: Response) => {
  try {
    const ads = await Ad.find({ isActive: true });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching ads" });
  }
});

// Get ad by id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });
    res.json(ad);
  } catch (err) {
    res.status(500).json({ message: "Server error fetching ad" });
  }
});

export default router;
