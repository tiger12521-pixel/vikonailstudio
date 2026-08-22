/* #region Booking Configuration */

/* API route used to load one week of booking availability. */
export const BOOKING_API_URL = "/api/booking";

/* LINE Official Account used by the booking inquiry form. */
export const LINE_OFFICIAL_ACCOUNT_ID = "@201qwlwv";

/* Booking slot keys shared by the API response and booking UI. */
export const BOOKING_TIME_SLOTS = Object.freeze([
	Object.freeze({
		key: "morning",
		label: "早上",
		startTimes: Object.freeze(["08:00", "08:30", "09:00"])
	}),
	Object.freeze({
		key: "afternoon",
		label: "中午",
		startTimes: Object.freeze(["12:30", "13:00"])
	}),
	Object.freeze({
		key: "evening",
		label: "晚上",
		startTimes: Object.freeze(["17:00", "17:30", "18:00"])
	})
]);

/* Weekday labels displayed beside each booking date. */
export const WEEKDAY_LABELS = Object.freeze([
	"日",
	"一",
	"二",
	"三",
	"四",
	"五",
	"六"
]);

/* Default status used when the API has no entry for a date. */
export const DEFAULT_DAY_AVAILABILITY = Object.freeze({
	morning: true,
	afternoon: true,
	evening: true
});

/* Number of days displayed in one booking page. */
export const DAYS_PER_WEEK = 7;

/* #endregion */
