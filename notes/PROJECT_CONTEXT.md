# 專案背景

## 網站用途

Vico Nail Story 是「薇可美甲工作坊」的官方形象與預約資訊網站。

主要用途：

- 展示品牌形象。
- 展示美甲作品。
- 顯示價目表。
- 顯示近期可預約時段。
- 提供 LINE、電話、Google Maps、Instagram、Facebook 入口。

## 技術與部署

- 前端：HTML、CSS、原生 JavaScript ES Modules。
- 本機測試：Node.js + Express，預設 `http://localhost:3200`。
- 線上部署：GitHub `main` Branch 推送後由 Cloudflare Pages 部署。
- 線上 API：Cloudflare Pages Functions。
- 優惠資料：Cloudflare D1，海報使用 R2。
- Gallery metadata 與圖片：Cloudflare R2。
- 管理後台：`/admin/`，正式環境使用 Cloudflare Access 保護。
- 本機預約測試資料：`data/booking.json`。
- 版本識別：網站載入後在 DevTools Console 顯示 `version.json`。

## 視覺方向

- 日系、柔和、簡約、女性化。
- 淡粉、奶油白、低飽和棕色。
- 優先保留空氣感、圓角、半透明與細緻陰影。
- 不應突然加入高飽和色、厚重黑色或強烈科技感。

## 目前完成

- Sticky Header 與社群連結。
- Hero 品牌視覺與桌機／手機背景。
- 多活動優惠輪播、日期篩選、常駐活動與海報放大檢視。
- 活動管理後台與 Cloudflare D1／R2 架構。
- 首頁精選 Gallery 作品展示。
- `/gallery/` 完整作品頁、多分類篩選、Lightbox 與鍵盤導覽。
- Gallery 作品上傳、編輯、精選、顯示、排序與刪除後台。
- Gallery metadata 單件儲存，避免同時上傳造成資料覆蓋。
- Price 價目表。
- 預約須知與美甲 FAQ。
- Booking 一週預約狀態、週次切換、時段標示與 LINE 預約入口。
- CSS 模組化與 Design Tokens。
- JavaScript 模組化。
- SEO metadata、canonical、Open Graph、Twitter Card 與 `BeautySalon` JSON-LD。
- `robots.txt`、`sitemap.xml`、Web Manifest 與網站圖示。
- Console 版本資訊。
- 版本更新與檢查腳本。
- 開發、發布與維護文件。

## 未來可能功能

- About 品牌介紹。
- Footer。
- Google 評價。
- 圖片 WebP／AVIF 與進一步效能優化。
- 補齊已確認的營業時間、完整地址等結構化資料。
- 404 頁面。
- 更完整的預約後台或表單。

## 重要原則

- 不為了短期方便，把新功能塞回 `main.js` 或單一 CSS 大檔。
- 每次修改先本機測試，再 Commit，再 Push。
- 正式版本完成後建立 Git Tag。
- 只要畫面或功能出現異常，先查看 Git Diff 與 Console。

## 版本里程碑

- V1.1.x：完成優惠資料化、響應式多活動輪播、預約須知與 FAQ。
- V1.2.0：完成活動管理後台、D1／R2 與 Cloudflare Access 部署架構。
- V1.3.0：完成完整 Gallery 頁面、Lightbox 與作品管理後台。
- V1.3.1：完成 SEO 基礎、網站圖示、Manifest 與結構化資料。
- V1.3.2：修正 Gallery metadata 同時寫入互相覆蓋問題。
- V1.3.3：改善 Booking 導引、時段標示與 LINE 預約流程。
