# 專案決策紀錄

## 2026-07：CSS 模組化

決定：保留 `css/style.css` 為唯一 HTML 入口，再以 `@import` 載入 `tokens.css`、`base.css` 與各 Section CSS。

原因：

- HTML 只需要管理一個 CSS 連結。
- 各區塊可獨立維護。
- 可保留清楚的載入順序與覆蓋關係。

## 2026-07：Design Tokens

決定：共用品牌色、文字色、背景色、圓角與動畫時間集中在 `css/tokens.css`。

原因：日後更換品牌色或統一視覺時，不需逐檔搜尋重複色碼。

## 2026-07：JavaScript ES Modules

決定：`js/main.js` 只負責啟動與初始化，Booking 的畫面、API、日期與設定各自拆檔。

原因：避免新增功能後 `main.js` 變成難以維護的大型檔案。

## 2026-07：Tab 縮排

決定：HTML、CSS、JavaScript、JSON 與 Markdown 中的程式碼範例，以 Tab 作為主要縮排風格。

原因：符合專案擁有者長期 Coding Style 與閱讀習慣。

## 2026-07：Console 顯示版本

決定：版本資訊不固定顯示在客戶頁面，而是在 F12 Console 顯示。

原因：

- 不影響正式頁面設計。
- 可快速確認 Cloudflare 是否部署最新版。
- 可對照 Version、Build、Commit、Branch 與 Environment。

## 2026-07：本機 Port 3200

決定：本機預設使用 3200，而非常見的 3000。

原因：降低瀏覽器誤開舊專案或另一個仍在執行的本機服務之風險。

## 2026-07：正式文件與個人知識庫分離

決定：

- `docs/` 放正式架構、規範、版本與發布文件。
- `notes/` 放快速操作、常用指令、經驗、決策與 AI 協作資訊。

原因：正式規範與日常操作筆記的讀者、用途與更新頻率不同。
