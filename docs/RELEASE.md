# 發布流程

本專案從 `v1.0.1` 起提供 Release 自動化工具。

## 一、版本規則

版本格式採 Semantic Versioning：

```text
MAJOR.MINOR.PATCH
```

- `PATCH`：Bug 修正、工具或文件維護，例如 `v1.0.1`。
- `MINOR`：新增相容功能，例如 `v1.1.0`。
- `MAJOR`：重大且可能不相容的改版，例如 `v2.0.0`。

## 二、正式發布前

### 1. 確認專案路徑

```bash
cd D:\VicoNailStory
```

用途：切換到含有 `.git` 與 `package.json` 的正式 Repository。

### 2. 確認本機狀態

```bash
git status
```

用途：確認目前修改內容是否符合預期。

### 3. 安裝套件

```bash
npm ci
```

用途：依 `package-lock.json` 安裝固定版本套件。

### 4. 啟動本機網站

```bash
npm start
```

用途：在 `http://localhost:3200` 啟動網站。

### 5. 手動驗證

至少確認：

- 桌機版首頁。
- 手機版首頁。
- Gallery。
- Price。
- Booking 上一週與下一週。
- Booking API 資料。
- Console 無 JavaScript 錯誤。

### 6. 提交功能或修正內容

```bash
git add .
```

用途：將本次確認過的修改加入暫存區。

```bash
git commit -m "fix: prepare v1.0.1 release workflow"
```

用途：建立主要程式 Commit。

> Release 指令必須在乾淨的工作目錄執行，因此請先提交所有正式修改。

## 三、推薦的一鍵正式發布

```bash
npm run release -- v1.0.1 --commit --push
```

這一行會依序執行：

1. 確認工作目錄乾淨。
2. 確認目前 Branch 為 `main`。
3. 確認 `v1.0.1` Tag 尚不存在。
4. 執行 `npm test`。
5. 將目前 HEAD Commit、Build 時間與 Branch 寫入版本資訊。
6. 執行版本檢查。
7. 建立 metadata Commit。
8. 建立 annotated Git Tag。
9. 推送 `main` 到 GitHub。
10. 推送版本 Tag 到 GitHub。

## 四、分階段發布模式

若不想讓腳本直接 Commit 或 Push，可分開執行。

### 1. 只產生版本資訊

```bash
npm run release -- v1.0.1
```

用途：只修改以下檔案，不會 Commit、不會 Tag、不會 Push：

- `version.json`
- `package.json`
- `package-lock.json`

接著可檢查：

```bash
git diff -- version.json package.json package-lock.json
```

注意：準備模式執行後工作目錄會變成非乾淨狀態。若要改用自動 `--commit` 模式，需先還原這三個檔案，或自行提交它們。

### 2. 自動 Commit 與 Tag，但不 Push

```bash
npm run release -- v1.0.1 --commit
```

用途：更新版本資訊、建立 metadata Commit 與本機 Tag，但保留最後 Push 由你手動執行。

完成後執行：

```bash
git push origin main
```

用途：推送主分支。

```bash
git push origin v1.0.1
```

用途：推送正式版本 Tag。

## 五、線上驗證

Cloudflare Pages 部署完成後：

1. 開啟正式網站。
2. 按 `F12`。
3. 切換到 Console。
4. 確認：
   - Version 為預期版本。
   - Commit 對應主要程式 Commit。
   - Branch 為 `main`。
   - Environment 為 `Production`。
   - Build 為本次發布時間。
5. 必要時按 `Ctrl + Shift + R` 強制重新整理。

## 六、腳本安全機制

Release 腳本遇到以下情況會中止：

- 未提供合法版本號。
- 工作目錄有尚未提交的修改。
- 目前不在 `main` Branch。
- 同名 Tag 已存在。
- `npm test` 失敗。
- 版本 metadata 驗證失敗。
- 使用 `--push` 卻未搭配 `--commit`。

腳本不會覆寫既有 Tag，也不會自動刪除本機修改。
