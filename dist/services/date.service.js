"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getThreeDayRange = getThreeDayRange;
exports.getTwoDayRangeFromTomorrow = getTwoDayRangeFromTomorrow;
function startOfUtcDay(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
}
function addDays(date, days) {
    const copy = new Date(date);
    copy.setUTCDate(copy.getUTCDate() + days);
    return copy;
}
function getThreeDayRange() {
    const todayStart = startOfUtcDay(new Date());
    const yesterdayStart = addDays(todayStart, -1);
    const afterFourDays = addDays(todayStart, 4);
    return {
        from: yesterdayStart.toISOString(),
        to: afterFourDays.toISOString()
    };
}
function getTwoDayRangeFromTomorrow() {
    const todayStart = startOfUtcDay(new Date());
    const tomorrowStart = addDays(todayStart, 1);
    const afterTwoDays = addDays(tomorrowStart, 2);
    return {
        from: tomorrowStart.toISOString(),
        to: afterTwoDays.toISOString()
    };
}
