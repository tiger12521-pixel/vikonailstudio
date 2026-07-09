const express = require("express");
const path = require("path");
const { google } = require("googleapis");

const app = express();
const PORT = 3000;

const CALENDAR_ID = "tina34252@gmail.com";
const SERVICE_ACCOUNT_KEY_PATH =
  "C:\\Users\\USER\\Documents\\vika-booking-ecb0317cc5b3.json";

app.use(express.static(__dirname));

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getSlotName(date) {
  const hour = date.getHours();

  if (hour >= 8 && hour < 12) {
    return "morning";
  }

  if (hour >= 12 && hour < 17) {
    return "afternoon";
  }

  if (hour >= 17 && hour < 22) {
    return "evening";
  }

  return null;
}

async function getCalendarEvents(timeMin, timeMax) {
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY_PATH,
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
  });

  const calendar = google.calendar({
    version: "v3",
    auth,
  });

  const response = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin: timeMin.toISOString(),
    timeMax: timeMax.toISOString(),
    singleEvents: true,
    orderBy: "startTime",
  });

  return response.data.items || [];
}

app.get("/api/booking", async (req, res) => {
  try {
    const weekParam = req.query.week;

    const weekStart = weekParam
      ? getMonday(new Date(`${weekParam}T00:00:00`))
      : getMonday(new Date());
      
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    const bookingData = {};

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);

      bookingData[formatDateKey(date)] = {
        morning: true,
        afternoon: true,
        evening: true,
      };
    }

    const events = await getCalendarEvents(weekStart, weekEnd);

     

    events.forEach((event) => {

      if (!event.start || !event.start.dateTime) {
        return;
    }

  // 沒有 Description 代表只是預留時段，不算已預約
  const hasBooking =
    event.description &&
    event.description.trim().length > 0;

  if (!hasBooking) {
    return;
  }

  const startDate = new Date(event.start.dateTime);
  const dateKey = formatDateKey(startDate);
  const slotName = getSlotName(startDate);

  if (bookingData[dateKey] && slotName) {
    bookingData[dateKey][slotName] = false;
  }
});

    res.json(bookingData);
  } catch (error) {
    console.error("Failed to load booking data:", error.message);
    res.status(500).json({
      error: "Failed to load booking data",
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});