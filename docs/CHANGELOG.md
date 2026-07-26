# Changelog

本專案採用 Semantic Versioning：`MAJOR.MINOR.PATCH`。

## Unreleased

### Added

- 可預約時段改為可點擊，並新增預約詢問表單。
- 預約表單支援手部、足部及手足皆做，手足皆做時分別收集需求。
- 自動整理日期、時段、施作部位、延甲、卸甲、款式等資訊並帶入 LINE 官方帳號聊天室。
- 新增預約訊息編輯與複製備援功能。
- 已過日期與時間顯示為不可點擊的灰色時段。
- 訊息預覽加入「尚未送出」提示，提醒使用者仍須前往 LINE 並在聊天室按下送出。

### Changed

- 網站公開 LINE 入口及新活動預設網址改為 LINE 官方帳號。
- 新增 D1 migration，將仍使用舊私人 LINE 網址的既有活動切換至官方帳號。

## v1.3.3 - Booking UX Improvement

### Changed

- Hero「立即預約」改為導向站內預約須知。
- 預約時段新增 09:00、13:00、17:00 標示。
- 預約須知新增手足同時施作需預留兩個時段的說明。
- 預約區新增「前往 LINE 預約」按鈕。

## v1.3.2 - Gallery Metadata Concurrency Fix

### Fixed

- 修正正式環境連續上傳作品時，單一 R2 `gallery.json` 產生最後寫入覆蓋前次資料的問題。
- Gallery Metadata 改為每件作品各自儲存一份 R2 JSON，避免不同作品互相覆蓋。
- 保留 V1.3.1 舊版 `gallery.json` 相容讀取，不需要手動搬移既有作品。

## [1.3.1] - 2026-07-12

### Added

- SEO metadata, canonical URLs, Open Graph and Twitter Card metadata.
- `robots.txt`, `sitemap.xml`, web manifest and favicon assets.
- Local business structured data for the homepage.

## v1.2.0

- 新增活動內容管理後台 `/admin/`。
- 新增活動 CRUD、圖片上傳、常駐、日期、置頂、排序及顯示開關。
- 新增 Cloudflare D1、R2 與 Pages Functions 架構。
- 前台活動資料改為 API 優先、靜態 JSON fallback。
- 保留海報完整顯示與「最新活動」中文標籤修正。

## v1.1.2

- Upgraded latest promotions to a responsive multi-campaign carousel.
- Added a permanent loyalty reward campaign and responsive poster assets.
- Added autoplay, previous/next controls, indicator dots, mobile swipe, ordering, pinned campaigns, and permanent campaign support.
- Preserved all other v1.1.1 website sections and behavior.

## v1.1.1 - Data-driven promotion

### Added

- 新增資料驅動的最新優惠元件。
- 新增桌機橫式與手機直式活動海報。
- 新增海報點擊放大 Dialog、圖片載入失敗保護與備援內容。
- 新增活動有效期間、顯示開關與排序欄位。
- 新增 V1.1.1 開發與維護說明。

### Changed

- 最新優惠由 `data/promotions.json` 管理，不再將活動內容寫死於 HTML。
- 專案測試版本更新為 1.1.1。

## v1.1.0 - Content information sections

### Added

- 新增 Hero 後方的「最新優惠」預留區。
- 新增「預約須知」卡片與取消、改期、遲到說明。
- 新增可展開式「美甲常見問題」FAQ。
- 新增 V1.1.0 開發說明。

### Changed

- 網站資訊順序調整為 Hero、最新優惠、作品集、價目表、預約須知、FAQ、預約狀況。
- 專案測試版本更新為 1.1.0。

## v1.0.1 - Release workflow maintenance

### Added

- 新增安全的 Release 自動化腳本。
- 支援 metadata 準備、驗證、Commit、Tag 與 Push。
- 新增 V1.0.1 發布說明。

### Changed

- 更新 Release、常用指令、部署檢查與疑難排解文件。
- 專案版本更新為 1.0.1。

## [1.0.0] - 2026-07-11

### Added

- 建立模組化 CSS 架構與 Design Tokens。
- 建立模組化 JavaScript 架構。
- 新增 Console 版本與部署資訊。
- 新增版本更新與驗證腳本。
- 新增專案架構、Coding Style 與發布文件。
- 新增 `.editorconfig` 與 `.gitattributes`，統一 Tab 縮排與換行格式。

### Changed

- 整理 HTML 與 CSS 註解及區段結構。
- 保留既有網站視覺、預約功能與 API 行為。

## V1.0.0 Knowledge Base

- 新增 `notes/` 長期維護知識庫。
- 新增逐條說明的 Git、npm、版本與發布指令集。
- 新增快速開始、AI 協作、部署檢查、疑難排除與技術決策紀錄。
