"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDailyAverages = calculateDailyAverages;
exports.findBestChargingWindow = findBestChargingWindow;
const CLEAN_FUELS = ["biomass", "nuclear", "hydro", "wind", "solar"];
function round(value) {
    return Math.round(value * 100) / 100;
}
function getCleanEnergyPercentage(interval) {
    return interval.generationmix
        .filter((item) => CLEAN_FUELS.includes(item.fuel))
        .reduce((sum, item) => sum + item.perc, 0);
}
function getDateOnly(dateString) {
    return dateString.slice(0, 10);
}
function calculateDailyAverages(intervals) {
    const groupedByDate = {};
    for (const interval of intervals) {
        const date = getDateOnly(interval.from);
        if (!groupedByDate[date]) {
            groupedByDate[date] = [];
        }
        groupedByDate[date].push(interval);
    }
    return Object.entries(groupedByDate).map(([date, dayIntervals]) => {
        const fuelSums = {};
        const fuelCounts = {};
        for (const interval of dayIntervals) {
            for (const item of interval.generationmix) {
                if (!fuelSums[item.fuel]) {
                    fuelSums[item.fuel] = 0;
                    fuelCounts[item.fuel] = 0;
                }
                fuelSums[item.fuel] += item.perc;
                fuelCounts[item.fuel] += 1;
            }
        }
        const mix = {};
        for (const fuel of Object.keys(fuelSums)) {
            mix[fuel] = round(fuelSums[fuel] / fuelCounts[fuel]);
        }
        const cleanEnergyPercentage = CLEAN_FUELS.reduce((sum, fuel) => {
            return sum + (mix[fuel] || 0);
        }, 0);
        return {
            date,
            mix,
            cleanEnergyPercentage: round(cleanEnergyPercentage)
        };
    });
}
function findBestChargingWindow(intervals, hours) {
    const requiredIntervals = hours * 2;
    if (intervals.length < requiredIntervals) {
        throw new Error("Not enough data to calculate charging window.");
    }
    let bestStartIndex = 0;
    let bestAverage = -1;
    for (let i = 0; i <= intervals.length - requiredIntervals; i++) {
        const window = intervals.slice(i, i + requiredIntervals);
        const cleanEnergySum = window.reduce((sum, interval) => {
            return sum + getCleanEnergyPercentage(interval);
        }, 0);
        const average = cleanEnergySum / requiredIntervals;
        if (average > bestAverage) {
            bestAverage = average;
            bestStartIndex = i;
        }
    }
    const bestWindow = intervals.slice(bestStartIndex, bestStartIndex + requiredIntervals);
    return {
        start: bestWindow[0].from,
        end: bestWindow[bestWindow.length - 1].to,
        averageCleanEnergyPercentage: round(bestAverage)
    };
}
