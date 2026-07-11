/* #region Promotion Data Service */

import { PROMOTION_CONFIG } from "../config/promotion-config.js";

/*
 * Loads promotion content from the static JSON file.
 * A cache-busting query keeps content updates visible after deployment.
 */
export async function loadPromotions() {
	const requestUrl = `${PROMOTION_CONFIG.dataUrl}?t=${Date.now()}`;
	const response = await fetch(requestUrl, {
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

/* #endregion */
