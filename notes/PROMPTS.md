# 常用 ChatGPT Prompt

使用前建議先把專案 ZIP 與 `notes/AI_GUIDE.md` 提供給 ChatGPT。

## 修改現有功能

```text
請先閱讀 notes/AI_GUIDE.md 與 docs/ARCHITECTURE.md。
依目前專案架構修改【功能名稱】。
請維持既有顯示與其他功能不變，所有縮排使用 Tab。
完成後列出修改檔案、修改原因、本機測試方式與可能風險。
```

## 新增 Section

```text
請在首頁 Booking 之後新增【Section 名稱】。
HTML、CSS 與 JavaScript 必須依現有模組架構放到正確檔案；若為新功能，建立獨立 Section CSS 或 JS 模組。
不要將完整功能塞進 css/style.css 或 js/main.js。
縮排使用 Tab，加入方便未來微調的繁體中文註解。
```

## 整理 CSS

```text
請只整理【CSS 檔案】的註解、區段與 Property 排序，不改變任何選擇器、數值、載入順序或最終顯示。
縮排使用 Tab，保留 #region / #endregion。
```

## 修正 Bug

```text
目前現象：【描述】
重現方式：【步驟】
Console 錯誤：【貼上】
請先定位根因，不要直接大幅重寫。提供最小修改方案，並說明如何驗證沒有影響其他功能。
```

## 發布前檢查

```text
請依 notes/DEPLOY_CHECKLIST.md 檢查這份專案是否適合發布。
特別確認 Version、Git Tag、Cloudflare 部署、Booking API 與 Console 錯誤。
```
