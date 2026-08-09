# Theme: apple（Apple 风格）

参考 Apple 官网营销页气质的**非官方**视觉包。

## 色板

| 模式 | 背景 | 表面 | 文字 | 强调色 |
|------|------|------|------|--------|
| 浅色 | `#f5f5f7` | `#ffffff` | `#1d1d1f` | `#0071e3` |
| 深色 | `#000000` | `#1d1d1f` | `#f5f5f7` | `#2997ff` |

## 特点

- 系统字体栈（SF Pro / PingFang / -apple-system）
- 链接按钮**胶囊形**（`border-radius: 980px`）
- 浅灰画布 + 白卡片、阴影很轻
- 标题字重 600、字距略收紧
- 无径向渐变背景（`gradientBg: false`）

## 与 anthropic 对比

| | anthropic | apple |
|--|-----------|-------|
| 气质 | 插画/纸感、衬线 | 产品营销、无衬线 |
| 强调色 | clay `#D97757` | Apple 蓝 |
| 按钮 | 圆角方卡描边 | 全胶囊 |
| 浅色底 | oat 暖灰 | 冷灰 `#f5f5f7` |

## 使用

```bash
npm run build:themes
```

- 后台选择 **Apple / Apple 风格**
- 或 `DEFAULT_THEME=apple`
- 或 KV `settings.theme = "apple"`
