const express = require("express");
const Reading = require("../models/Reading");
const auth = require("../middleware/auth");
const { slidingAverage } = require("../utils/slidingWindow");
const mongoose = require("mongoose");

const router = express.Router();

router.use(auth);

router.post("/", async (req, res) => {
  try {
    const { date, applianceName, units, costPerUnit, totalCost } = req.body;
    if (!date || !applianceName || units == null || costPerUnit == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const tc =
      totalCost != null ? totalCost : Number(units) * Number(costPerUnit);
    const reading = await Reading.create({
      userId: req.user.id,
      date: new Date(date),
      applianceName,
      units: Number(units),
      costPerUnit: Number(costPerUnit),
      totalCost: Number(tc),
    });
    res.status(201).json(reading);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const readings = await Reading.find({ userId: req.user.id }).sort({
      date: 1,
    });
    res.json(readings);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/average", async (req, res) => {
  try {
    const n = Number(req.query.n) || 3;
    const readings = await Reading.find({ userId: req.user.id }).sort({
      date: 1,
    });
    const avg = slidingAverage(readings, n);
    res.json({ n, averageUnits: avg });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/summary/monthly", async (req, res) => {
  try {
    const summary = await Reading.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          totalUnits: { $sum: "$units" },
          totalCost: { $sum: "$totalCost" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const result = summary.map((item) => ({
      year: item._id.year,
      month: item._id.month,
      totalUnits: item.totalUnits,
      totalCost: item.totalCost,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/summary/appliance", async (req, res) => {
  try {
    const summary = await Reading.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: "$applianceName",
          totalUnits: { $sum: "$units" },
          totalCost: { $sum: "$totalCost" },
        },
      },
      { $sort: { totalUnits: -1 } },
    ]);

    const result = summary.map((item) => ({
      applianceName: item._id,
      totalUnits: item.totalUnits,
      totalCost: item.totalCost,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
