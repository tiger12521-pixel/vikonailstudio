/* #region Booking Component */

import {
	BOOKING_TIME_SLOTS,
	DAYS_PER_WEEK,
	DEFAULT_DAY_AVAILABILITY,
	LINE_OFFICIAL_ACCOUNT_ID,
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
	nextButton: document.getElementById("nextWeekBtn"),
	dialog: document.getElementById("bookingDialog"),
	dialogClose: document.getElementById("bookingDialogClose"),
	dialogCancel: document.getElementById("bookingDialogCancel"),
	selectedSlot: document.getElementById("bookingDialogSelected"),
	form: document.getElementById("bookingInquiryForm"),
	serviceArea: document.getElementById("bookingServiceArea"),
	bothHelp: document.getElementById("bookingBothHelp"),
	bothDetails: document.getElementById("bookingBothDetails"),
	removal: document.getElementById("bookingRemoval"),
	continuationField: document.getElementById("bookingContinuationField"),
	footRemoval: document.getElementById("bookingFootRemoval"),
	footContinuationField: document.getElementById("bookingFootContinuationField"),
	messageResult: document.getElementById("bookingMessageResult"),
	messageText: document.getElementById("bookingMessageText"),
	copyStatus: document.getElementById("bookingCopyStatus"),
	editButton: document.getElementById("bookingEditButton"),
	copyButton: document.getElementById("bookingCopyButton"),
	openLine: document.getElementById("bookingOpenLine")
};

let currentWeekStart = getMonday(new Date());
let selectedBookingSlot = null;

function isBookingSlotPast(date, timeLabel, now = new Date()) {
	const [hours, minutes] = timeLabel.split(":").map(Number);
	const slotDate = new Date(date);
	slotDate.setHours(hours, minutes, 0, 0);

	return slotDate <= now;
}

/* Creates one interactive available slot or one non-interactive status slot. */
function createSlot(isAvailable, date, timeSlot) {
	const isPast = isBookingSlotPast(date, timeSlot.label);
	const canBook = isAvailable && !isPast;
	const statusText = isPast ? "已過" : (isAvailable ? "可約" : "已滿");
	const className = isPast ? "expired" : (isAvailable ? "available" : "booked");
	const tagName = canBook ? "button" : "div";
	const interactiveAttributes = canBook
		? `
			type="button"
			data-booking-date="${formatDateKey(date)}"
			data-booking-time="${timeSlot.label}"
			aria-label="${formatShortDate(date)} ${timeSlot.label} 可預約，開啟預約表單"
		`
		: "";

	return `
		<${tagName} class="slot ${className}" ${interactiveAttributes}>
			<span class="slot-dot">●</span>
			<span class="slot-text">${statusText}</span>
		</${tagName}>
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
				${BOOKING_TIME_SLOTS.map((timeSlot) => {
					return createSlot(dayData[timeSlot.key], date, timeSlot);
				}).join("")}
			</div>
		</div>
	`;
}

function formatSelectedDate(dateKey) {
	const [year, month, day] = dateKey.split("-");
	const date = new Date(Number(year), Number(month) - 1, Number(day));
	return `${year}/${month}/${day} (${WEEKDAY_LABELS[date.getDay()]})`;
}

function setResultVisibility(isVisible) {
	bookingElements.form.hidden = isVisible;
	bookingElements.messageResult.hidden = !isVisible;
}

function synchronizeConditionalFields() {
	const isBoth = bookingElements.serviceArea.value === "手足皆做";
	const hasRemoval = bookingElements.removal.value !== "無卸甲";
	const hasFootRemoval = bookingElements.footRemoval.value !== "無卸甲";

	bookingElements.bothHelp.hidden = !isBoth;
	bookingElements.bothDetails.hidden = !isBoth;
	bookingElements.continuationField.hidden = !hasRemoval;
	bookingElements.form.elements.continuation.disabled = !hasRemoval;
	bookingElements.footContinuationField.hidden = !isBoth || !hasFootRemoval;
	bookingElements.form.elements.footRemoval.disabled = !isBoth;
	bookingElements.form.elements.footContinuation.disabled = !isBoth || !hasFootRemoval;
	bookingElements.form.elements.footStyle.disabled = !isBoth;
	bookingElements.form.elements.footStyle.required = isBoth;
	bookingElements.form.elements.footOther.disabled = !isBoth;
}

function openBookingDialog(dateKey, time) {
	selectedBookingSlot = { dateKey, time };
	bookingElements.form.reset();
	bookingElements.copyStatus.textContent = "";
	bookingElements.selectedSlot.textContent =
		`詢問時段：${formatSelectedDate(dateKey)} ${time}`;
	setResultVisibility(false);
	synchronizeConditionalFields();
	bookingElements.dialog.showModal();
}

