import { findBestChargingWindow } from "../src/services/energy.service";
import { GenerationInterval } from "../src/types/energy.types";

describe("findBestChargingWindow", () => {
  it("should find the window with the highest clean energy percentage", () => {
    const intervals: GenerationInterval[] = [
      {
        from: "2026-07-03T00:00:00Z",
        to: "2026-07-03T00:30:00Z",
        generationmix: [
          { fuel: "wind", perc: 10 },
          { fuel: "solar", perc: 10 },
          { fuel: "gas", perc: 80 }
        ]
      },
      {
        from: "2026-07-03T00:30:00Z",
        to: "2026-07-03T01:00:00Z",
        generationmix: [
          { fuel: "wind", perc: 20 },
          { fuel: "solar", perc: 20 },
          { fuel: "gas", perc: 60 }
        ]
      },
      {
        from: "2026-07-03T01:00:00Z",
        to: "2026-07-03T01:30:00Z",
        generationmix: [
          { fuel: "wind", perc: 40 },
          { fuel: "solar", perc: 40 },
          { fuel: "gas", perc: 20 }
        ]
      },
      {
        from: "2026-07-03T01:30:00Z",
        to: "2026-07-03T02:00:00Z",
        generationmix: [
          { fuel: "wind", perc: 45 },
          { fuel: "solar", perc: 45 },
          { fuel: "gas", perc: 10 }
        ]
      }
    ];

    const result = findBestChargingWindow(intervals, 1);

    expect(result.start).toBe("2026-07-03T01:00:00Z");
    expect(result.end).toBe("2026-07-03T02:00:00Z");
    expect(result.averageCleanEnergyPercentage).toBe(85);
  });
});