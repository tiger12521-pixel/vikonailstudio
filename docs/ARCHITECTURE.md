# 專案架構

## HTML

目前網站以單頁 `index.html` 為主。各區塊使用 `#region` 註解分隔，並保留既有 class 與 ID，避免影響 CSS 與 JavaScript 掛鉤。

## CSS

`css/style.css` 是唯一入口，依序載入：

1. `tokens.css`：品牌色、文字色、圓角、陰影與動畫時間。
2. `base.css`：全站基礎設定。
3. `sections/header.css`
4. `sections/hero.css`
5. `sections/gallery.css`
6. `sections/price.css`
7. `sections/booking.css`

修改畫面時，優先調整對應 section；跨區共用的顏色或尺寸再放入 `tokens.css`。

## JavaScript

```text
js/main.js                         應用程式啟動入口
js/config/app-info.js              版本資訊載入與 Console 顯示
js/config/booking-config.js        預約畫面常數
js/components/booking.js           預約畫面與互動
js/components/promotion.js         優惠畫面、有效期間與海報 Dialog
js/services/booking-api.js         預約 API 呼叫
js/services/promotion-data.js      優惠資料載入
js/config/promotion-config.js      優惠資料來源與備援連結
js/utils/date.js                   日期共用函式
```

`main.js` 只負責初始化，不應累積大型功能。新增功能時，依責任放入 `components`、`services`、`config` 或 `utils`。

## API

- 線上：`functions/api/booking.js`
- 本機：`server.js`

兩邊必須維持相同的 API 輸出格式，前端只透過 `/api/booking` 取得資料。

## 版本資訊

網站啟動時會讀取根目錄的 `version.json`，並在 DevTools Console 顯示版本、建置時間、Commit、Branch 與環境。


## 優惠資料

```text
data/promotions.json                         優惠內容與有效期間
assets/images/promotions/                    桌機與手機版優惠海報
js/config/promotion-config.js                資料來源與備援設定
js/services/promotion-data.js                資料讀取與格式檢查
js/components/promotion.js                   畫面產生、日期篩選與放大檢視
```

目前由靜態 JSON 提供資料，前台元件不直接依賴檔案實作。日後建置管理後台時，可將資料服務切換至 `/api/promotions`，保留既有畫面模組。
