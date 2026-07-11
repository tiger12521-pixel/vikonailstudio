# Vico Nail Story - Stage 2 CSS Refactor

## 本階段完成內容

- 新增 `css/tokens.css`，集中管理品牌色、文字色、價目表色、預約狀態色、圓角與動畫時間。
- `css/style.css` 維持唯一入口，並補上載入順序說明。
- 全部 CSS 延續使用 Tab 縮排。
- 保留所有 selector、尺寸、間距、透明度、陰影、動畫與斷點數值。
- 增加維護註解，讓每個區段更容易定位。
- 未修改 JavaScript、API、JSON、圖片與伺服器功能。

## 常見調整位置

### 修改網站整體品牌色

編輯：`css/tokens.css`

常用變數：

- `--color-brand-500`：Header Logo、導覽圖示主色
- `--color-brand-600`：Hero 英文字 Logo
- `--color-brand-700`：部分按鈕與控制項顏色
- `--color-text-primary`：全站主要文字顏色

### 修改 Header 高度與圖示尺寸

編輯：`css/sections/header.css`

- `.site-header`：Header 高度、左右留白、背景及陰影
- `.site-logo`：左側 Logo 外框尺寸
- `.site-logo-mark`：SVG Logo 本體尺寸
- `.site-nav a`：右側每個圓形按鈕尺寸
- `.site-nav svg`：圖示本身尺寸

### 修改 Hero 背景與內容位置

編輯：`css/sections/hero.css`

- `.hero`：背景圖片、背景位置、Hero 高度與左側留白
- `.hero-content`：半透明內容卡片尺寸、內距與圓角
- `.hero-logo-script`：Nail Story 字體大小
- `.hero-brand-text`：中文品牌名稱字體大小與字距
- `.description`：介紹文字大小、行距與上下間距
- `.hero-link`：按鈕高度、寬度與文字大小
- `@media (max-width: 640px)`：手機版覆蓋設定

### 修改 Gallery 排版

編輯：`css/sections/gallery.css`

- `.gallery-section`：作品區上下與左右留白
- `.gallery-grid`：欄數、圖片間距與最大寬度
- `.gallery-grid img`：圖片比例、圓角與陰影

### 修改 Price 排版

編輯：`css/sections/price.css`

- `.price-section`：價目表整區背景與留白
- `.price-card`：卡片寬度、內距、圓角與陰影
- `.price-row`：每一列的間距與分隔線
- `.price-warning`：足部加價提示外觀

### 修改 Booking 排版

編輯：`css/sections/booking.css`

- `.booking-header`：上週、月份、下週的水平排版
- `.week-btn`：左右切換按鈕尺寸與樣式
- `.booking-day`：每天日期與時段的欄寬
- `.booking-slots`：三個時段的欄數與間距
- `.slot`：每個時段格子的高度、圓角與文字
- `.slot.available`：可預約顏色
- `.slot.booked`：已預約顏色

## 本地測試

```bash
npm ci
node server.js
```

瀏覽器開啟：

```text
http://localhost:3000
```
