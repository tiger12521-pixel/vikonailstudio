# 快速開始

這份文件給「很久沒有碰專案，現在想重新開始」時使用。

## 1. 進入正式專案資料夾

```bash
cd <VicoNailStory 專案路徑>
```

用途：切換終端機目前工作目錄到正式 Git 專案。

注意：必須是內含 `.git`、`package.json`、`index.html` 的那一層。

## 2. 確認目前 Git 狀態

```bash
git status
```

用途：確認是否有尚未提交的修改，避免把以前做到一半的內容誤當成乾淨版本。

## 3. 安裝套件

首次下載或刪除 `node_modules` 後執行：

```bash
npm ci
```

用途：依 `package-lock.json` 安裝固定版本的相依套件。

若只是日常開發且沒有刪除 `node_modules`，通常不需要重複執行。

## 4. 啟動本機網站

```bash
npm start
```

用途：啟動 `server.js`。

預設網址：

```text
http://localhost:3200
```

## 5. 本機檢查

至少確認：

- 首頁 Hero 顯示正常。
- Gallery 圖片可載入。
- 價目表排版正常。
- Booking 可顯示一週資料。
- 上一週與下一週按鈕可操作。
- F12 Console 沒有紅色錯誤。
- Console 可看到 Version、Build、Commit、Branch、Environment。

## 6. 開始修改前先閱讀

- CSS：[`../docs/CODING_STYLE.md`](../docs/CODING_STYLE.md)
- 架構：[`../docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md)
- 指令：[`COMMON_COMMANDS.md`](COMMON_COMMANDS.md)
- AI 協作：[`AI_GUIDE.md`](AI_GUIDE.md)

## 7. 停止本機伺服器

在執行 `npm start` 的終端機中按：

```text
Ctrl + C
```

用途：停止 Node.js 本機伺服器，釋放 3200 Port。
