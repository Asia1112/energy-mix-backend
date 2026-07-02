"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carbonApi_service_1 = require("../services/carbonApi.service");
const date_service_1 = require("../services/date.service");
const energy_service_1 = require("../services/energy.service");
const router = (0, express_1.Router)();
router.get("/energy-mix", async (req, res) => {
    try {
        const { from, to } = (0, date_service_1.getThreeDayRange)();
        const data = await (0, carbonApi_service_1.fetchGenerationMix)(from, to);
        const result = (0, energy_service_1.calculateDailyAverages)(data);
        res.json(result);
    }
    catch (error) {
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
        const { from, to } = (0, date_service_1.getTwoDayRangeFromTomorrow)();
        const data = await (0, carbonApi_service_1.fetchGenerationMix)(from, to);
        const result = (0, energy_service_1.findBestChargingWindow)(data, hours);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to calculate charging window."
        });
    }
});
exports.default = router;
