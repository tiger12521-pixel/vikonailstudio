/* #region Promotion Configuration */

/*
 * Centralized settings for the promotion component.
 * The data URL can be replaced with an API endpoint when the admin system is added.
 */

export const PROMOTION_CONFIG = Object.freeze({
	dataUrl: "./data/promotions.json",
	mobileBreakpoint: "640px",
	fallbackTitle: "最新優惠",
	fallbackText:
		"活動內容即將更新。歡迎追蹤 Instagram 或加入 LINE，第一時間收到薇可美甲的最新活動資訊。",
	instagramUrl: "https://www.instagram.com/nailstory03/",
	lineUrl: "https://line.me/ti/p/6Tmd0fH59r"
});

/* #endregion */
