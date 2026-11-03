# Fang Xu · Personal Homepage

主页：<https://freddy-hexas.github.io/>

个人学术主页，使用 HTML、CSS、JavaScript 和静态资源，无需构建即可部署。布局参考 [shiyicao.com](https://shiyicao.com/)，代码独立实现。

## 自动访问与收录偏好

- `robots.txt` 使用 `User-agent: *` 和 `Disallow: /`，请求所有自动客户端不要抓取整个站点，包括 JSON、照片等资源。
- 首页声明 `noindex, nofollow, nosnippet, noimageindex`，表达不收录、不跟踪链接、不展示摘要和不索引页面图片的偏好。
- `llms.txt` 仅包含中英文拒绝采集的告知，`llm.txt` 是同文副本；声明不授权未经书面许可的自动采集、AI/LLM 代理读取、训练、微调等用途。网站不挂可见说明链接或独立说明页面。

常见文件名是 `llms.txt`。[原提案](https://llmstxt.org/)用于提供面向 LLM 的网站概要与内容指引，不是标准禁爬协议。本项目只在其中发布拒绝采集的告知，不提供简历、照片或站点内容的索引；爬虫访问约定仍以 `robots.txt` 为准。修改告知时，请同步修改 `llms.txt` 与 `llm.txt`。

这些设置是自愿遵守的规则与声明，不是登录验证、网络封禁或防火墙；公开 GitHub 仓库及 raw 文件入口仍可被独立访问。它们也不能移除已被保存或用于训练的数据。

**已有搜索结果：** Google 必须能够抓取页面才能读取 `noindex`。本项目按所有者选择立即禁止全部自动抓取，因此不能承诺已有 URL 自动退索引；必要时需在 Google Search Console、Bing 等站长平台申请移除。不能把 robots.txt 和 noindex 的组合当作已完成搜索结果清除的证明。

参考：[Google robots.txt 说明](https://developers.google.com/search/docs/crawling-indexing/robots/intro)、[noindex 与抓取权限](https://developers.google.com/search/docs/crawling-indexing/block-indexing)、[公开 GitHub 仓库的许可与可访问性](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)。

## 内容维护

日常内容集中在 `content.json`，在 GitHub 编辑并提交后，GitHub Pages 会自动更新。

| 字段 | 内容 |
| --- | --- |
| `profile` | 姓名、简介、照片和 Email / GitHub 链接 |
| `research` | 研究方向 |
| `news` | 按新到旧排列的动态 |
| `publications` | 论文和在审稿件；请保留准确状态 |
| `projects` | 研究及课程项目 |
| `experience` | 实验室与实习经历 |
| `education` | 教育背景和课程 |
| `service` | 助教与学生组织经历 |
| `skills` | 编程、建模、硬件、微加工及语言技能 |

内容根据 2026 年 10 月 30 日更新的个人学术资料整理。ARISE 标注为在审稿件；已发表论文链接到期刊及 DOI，DREAM 链接到公开仓库。公开联系信息使用学校邮箱。

JSON 使用英文双引号；同一数组中的记录以逗号分隔，最后一条后不加逗号。正文为纯文本，不需要写 HTML。

论文、项目和经历可使用 `id`、`title`、`period`、`role`、`description`、`bullets`、`links` 字段。论文还支持 `authors` 和 `venue`，项目支持奖项说明 `highlight`。`id` 用于站内跳转，修改时也请更新对应链接。链接可设置 `newTab: true`。

## 文件结构

```text
index.html                 页面结构、初始简介和 SEO 信息
styles.css                 布局、主题、手机适配和滚动渐显
site.js                    内容加载与交互
content.json               个人内容
assets/portrait.jpg        主页照片
assets/fonts/              Source Serif 4 字体及开源许可
.nojekyll                  直接发布静态文件
```

标题使用本地 Source Serif 4 字体：桌面字号 64px，字重 500，字间距 -1px。手机端自动调整。正文 Inter 通过 Google Fonts 加载，失败时使用系统字体。

内容首次进入视口时会缓缓淡入并轻微上移，约 1 秒完成。开启系统“减少动态效果”时，内容直接显示。

## 本地预览

在仓库目录运行：

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

浏览器打开 <http://127.0.0.1:8000/>。

## 部署

GitHub Pages 使用 **main → / (root)**，向 `main` 推送后自动发布。若设置自定义域名，请先拉取 GitHub 创建的 `CNAME` 提交，再推送本地更新。
