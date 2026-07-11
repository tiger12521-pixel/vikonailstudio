# 學習紀錄

用來記錄開發過程中值得保留的經驗，避免數月後重新查找。

## 2026-07：新解壓專案找不到 Express

現象：

```text
Error: Cannot find module 'express'
```

原因：ZIP 不包含 `node_modules`，這是正確且正常的做法。

解法：

```bash
npm ci
```

## 2026-07：使用 3200 區分本機版本

若 3000 Port 曾有其他專案或舊 Node 程序，瀏覽器可能顯示歷史分頁或舊服務。改用 3200 後，更容易確認目前開啟的是新專案。

## 2026-07：純架構修改難以確認線上部署

當畫面內容完全相同時，不能只看頁面判斷 Cloudflare 是否更新。現在使用 F12 Console 讀取 `version.json`，以 Version、Build 與 Commit 驗證。
