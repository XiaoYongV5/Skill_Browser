# Trae Skill Browser Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 开发一个 Node.js 网页应用，动态扫描并展示 `d:\AI Agent\Skill` 目录下的技能信息。

**Architecture:** 采用 Express 作为后端服务，负责文件扫描和解析；前端使用原生 JS + Tailwind CSS 实现响应式网格布局和实时搜索。

**Tech Stack:** Node.js, Express, gray-matter, glob, Tailwind CSS.

---

### Task 1: 初始化项目环境

**Files:**
- Create: `package.json`
- Create: `.gitignore`

**Step 1: 创建 package.json 并安装依赖**
```json
{
  "name": "skill-browser",
  "version": "1.0.0",
  "description": "Trae Skill Browser",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "gray-matter": "^4.0.3",
    "glob": "^10.3.10",
    "cors": "^2.8.5"
  }
}
```
Run: `npm install`

**Step 2: 创建 .gitignore**
```text
node_modules
.DS_Store
```

**Step 3: Commit**
```bash
git add package.json .gitignore
git commit -m "chore: init project and install dependencies"
```

---

### Task 2: 实现后端 API 逻辑

**Files:**
- Create: `server.js`

**Step 1: 编写 server.js 核心逻辑**
包含文件扫描、YAML 解析和关键词提取逻辑。
```javascript
const express = require('express');
const path = require('path');
const fs = require('fs');
const { glob } = require('glob');
const matter = require('gray-matter');
const cors = require('cors');

const app = express();
const PORT = 3000;
const SKILLS_DIR = 'd:/AI Agent/Skill';

app.use(cors());
app.use(express.static('public'));

app.get('/api/skills', async (req, res) => {
    try {
        const files = await glob('**/SKILL.md', { cwd: SKILLS_DIR, absolute: true });
        const skills = files.map(file => {
            const content = fs.readFileSync(file, 'utf8');
            const { data, content: body } = matter(content);
            
            // 提取关键词逻辑：查找 "Trigger keywords" 或 "When to Use" 部分
            const keywordMatch = body.match(/(?:Trigger keywords|When to [uU]se):?\s*\n((?:- .*\n?)+)/i);
            const keywords = keywordMatch 
                ? keywordMatch[1].split('\n').map(k => k.replace(/^- /, '').trim()).filter(Boolean)
                : [];

            return {
                name: data.name || path.basename(path.dirname(file)),
                description: data.description || '',
                keywords: keywords,
                path: file
            };
        });
        res.json(skills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
```

**Step 2: 运行并验证接口**
Run: `node server.js`
Expected: 访问 `http://localhost:3000/api/skills` 返回 JSON 数组。

**Step 3: Commit**
```bash
git add server.js
git commit -m "feat: implement backend API for scanning skills"
```

---

### Task 3: 实现前端界面

**Files:**
- Create: `public/index.html`
- Create: `public/script.js`
- Create: `public/style.css`

**Step 1: 编写 index.html**
使用 Tailwind CDN 进行快速开发。
```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Trae Skill Browser</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <header class="mb-12 text-center">
            <h1 class="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Trae Skill Browser
            </h1>
            <div class="max-w-xl mx-auto relative">
                <input type="text" id="searchInput" placeholder="搜索技能或关键词..." 
                    class="w-full bg-slate-800 border border-slate-700 rounded-xl px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
            </div>
        </header>

        <div id="skillsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- 技能卡片将在这里动态生成 -->
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

**Step 2: 编写 script.js**
处理数据请求和实时搜索。
```javascript
async function fetchSkills() {
    const res = await fetch('/api/skills');
    const skills = await res.json();
    renderSkills(skills);
    
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = skills.filter(s => 
            s.name.toLowerCase().includes(term) || 
            s.description.toLowerCase().includes(term) ||
            s.keywords.some(k => k.toLowerCase().includes(term))
        );
        renderSkills(filtered);
    });
}

function renderSkills(skills) {
    const grid = document.getElementById('skillsGrid');
    grid.innerHTML = skills.map(skill => `
        <div class="skill-card p-6 rounded-2xl border border-slate-700 hover:border-blue-500 transition-all cursor-pointer">
            <h3 class="text-xl font-bold mb-2 text-blue-400">${skill.name}</h3>
            <p class="text-slate-400 text-sm mb-4 line-clamp-2">${skill.description}</p>
            <div class="flex flex-wrap gap-2">
                ${skill.keywords.map(k => `<span class="px-2 py-1 bg-slate-700 rounded text-xs text-emerald-400">${k}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

fetchSkills();
```

**Step 3: 编写 style.css**
添加磨砂玻璃效果。
```css
.skill-card {
    background: rgba(30, 41, 59, 0.7);
    backdrop-filter: blur(10px);
}
.skill-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.3);
}
```

**Step 4: Commit**
```bash
git add public/
git commit -m "feat: implement frontend UI and search functionality"
```

---

### Task 4: 最终测试与部署

**Step 1: 启动服务并预览**
Run: `npm start`
Expected: 访问 `http://localhost:3000` 看到精美的技能库界面。

**Step 2: 验证动态更新**
在 `d:\AI Agent\Skill` 下新建一个测试技能文件夹及 `SKILL.md`，刷新网页看是否自动出现。
