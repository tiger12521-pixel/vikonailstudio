# 部署檢查清單

## A. 開發完成

- [ ] 所有修改已保存。
- [ ] `git diff` 已檢查。
- [ ] 沒有誤改金鑰、個人資料或不該上傳的檔案。
- [ ] 文件與 CHANGELOG 已同步更新。

## B. 本機測試

- [ ] 執行 `npm ci` 或確認套件已安裝。
- [ ] 執行 `npm start`。
- [ ] 開啟 `http://localhost:3200`。
- [ ] 桌機 Hero 正常。
- [ ] 手機 Hero 正常。
- [ ] Gallery 正常。
- [ ] Price 正常。
- [ ] Booking 上一週、下一週正常。
- [ ] Booking 資料正常。
- [ ] Console 無紅色錯誤。
- [ ] 執行 `npm test` 成功。

## C. 提交主要程式

- [ ] 執行 `git status`。
- [ ] 執行 `git add .`。
- [ ] 建立清楚的主要程式 Commit。
- [ ] 再次執行 `git status`，確認工作目錄乾淨。

## D. 正式 Release

推薦指令：

```bash
npm run release -- v1.0.1 --commit --push
```

- [ ] 版本號符合 SemVer。
- [ ] Release Script 完整執行成功。
- [ ] metadata Commit 已建立。
- [ ] Git Tag 已建立。
- [ ] `main` 已 Push。
- [ ] Tag 已 Push。

## E. Cloudflare 驗證

- [ ] Cloudflare 部署顯示成功。
- [ ] 正式網域可以開啟。
- [ ] 按 `Ctrl + Shift + R` 強制重新整理。
- [ ] Console Version 正確。
- [ ] Console Commit 正確。
- [ ] Console Branch 為 `main`。
- [ ] Console Environment 為 `Production`。
- [ ] Console Build 為本次發布時間。
- [ ] 線上 Booking 功能正常。

## F. 發布後

- [ ] 視需要建立 GitHub Release。
- [ ] 將重要結果記錄到 `notes/LEARNING_LOG.md`。
- [ ] 更新下一版 `notes/TODO.md`。
