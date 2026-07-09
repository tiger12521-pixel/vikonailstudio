console.log("VIKA Nail Story loaded.");

const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

async function getBookingData() {
  const week = formatDateKey(currentWeekStart);
  const response = await fetch(`/api/booking?week=${week}`, {
  cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load booking data");
  }

  const data = await response.json();
  return data;
}

let currentWeekStart = getMonday(new Date());

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

const bookingMonth = document.getElementById("bookingMonth");
const bookingRange = document.getElementById("bookingRange");
const bookingList = document.getElementById("bookingList");
const prevWeekBtn = document.getElementById("prevWeekBtn");
const nextWeekBtn = document.getElementById("nextWeekBtn");

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatMonthText(date) {
  return `${date.getFullYear()} 年 ${date.getMonth() + 1} 月`;
}

function formatShortDate(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${month}/${day}`;
}

function createSlot(label, isAvailable) {
 const statusText = isAvailable ? "可約" : "已滿";
  const className = isAvailable ? "available" : "booked";
  const dot = isAvailable ? "●" : "●";

  return `
    <div class="slot ${className}">
      <span class="slot-dot">${dot}</span>
      <span class="slot-text">${statusText}</span>
    </div>
  `;
}

async function renderBookingWeek() {
  const dataSource = await getBookingData();
  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(currentWeekStart.getDate() + 6);

  bookingMonth.textContent = formatMonthText(currentWeekStart);
  bookingRange.textContent = `${formatShortDate(currentWeekStart)} - ${formatShortDate(weekEnd)}`;

  bookingList.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    const date = new Date(currentWeekStart);
    date.setDate(currentWeekStart.getDate() + i);

    const dateKey = formatDateKey(date);
    

    const dayData = dataSource[dateKey] || {
      morning: true,
      afternoon: true,
      evening: true,
    };

    const dayHtml = `
    <div class="booking-day">
        <div class="booking-date">
            <strong>${formatShortDate(date)}</strong>
            <span>（${weekDays[date.getDay()]}）</span>
        </div>

        <div class="booking-slots">
            ${createSlot("上午", dayData.morning)}
            ${createSlot("下午", dayData.afternoon)}
            ${createSlot("晚上", dayData.evening)}
        </div>
    </div>
    `;

    bookingList.insertAdjacentHTML("beforeend", dayHtml);
  }
}

prevWeekBtn.addEventListener("click", function () {
  currentWeekStart.setDate(currentWeekStart.getDate() - 7);
  renderBookingWeek();
});

nextWeekBtn.addEventListener("click", function () {
  currentWeekStart.setDate(currentWeekStart.getDate() + 7);
  renderBookingWeek();
});

renderBookingWeek();