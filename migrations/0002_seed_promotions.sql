INSERT OR IGNORE INTO promotions (
	id, title, description, desktop_image, mobile_image, image_alt,
	start_date, end_date, is_permanent, is_pinned, button_text,
	button_url, is_active, sort_order
) VALUES
(
	'gift-campaign-2026',
	'美好分享・寵愛加碼',
	'當日消費或儲值即可享限定好禮，數量有限，送完為止。',
	'/assets/images/promotions/gift-campaign-desktop.jpg',
	'/assets/images/promotions/gift-campaign-mobile.jpg',
	'Nail Story 薇可工作坊美好分享寵愛加碼活動。',
	'2026-07-11', NULL, 0, 1, '立即預約',
	'https://line.me/ti/p/6Tmd0fH59r', 1, 1
),
(
	'loyalty-reward',
	'集點兌換小飾品',
	'單次消費每滿 600 元集 1 點；集滿 5 點可兌換 200 元內小飾品，集滿 10 點可兌換 500 元內小飾品。',
	'/assets/images/promotions/loyalty-reward-desktop.jpg',
	'/assets/images/promotions/loyalty-reward-mobile.jpg',
	'Nail Story 薇可工作坊常駐集點活動。',
	'2026-07-11', NULL, 1, 0, '立即預約',
	'https://line.me/ti/p/6Tmd0fH59r', 1, 2
);
