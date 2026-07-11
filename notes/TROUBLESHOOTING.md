# 常見問題排除

## 問題 1：找不到 Express

錯誤：

```text
Error: Cannot find module 'express'
```

原因：新解壓或新 Clone 的專案沒有 `node_modules`。

處理：

```bash
npm ci
```

完成後再執行：

```bash
npm start
```

## 問題 2：3200 Port 已被占用

可能錯誤：

```text
EADDRINUSE
```

原因：另一個 Node 伺服器仍在執行。

處理：先回到原本終端機按 `Ctrl + C`。找不到原終端機時，可重新開機，或在 Windows 查詢占用程序。

## 問題 3：網站看起來仍是舊版

依序檢查：

1. 確認網址是正式網站，不是 `localhost` 或舊分頁。
2. 按 `Ctrl + Shift + R` 強制重新整理。
3. F12 → Console 查看版本。
4. 查看 Cloudflare Pages 部署紀錄。
5. 查看 GitHub `main` 是否有本次 Commit。

## 問題 4：Console 顯示舊版本

可能原因：

- 尚未執行 `npm run version:update -- vX.Y.Z`。
- `version.json` 沒有 Commit 或 Push。
- Cloudflare 尚未部署完成。
- 瀏覽器正在顯示舊分頁。

## 問題 5：Booking 區塊空白

檢查順序：

1. F12 Console 是否有 JavaScript 錯誤。
2. Network 是否能取得 `/api/booking`。
3. 本機確認 `data/booking.json` 存在且 JSON 格式正確。
4. 線上確認 Cloudflare Function `functions/api/booking.js` 正常。
5. 確認環境變數或 Google Calendar 金鑰是否正確。

## 問題 6：CSS 修改沒有生效

檢查：

1. 是否改到正確 Section CSS。
2. `css/style.css` 是否仍有載入該檔案。
3. Selector 是否被後面的 Mobile Media Query 覆蓋。
4. DevTools Elements → Styles 查看實際生效規則。
5. 強制重新整理瀏覽器。

## 問題 7：Git 顯示大量無關修改

可能原因：換行格式、格式化工具或複製整個專案造成。

先執行：

```bash
git diff --stat
```

再檢查單一檔案：

```bash
git diff -- <檔案路徑>
```

不要在未確認差異前直接 `git add .`。

# Release 指令失敗

## 顯示 working tree is not clean

原因：目前有尚未 Commit 或 Stash 的修改。

先執行：

```bash
git status
```

解決方式一：確認修改正確後 Commit。

解決方式二：尚未完成的工作先 Stash。

```bash
git stash push -m "unfinished work before release"
```

注意：Release 完成後記得執行 `git stash pop` 恢復工作。

## 顯示 Release must run from the main branch

原因：目前不在 `main`。

先查看：

```bash
git branch --show-current
```

確認工作已保存後切回：

```bash
git switch main
```

## 顯示 Tag already exists

原因：同版本 Tag 已建立，Release Script 為避免覆寫正式版本而中止。

查看本機 Tag：

```bash
git tag --list
```

查看 Tag 內容：

```bash
git show v1.0.1
```

不要隨意刪除已發布的 Tag。若內容有新修正，通常應改用下一個 Patch 版本，例如 `v1.0.2`。

## 顯示 --push requires --commit

原因：`--push` 必須搭配 `--commit`，避免在沒有建立版本 Commit 與 Tag 時誤推送。

正確指令：

```bash
npm run release -- v1.0.1 --commit --push
```

## 準備模式完成後，重新執行卻顯示工作目錄不乾淨

原因：第一次執行 `npm run release -- v1.0.1` 已修改三個版本檔案。

先查看：

```bash
git diff -- version.json package.json package-lock.json
```

若只是測試而不保留，可還原：

```bash
git restore version.json package.json package-lock.json
```

再執行完整模式：

```bash
npm run release -- v1.0.1 --commit --push
```
