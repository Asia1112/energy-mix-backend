import {
  calculateDailyAverages,
  findBestChargingWindow
} from "../src/services/energy.service";
import { GenerationInterval } from "../src/types/energy.types";

function createInterval(
  from: string,
  generationmix: GenerationInterval["generationmix"],
  to = "2026-07-03T00:30:00Z"
): GenerationInterval {
  return {
    from,
    to,
    generationmix
  };
}

describe("calculateDailyAverages", () => {
  it("should group intervals by day and average each fuel", () => {
    const intervals: GenerationInterval[] = [
      createInterval("2026-07-03T00:00:00Z", [
        { fuel: "wind", perc: 20 },
        { fuel: "solar", perc: 10 },
        { fuel: "gas", perc: 70 }
      ]),
      createInterval("2026-07-03T00:30:00Z", [
        { fuel: "wind", perc: 40 },
        { fuel: "solar", perc: 20 },
        { fuel: "gas", perc: 40 }
      ]),
      createInterval("2026-07-04T00:00:00Z", [
        { fuel: "wind", perc: 60 },
        { fuel: "nuclear", perc: 25 },
        { fuel: "gas", perc: 15 }
      ])
    ];

    const result = calculateDailyAverages(intervals);

    expect(result).toEqual([
      {
        date: "2026-07-03",
        mix: {
          wind: 30,
          solar: 15,
          gas: 55
        },
        cleanEnergyPercentage: 45
      },
      {
        date: "2026-07-04",
        mix: {
          wind: 60,
          nuclear: 25,
          gas: 15
        },
        cleanEnergyPercentage: 85
      }
    ]);
  });

  it("should round daily averages to two decimal places", () => {
    const intervals: GenerationInterval[] = [
      createInterval("2026-07-03T00:00:00Z", [
        { fuel: "wind", perc: 10 },
        { fuel: "solar", perc: 20 },
        { fuel: "gas", perc: 70 }
      ]),
      createInterval("2026-07-03T00:30:00Z", [
        { fuel: "wind", perc: 11 },
        { fuel: "solar", perc: 21 },
        { fuel: "gas", perc: 68 }
      ]),
      createInterval("2026-07-03T01:00:00Z", [
        { fuel: "wind", perc: 12 },
        { fuel: "solar", perc: 22 },
        { fuel: "gas", perc: 66 }
      ])
    ];

    const [day] = calculateDailyAverages(intervals);

    expect(day.mix.wind).toBe(11);
    expect(day.mix.solar).toBe(21);
    expect(day.cleanEnergyPercentage).toBe(32);
  });
});

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

  it("should use the first best window when two windows have the same average", () => {
    const intervals: GenerationInterval[] = [
      createInterval(
        "2026-07-03T00:00:00Z",
        [
          { fuel: "wind", perc: 40 },
          { fuel: "gas", perc: 60 }
        ],
        "2026-07-03T00:30:00Z"
      ),
      createInterval(
        "2026-07-03T00:30:00Z",
        [
          { fuel: "wind", perc: 60 },
          { fuel: "gas", perc: 40 }
        ],
        "2026-07-03T01:00:00Z"
      ),
      createInterval(
        "2026-07-03T01:00:00Z",
        [
          { fuel: "wind", perc: 40 },
          { fuel: "gas", perc: 60 }
        ],
        "2026-07-03T01:30:00Z"
      )
    ];

    const result = findBestChargingWindow(intervals, 1);

    expect(result.start).toBe("2026-07-03T00:00:00Z");
    expect(result.end).toBe("2026-07-03T01:00:00Z");
    expect(result.averageCleanEnergyPercentage).toBe(50);
  });

  it("should throw when there is not enough data for the requested hours", () => {
    const intervals: GenerationInterval[] = [
      createInterval("2026-07-03T00:00:00Z", [
        { fuel: "wind", perc: 80 },
        { fuel: "gas", perc: 20 }
      ])
    ];

    expect(() => findBestChargingWindow(intervals, 1)).toThrow(
      "Not enough data to calculate charging window."
    );
  });
});
