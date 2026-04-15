let allSkills = [];
let currentLang = 'zh';
let selectedCategory = '全部';
let skillsDir = '';

const skillTranslations = {
    'writing-plans': { name: '开发实现计划', desc: '用于多步骤任务的规范或需求，在编写代码之前制定详细的实施计划。' },
    'brainstorming': { name: '头脑风暴', desc: '通过自然的协作对话，帮助将想法转化为完整的设计和规范。' },
    'frontend-design': { name: '前端设计', desc: '创建独特、高生产力的前端界面，具有高设计质量。' },
    'frontend-slides': { name: '前端幻灯片', desc: '从零开始或通过转换PPT/PPTX创建令人惊叹的动画HTML演示文稿。' },
    'sketch-to-web': { name: '草图到网页', desc: '将手绘草图、截图或线框图转换为令人惊叹的生产就绪HTML网页。' },
    'web-prototype': { name: '网页原型克隆', desc: '将实时网页克隆到本地Next.js + Tailwind CSS项目中进行快速原型设计。' },
    'excalidraw-diagram-generator': { name: '图表生成器', desc: '从自然语言描述生成Excalidraw图表，支持流程图、关系图、思维导图等。' },
    'storyboard': { name: '分镜', desc: '创建六帧故事板，展示用户从问题到解决方案的旅程。' },
    'canvas-design': { name: '画布设计', desc: '使用设计理念创建漂亮的视觉艺术作品。' },
    'user-story': { name: '用户故事', desc: '使用Mike Cohn格式和Gherkin验收标准创建用户故事。' },
    'roadmap-planning': { name: '路线图规划', desc: '跨优先级、史诗定义、利益相关者对齐和排序制定战略路线图。' },
    'problem-framing-canvas': { name: '问题框架画布', desc: '引导团队完成MITRE问题框架画布，需要更清晰的问题陈述。' },
    'opportunity-solution-tree': { name: '机会解决方案树', desc: '从结果到机会、解决方案和测试构建机会解决方案树。' },
    'agile-pm-workflow': { name: '敏捷产品经理工作流程', desc: '引导新手PM完成7步敏捷工作流程，包括需求收集、PRD草稿、HTML原型等。' },
    'ui-ux-pro-max': { name: '智能设计', desc: '面向网页和移动端的UI/UX设计智能，支持50+种样式、161+种配色方案等。' },
    'planning-with-files': { name: '文件规划', desc: '像Manus一样工作：使用持久的markdown文件作为"磁盘上的工作内存"。' },
    'using-superpowers': { name: '使用超能力', desc: '在任何对话开始时使用，建立如何查找和使用技能的方法。' },
    'prd': { name: '产品需求文档', desc: '为软件系统和AI功能生成高质量的产品需求文档。' },
    'auto-optimize': { name: '自主评分优化', desc: '面向AI辅助交付的双层工作流程，包含需求规范、多提示外部循环等。' }
};

const categoryMap = {
    'using-superpowers': '通用',
    'brainstorming': '规划',
    'planning-with-files': '规划',
    'writing-plans': '规划',
    'roadmap-planning': '规划',
    'problem-framing-canvas': '规划',
    'opportunity-solution-tree': '规划',
    'prd': '产品设计',
    'user-story': '产品设计',
    'agile-pm-workflow': '产品设计',
    'ui-ux-pro-max': '产品设计',
    'storyboard': '产品设计',
    'canvas-design': '产品设计',
    'frontend-design': '网页开发',
    'frontend-slides': '网页开发',
    'sketch-to-web': '网页开发',
    'web-prototype': '网页开发',
    'excalidraw-diagram-generator': '图表工具',
    'auto-optimize': '效率工具'
};

const categoryInfo = {
    '全部': { icon: 'fa-th-large', color: 'blue' },
    '通用': { icon: 'fa-cube', color: 'slate' },
    '规划': { icon: 'fa-map', color: 'blue' },
    '产品设计': { icon: 'fa-palette', color: 'purple' },
    '网页开发': { icon: 'fa-code', color: 'emerald' },
    '图表工具': { icon: 'fa-chart-bar', color: 'amber' },
    '效率工具': { icon: 'fa-rocket', color: 'rose' }
};

