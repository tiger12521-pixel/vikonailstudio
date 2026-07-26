# 待辦與未來規劃

## 下一階段候選功能

- [x] Gallery Lightbox：點擊作品後可放大瀏覽。
- [ ] Footer：加入店家資訊、版權與快速連結。
- [ ] About：品牌與美甲師介紹。
- [x] FAQ：預約、卸甲、遲到、改期等常見問題。
- [ ] Google 評價區塊。
- [x] SEO Meta、Canonical、Open Graph、Twitter Card 與基礎結構化資料。
- [ ] 補齊已確認的營業時間、完整地址等結構化資料。
- [x] Gallery 與活動圖片 Lazy Loading。
- [ ] 圖片 WebP／AVIF 優化。
- [ ] 404 頁面。
- [ ] 預約表單或後台管理。

## 每次開始新功能前

1. 先確認功能屬於哪個版本。
2. 決定 HTML、CSS、JavaScript 與 API 放置位置。
3. 確認是否需要新增 Design Token。
4. 完成本機測試後再更新這份清單。

## 優惠區後續決策

- [x] V1.1.1 採單一活動海報搭配文字與預約按鈕。
- [x] 桌機使用橫式海報，手機使用直式海報。
- [x] V1.1.1 以 `data/promotions.json` 管理活動內容與有效期間。
- [x] 過期或停用活動自動隱藏，並顯示社群備援內容。
- [x] V1.2.0 導入 Cloudflare D1、R2 與 `/admin` 管理頁面。
- [x] 優惠資料來源切換為 `/api/promotions`，並保留靜態 JSON fallback。

## Gallery 系統

- [x] 首頁顯示最多六件精選作品。
- [x] 建立 `/gallery/` 完整作品頁與多分類篩選。
- [x] 支援 Lightbox、前後切換與鍵盤操作。
- [x] 建立 Gallery 上傳、編輯、精選、顯示、排序與刪除後台。
- [x] 正式環境使用 `GALLERY_ASSETS` R2 binding。
- [x] V1.3.2 將 metadata 改為每件作品獨立 JSON，避免同時寫入覆蓋資料。

## 部署後仍需人工確認

下列項目涉及 Cloudflare 帳號設定，Repository 無法單獨證明線上狀態；每次調整部署設定後仍需重新確認：

- [ ] D1 database 已套用最新 migrations。
- [ ] `DB`、`PROMOTION_IMAGES`、`GALLERY_ASSETS` bindings 正確。
- [ ] Cloudflare Access Email One-time PIN 正常。
- [ ] `/admin/*` 與 `/api/admin/*` 均受到 Access 保護。
- [ ] 公開 API 與首頁、Gallery 線上運作正常。
