# 待辦與未來規劃

## 下一階段候選功能

- [ ] Gallery Lightbox：點擊作品後可放大瀏覽。
- [ ] Footer：加入店家資訊、版權與快速連結。
- [ ] About：品牌與美甲師介紹。
- [ ] FAQ：預約、卸甲、遲到、改期等常見問題。
- [ ] Google 評價區塊。
- [ ] SEO Meta、Open Graph 與結構化資料。
- [ ] 圖片 Lazy Loading 與 WebP／AVIF 優化。
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
- [x] 由 `data/promotions.json` 管理活動內容與有效期間。
- [x] 過期或停用活動自動隱藏，並顯示社群備援內容。
- [ ] V1.2.0 評估 Cloudflare D1、R2 與 `/admin` 管理頁面。
- [ ] 管理後台完成後，將優惠資料來源由 JSON 切換成 `/api/promotions`。
