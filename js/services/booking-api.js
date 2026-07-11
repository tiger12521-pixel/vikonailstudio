/* #region Booking API Service */

import { BOOKING_API_URL } from "../config/booking-config.js";
import { formatDateKey } from "../utils/date.js";

/*
 * Requests one week of booking availability.
 * cache: no-store prevents an old API response from being reused locally.
 */
export async function fetchBookingWeek(weekStart) {
	const week = formatDateKey(weekStart);
	const response = await fetch(`${BOOKING_API_URL}?week=${week}`, {
		cache: "no-store"
	});

	if (!response.ok) {
		throw new Error(`Failed to load booking data: HTTP ${response.status}`);
	}

	return response.json();
}

/* #endregion */
