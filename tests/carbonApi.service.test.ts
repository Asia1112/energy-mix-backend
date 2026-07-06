import axios from "axios";
import { fetchGenerationMix } from "../src/services/carbonApi.service";
import type { GenerationInterval } from "../src/types/energy.types";

jest.mock("axios");

const mockedAxios = jest.mocked(axios);

describe("fetchGenerationMix", () => {
  const originalCarbonApiBaseUrl = process.env.CARBON_API_BASE_URL;

  beforeEach(() => {
    delete process.env.CARBON_API_BASE_URL;
    mockedAxios.get.mockReset();
  });

  afterEach(() => {
    process.env.CARBON_API_BASE_URL = originalCarbonApiBaseUrl;
  });

  it("requests the Carbon Intensity generation endpoint with timeout", async () => {
    const intervals: GenerationInterval[] = [
      {
        from: "2026-07-03T00:00:00Z",
        to: "2026-07-03T00:30:00Z",
        generationmix: [
          { fuel: "wind", perc: 30 },
          { fuel: "gas", perc: 70 }
        ]
      }
    ];

    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: intervals
      }
    });

    await expect(
      fetchGenerationMix("2026-07-03T00:00:00Z", "2026-07-04T00:00:00Z")
    ).resolves.toEqual(intervals);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://api.carbonintensity.org.uk/generation/2026-07-03T00:00:00Z/2026-07-04T00:00:00Z",
      {
        timeout: 10000
      }
    );
  });

  it("uses CARBON_API_BASE_URL when it is configured", async () => {
    process.env.CARBON_API_BASE_URL = "https://carbon.example.test/";
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        data: []
      }
    });

    await fetchGenerationMix(
      "2026-07-03T00:00:00Z",
      "2026-07-04T00:00:00Z"
    );

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://carbon.example.test/generation/2026-07-03T00:00:00Z/2026-07-04T00:00:00Z",
      {
        timeout: 10000
      }
    );
  });
});
