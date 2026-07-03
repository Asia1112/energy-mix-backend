function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0
    )
  );
}

function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function getDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getEnergyMixFetchRange(baseDate = new Date()): {
  from: string;
  to: string;
} {
  const todayStart = startOfUtcDay(baseDate);
  const yesterdayStart = addDays(todayStart, -1);
  const afterFourDays = addDays(todayStart, 4);

  return {
    from: yesterdayStart.toISOString(),
    to: afterFourDays.toISOString()
  };
}

export function getEnergyMixTargetDates(baseDate = new Date()): string[] {
  const todayStart = startOfUtcDay(baseDate);

  return [0, 1, 2].map((offset) => getDateOnly(addDays(todayStart, offset)));
}

export function getChargingWindowRangeFromTomorrow(baseDate = new Date()): {
  from: string;
  to: string;
} {
  const todayStart = startOfUtcDay(baseDate);
  const tomorrowStart = addDays(todayStart, 1);
  const afterTwoDays = addDays(tomorrowStart, 2);

  return {
    from: tomorrowStart.toISOString(),
    to: afterTwoDays.toISOString()
  };
}
