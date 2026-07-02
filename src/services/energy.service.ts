import {
  ChargingWindowResult,
  DailyEnergyMix,
  GenerationInterval
} from "../types/energy.types";

const CLEAN_FUELS = ["biomass", "nuclear", "hydro", "wind", "solar"];

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function getCleanEnergyPercentage(interval: GenerationInterval): number {
  return interval.generationmix
    .filter((item) => CLEAN_FUELS.includes(item.fuel))
    .reduce((sum, item) => sum + item.perc, 0);
}

function getDateOnly(dateString: string): string {
  return dateString.slice(0, 10);
}

export function calculateDailyAverages(
  intervals: GenerationInterval[]
): DailyEnergyMix[] {
  const groupedByDate: Record<string, GenerationInterval[]> = {};

  for (const interval of intervals) {
    const date = getDateOnly(interval.from);

    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }

    groupedByDate[date].push(interval);
  }

  return Object.entries(groupedByDate).map(([date, dayIntervals]) => {
    const fuelSums: Record<string, number> = {};
    const fuelCounts: Record<string, number> = {};

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

    const mix: Record<string, number> = {};

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

export function findBestChargingWindow(
  intervals: GenerationInterval[],
  hours: number
): ChargingWindowResult {
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

  const bestWindow = intervals.slice(
    bestStartIndex,
    bestStartIndex + requiredIntervals
  );

  return {
    start: bestWindow[0].from,
    end: bestWindow[bestWindow.length - 1].to,
    averageCleanEnergyPercentage: round(bestAverage)
  };
}