const iconMap = {
    'writing': 'fa-pencil-alt',
    'plan': 'fa-clipboard-list',
    'brainstorm': 'fa-lightbulb',
    'idea': 'fa-brain',
    'design': 'fa-palette',
    'frontend': 'fa-code',
    'slides': 'fa-presentation',
    'web': 'fa-globe',
    'prototype': 'fa-drafting-compass',
    'diagram': 'fa-project-diagram',
    'chart': 'fa-chart-bar',
    'storyboard': 'fa-film',
    'canvas': 'fa-paint-brush',
    'art': 'fa-paint-roller',
    'user': 'fa-user',
    'story': 'fa-book-open',
    'roadmap': 'fa-map',
    'planning': 'fa-route',
    'problem': 'fa-exclamation-circle',
    'question': 'fa-question-circle',
    'opportunity': 'fa-star',
    'solution': 'fa-check-circle',
    'tree': 'fa-tree',
    'agile': 'fa-sync-alt',
    'workflow': 'fa-tasks',
    'pm': 'fa-user-tie',
    'ui': 'fa-object-group',
    'ux': 'fa-users',
    'file': 'fa-file-alt',
    'document': 'fa-file',
    'superpower': 'fa-bolt',
    'power': 'fa-charging-station',
    'prd': 'fa-file-alt',
    'optimize': 'fa-rocket',
    'auto': 'fa-cogs',
    'skill': 'fa-bolt',
    'default': 'fa-bolt'
};

function getIconForSkill(name) {
    const lower = name.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
        if (lower.includes(key)) return icon;
    }
    return 'fa-bolt';
}

function getSkillTranslation(name) {
    return skillTranslations[name] || null;
}

function getCategoryForSkill(name) {
    return categoryMap[name] || '通用';
}

function copyToClipboard(text, event) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback(event.target, '已复制!');
        }).catch(() => {
            fallbackCopy(text, event);
        });
    } else {
        fallbackCopy(text, event);
    }
}

function fallbackCopy(text, event) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        showCopyFeedback(event.target, '已复制!');
    } catch (err) {
        showCopyFeedback(event.target, '复制失败');
    }
    document.body.removeChild(textarea);
}

function showCopyFeedback(element, message) {
    const original = element.innerHTML;
    element.innerHTML = `<span class="text-xs">${message}</span>`;
    setTimeout(() => { element.innerHTML = original; }, 1500);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const sidebarCollapsed = document.getElementById('sidebarCollapsed');
    sidebar.classList.toggle('hidden');
    sidebarCollapsed.classList.toggle('hidden');
}

function selectCategory(category) {
    selectedCategory = category;
    hideSettings();
    renderSidebar();
    const term = document.getElementById('searchInput').value.toLowerCase().trim();
    filterSkills(term);
}

function toggleLang() {
    currentLang = currentLang === 'zh' ? 'en' : 'zh';
    const btn = document.getElementById('langToggle');
    btn.innerHTML = currentLang === 'zh' ? '<i class="fas fa-language mr-1"></i>EN' : '<i class="fas fa-language mr-1"></i>中文';
    const term = document.getElementById('searchInput').value.toLowerCase().trim();
    filterSkills(term);
}

function showSettings() {
    document.getElementById('mainContent').classList.add('hidden');
    document.getElementById('settingsView').classList.remove('hidden');
    document.getElementById('skillsDirInput').value = skillsDir;
}

function hideSettings() {
    document.getElementById('mainContent').classList.remove('hidden');
    document.getElementById('settingsView').classList.add('hidden');
}

async function saveSettings() {
    const newDir = document.getElementById('skillsDirInput').value.trim();
    if (!newDir) return alert('请输入有效的路径');
    
    try {
        const res = await fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ skillsDir: newDir })
        });
        if (res.ok) {
            skillsDir = newDir;
            alert('设置已保存，正在重新加载技能...');
            hideSettings();
            fetchSkills();
        }
    } catch (error) {
        alert('保存失败: ' + error.message);
    }
}

async function fetchConfig() {
    try {
        const res = await fetch('/api/config');
        if (!res.ok) throw new Error('API request failed');
        const config = await res.json();
        skillsDir = config.skillsDir;
    } catch (error) {
        console.error('Fetch config error:', error);
    }
}

