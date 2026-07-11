/* #region Date Utilities */

/* Returns Monday 00:00 of the week containing the supplied date. */
export function getMonday(date) {
	const result = new Date(date);
	const day = result.getDay();
	const difference = day === 0 ? -6 : 1 - day;

	result.setDate(result.getDate() + difference);
	result.setHours(0, 0, 0, 0);

	return result;
}

/* Converts a date to the API key format: YYYY-MM-DD. */
export function formatDateKey(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${year}-${month}-${day}`;
}

/* Converts a date to the booking title format: YYYY 年 M 月. */
export function formatMonthText(date) {
	return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`;
}

/* Converts a date to the compact display format: MM/DD. */
export function formatShortDate(date) {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");

	return `${month}/${day}`;
}

/* Returns a new date shifted by the requested number of days. */
export function addDays(date, numberOfDays) {
	const result = new Date(date);
	result.setDate(result.getDate() + numberOfDays);
	return result;
}

/* #endregion */
