# 部署到 Gitee Pages（手机可在线阅读）

本目录是一个 [VitePress](https://vitepress.dev/) 静态文档站，已把全部 Markdown 教程（含本地图片 `_images/`）合并为统一站点，自动生成侧栏导航、本地搜索，响应式适配手机。

## 一、在本机构建验证（可选）

```bash
npm install
npm run docs:dev      # 本地预览，默认 http://localhost:5173
# 或手机同 Wi-Fi：npm run docs:dev -- --host  然后手机访问 http://<电脑局域网IP>:5173
npm run build         # 产出 .vitepress/dist 静态文件
```

> 注意：在 WorkBuddy 终端里构建需先 `export CODEBUDDY_SAFE_DELETE_ENABLED=0`，否则 Vite 清理 dist 时会被 safe-delete 拦截导致构建失败（无该 shim 的环境忽略即可）。

## 二、推送到 Gitee Pages

1. 在 Gitee 新建仓库：
   - **个人主页**（地址 `https://wzx825.gitee.io/`）：仓库名必须叫 `wzx825`。
   - 普通项目页（地址 `https://wzx825.gitee.io/<仓库名>/`）：仓库名随意，如 `央国企指南手册`。
2. 在本目录初始化 git 并关联远程（若尚未做）：
   ```bash
   git init
   git add -A
   git commit -m "init: 央国企求职指南手册源文件"
   git remote add gitee git@gitee.com:wzx825/<仓库名>.git   # 或带 token 的 https
   git push -u gitee master          # 源码可提交到 master（图片一并入库）
   ```
3. 一键部署（构建并把 `dist` 推到 `gh-pages` 分支）：
   ```bash
   bash deploy-gitee.sh
   ```
   - 脚本会根据仓库名自动设置 `base`：仓库名=`wzx825`→`/`，否则→`/<仓库名>/`。
   - 也可手动指定：`GITEE_REPO=央国企指南手册 bash deploy-gitee.sh`。
4. 开启 Pages：Gitee 仓库 → **设置 → Pages** → 部署分支选 `gh-pages`、部署目录 `/` → 保存。稍候即可访问。

## 三、手机阅读

- 部署后直接用手机浏览器打开 `https://wzx825.gitee.io/`（或带仓库名的地址）。
- 站点响应式：手机上侧栏收成汉堡菜单，单列排版，支持本地搜索、大纲跳转。
- 未部署时，电脑开 `npm run docs:dev -- --host`，手机同 Wi-Fi 访问局域网地址也能看（零托管）。

## 四、更新内容后重新发布

改完 Markdown / 图片后：

```bash
bash deploy-gitee.sh     # 重新构建并推送 gh-pages
```

若只改源码想保留到 master：`git add -A && git commit -m "..." && git push gitee master`。

## 五、常见问题

- **构建报 `safe-delete` / EPERM**：未关闭 WorkBuddy 的 safe-delete 拦截。构建前执行 `export CODEBUDDY_SAFE_DELETE_ENABLED=0`。
- **页面 404 / 样式错乱**：`base` 与仓库名不匹配。个人页仓库必须是 `wzx825` 且 base=`/`；项目页 base 必须是 `/<仓库名>/`。重新 `bash deploy-gitee.sh` 会自动修正。
- **图片不显示**：确认 `_images/` 目录随文章一起入库；本地引用为 `![](_images/xxx.png)` 相对路径。
- **Gitee Pages 国内访问慢**：免费版有部署延迟，首次开启后等 1~2 分钟；如仍慢可考虑 Cloudflare Pages 或 GitHub Pages。
