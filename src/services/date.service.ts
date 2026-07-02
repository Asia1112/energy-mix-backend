function startOfUtcDay(date: Date): Date {
    return new Date(Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        0,
        0,
        0
    ));
}

function addDays(date: Date, days: number): Date {
    const copy = new Date(date);
    copy.setUTCDate(copy.getUTCDate() + days);
    return copy;
}

export function getThreeDayRange(): { from: string; to: string } {
    const todayStart = startOfUtcDay(new Date());
    const yesterdayStart = addDays(todayStart, -1);
    const afterFourDays = addDays(todayStart, 4);

    return {
        from: yesterdayStart.toISOString(),
        to: afterFourDays.toISOString()
    };
}

export function getTwoDayRangeFromTomorrow(): { from: string; to: string } {
    const todayStart = startOfUtcDay(new Date());
    const tomorrowStart = addDays(todayStart, 1);
    const afterTwoDays = addDays(tomorrowStart, 2);

    return {
        from: tomorrowStart.toISOString(),
        to: afterTwoDays.toISOString()
    };
}