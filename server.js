const express = require("express");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const multer = require("multer");
const { google } = require("googleapis");

const app = express();
const PORT = process.env.PORT || 3200;

const CALENDAR_ID = "tina34252@gmail.com";
const SERVICE_ACCOUNT_KEY_PATH =
	"C:\\Users\\USER\\Documents\\vika-booking-ecb0317cc5b3.json";
const PROMOTION_DATA_PATH = path.join(__dirname, "data", "promotions.json");
const GALLERY_DATA_PATH = path.join(__dirname, "data", "gallery.json");
const GALLERY_UPLOAD_DIRECTORY = path.join(__dirname, "assets", "uploads", "gallery");

const PROMOTION_UPLOAD_DIRECTORY = path.join(
	__dirname,
	"assets",
	"uploads",
	"promotions"
);

fs.mkdirSync(PROMOTION_UPLOAD_DIRECTORY, { recursive: true });
fs.mkdirSync(GALLERY_UPLOAD_DIRECTORY, { recursive: true });

const upload = multer({
	storage: multer.diskStorage({
		destination: PROMOTION_UPLOAD_DIRECTORY,
		filename: (request, file, callback) => {
			const extension = path.extname(file.originalname).toLowerCase() || ".jpg";
			callback(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
		}
	}),
	limits: {
		fileSize: 8 * 1024 * 1024
	},
	fileFilter: (request, file, callback) => {
		const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
		callback(allowedTypes.has(file.mimetype) ? null : new Error("Unsupported image type."), allowedTypes.has(file.mimetype));
	}
});


const galleryUpload = multer({
	storage: multer.diskStorage({
		destination: GALLERY_UPLOAD_DIRECTORY,
		filename: (request, file, callback) => {
			const extension = path.extname(file.originalname).toLowerCase() || ".jpg";
			callback(null, `${Date.now()}-${crypto.randomUUID()}${extension}`);
		}
	}),
	limits: { fileSize: 12 * 1024 * 1024 },
	fileFilter: (request, file, callback) => {
		const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
		const isAllowed = allowedTypes.has(file.mimetype);
		callback(isAllowed ? null : new Error("Unsupported image type."), isAllowed);
	}
});

app.use(express.json());
app.use(express.static(__dirname));

function formatDateKey(date) {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}-${month}-${day}`;
}

function getMonday(date) {
	const normalizedDate = new Date(date);
	const day = normalizedDate.getDay();
	const difference = day === 0 ? -6 : 1 - day;
	normalizedDate.setDate(normalizedDate.getDate() + difference);
	normalizedDate.setHours(0, 0, 0, 0);
	return normalizedDate;
}

function getSlotName(date) {
	const hour = date.getHours();
	if (hour >= 8 && hour < 12) return "morning";
	if (hour >= 12 && hour < 17) return "afternoon";
	if (hour >= 17 && hour < 22) return "evening";
	return null;
}

async function getCalendarEvents(timeMin, timeMax) {
	const auth = new google.auth.GoogleAuth({
		keyFile: SERVICE_ACCOUNT_KEY_PATH,
		scopes: ["https://www.googleapis.com/auth/calendar.readonly"]
	});
	const calendar = google.calendar({ version: "v3", auth });
	const response = await calendar.events.list({
		calendarId: CALENDAR_ID,
		timeMin: timeMin.toISOString(),
		timeMax: timeMax.toISOString(),
		singleEvents: true,
		orderBy: "startTime"
	});
	return response.data.items || [];
}

function readPromotionData() {
	const rawData = fs.readFileSync(PROMOTION_DATA_PATH, "utf8");
	const data = JSON.parse(rawData);
	return Array.isArray(data.promotions) ? data.promotions : [];
}

function writePromotionData(promotions) {
	fs.writeFileSync(
		PROMOTION_DATA_PATH,
		`${JSON.stringify({ promotions }, null, "\t")}\n`,
		"utf8"
	);
}

function toBoolean(value) {
	return value === true || value === "true" || value === "1" || value === 1;
}

function createPromotionId(title) {
	const base = String(title || "activity")
		.normalize("NFKD")
		.replace(/[^a-zA-Z0-9\u4e00-\u9fff]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.toLowerCase();
	return `${base || "activity"}-${crypto.randomUUID().slice(0, 8)}`;
}

function getUploadedImageUrl(file) {
	return file ? `/assets/uploads/promotions/${file.filename}` : null;
}

function normalizePromotionInput(body, existing = {}) {
	const title = String(body.title || existing.title || "").trim();
	if (!title) throw new Error("請輸入活動名稱。");
	const isPermanent = toBoolean(body.isPermanent);
	return {
		title,
		description: String(body.description ?? existing.description ?? "").trim(),
		imageAlt: String(body.imageAlt ?? existing.imageAlt ?? title).trim(),
		startDate: String(body.startDate ?? existing.startDate ?? "").trim() || null,
		endDate: isPermanent ? null : (String(body.endDate ?? existing.endDate ?? "").trim() || null),
		isPermanent,
		isPinned: toBoolean(body.isPinned),
		buttonText: String(body.buttonText ?? existing.buttonText ?? "立即預約").trim() || "立即預約",
		buttonUrl: String(body.buttonUrl ?? existing.buttonUrl ?? "https://line.me/ti/p/6Tmd0fH59r").trim(),
		isActive: toBoolean(body.isActive),
		sortOrder: Number.parseInt(body.sortOrder ?? existing.sortOrder ?? 0, 10) || 0
	};
}

const promotionUploadFields = upload.fields([
	{ name: "desktopImage", maxCount: 1 },
	{ name: "mobileImage", maxCount: 1 }
]);

function readGalleryData() {
	const rawData = fs.readFileSync(GALLERY_DATA_PATH, "utf8");
	const data = JSON.parse(rawData);
	return { version: Number(data.version || 1), items: Array.isArray(data.items) ? data.items : [] };
}

function writeGalleryData(data) {
	fs.writeFileSync(GALLERY_DATA_PATH, `${JSON.stringify(data, null, "\t")}\n`, "utf8");
}

function normalizeGalleryInput(body, existing = {}) {
	const rawCategories = Array.isArray(body.category) ? body.category : (body.category ? [body.category] : []);
	return {
		title: String(body.title ?? existing.title ?? "").trim(),
		category: rawCategories.length ? [...new Set(rawCategories.map((value) => String(value).trim()).filter(Boolean))] : (existing.category || []),
		featured: toBoolean(body.featured),
		isActive: toBoolean(body.isActive),
		date: String(body.date ?? existing.date ?? new Date().toISOString().slice(0, 10)).trim(),
		sortOrder: Number.parseInt(body.sortOrder ?? existing.sortOrder ?? 0, 10) || 0,
		artistId: String(body.artistId ?? existing.artistId ?? "default").trim() || "default"
	};
}

function sortGalleryItems(items) {
	return [...items].sort((a, b) => (Number(a.sortOrder || 0) - Number(b.sortOrder || 0)) || String(b.date || "").localeCompare(String(a.date || "")) || String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

function deleteLocalGalleryImage(item) {
	if (!item?.image?.startsWith("/assets/uploads/gallery/")) return;
	const filePath = path.join(__dirname, item.image.replace(/^\//, ""));
	if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

app.get("/api/booking", async (request, response) => {
	try {
		const weekStart = request.query.week
			? getMonday(new Date(`${request.query.week}T00:00:00`))
			: getMonday(new Date());
		const weekEnd = new Date(weekStart);
		weekEnd.setDate(weekStart.getDate() + 7);
		const bookingData = {};

		for (let index = 0; index < 7; index += 1) {
			const date = new Date(weekStart);
			date.setDate(weekStart.getDate() + index);
			bookingData[formatDateKey(date)] = {
				morning: true,
				afternoon: true,
				evening: true
			};
		}

		const events = await getCalendarEvents(weekStart, weekEnd);
		events.forEach((event) => {
			if (!event.start || !event.start.dateTime) return;
			if (!event.description || !event.description.trim()) return;
			const startDate = new Date(event.start.dateTime);
			const dateKey = formatDateKey(startDate);
			const slotName = getSlotName(startDate);
			if (bookingData[dateKey] && slotName) bookingData[dateKey][slotName] = false;
		});

		response.json(bookingData);
	} catch (error) {
		console.error("Failed to load booking data:", error.message);
		response.status(500).json({ error: "Failed to load booking data" });
	}
});

app.get("/api/promotions", (request, response) => {
	try {
		response.set("Cache-Control", "no-store");
		response.json({ promotions: readPromotionData().filter((item) => item.isActive === true) });
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

app.get("/api/admin/promotions", (request, response) => {
	try {
		response.set("Cache-Control", "no-store");
		response.json({ promotions: readPromotionData() });
	} catch (error) {
		response.status(500).json({ error: error.message });
	}
});

app.post("/api/admin/promotions", promotionUploadFields, (request, response) => {
	try {
		const values = normalizePromotionInput(request.body);
		const desktopImage = getUploadedImageUrl(request.files?.desktopImage?.[0]);
		const mobileImage = getUploadedImageUrl(request.files?.mobileImage?.[0]) || desktopImage;
		if (!desktopImage) return response.status(400).json({ error: "新增活動時必須上傳桌機海報。" });
		const promotions = readPromotionData();
		const id = createPromotionId(values.title);
		promotions.push({ id, ...values, desktopImage, mobileImage });
		writePromotionData(promotions);
		return response.status(201).json({ id });
	} catch (error) {
		return response.status(400).json({ error: error.message });
	}
});

app.put("/api/admin/promotions/:id", promotionUploadFields, (request, response) => {
	try {
		const promotions = readPromotionData();
		const index = promotions.findIndex((item) => item.id === request.params.id);
		if (index < 0) return response.status(404).json({ error: "找不到指定活動。" });
		const existing = promotions[index];
		const values = normalizePromotionInput(request.body, existing);
		const desktopImage = getUploadedImageUrl(request.files?.desktopImage?.[0]) || existing.desktopImage;
		const mobileImage = getUploadedImageUrl(request.files?.mobileImage?.[0]) || existing.mobileImage || desktopImage;
		promotions[index] = { ...existing, ...values, desktopImage, mobileImage };
		writePromotionData(promotions);
		return response.json({ id: existing.id });
	} catch (error) {
		return response.status(400).json({ error: error.message });
	}
});

app.delete("/api/admin/promotions/:id", (request, response) => {
	try {
		const promotions = readPromotionData();
		const nextPromotions = promotions.filter((item) => item.id !== request.params.id);
		if (nextPromotions.length === promotions.length) return response.status(404).json({ error: "找不到指定活動。" });
		writePromotionData(nextPromotions);
		return response.status(204).end();
	} catch (error) {
		return response.status(500).json({ error: error.message });
	}
});

app.get("/api/gallery", (request, response) => {
	try {
		let items = sortGalleryItems(readGalleryData().items).filter((item) => item.isActive !== false);
		if (request.query.featured === "true") items = items.filter((item) => item.featured === true);
		const limit = Number.parseInt(request.query.limit || "0", 10);
		if (limit > 0) items = items.slice(0, limit);
		response.set("Cache-Control", "no-store").json({ items });
	} catch (error) { response.status(500).json({ error: error.message }); }
});

app.get("/api/admin/gallery", (request, response) => {
	try { response.set("Cache-Control", "no-store").json({ items: sortGalleryItems(readGalleryData().items) }); }
	catch (error) { response.status(500).json({ error: error.message }); }
});

app.post("/api/admin/gallery", galleryUpload.single("image"), (request, response) => {
	try {
		if (!request.file) return response.status(400).json({ error: "新增作品時必須上傳圖片。" });
		const data = readGalleryData(); const id = `work-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`; const now = new Date().toISOString();
		data.items.push({ id, ...normalizeGalleryInput(request.body), image: `/assets/uploads/gallery/${request.file.filename}`, createdAt: now, updatedAt: now });
		writeGalleryData(data); return response.status(201).json({ id });
	} catch (error) { return response.status(400).json({ error: error.message }); }
});

app.put("/api/admin/gallery/:id", galleryUpload.single("image"), (request, response) => {
	try {
		const data = readGalleryData(); const index = data.items.findIndex((item) => item.id === request.params.id);
		if (index < 0) return response.status(404).json({ error: "找不到指定作品。" });
		const existing = data.items[index]; let image = existing.image;
		if (request.file) { deleteLocalGalleryImage(existing); image = `/assets/uploads/gallery/${request.file.filename}`; }
		data.items[index] = { ...existing, ...normalizeGalleryInput(request.body, existing), image, updatedAt: new Date().toISOString() };
		writeGalleryData(data); return response.json({ id: existing.id });
	} catch (error) { return response.status(400).json({ error: error.message }); }
});

app.delete("/api/admin/gallery/:id", (request, response) => {
	try {
		const data = readGalleryData(); const index = data.items.findIndex((item) => item.id === request.params.id);
		if (index < 0) return response.status(404).json({ error: "找不到指定作品。" });
		const [removed] = data.items.splice(index, 1); deleteLocalGalleryImage(removed); writeGalleryData(data); return response.status(204).end();
	} catch (error) { return response.status(500).json({ error: error.message }); }
});

app.get("/", (request, response) => {
	response.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
	console.log(`Server running: http://localhost:${PORT}`);
	console.log(`Admin panel: http://localhost:${PORT}/admin/`);
});
