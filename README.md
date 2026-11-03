# Fang Xu · Personal Homepage

主页：<https://freddy-hexas.github.io/>

个人学术主页，使用 HTML、CSS、JavaScript 和静态资源，无需构建即可部署。布局参考 [shiyicao.com](https://shiyicao.com/)，代码独立实现。

## 内容维护

日常内容集中在 `content.json`，在 GitHub 编辑并提交后，GitHub Pages 会自动更新。

| 字段 | 内容 |
| --- | --- |
| `profile` | 姓名、简介、照片和 Email / CV / GitHub 链接 |
| `research` | 研究方向 |
| `news` | 按新到旧排列的动态 |
| `publications` | 论文和在审稿件；请保留准确状态 |
| `projects` | 研究及课程项目 |
| `experience` | 实验室与实习经历 |
| `education` | 教育背景和课程 |
| `service` | 助教与学生组织经历 |
| `skills` | 编程、建模、硬件、微加工及语言技能 |

内容根据 2026 年 10 月 30 日更新的学术 CV 整理。ARISE 标注为在审稿件；已发表论文链接到期刊及 DOI，DREAM 链接到公开仓库。公开联系信息使用学校邮箱。

JSON 使用英文双引号；同一数组中的记录以逗号分隔，最后一条后不加逗号。正文为纯文本，不需要写 HTML。

论文、项目和经历可使用 `id`、`title`、`period`、`role`、`description`、`bullets`、`links` 字段。论文还支持 `authors` 和 `venue`，项目支持奖项说明 `highlight`。`id` 用于站内跳转，修改时也请更新对应链接。链接可设置 `newTab: true`。

## 文件结构

```text
index.html                 页面结构、初始简介和 SEO 信息
styles.css                 布局、主题、手机适配和滚动渐显
site.js                    内容加载与交互
content.json               个人内容
assets/portrait.jpg        主页照片
assets/Fang-Xu-CV.pdf       可公开下载的学术 CV
assets/fonts/              Source Serif 4 字体及开源许可
scripts/build_cv.py        从 content.json 生成公开 CV
.nojekyll                  直接发布静态文件
```

标题使用本地 Source Serif 4 字体：桌面字号 64px，字重 500，字间距 -1px。手机端自动调整。正文 Inter 通过 Google Fonts 加载，失败时使用系统字体。

内容首次进入视口时会缓缓淡入并轻微上移，约 1 秒完成。开启系统“减少动态效果”时，内容直接显示。

## 更新公开 CV

PDF 是静态文件。更新网页 JSON 后如需同步 CV，请在装有 ReportLab 的 Python 3.9+ 环境运行：

```sh
python3 scripts/build_cv.py
```

生成的公开版 CV 使用学校邮箱、GitHub 和主页链接，未加入私人电话号码。修改后检查 PDF 排版，再一起提交。

## 本地预览

在仓库目录运行：

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

浏览器打开 <http://127.0.0.1:8000/>。

## 部署

GitHub Pages 使用 **main → / (root)**，向 `main` 推送后自动发布。若设置自定义域名，请先拉取 GitHub 创建的 `CNAME` 提交，再推送本地更新。
