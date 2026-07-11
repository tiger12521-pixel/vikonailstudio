/* #region Promotion Configuration */

/*
 * Centralized settings for the promotion carousel.
 * The public API is preferred in v1.2.0, while the static JSON file remains
 * available as a safe fallback during local setup or service interruption.
 */

export const PROMOTION_CONFIG = Object.freeze({
	apiUrl: "/api/promotions",
	fallbackDataUrl: "./data/promotions.json",
	mobileBreakpoint: "640px",
	autoplayInterval: 6500,
	swipeThreshold: 48,
	fallbackTitle: "最新活動",
	fallbackText:
		"活動內容即將更新。歡迎追蹤 Instagram 或加入 LINE，第一時間收到薇可美甲的最新活動資訊。",
	instagramUrl: "https://www.instagram.com/nailstory03/",
	lineUrl: "https://line.me/ti/p/6Tmd0fH59r"
});

/* #endregion */
