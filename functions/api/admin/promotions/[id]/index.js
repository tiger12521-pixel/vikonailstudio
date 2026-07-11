import {
	PUBLIC_PROMOTION_SELECT,
	jsonResponse,
	normalizeDatabasePromotion,
	readPromotionForm,
	uploadImage
} from "../../../../_shared/promotion-utils.js";

async function getPromotion(env, id) {
	const row = await env.DB.prepare(`${PUBLIC_PROMOTION_SELECT} WHERE id = ?`).bind(id).first();
	return row ? normalizeDatabasePromotion(row) : null;
}

export async function onRequestPut(context) {
	try {
		const id = context.params.id;
		const existing = await getPromotion(context.env, id);
		if (!existing) {
			return jsonResponse({ error: "找不到指定活動。" }, 404);
		}

		const formData = await context.request.formData();
		const values = readPromotionForm(formData, existing);
		const desktopImage = await uploadImage(context.env, formData.get("desktopImage"), id, "desktop") || existing.desktopImage;
		const mobileImage = await uploadImage(context.env, formData.get("mobileImage"), id, "mobile") || existing.mobileImage || desktopImage;

		await context.env.DB.prepare(`
			UPDATE promotions SET
				title = ?, description = ?, desktop_image = ?, mobile_image = ?, image_alt = ?,
				start_date = ?, end_date = ?, is_permanent = ?, is_pinned = ?, button_text = ?,
				button_url = ?, is_active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
			WHERE id = ?
		`).bind(
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
			values.sortOrder,
			id
		).run();

		return jsonResponse({ id });
	} catch (error) {
		return jsonResponse({ error: error.message }, 400);
	}
}

export async function onRequestDelete(context) {
	try {
		const id = context.params.id;
		const existing = await getPromotion(context.env, id);
		if (!existing) {
			return jsonResponse({ error: "找不到指定活動。" }, 404);
		}

		await context.env.DB.prepare("DELETE FROM promotions WHERE id = ?").bind(id).run();
		return new Response(null, { status: 204 });
	} catch (error) {
		return jsonResponse({ error: error.message }, 500);
	}
}
