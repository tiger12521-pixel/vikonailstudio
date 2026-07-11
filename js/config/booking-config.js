/* #region Booking Configuration */

/* API route used to load one week of booking availability. */
export const BOOKING_API_URL = "/api/booking";

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
