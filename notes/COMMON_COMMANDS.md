# 常用指令完整說明

這份文件假設使用 Windows、VS Code Terminal、Git、Node.js 與 npm。

> 指令中的 `<...>` 代表要替換成實際內容，不要連尖括號一起輸入。

# 一、本機專案與 npm

## `cd <專案路徑>`

```bash
cd C:\你的路徑\VicoNailStory
```

用途：切換終端機到正式專案資料夾。

使用時機：每次新開終端機後第一步。

注意：該資料夾應包含 `.git`、`package.json`、`index.html`。

## `npm ci`

```bash
npm ci
```

用途：依 `package-lock.json` 乾淨安裝專案相依套件。

使用時機：

- 第一次 Clone 或解壓專案。
- `node_modules` 不存在。
- 套件狀態混亂，想重新安裝。

執行結果：建立 `node_modules/`。

注意：會依 lock 檔安裝固定版本，適合正式專案與重現環境。

## `npm install`

```bash
npm install
```

用途：安裝相依套件，並可能更新 `package-lock.json`。

使用時機：新增、移除或調整套件時。

注意：只是重新建立既有環境時，優先使用 `npm ci`。

## `npm start`

```bash
npm start
```

用途：執行 `package.json` 中的 `start` 指令，也就是 `node server.js`。

執行結果：本機網站啟動於 `http://localhost:3200`。

停止方式：在同一終端機按 `Ctrl + C`。

## `node server.js`

```bash
node server.js
```

用途：直接執行本機 Express 伺服器。

使用時機：想明確確認執行的是哪一支 Server 檔案時。

與 `npm start` 的差異：目前兩者效果相同，但 `npm start` 較符合專案標準流程。

## `npm test`

```bash
npm test
```

用途：檢查 `server.js` 與版本腳本的 JavaScript 語法。

注意：目前不是完整的瀏覽器自動測試，仍需要手動檢查畫面與 Booking。

# 二、Git 日常檢查

## `git status`

```bash
git status
```

用途：查看目前 Branch、已修改檔案、已暫存檔案與未追蹤檔案。

使用時機：

- 開始工作前。
- Commit 前。
- Pull 前。
- 複製或覆蓋檔案後。

常見輸出：

- `modified`：Git 已追蹤檔案被修改。
- `untracked`：新增檔案尚未被 Git 追蹤。
- `changes to be committed`：已執行 `git add`，等待 Commit。

## `git diff`

```bash
git diff
```

用途：查看尚未 `git add` 的實際內容差異。

使用時機：Commit 前確認沒有意外修改。

## `git diff -- <檔案路徑>`

```bash
git diff -- server.js
```

用途：只查看指定檔案差異。

使用時機：例如 `server.js` 顯示 Modified，但你只記得改了 Port。

## `git diff --stat`

```bash
git diff --stat
```

用途：以摘要方式查看哪些檔案改動以及大約增刪行數。

使用時機：完整 Diff 太長時先快速盤點。

## `git log --oneline -5`

```bash
git log --oneline -5
```

用途：查看最近 5 筆 Commit 的短 Hash 與訊息。

使用時機：

- 建立 Tag 前確認要標記哪一版。
- 確認最近是否已 Commit。
- 比對 Console 中的 Commit。

## `git rev-parse --short HEAD`

```bash
git rev-parse --short HEAD
```

用途：取得目前 HEAD 的短 Commit Hash。

使用時機：核對 `version.json` 或 Console 顯示的 Commit。

## `git branch --show-current`

```bash
git branch --show-current
```

用途：顯示目前所在 Branch。

正常正式發布通常應為：

```text
main
```

# 三、Git 暫存與 Commit

## `git add .`

```bash
git add .
```

用途：將目前目錄下所有新增、修改與刪除加入暫存區。

使用時機：已完整確認 `git status` 與 `git diff` 後。

注意：不要在不知道有哪些修改時直接執行。

## `git add <檔案>`

```bash
git add version.json package.json package-lock.json
```

用途：只暫存指定檔案。

使用時機：只想提交版本 metadata，不想混入其他修改。

## `git commit -m "訊息"`

```bash
git commit -m "refactor: prepare v1.0.0 architecture"
```

用途：把暫存區內容建立成一筆本機 Commit。

Commit 訊息常用前綴：