function closeBookingDialog() {
	bookingElements.dialog.close();
}

function getFormText(name, fallback = "未填寫") {
	const value = String(bookingElements.form.elements[name]?.value || "").trim();
	return value || fallback;
}

function createBookingMessage() {
	const serviceArea = getFormText("serviceArea");
	const removal = getFormText("removal");
	const continuation = removal === "無卸甲"
		? "不適用"
		: getFormText("continuation");
	const serviceLines = serviceArea === "手足皆做"
		? [
			"【手部需求】",
			`是否延甲：${getFormText("extension")}`,
			`是否卸甲：${removal}`,
			`卸甲後是否續作：${continuation}`,
			`想做的款式：${getFormText("style")}`,
			`其他需求：${getFormText("other", "無")}`,
			"",
			"【足部需求】",
			`是否卸甲：${getFormText("footRemoval")}`,
			`卸甲後是否續作：${getFormText("footRemoval") === "無卸甲" ? "不適用" : getFormText("footContinuation")}`,
			`想做的款式：${getFormText("footStyle")}`,
			`其他需求：${getFormText("footOther", "無")}`
		]
		: [
			`2. 是否延甲：${getFormText("extension")}`,
			`3. 是否卸甲：${removal}`,
			`4. 卸甲後是否續作：${continuation}`,
			`5. 想做的款式：${getFormText("style")}`,
			`6. 其他需求：${getFormText("other", "無")}`
		];

	return [
		"您好，我想詢問美甲預約 💅",
		"",
		`預約日期：${formatSelectedDate(selectedBookingSlot.dateKey)}`,
		`預約時段：${selectedBookingSlot.time}`,
		`姓名：${getFormText("customerName")}`,
		"",
		`1. 施作部位：${serviceArea}`,
		...serviceLines,
		"",
		"款式參考圖片及目前指甲狀況照片將於下一則訊息補上。",
		"",
		"⚠️ 此訊息為預約詢問，須經工作室回覆確認後才算預約完成。"
	].join("\n");
}

function createLineMessageUrl(message) {
	const accountId = encodeURIComponent(LINE_OFFICIAL_ACCOUNT_ID);
	return `https://line.me/R/oaMessage/${accountId}/?${encodeURIComponent(message)}`;
}

function handleBookingFormSubmit(event) {
	event.preventDefault();

	if (!selectedBookingSlot) {
		return;
	}

	bookingElements.messageText.value = createBookingMessage();
	setResultVisibility(true);
	bookingElements.messageText.focus();
}

async function copyBookingMessage() {
	const message = bookingElements.messageText.value.trim();

	if (!message) {
		bookingElements.copyStatus.textContent = "目前沒有可複製的訊息。";
		return;
	}

	try {
		await navigator.clipboard.writeText(message);
		bookingElements.copyStatus.textContent =
			"預約訊息已複製，但尚未送出；請貼到 LINE 聊天室並傳送。";
	} catch (error) {
		bookingElements.messageText.select();
		bookingElements.copyStatus.textContent = "請按 Ctrl+C 或長按文字進行複製。";
		console.warn("Unable to copy booking message:", error);
	}
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

	bookingElements.list.addEventListener("click", (event) => {
		const slotButton = event.target.closest("button[data-booking-date]");

		if (!slotButton) {
			return;
		}

		openBookingDialog(
			slotButton.dataset.bookingDate,
			slotButton.dataset.bookingTime
		);
	});

	bookingElements.dialogClose.addEventListener("click", closeBookingDialog);
	bookingElements.dialogCancel.addEventListener("click", closeBookingDialog);
	bookingElements.dialog.addEventListener("click", (event) => {
		if (event.target === bookingElements.dialog) {
			closeBookingDialog();
		}
	});
	bookingElements.serviceArea.addEventListener("change", synchronizeConditionalFields);
	bookingElements.removal.addEventListener("change", synchronizeConditionalFields);
	bookingElements.footRemoval.addEventListener("change", synchronizeConditionalFields);
	bookingElements.form.addEventListener("submit", handleBookingFormSubmit);
	bookingElements.editButton.addEventListener("click", () => {
		setResultVisibility(false);
	});
	bookingElements.copyButton.addEventListener("click", copyBookingMessage);
	bookingElements.openLine.addEventListener("click", (event) => {
		const message = bookingElements.messageText.value.trim();

		if (!message) {
			event.preventDefault();
			bookingElements.copyStatus.textContent = "請先填寫預約訊息。";
			return;
		}

		bookingElements.openLine.href = createLineMessageUrl(message);
	});

	renderBookingWeek();
}

/* #endregion */
