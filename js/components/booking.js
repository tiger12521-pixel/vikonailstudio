/* #region Booking Component */

import {
	DAYS_PER_WEEK,
	DEFAULT_DAY_AVAILABILITY,
	WEEKDAY_LABELS
} from "../config/booking-config.js";
import { fetchBookingWeek } from "../services/booking-api.js";
import {
	addDays,
	formatDateKey,
	formatMonthText,
	formatShortDate,
	getMonday
} from "../utils/date.js";

/*
 * Booking DOM references.
 * Change the matching IDs in index.html only when these references are updated.
 */
const bookingElements = {
	month: document.getElementById("bookingMonth"),
	range: document.getElementById("bookingRange"),
	list: document.getElementById("bookingList"),
	previousButton: document.getElementById("prevWeekBtn"),
	nextButton: document.getElementById("nextWeekBtn")
};

let currentWeekStart = getMonday(new Date());

/* Creates one green available slot or one red booked slot. */
function createSlot(isAvailable) {
	const statusText = isAvailable ? "可約" : "已滿";
	const className = isAvailable ? "available" : "booked";

	return `
		<div class="slot ${className}">
			<span class="slot-dot">●</span>
			<span class="slot-text">${statusText}</span>
		</div>
	`;
}

/* Creates one date row containing morning, afternoon, and evening status. */
function createBookingDay(date, dayData) {
	return `
		<div class="booking-day">
			<div class="booking-date">
				<strong>${formatShortDate(date)}</strong>
				<span>（${WEEKDAY_LABELS[date.getDay()]}）</span>
			</div>

			<div class="booking-slots">
				${createSlot(dayData.morning)}
				${createSlot(dayData.afternoon)}
				${createSlot(dayData.evening)}
			</div>
		</div>
	`;
}

/* Updates the month title and visible Monday-to-Sunday date range. */
function renderBookingHeader() {
	const weekEnd = addDays(currentWeekStart, DAYS_PER_WEEK - 1);

	bookingElements.month.textContent = formatMonthText(currentWeekStart);
	bookingElements.range.textContent =
		`${formatShortDate(currentWeekStart)} - ${formatShortDate(weekEnd)}`;
}

/* Rebuilds all seven booking rows using the latest API response. */
async function renderBookingWeek() {
	try {
		const dataSource = await fetchBookingWeek(currentWeekStart);

		renderBookingHeader();
		bookingElements.list.innerHTML = "";

		for (let index = 0; index < DAYS_PER_WEEK; index += 1) {
			const date = addDays(currentWeekStart, index);
			const dateKey = formatDateKey(date);
			const dayData = dataSource[dateKey] || DEFAULT_DAY_AVAILABILITY;

			bookingElements.list.insertAdjacentHTML(
				"beforeend",
				createBookingDay(date, dayData)
			);
		}
	} catch (error) {
		console.error("Unable to render booking availability:", error);
	}
}

/* Moves the booking view backward or forward by one full week. */
function changeWeek(numberOfDays) {
	currentWeekStart = addDays(currentWeekStart, numberOfDays);
	renderBookingWeek();
}

/* Confirms that all required booking elements exist before initialization. */
function hasRequiredElements() {
	return Object.values(bookingElements).every(Boolean);
}

export function initializeBooking() {
	if (!hasRequiredElements()) {
		console.warn("Booking component was not initialized: required HTML is missing.");
		return;
	}

	bookingElements.previousButton.addEventListener("click", () => {
		changeWeek(-DAYS_PER_WEEK);
	});

	bookingElements.nextButton.addEventListener("click", () => {
		changeWeek(DAYS_PER_WEEK);
	});

	renderBookingWeek();
}

/* #endregion */
