# 上線檢查清單

每次正式發布前，逐項完成。不要憑印象略過。

## A. 本機環境

- [ ] 終端機位於正式 Git 專案，而不是 Downloads 中的測試副本。
- [ ] `git status` 顯示的修改都符合預期。
- [ ] `npm ci` 或既有 `node_modules` 可正常使用。
- [ ] `npm start` 可啟動 `http://localhost:3200`。

## B. 畫面與互動

- [ ] Header 與社群連結正常。
- [ ] Hero 桌機版正常。
- [ ] Hero 手機版正常。
- [ ] Gallery 圖片正常。
- [ ] Price 排版正常。
- [ ] Booking 顯示正常。
- [ ] 上一週／下一週按鈕正常。
- [ ] F12 Console 沒有紅色錯誤。

## C. 版本資訊

- [ ] 主要程式修改已 Commit。
- [ ] 已執行 `npm run version:update -- vX.Y.Z`。
- [ ] 已執行 `npm run version:check`。
- [ ] `version.json` 的 Version、Build、Commit、Branch 正確。
- [ ] 版本資訊檔案已再 Commit。

## D. Git 與 Tag

- [ ] `git log --oneline -5` 已確認最近 Commit。
- [ ] 已建立 Annotated Tag。
- [ ] 已 Push `main`。
- [ ] 已 Push Tag。
- [ ] GitHub 上可看到最新 Commit 與 Tag。

## E. Cloudflare 線上驗證

- [ ] Cloudflare Pages 顯示部署成功。
- [ ] 正式網站可以開啟。
- [ ] 使用 `Ctrl + Shift + R` 強制重新整理。
- [ ] F12 Console 的 Version 與本次版本相同。
- [ ] F12 Console 的 Commit 與 `version.json` 相同。
- [ ] 線上 Booking API 正常。

## F. 發布完成後

- [ ] 更新 `docs/CHANGELOG.md`。
- [ ] 更新 `notes/TODO.md`。
- [ ] 如有重要新決策，更新 `notes/PROJECT_DECISIONS.md`。
