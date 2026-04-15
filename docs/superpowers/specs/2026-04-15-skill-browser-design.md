# Trae Skill Browser 设计文档

## 1. 概述 (Executive Summary)
**问题描述**: Trae 中安装的技能分散在多个文件夹中，难以快速预览各技能的核心功能、使用场景及触发关键词。
**解决方案**: 开发一个基于 Node.js 的本地网页应用，通过动态扫描 `d:\AI Agent\Skill` 目录，实时提取并展示所有已安装技能的详细信息。

**成功标准**:
- 自动发现所有 `SKILL.md` 文件。
- 提取并展示：技能名称、核心描述、触发关键词。
- 提供实时搜索过滤功能。
- 点击可预览 Markdown 完整内容。

## 2. 用户体验与功能 (User Experience & Functionality)
### 用户故事
- 作为开发者，我希望在一个界面看到所有技能，以便我能快速决定在当前任务中使用哪个。
- 作为开发者，我希望通过关键词搜索技能，以便快速找到特定功能的处理工具。

### 功能点
- **动态扫描**: 每次请求接口时实时扫描文件系统。
- **信息提取**: 
  - 从 YAML Front Matter 提取 `name` 和 `description`。
  - 从正文提取 `Trigger keywords` 或 `When to use` 部分作为关键词。
- **UI 界面**: 
  - 响应式网格布局。
  - 搜索栏实时过滤。
  - 磨砂玻璃质感卡片设计。

## 3. 技术规范 (Technical Specifications)
### 后端 (Server)
- **技术栈**: Node.js + Express
- **核心库**: 
  - `gray-matter`: 解析 Markdown YAML。
  - `glob`: 递归查找文件。
  - `cors`: 处理跨域。
- **API 接口**:
  - `GET /api/skills`: 返回解析后的技能列表。
  - `GET /api/skill-content?path=...`: 返回单个技能的 Markdown 原文。

### 前端 (Frontend)
- **技术栈**: HTML5 + Tailwind CSS + Lucide Icons + Vue/React (简易版可使用原生 JS + Template)。
- **样式风格**: 现代、简洁、深色模式支持、Bento Grid 布局。

## 4. 目录结构
```text
skill-browser/
├── server.js          # 后端服务
├── public/            # 前端静态文件
│   ├── index.html
│   ├── script.js
│   └── style.css
├── package.json
└── docs/              # 文档
```

## 5. 风险与路线图 (Risks & Roadmap)
- **风险**: 文件路径包含特殊字符可能导致扫描失败。
- **阶段 1**: 实现基础扫描和卡片展示。
- **阶段 2**: 增加技能分类标签。
- **阶段 3**: 支持在网页端直接编辑技能描述。
