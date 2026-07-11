# 發布流程

## 一般版本流程

### 1. 確認本機狀態

```bash
git status
npm ci
npm start
```

檢查桌機、手機版與預約資料皆正常。

### 2. 提交功能修改

```bash
git add .
git commit -m "refactor: prepare v1.0.0 architecture"
```

### 3. 產生版本資訊

提交完成後執行：

```bash
npm run version:update -- v1.0.0
npm run version:check
```

這會將目前 HEAD 的短 Commit、Branch 與建置時間寫入 `version.json`。

> `version.json` 記錄的是主要程式提交。接著的 metadata commit 只負責保存版本資訊，因此 Console 顯示的 Commit 仍可正確對應主要程式內容。

### 4. 提交版本資訊

```bash
git add version.json package.json package-lock.json
git commit -m "chore: finalize v1.0.0 metadata"
```

### 5. 建立 Tag 並推送

```bash
git tag -a v1.0.0 -m "Vico Nail Story v1.0.0"
git push origin main
git push origin v1.0.0
```

### 6. 驗證線上版本

等待 Cloudflare Pages 部署完成後：

1. 開啟正式網站。
2. 按 `F12` 開啟 DevTools。
3. 切到 Console。
4. 確認 Version、Commit、Branch 與 Build。
5. 必要時按 `Ctrl + Shift + R` 強制重新整理。

## Cloudflare 自動產生版本資訊（選用）

若日後在 Cloudflare Pages 設定 Build command，可使用：

```bash
npm run build:metadata
```

腳本會優先讀取 Cloudflare 提供的：

- `CF_PAGES_COMMIT_SHA`
- `CF_PAGES_BRANCH`
- `CF_PAGES_URL`

因此部署工作區中的 `version.json` 可直接對應實際部署 Commit。現在若網站採無建置直接部署，維持上方的一般版本流程即可。
