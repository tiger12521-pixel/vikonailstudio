export const PUBLIC_PROMOTION_SELECT = `
	SELECT
		id,
		title,
		description,
		desktop_image AS desktopImage,
		mobile_image AS mobileImage,
		image_alt AS imageAlt,
		start_date AS startDate,
		end_date AS endDate,
		is_permanent AS isPermanent,
		is_pinned AS isPinned,
		button_text AS buttonText,
		button_url AS buttonUrl,
		is_active AS isActive,
		sort_order AS sortOrder,
		created_at AS createdAt,
		updated_at AS updatedAt
	FROM promotions
`;

export function jsonResponse(data, status = 200) {
	return Response.json(data, {
		status,
		headers: {
			"Cache-Control": "no-store"
		}
	});
}

export function normalizeDatabasePromotion(promotion) {
	return {
		...promotion,
		isPermanent: Boolean(promotion.isPermanent),
		isPinned: Boolean(promotion.isPinned),
		isActive: Boolean(promotion.isActive),
		sortOrder: Number(promotion.sortOrder || 0)
	};
}

export function toBoolean(value) {
	return value === true || value === "true" || value === "1" || value === 1;
}

export function createPromotionId(title) {
	const base = String(title || "activity")
		.normalize("NFKD")
		.replace(/[^a-zA-Z0-9\u4e00-\u9fff]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.toLowerCase();
	const suffix = crypto.randomUUID().slice(0, 8);
	return `${base || "activity"}-${suffix}`;
}

export function validateImage(file) {
	if (!(file instanceof File) || file.size === 0) {
		return false;
	}

	const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
	if (!allowedTypes.has(file.type)) {
		throw new Error("海報僅支援 JPG、PNG 或 WebP 圖片。");
	}

	if (file.size > 8 * 1024 * 1024) {
		throw new Error("單張海報不可超過 8 MB。");
	}

	return true;
}

export async function uploadImage(env, file, promotionId, variant) {
	if (!validateImage(file)) {
		return null;
	}

	const extensionMap = {
		"image/jpeg": "jpg",
		"image/png": "png",
		"image/webp": "webp"
	};
	const extension = extensionMap[file.type];
	const key = `promotions/${promotionId}/${variant}-${Date.now()}.${extension}`;

	await env.PROMOTION_IMAGES.put(key, file.stream(), {
		httpMetadata: {
			contentType: file.type,
			cacheControl: "public, max-age=31536000, immutable"
		}
	});

	return `/api/media/${key}`;
}

export function getFormValue(formData, name, fallback = "") {
	const value = formData.get(name);
	return typeof value === "string" ? value.trim() : fallback;
}

export function readPromotionForm(formData, existing = {}) {
	const title = getFormValue(formData, "title", existing.title || "");
	if (!title) {
		throw new Error("請輸入活動名稱。");
	}

	const isPermanent = toBoolean(formData.get("isPermanent"));

	return {
		title,
		description: getFormValue(formData, "description", existing.description || ""),
		imageAlt: getFormValue(formData, "imageAlt", existing.imageAlt || title),
		startDate: getFormValue(formData, "startDate", existing.startDate || "") || null,
		endDate: isPermanent ? null : (getFormValue(formData, "endDate", existing.endDate || "") || null),
		isPermanent,
		isPinned: toBoolean(formData.get("isPinned")),
		buttonText: getFormValue(formData, "buttonText", existing.buttonText || "立即預約") || "立即預約",
		buttonUrl: getFormValue(formData, "buttonUrl", existing.buttonUrl || "https://line.me/ti/p/6Tmd0fH59r"),
		isActive: toBoolean(formData.get("isActive")),
		sortOrder: Number.parseInt(getFormValue(formData, "sortOrder", String(existing.sortOrder || 0)), 10) || 0
	};
}
