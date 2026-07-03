import {
  getChargingWindowRangeFromTomorrow,
  getEnergyMixFetchRange,
  getEnergyMixTargetDates
} from "../src/services/date.service";

describe("date service", () => {
  const baseDate = new Date("2026-07-03T23:30:00Z");

  it("returns UTC target dates for the visible energy mix cards", () => {
    expect(getEnergyMixTargetDates(baseDate)).toEqual([
      "2026-07-03",
      "2026-07-04",
      "2026-07-05"
    ]);
  });

  it("returns the wider UTC fetch range needed for energy mix data", () => {
    expect(getEnergyMixFetchRange(baseDate)).toEqual({
      from: "2026-07-02T00:00:00.000Z",
      to: "2026-07-07T00:00:00.000Z"
    });
  });

  it("returns the UTC charging window search range from tomorrow", () => {
    expect(getChargingWindowRangeFromTomorrow(baseDate)).toEqual({
      from: "2026-07-04T00:00:00.000Z",
      to: "2026-07-06T00:00:00.000Z"
    });
  });
});
