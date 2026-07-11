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
- 預約 API：`functions/api/booking.js`。
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
- Gallery 作品展示。
- Price 價目表。
- Booking 一週預約狀態。
- CSS 模組化與 Design Tokens。
- JavaScript 模組化。
- Console 版本資訊。
- 版本更新與檢查腳本。
- 開發、發布與維護文件。

## 未來可能功能

- Gallery Lightbox。
- About 品牌介紹。
- FAQ。
- Footer。
- Google 評價。
- 圖片 Lazy Loading 與效能優化。
- SEO 與結構化資料。
- 更完整的預約後台或表單。

## 重要原則

- 不為了短期方便，把新功能塞回 `main.js` 或單一 CSS 大檔。
- 每次修改先本機測試，再 Commit，再 Push。
- 正式版本完成後建立 Git Tag。
- 只要畫面或功能出現異常，先查看 Git Diff 與 Console。

## V1.1.0 新增內容

- Hero 後方保留最新優惠區，活動呈現方式尚待討論。
- 新增預約須知，降低 LINE 往返確認次數。
- 新增美甲 FAQ，將既有客戶溝通內容整理成網站文字。
- FAQ 醫療相關表述採保守原則，不進行診斷或保證。
