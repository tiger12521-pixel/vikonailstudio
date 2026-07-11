CREATE TABLE IF NOT EXISTS promotions (
	id TEXT PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT NOT NULL DEFAULT '',
	desktop_image TEXT NOT NULL,
	mobile_image TEXT NOT NULL,
	image_alt TEXT NOT NULL DEFAULT '',
	start_date TEXT,
	end_date TEXT,
	is_permanent INTEGER NOT NULL DEFAULT 0,
	is_pinned INTEGER NOT NULL DEFAULT 0,
	button_text TEXT NOT NULL DEFAULT '立即預約',
	button_url TEXT NOT NULL DEFAULT 'https://line.me/ti/p/6Tmd0fH59r',
	is_active INTEGER NOT NULL DEFAULT 1,
	sort_order INTEGER NOT NULL DEFAULT 0,
	created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_promotions_public_order
ON promotions (is_active, is_pinned DESC, sort_order ASC);
