# AI 協作指南

把這份文件交給新的 ChatGPT 或其他 AI 工具，可快速建立正確專案背景。

## 必須遵守

- 使用繁體中文說明。
- 程式縮排使用 Tab，不要改成 Spaces。
- 不隨意更名既有 class、ID、檔案或 API 路徑。
- 未經要求，不改變既有版面、文字、色彩或功能行為。
- 每次修改必須說明修改了哪些檔案與原因。
- 優先小幅修改，不做無必要的大型重寫。
- MCU 專案的「程式碼註解不得有中文」規則不套用此網站；網站可使用繁體中文註解。

## CSS 架構

- `css/style.css`：唯一入口，只管理 `@import` 順序。
- `css/tokens.css`：品牌色、文字色、背景色、圓角、陰影與動畫時間。
- `css/base.css`：全站 reset、HTML、Body 與共用基本樣式。
- `css/sections/header.css`：Header、Logo、社群圖示。
- `css/sections/hero.css`：Hero 背景、品牌 Logo、文案、按鈕、動畫與手機版。
- `css/sections/gallery.css`：作品集。
- `css/sections/price.css`：價目表。
- `css/sections/booking.css`：預約區塊。

規則：

- 改 Hero 只改 `hero.css`；共用品牌顏色才改 `tokens.css`。
- 新增 Footer 時建立 `css/sections/footer.css`，再加入 `style.css`。
- 不把 Section 樣式放進 `base.css`。
- 保留 `#region / #endregion` 與維護註解。

## JavaScript 架構

- `js/main.js`：只做應用程式啟動與初始化。
- `js/config/app-info.js`：讀取與顯示版本資訊。
- `js/config/booking-config.js`：Booking 常數與設定。
- `js/components/booking.js`：Booking UI 與互動。
- `js/services/booking-api.js`：呼叫 Booking API。
- `js/utils/date.js`：日期計算與格式化。

規則：

- 不把完整功能直接寫回 `main.js`。
- 新功能依責任建立 `components/`、`services/`、`config/` 或 `utils/` 模組。
- 保持 ES Modules 的 `import / export`。
- API 路徑 `/api/booking` 未經確認不得更改。

## HTML 架構

目前單頁順序：

1. Header
2. Hero
3. Gallery
4. Price
5. Booking

規則：

- 保留語意標籤與無障礙屬性。
- 新 Section 使用清楚的 `id` 與 class。
- 若 JavaScript 依賴既有 ID，修改前要先搜尋所有引用。

## Booking 注意事項

- 線上 API：`functions/api/booking.js`。
- 本機測試：`server.js` 會使用 `data/booking.json`。
- 前端資料取得：`js/services/booking-api.js`。
- UI：`js/components/booking.js`。

修改 Booking 前，要同時確認本機與 Cloudflare Pages Functions 的行為。

## 完成修改後最低檢查

1. `npm start`
2. 開啟 `http://localhost:3200`
3. 檢查桌機版。
4. 檢查手機寬度。
5. 檢查 Booking 上一週與下一週。
6. 檢查 Console 無紅色錯誤。
7. 執行 `git diff` 確認沒有額外修改。