async function fetchSkills() {
    const loading = document.getElementById('loading');
    const grid = document.getElementById('skillsGrid');
    const empty = document.getElementById('emptyState');
    
    loading.classList.remove('hidden');
    grid.innerHTML = '';
    empty.classList.add('hidden');
    
    try {
        const res = await fetch('/api/skills');
        allSkills = await res.json();
        
        loading.classList.add('hidden');
        renderSidebar();
        filterSkills('');

        document.getElementById('searchInput').addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            filterSkills(term);
        });
    } catch (error) {
        console.error('Fetch error:', error);
        loading.innerHTML = `<p class="text-red-500">无法获取技能数据，请确保后端服务已启动。</p>`;
    }
}

function filterSkills(term) {
    let filtered = allSkills;
    
    if (selectedCategory !== '全部') {
        filtered = filtered.filter(s => getCategoryForSkill(s.name) === selectedCategory);
    }
    
    if (term) {
        filtered = filtered.filter(skill => {
            const trans = getSkillTranslation(skill.name);
            const name = trans ? trans.name : skill.name;
            const desc = trans ? trans.desc : skill.description;
            return name.toLowerCase().includes(term) || 
                   desc.toLowerCase().includes(term) ||
                   skill.keywords.some(k => k.toLowerCase().includes(term));
        });
    }
    
    renderSkills(filtered);
}

function renderSidebar() {
    const categoryList = document.getElementById('categoryList');
    const collapsedCategories = document.getElementById('collapsedCategories');
    
    const categories = ['全部', '通用', '规划', '产品设计', '网页开发', '图表工具', '效率工具'];
    
    categoryList.innerHTML = categories.map(cat => {
        const info = categoryInfo[cat];
        const isActive = selectedCategory === cat;
        const activeClass = isActive ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'text-slate-400 hover:bg-slate-700/50 border-transparent';
        
        return `
            <div onclick="selectCategory('${cat}')" class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${activeClass}">
                <i class="fas ${info.icon} w-5 text-center"></i>
                <span class="text-sm font-medium">${cat}</span>
            </div>
        `;
    }).join('');
    
    collapsedCategories.innerHTML = categories.map(cat => {
        const info = categoryInfo[cat];
        const isActive = selectedCategory === cat;
        const activeClass = isActive ? 'text-blue-400 bg-blue-500/20' : 'text-slate-500 hover:text-slate-300';
        
        return `
            <div onclick="selectCategory('${cat}')" title="${cat}" class="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all ${activeClass}">
                <i class="fas ${info.icon}"></i>
            </div>
        `;
    }).join('');
}

function renderSkills(skills) {
    const grid = document.getElementById('skillsGrid');
    const empty = document.getElementById('emptyState');
    
    if (skills.length === 0) {
        grid.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }
    
    empty.classList.add('hidden');
    
    grid.innerHTML = skills.map(skill => {
        const trans = getSkillTranslation(skill.name);
        const displayName = currentLang === 'zh' && trans ? trans.name : skill.name;
        const displayDesc = currentLang === 'zh' && trans ? trans.desc : skill.description;
        const icon = getIconForSkill(skill.name);
        
        return `
            <div class="skill-card group p-6 rounded-2xl border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden">
                <div class="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
                
                <div class="relative z-10">
                    <div class="flex items-start justify-between mb-4">
                        <div class="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                            <i class="fas ${icon} text-xl"></i>
                        </div>
                    </div>
                    
                    <h3 class="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                        ${displayName}
                        <i onclick="copyToClipboard('${skill.name}', event)" class="fas fa-copy text-xs text-slate-500 hover:text-blue-400 cursor-pointer transition-colors p-1" title="复制技能名称"></i>
                    </h3>
                    
                    <p class="text-slate-400 text-sm leading-relaxed mb-4 overflow-y-auto max-h-24 scrollbar-thin">
                        ${displayDesc || '暂无描述信息'}
                    </p>
                    
                    <div class="space-y-4">
                        ${skill.keywords.length > 0 
                            ? `<div class="flex flex-wrap gap-2">${skill.keywords.map(k => `<span class="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-medium text-emerald-400 uppercase tracking-wider">${k}</span>`).join('')}</div>`
                            : ''
                        }
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchConfig();
    fetchSkills();
});
