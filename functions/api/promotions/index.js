import {
	PUBLIC_PROMOTION_SELECT,
	jsonResponse,
	normalizeDatabasePromotion
} from "../../_shared/promotion-utils.js";

export async function onRequestGet(context) {
	try {
		const result = await context.env.DB.prepare(`
			${PUBLIC_PROMOTION_SELECT}
			WHERE is_active = 1
			ORDER BY is_pinned DESC, sort_order ASC, created_at DESC
		`).all();

		return jsonResponse({
			promotions: (result.results || []).map(normalizeDatabasePromotion)
		});
	} catch (error) {
		return jsonResponse({ error: `Unable to load promotions: ${error.message}` }, 500);
	}
}
