# 个人主页

主页地址：<https://freddy-hexas.github.io/>

这是一个适合逐步填写的个人主页，使用 HTML、CSS 和 JavaScript，无需安装依赖或运行构建。页面布局参考 [shiyicao.com](https://shiyicao.com/)，代码独立编写，未使用对方的个人资料、照片或论文内容。

## 以后如何填内容

日常只需编辑 `content.json`。在 GitHub 打开这个文件，点击铅笔图标，修改后选择 **Commit changes**，网站会自动重新发布。

| 字段 | 用途 |
| --- | --- |
| `profile.name` | 英文姓名、导航名称和网页标题 |
| `profile.nameChinese` | 中文姓名；留空则隐藏 |
| `profile.description` | 搜索结果中的网页简介 |
| `profile.tagline` | 身份或单位；留空则隐藏 |
| `profile.bio` | 简介段落，每个字符串为一段 |
| `profile.photo` | 照片路径，例如 `assets/photo.jpg` |
| `profile.photoAlt` | 照片文字描述 |
| `profile.links` | 邮箱、简历、GitHub、Scholar 等链接 |
| `research` | 研究方向 |
| `news` | 动态，按数组顺序显示，前四条以外可以展开 |
| `publications` | 论文 |
| `openSource` | 开源项目 |
| `talks` | 报告和演讲 |
| `blog` | 博客文章链接 |

数组留为 `[]` 时显示简洁的待更新提示。填写后自动替换提示。所有正文为纯文本，不需要写 HTML。下面的示例仅供填写参考，未添加到网站。

### 简介、照片、邮箱和简历

把照片或 PDF 上传到仓库的 `assets` 目录，再修改对应字段。例如：

```json
"bio": ["第一段简介。", "第二段简介。"],
"photo": "assets/photo.jpg",
"links": [
  { "label": "Email", "url": "mailto:your-email@example.com" },
  { "label": "CV", "url": "assets/cv.pdf" },
  { "label": "GitHub", "url": "https://github.com/Freddy-Hexas" }
]
```

没有照片时保留占位图；没有填写的联系方式不会生成无效按钮。请使用你自己的邮箱替换示例邮箱。

### 研究方向

```json
"research": [
  {
    "title": "方向名称",
    "description": "简短说明。",
    "url": "",
    "links": []
  }
]
```

### 动态和报告

`news`、`talks` 使用相同结构，最新一条放在前面。日期作为文字原样显示。

```json
"news": [
  { "date": "Nov '26", "text": "一条动态。", "url": "" }
]
```

### 论文和开源项目

`publications`、`openSource` 使用相同结构。不需要的字段可以留空或省略。

```json
"publications": [
  {
    "title": "论文标题",
    "url": "https://example.com/paper",
    "authors": "作者列表",
    "venue": "会议或期刊 · 年份",
    "description": "简短说明或关键词。",
    "links": [
      { "label": "Paper", "url": "https://example.com/paper" },
      { "label": "Code", "url": "https://github.com/owner/repository" }
    ]
  }
]
```

### 博客

```json
"blog": [
  {
    "date": "Nov '26",
    "title": "文章标题",
    "description": "可选的一句话摘要。",
    "url": "https://example.com/post"
  }
]
```

博客目前是文章链接列表。以后可以在本仓库增加文章 HTML，或链接到已有博客。

JSON 使用英文双引号，数组内多条记录之间用逗号分隔，最后一条后面不要加逗号。

## 文件结构

```text
index.html       页面结构和栏目标题
styles.css       布局、颜色和手机适配
site.js          内容加载、主题和导航交互
content.json     你的个人内容
favicon.svg      网站图标
assets/          以后可创建此目录，存放照片、简历等文件
.nojekyll        让 GitHub Pages 直接发布静态文件
```

栏目名称可以在 `index.html` 中修改。网站支持系统深色模式、记住手动切换的主题、手机菜单和键盘操作。字体来自 Google Fonts，加载失败会自动使用系统字体。

## GitHub Pages 设置

仓库名称应为 `freddy-hexas.github.io`。进入 **Settings → Pages**：

1. Source 选择 **Deploy from a branch**。
2. Branch 选择 **main**，目录选择 **/ (root)**。
3. 点击 **Save**，等待部署完成。

此后每次向 `main` 提交修改，GitHub Pages 会自动更新。网站使用相对资源路径，不依赖其他托管服务。

## 本地预览

在此目录运行：

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

浏览器访问 <http://127.0.0.1:8000/>。请通过本地服务器预览，让 `content.json` 正常加载。