- `feat:` 新功能。
- `fix:` 修正 Bug。
- `refactor:` 重構但不改功能。
- `style:` 純格式或視覺調整。
- `docs:` 文件修改。
- `chore:` 版本、工具或維護工作。

## `git restore --staged <檔案>`

```bash
git restore --staged server.js
```

用途：把指定檔案從暫存區移出，但保留工作目錄中的修改。

使用時機：不小心 `git add` 了不想放進本次 Commit 的檔案。

## `git restore <檔案>`

```bash
git restore server.js
```

用途：丟棄指定檔案尚未 Commit 的修改，恢復到目前 HEAD。

警告：未 Commit 的修改會消失。執行前先確認或備份。

# 四、GitHub 同步

## `git pull origin main`

```bash
git pull origin main
```

用途：取得 GitHub `main` 最新內容並整合到本機。

使用時機：開始工作前，且 `git status` 乾淨時。

注意：有未提交修改時先確認是否會衝突，不要盲目 Pull。

## `git push origin main`

```bash
git push origin main
```

用途：把本機 `main` 的 Commit 推到 GitHub。

執行結果：Cloudflare Pages 通常會自動開始部署。

## `git remote -v`

```bash
git remote -v
```

用途：查看此專案連到哪一個 GitHub Repository。

使用時機：懷疑目前開錯專案或 Push 到錯誤 Repository 時。

# 五、暫存尚未完成的工作

## `git stash push -m "說明"`

```bash
git stash push -m "unfinished local work"
```

用途：暫時收起尚未 Commit 的修改，讓工作目錄恢復乾淨。

使用時機：需要先切換版本、Pull 或建立舊版 Tag，但目前還有做到一半的內容。

## `git stash list`

```bash
git stash list
```

用途：查看所有暫存工作。

## `git stash pop`

```bash
git stash pop
```

用途：恢復最近一筆 Stash，成功後移除該 Stash。

注意：可能出現衝突；恢復後立即執行 `git status`。

# 六、版本資訊

## `npm run version:update -- v1.0.0`

```bash
npm run version:update -- v1.0.0
```

用途：更新正式版本 metadata。

會同步更新：

- `version.json`
- `package.json`
- `package-lock.json`
- Build 時間
- Git Commit
- Git Branch
- Environment

使用時機：主要程式已 Commit、準備正式發布時。

注意：版本格式使用 Semantic Version，例如 `v1.0.0`、`v1.1.0`、`v1.1.1`。

## `npm run version:check`

```bash
npm run version:check
```

用途：檢查版本格式、版本同步、Build 時間與 Commit 是否有效。

使用時機：`version:update` 後、提交 metadata 前。

## `npm run build:metadata`

```bash
npm run build:metadata
```

用途：執行版本資訊產生腳本，設計給日後 Cloudflare Build command 使用。

目前若採 GitHub Push 後直接部署、不設定 Build command，不需要日常執行這條。

# 七、Git Tag

## `git tag`

```bash
git tag
```

用途：列出本機所有 Tag。

## `git tag -a v1.0.0 -m "Vico Nail Story v1.0.0"`

```bash
git tag -a v1.0.0 -m "Vico Nail Story v1.0.0"
```

用途：在目前 HEAD 建立帶有說明的 Annotated Tag。

使用時機：正式版本全部完成、版本 metadata 已 Commit 後。

注意：Tag 標記的是 Commit，不包含尚未 Commit 的檔案。

## `git show v1.0.0`

```bash
git show v1.0.0
```

用途：查看 Tag 指向的 Commit、作者、日期與變更。

## `git push origin v1.0.0`

```bash
git push origin v1.0.0
```

用途：把指定 Tag 推到 GitHub。

注意：單純 `git push origin main` 不一定會推送新 Tag，所以要另外執行。

## `git push origin --tags`

```bash
git push origin --tags
```

用途：一次推送所有尚未存在於 GitHub 的本機 Tag。

注意：若只想發布單一版本，優先使用指定 Tag 的指令，較不容易誤推其他 Tag。

# 八、正式 V1.0.0 建議完整流程

以下每一行都按順序執行：

```bash
git status
```

用途：確認目前修改是否都是預期內容。

```bash
npm test
```

用途：先做 JavaScript 語法檢查。

```bash
npm start
```

