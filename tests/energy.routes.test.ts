import request from "supertest";
import { createApp } from "../src/app";
import { fetchGenerationMix } from "../src/services/carbonApi.service";
import type { GenerationInterval } from "../src/types/energy.types";

jest.mock("../src/services/carbonApi.service", () => ({
  fetchGenerationMix: jest.fn()
}));

const mockedFetchGenerationMix = jest.mocked(fetchGenerationMix);

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

describe("energy routes", () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date("2026-07-03T12:00:00Z"));
    mockedFetchGenerationMix.mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("GET /api/energy-mix", () => {
    it("returns filtered and sorted energy mix data for target dates", async () => {
      mockedFetchGenerationMix.mockResolvedValueOnce([
        createInterval("2026-07-05T00:00:00Z", [
          { fuel: "wind", perc: 50 },
          { fuel: "gas", perc: 50 }
        ]),
        createInterval("2026-07-02T00:00:00Z", [
          { fuel: "wind", perc: 90 },
          { fuel: "gas", perc: 10 }
        ]),
        createInterval("2026-07-03T00:00:00Z", [
          { fuel: "solar", perc: 20 },
          { fuel: "gas", perc: 80 }
        ]),
        createInterval("2026-07-04T00:00:00Z", [
          { fuel: "nuclear", perc: 40 },
          { fuel: "gas", perc: 60 }
        ])
      ]);

      await request(createApp())
        .get("/api/energy-mix")
        .expect(200)
        .expect([
          {
            date: "2026-07-03",
            mix: {
              solar: 20,
              gas: 80
            },
            cleanEnergyPercentage: 20
          },
          {
            date: "2026-07-04",
            mix: {
              nuclear: 40,
              gas: 60
            },
            cleanEnergyPercentage: 40
          },
          {
            date: "2026-07-05",
            mix: {
              wind: 50,
              gas: 50
            },
            cleanEnergyPercentage: 50
          }
        ]);

      expect(mockedFetchGenerationMix).toHaveBeenCalledWith(
        "2026-07-02T00:00:00.000Z",
        "2026-07-07T00:00:00.000Z"
      );
    });

    it("returns 500 when energy mix data cannot be fetched", async () => {
      mockedFetchGenerationMix.mockRejectedValueOnce(new Error("upstream"));

      await request(createApp())
        .get("/api/energy-mix")
        .expect(500)
        .expect({
          message: "Failed to fetch energy mix data."
        });
    });
  });

  describe("GET /api/charging-window", () => {
    it("returns the best charging window for valid hours", async () => {
      mockedFetchGenerationMix.mockResolvedValueOnce([
        createInterval(
          "2026-07-04T00:00:00Z",
          [
            { fuel: "wind", perc: 20 },
            { fuel: "gas", perc: 80 }
          ],
          "2026-07-04T00:30:00Z"
        ),
        createInterval(
          "2026-07-04T00:30:00Z",
          [
            { fuel: "wind", perc: 40 },
            { fuel: "gas", perc: 60 }
          ],
          "2026-07-04T01:00:00Z"
        ),
        createInterval(
          "2026-07-04T01:00:00Z",
          [
            { fuel: "wind", perc: 90 },
            { fuel: "gas", perc: 10 }
          ],
          "2026-07-04T01:30:00Z"
        ),
        createInterval(
          "2026-07-04T01:30:00Z",
          [
            { fuel: "wind", perc: 80 },
            { fuel: "gas", perc: 20 }
          ],
          "2026-07-04T02:00:00Z"
        )
      ]);

      await request(createApp())
        .get("/api/charging-window?hours=1")
        .expect(200)
        .expect({
          start: "2026-07-04T01:00:00Z",
          end: "2026-07-04T02:00:00Z",
          averageCleanEnergyPercentage: 85
        });

      expect(mockedFetchGenerationMix).toHaveBeenCalledWith(
        "2026-07-04T00:00:00.000Z",
        "2026-07-06T00:00:00.000Z"
      );
    });

    it.each(["0", "7", "1.5", "not-a-number"])(
      "returns 400 for invalid hours=%s",
      async (hours) => {
        await request(createApp())
          .get(`/api/charging-window?hours=${hours}`)
          .expect(400)
          .expect({
            message:
              "Charging time must be a full number of hours between 1 and 6."
          });

        expect(mockedFetchGenerationMix).not.toHaveBeenCalled();
      }
    );

    it("returns 500 when the charging window cannot be calculated", async () => {
      mockedFetchGenerationMix.mockRejectedValueOnce(new Error("upstream"));

      await request(createApp())
        .get("/api/charging-window?hours=1")
        .expect(500)
        .expect({
          message: "Failed to calculate charging window."
        });
    });
  });
});
