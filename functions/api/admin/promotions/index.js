import {
	PUBLIC_PROMOTION_SELECT,
	createPromotionId,
	jsonResponse,
	normalizeDatabasePromotion,
	readPromotionForm,
	uploadImage
} from "../../../_shared/promotion-utils.js";

export async function onRequestGet(context) {
	try {
		const result = await context.env.DB.prepare(`
			${PUBLIC_PROMOTION_SELECT}
			ORDER BY is_pinned DESC, sort_order ASC, created_at DESC
		`).all();

		return jsonResponse({
			promotions: (result.results || []).map(normalizeDatabasePromotion)
		});
	} catch (error) {
		return jsonResponse({ error: error.message }, 500);
	}
}

export async function onRequestPost(context) {
	try {
		const formData = await context.request.formData();
		const values = readPromotionForm(formData);
		const id = createPromotionId(values.title);
		const desktopImage = await uploadImage(context.env, formData.get("desktopImage"), id, "desktop");
		const mobileImage = await uploadImage(context.env, formData.get("mobileImage"), id, "mobile") || desktopImage;

		if (!desktopImage) {
			return jsonResponse({ error: "新增活動時必須上傳桌機海報。" }, 400);
		}

		await context.env.DB.prepare(`
			INSERT INTO promotions (
				id, title, description, desktop_image, mobile_image, image_alt,
				start_date, end_date, is_permanent, is_pinned, button_text,
				button_url, is_active, sort_order, created_at, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
		`).bind(
			id,
			values.title,
			values.description,
			desktopImage,
			mobileImage,
			values.imageAlt,
			values.startDate,
			values.endDate,
			Number(values.isPermanent),
			Number(values.isPinned),
			values.buttonText,
			values.buttonUrl,
			Number(values.isActive),
			values.sortOrder
		).run();

		return jsonResponse({ id }, 201);
	} catch (error) {
		return jsonResponse({ error: error.message }, 400);
	}
}