用途：啟動本機網站並手動測試；測試後按 `Ctrl + C` 停止。

```bash
git add .
```

用途：暫存主要程式與文件修改。

```bash
git commit -m "refactor: finalize v1.0.0 project architecture"
```

用途：建立 V1.0.0 主要程式 Commit。

```bash
npm run version:update -- v1.0.0
```

用途：把剛才主要程式 Commit 的 Hash 與 Build 時間寫入版本資訊。

```bash
npm run version:check
```

用途：確認 metadata 正確。

```bash
git add version.json package.json package-lock.json
```

用途：只暫存版本資訊檔案。

```bash
git commit -m "chore: finalize v1.0.0 metadata"
```

用途：保存 V1.0.0 版本資訊。

```bash
git tag -a v1.0.0 -m "Vico Nail Story v1.0.0"
```

用途：在 metadata Commit 建立正式 Tag。

```bash
git push origin main
```

用途：推送程式與版本 Commit，觸發 Cloudflare 部署。

```bash
git push origin v1.0.0
```

用途：把正式版本 Tag 推到 GitHub。

```bash
git status
```

用途：最後確認工作目錄乾淨。

# 七、V1.0.1 Release 自動化

## `npm run release -- v1.0.1`

```bash
npm run release -- v1.0.1
```

用途：只準備 `v1.0.1` 的版本資訊並執行檢查。

什麼時候使用：

- 想先查看自動產生的 Build 與 Commit 是否正確。
- 想手動審查版本檔案後再決定是否 Commit。

執行前條件：

- 必須位於正式 Git Repository。
- 必須在 `main` Branch。
- `git status` 必須乾淨。
- `v1.0.1` Tag 不可已存在。

執行後會修改：

- `version.json`
- `package.json`
- `package-lock.json`

不會執行：

- Git Commit。
- Git Tag。
- Git Push。

注意：執行後工作目錄會出現修改。若要重新執行完整自動發布，需先自行 Commit 或還原這三個檔案。

## `npm run release -- v1.0.1 --commit`

```bash
npm run release -- v1.0.1 --commit
```

用途：更新版本資訊、建立 metadata Commit，並建立本機 annotated Tag。

什麼時候使用：

- 本機測試完成。
- 主要程式修改已先 Commit。
- 希望先在本機確認 Tag，再手動 Push。

執行後會發生：

1. 執行專案測試。
2. 更新三個版本檔案。
3. 驗證 metadata。
4. 建立 `chore: finalize v1.0.1 release metadata` Commit。
5. 建立 `v1.0.1` Tag。

不會執行：

- Push 到 GitHub。
- 觸發 Cloudflare 部署。

完成後需手動執行：

```bash
git push origin main
```

用途：推送 metadata Commit。

```bash
git push origin v1.0.1
```

用途：推送版本 Tag。

## `npm run release -- v1.0.1 --commit --push`

```bash
npm run release -- v1.0.1 --commit --push
```

用途：完整執行正式發布流程。

什麼時候使用：

- 本機畫面與功能均測試完成。
- 所有正式修改已 Commit。
- `git status` 顯示工作目錄乾淨。
- 已確定要立即發布到 GitHub 與 Cloudflare。

這一行會依序完成：

1. 專案測試。
2. 版本資訊更新。
3. metadata 驗證。
4. metadata Commit。
5. Git Tag。
6. Push `main`。
7. Push Tag。
8. 觸發 Cloudflare Pages 部署。

注意事項：

- 這是正式發布指令，不要在仍有未完成內容時執行。
- 同版本 Tag 已存在時會中止，不會覆寫舊 Tag。
- Push 需要網路正常，且本機 Git 已有 GitHub 權限。

## `git tag --list`

```bash
git tag --list
```

用途：列出本機所有版本 Tag。

使用時機：發布前確認版本號是否已使用。

## `git show v1.0.1`

```bash
git show v1.0.1
```

用途：查看 `v1.0.1` Tag 指向的 Commit 與內容摘要。

使用時機：確認 Tag 是否建立在正確版本。

## `git ls-remote --tags origin`

```bash
git ls-remote --tags origin
```

用途：查看 GitHub 遠端 Repository 已存在的 Tag。

使用時機：懷疑本機 Tag 已建立，但尚未成功推送到 GitHub。
