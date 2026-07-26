# 專案架構

## HTML

網站包含三個主要頁面：

```text
index.html              品牌首頁
gallery/index.html      完整作品集、分類篩選與 Lightbox
admin/index.html        活動與作品管理後台
```

首頁目前依序包含 Header、Hero、Promotion、Gallery、Price、Booking Guide、FAQ 與 Booking。大型區塊使用 `#region` 註解分隔，並保留既有 class 與 ID，避免影響 CSS 與 JavaScript 掛鉤。

## CSS

`css/style.css` 是唯一入口，依序載入：

1. `tokens.css`：品牌色、文字色、圓角、陰影與動畫時間。
2. `base.css`：全站基礎設定。
3. `sections/header.css`
4. `sections/hero.css`
5. `sections/promotion.css`
6. `sections/gallery.css`
7. `sections/price.css`
8. `sections/booking-guide.css`
9. `sections/faq.css`
10. `sections/booking.css`

修改畫面時，優先調整對應 section；跨區共用的顏色或尺寸再放入 `tokens.css`。

Gallery 獨立頁使用 `gallery/gallery.css`；管理後台使用 `admin/css/admin.css`。兩者仍共用全站 Design Tokens 與基礎樣式。

## JavaScript

```text
js/main.js                         應用程式啟動入口
js/config/app-info.js              版本資訊載入與 Console 顯示
js/config/booking-config.js        預約畫面常數
js/components/booking.js           預約畫面、詢問表單、訊息模板與 LINE 連結
js/components/promotion.js         優惠畫面、有效期間與海報 Dialog
js/components/gallery-home.js      首頁精選作品
js/services/booking-api.js         預約 API 呼叫
js/services/promotion-data.js      優惠資料載入
js/services/gallery-data.js        Gallery API 呼叫
js/config/promotion-config.js      優惠資料來源與備援連結
js/config/gallery-config.js        Gallery 路徑與首頁顯示數量
js/utils/date.js                   日期共用函式
gallery/gallery.js                 作品分類篩選與 Lightbox
admin/js/admin.js                  活動後台
admin/js/gallery-admin.js          作品後台
```

`main.js` 只負責初始化，不應累積大型功能。新增功能時，依責任放入 `components`、`services`、`config` 或 `utils`。

## API

- 本機 API 與靜態檔案伺服器：`server.js`
- 線上公開 API：
  - `functions/api/booking.js`
  - `functions/api/promotions/index.js`
  - `functions/api/gallery/index.js`
- 線上管理 API：
  - `functions/api/admin/promotions/`
  - `functions/api/admin/gallery/`
- 共用資料處理：
  - `functions/_shared/promotion-utils.js`
  - `functions/_shared/gallery-utils.js`

本機 Express 與 Cloudflare Pages Functions 必須維持相同的 API 輸出格式。前端只透過 `/api/booking`、`/api/promotions` 與 `/api/gallery` 取得資料。

正式環境必須使用 Cloudflare Access 同時保護 `/admin/*` 與 `/api/admin/*`。

預約詢問表單只在瀏覽器中整理使用者輸入，不會將姓名、款式或其他預約資料保存至網站伺服器。完成後透過 LINE URL Scheme 開啟指定官方帳號聊天室並預填文字，仍由使用者確認後自行送出。

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

前台優先透過 `/api/promotions` 讀取 Cloudflare D1 資料；API 無法使用時，退回 `data/promotions.json`。桌機與手機海報在正式環境儲存於 `PROMOTION_IMAGES` R2 bucket，本機則儲存於 `assets/uploads/promotions/`。

## Gallery 資料

```text
js/components/gallery-home.js               首頁載入最多六件精選作品
gallery/index.html                           完整作品頁
gallery/gallery.js                           多分類篩選、Lightbox 與鍵盤導覽
admin/js/gallery-admin.js                    上傳、編輯、顯示、精選與排序
functions/api/gallery/index.js               線上公開 API
functions/api/admin/gallery/                 線上管理 API
functions/_shared/gallery-utils.js           R2 Metadata 共用處理
```

本機 Gallery metadata 寫入 `data/gallery.json`，圖片寫入 `assets/uploads/gallery/`。正式環境的 metadata 與圖片使用 `GALLERY_ASSETS` R2 binding。

自 V1.3.2 起，每件作品使用獨立的 `gallery/items/<id>.json`，避免同時新增作品時覆寫整份 metadata。系統仍相容讀取舊版 `gallery/metadata/gallery.json`。
