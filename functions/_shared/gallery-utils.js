const LEGACY_METADATA_KEY = "gallery/metadata/gallery.json";
const ITEM_PREFIX = "gallery/items/";

export function jsonResponse(data, status = 200) {
	return Response.json(data, {
		status,
		headers: {
			"Cache-Control": "no-store"
		}
	});
}

export function toBoolean(value) {
	return value === true || value === "true" || value === "1" || value === 1;
}

async function readLegacyGallery(env) {
	const object = await env.GALLERY_ASSETS.get(LEGACY_METADATA_KEY);
	if (!object) return [];

	try {
		const data = await object.json();
		return Array.isArray(data.items) ? data.items : [];
	} catch {
		return [];
	}
}

async function listGalleryRecordObjects(env) {
	const objects = [];
	let cursor;

	do {
		const result = await env.GALLERY_ASSETS.list({
			prefix: ITEM_PREFIX,
			cursor
		});
		objects.push(...result.objects);
		cursor = result.truncated ? result.cursor : undefined;
	} while (cursor);

	return objects;
}

async function readGalleryRecords(env) {
	const objects = await listGalleryRecordObjects(env);
	const records = await Promise.all(objects.map(async ({ key }) => {
		const object = await env.GALLERY_ASSETS.get(key);
		if (!object) return null;

		try {
			return await object.json();
		} catch {
			return null;
		}
	}));

	return records.filter(record => record && typeof record.id === "string");
}

/*
 * Gallery metadata is stored as one R2 object per work.
 *
 * V1.3.1 used one shared gallery.json file. Concurrent uploads could read the
 * same old file and then overwrite each other (last write wins), causing a
 * previously uploaded work to disappear. Per-work records remove that race.
 *
 * Legacy gallery.json data remains readable, so deployment does not require a
 * manual migration. A new/updated record overrides its legacy copy. A deleted
 * record acts as a tombstone and prevents a legacy item from reappearing.
 */
export async function readGallery(env) {
	const [legacyItems, records] = await Promise.all([
		readLegacyGallery(env),
		readGalleryRecords(env)
	]);
	const itemsById = new Map();

	legacyItems.forEach(item => {
		if (item && typeof item.id === "string") itemsById.set(item.id, item);
	});

	records.forEach(record => {
		if (record.deleted === true) {
			itemsById.delete(record.id);
			return;
		}
		itemsById.set(record.id, record);
	});

	return {
		version: 2,
		items: [...itemsById.values()]
	};
}

export async function saveGalleryItem(env, item) {
	const key = `${ITEM_PREFIX}${encodeURIComponent(item.id)}.json`;
	await env.GALLERY_ASSETS.put(key, JSON.stringify(item, null, 2), {
		httpMetadata: {
			contentType: "application/json",
			cacheControl: "no-store"
		}
	});
}

export async function deleteGalleryItem(env, id) {
	await saveGalleryItem(env, {
		id,
		deleted: true,
		updatedAt: new Date().toISOString()
	});
}

export function createGalleryId() {
	return `work-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
}

export function readGalleryForm(formData, existing = {}) {
	const categories = formData.getAll("category")
		.filter(value => typeof value === "string")
		.map(value => value.trim())
		.filter(Boolean);

	return {
		title: String(formData.get("title") ?? existing.title ?? "").trim(),
		category: categories.length ? categories : (existing.category || []),
		featured: toBoolean(formData.get("featured")),
		isActive: toBoolean(formData.get("isActive")),
		date: String(formData.get("date") ?? existing.date ?? new Date().toISOString().slice(0, 10)).trim(),
		sortOrder: Number.parseInt(String(formData.get("sortOrder") ?? existing.sortOrder ?? 0), 10) || 0,
		artistId: String(formData.get("artistId") ?? existing.artistId ?? "default").trim() || "default"
	};
}

export async function uploadGalleryImage(env, file, id) {
	if (!(file instanceof File) || file.size === 0) return null;

	const allowed = new Set(["image/jpeg", "image/png", "image/webp"]);
	if (!allowed.has(file.type)) throw new Error("作品圖片僅支援 JPG、PNG 或 WebP。");
	if (file.size > 12 * 1024 * 1024) throw new Error("單張作品圖片不可超過 12 MB。");

	const ext = {
		"image/jpeg": "jpg",
		"image/png": "png",
		"image/webp": "webp"
	}[file.type];
	const key = `gallery/images/${id}/${Date.now()}.${ext}`;

	await env.GALLERY_ASSETS.put(key, file.stream(), {
		httpMetadata: {
			contentType: file.type,
			cacheControl: "public, max-age=31536000, immutable"
		}
	});

	return {
		key,
		url: `/api/gallery-media/${key}`
	};
}

export function sortGallery(items) {
	return [...items].sort((a, b) =>
		(Number(a.sortOrder || 0) - Number(b.sortOrder || 0)) ||
		String(b.date || "").localeCompare(String(a.date || "")) ||
		String(b.createdAt || "").localeCompare(String(a.createdAt || ""))
	);
}
