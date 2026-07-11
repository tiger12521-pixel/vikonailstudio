# Vico Nail Story

薇可美甲工作坊官方網站。

## 很久沒碰這個專案時

不要直接憑記憶操作，依序閱讀：

1. [`notes/QUICK_START.md`](notes/QUICK_START.md)
2. [`notes/PROJECT_CONTEXT.md`](notes/PROJECT_CONTEXT.md)
3. [`notes/COMMON_COMMANDS.md`](notes/COMMON_COMMANDS.md)

## 本機啟動

第一次下載專案：

```bash
npm ci
npm start
```

預設網址：

```text
http://localhost:3200
```

若環境變數提供 `PORT`，伺服器會優先使用該值；否則本機預設為 `3200`。

## 專案架構

```text
assets/                 圖片與靜態資源
css/                    全站與各頁面區塊樣式
js/                     前端 JavaScript 模組
functions/api/          Cloudflare Pages Functions API
data/                   本機測試資料
scripts/                版本與發布輔助工具
docs/                   正式架構、Coding Style 與發布文件
notes/                  快速操作、常用指令與長期維護知識庫
index.html              網站首頁
server.js               本機 Express 測試伺服器
version.json            Console 顯示的部署版本資訊
```

## 文件入口

- 正式文件：[`docs/README.md`](docs/README.md)
- 開發知識庫：[`notes/README.md`](notes/README.md)
- AI 協作規範：[`notes/AI_GUIDE.md`](notes/AI_GUIDE.md)
- 常用指令：[`notes/COMMON_COMMANDS.md`](notes/COMMON_COMMANDS.md)
- 發布檢查表：[`notes/DEPLOY_CHECKLIST.md`](notes/DEPLOY_CHECKLIST.md)
- 常見問題：[`notes/TROUBLESHOOTING.md`](notes/TROUBLESHOOTING.md)

## 常用指令

```bash
npm start
npm test
npm run version:check
npm run version:update -- v1.0.0
```

正式發布前請閱讀 [`docs/RELEASE.md`](docs/RELEASE.md)，並逐項完成 [`notes/DEPLOY_CHECKLIST.md`](notes/DEPLOY_CHECKLIST.md)。


## Release 快速入口

本機測試與主要程式 Commit 完成後，可執行：

```bash
npm run release -- v1.0.1 --commit --push
```

這行會更新版本資訊、驗證資料、建立 metadata Commit、建立 Tag，並推送到 GitHub。完整說明請閱讀：

- `docs/RELEASE.md`
- `notes/COMMON_COMMANDS.md`
- `notes/DEPLOY_CHECKLIST.md`
