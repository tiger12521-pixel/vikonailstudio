# Cloudflare CMS 設定指南

本文件用於將 v1.2.0 活動後台部署到 Cloudflare Pages。Email 地址只需要填在 Cloudflare Access Policy，不可寫入 GitHub 程式碼。

## 一、建立 D1

在 Cloudflare Dashboard 建立 D1 database：

```text
vico-nail-story
```

依序執行：

```text
migrations/0001_create_promotions.sql
migrations/0002_seed_promotions.sql
```

接著到 Pages 專案的 Bindings 新增 D1 binding：

```text
Variable name: DB
D1 database: vico-nail-story
```

## 二、建立 R2

建立 R2 bucket：

```text
vico-nail-story-promotions
```

到 Pages 專案 Bindings 新增 R2 binding：

```text
Variable name: PROMOTION_IMAGES
R2 bucket: vico-nail-story-promotions
```

## 三、部署程式

將 v1.2.0 Push 到 GitHub，等待 Cloudflare Pages 部署完成。

先測試公開 API：

```text
https://你的網域/api/promotions
```

應回傳 `promotions` 陣列。

## 四、設定 Cloudflare Access

在 Cloudflare Zero Trust 建立 Self-hosted Application，加入兩個受保護路徑：

```text
你的網域/admin/*
你的網域/api/admin/*
```

登入方式啟用 Email One-time PIN。

Access Policy：

```text
Action: Allow
Include: Emails
Value: 你的 Gmail、老婆的 Gmail
```

不要把 Gmail 寫入程式碼，也不要提供 Google 密碼或驗證碼。

## 五、線上驗證

使用無痕視窗測試：

1. 開啟 `/admin/`，應先看到 Cloudflare Access 登入頁。
2. 使用允許的 Email 收取一次性驗證碼。
3. 登入後新增一筆測試活動。
4. 回首頁確認輪播立即讀到新活動。
5. 使用其他 Email 測試，應被拒絕。
6. 確認首頁與 `/api/promotions` 保持公開。

## 六、安全邊界

必須同時保護：

```text
/admin/*
/api/admin/*
```

只保護管理畫面是不夠的，否則未登入者仍可能直接呼叫管理 API。

公開路徑：

```text
/
/api/promotions
/api/media/*
```
