# Coding Style

## 共通規則

- HTML、CSS、JavaScript、JSON 使用 Tab 縮排。
- 檔案使用 UTF-8 與 LF 換行。
- 檔案結尾保留一個換行。
- 不保留行尾空白。
- 優先維持既有命名，避免只為美觀大量改名。

## 區段註解

大型區段使用：

```text
/* #region Section Name */
...
/* #endregion */
```

CSS 小區塊使用清楚的標題與用途說明，註解應協助維護，不逐行重述程式碼。

## CSS 屬性順序

建議依序排列：

1. Position
2. Display / Layout
3. Size
4. Margin / Padding
5. Typography
6. Color / Background
7. Border
8. Shadow / Filter
9. Transform / Transition / Animation

不同性質之間保留空行。

## JavaScript

- 一個模組只處理一類責任。
- API 呼叫放在 `services`。
- 畫面與事件處理放在 `components`。
- 常數放在 `config`。
- 無狀態共用函式放在 `utils`。
- 函式應提早 return，降低巢狀層級。
- 不在前端程式中放置金鑰或服務帳戶內容。
