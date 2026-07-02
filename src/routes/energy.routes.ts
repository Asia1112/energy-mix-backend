import { Router } from "express";
import { fetchGenerationMix } from "../services/carbonApi.service";
import { getThreeDayRange, getTwoDayRangeFromTomorrow } from "../services/date.service";
import { calculateDailyAverages, findBestChargingWindow } from "../services/energy.service";

const router = Router();

router.get("/energy-mix", async (req, res) => {
  try {
    const { from, to } = getThreeDayRange();
    const data = await fetchGenerationMix(from, to);

    const result = calculateDailyAverages(data);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch energy mix data."
    });
  }
});

router.get("/charging-window", async (req, res) => {
  try {
    const hours = Number(req.query.hours);

    if (!Number.isInteger(hours) || hours < 1 || hours > 6) {
      return res.status(400).json({
        message: "Charging time must be a full number of hours between 1 and 6."
      });
    }

    const { from, to } = getTwoDayRangeFromTomorrow();
    const data = await fetchGenerationMix(from, to);

    const result = findBestChargingWindow(data, hours);

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to calculate charging window."
    });
  }
});

export default router;