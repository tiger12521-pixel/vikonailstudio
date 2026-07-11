/* #region Promotion Data Service */

import { PROMOTION_CONFIG } from "../config/promotion-config.js";

async function requestPromotionData(url) {
	const separator = url.includes("?") ? "&" : "?";
	const response = await fetch(`${url}${separator}t=${Date.now()}`, {
		cache: "no-store"
	});

	if (!response.ok) {
		throw new Error(`Unable to load promotions: HTTP ${response.status}`);
	}

	const data = await response.json();

	if (!data || !Array.isArray(data.promotions)) {
		throw new Error("Promotion data format is invalid.");
	}

	return data.promotions;
}

/*
 * Loads live promotion data from the v1.2.0 public API.
 * If the API is unavailable, the last packaged JSON data is used so the
 * public website can continue showing activities safely.
 */
export async function loadPromotions() {
	try {
		return await requestPromotionData(PROMOTION_CONFIG.apiUrl);
	} catch (apiError) {
		console.warn("Promotion API unavailable. Using static fallback.", apiError);
		return requestPromotionData(PROMOTION_CONFIG.fallbackDataUrl);
	}
}

/* #endregion */
