const express = require('express');
const path = require('path');
const fs = require('fs');
const { glob } = require('glob');
const matter = require('gray-matter');
const cors = require('cors');

const app = express();
const PORT = 3000;
const CONFIG_FILE = path.join(__dirname, 'config.json');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 加载配置
function loadConfig() {
    if (fs.existsSync(CONFIG_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
        } catch (e) {
            console.error('Error loading config:', e);
        }
    }
    return { skillsDir: 'd:/AI Agent/Skill' }; // 默认路径
}

// 保存配置
function saveConfig(config) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}

app.get('/api/config', (req, res) => {
    res.json(loadConfig());
});

app.post('/api/config', (req, res) => {
    const { skillsDir } = req.body;
    if (!skillsDir) {
        return res.status(400).json({ error: 'skillsDir is required' });
    }
    const config = loadConfig();
    config.skillsDir = skillsDir;
    saveConfig(config);
    res.json({ message: 'Config saved', config });
});

app.get('/api/skills', async (req, res) => {
    const config = loadConfig();
    const SKILLS_DIR = config.skillsDir;

    if (!fs.existsSync(SKILLS_DIR)) {
        return res.json([]);
    }

    try {
        const files = await glob('**/SKILL.md', { cwd: SKILLS_DIR, absolute: true });
        
        const skills = files.map(file => {
            try {
                const content = fs.readFileSync(file, 'utf8');
                const { data, content: body } = matter(content);
                
                const keywordMatch = body.match(/(?:Trigger keywords|When to [uU]se|Triggering [kK]eywords):?\s*\n((?:- .*\n?)+)/i);
                let keywords = keywordMatch 
                    ? keywordMatch[1].split('\n').map(k => k.replace(/^- /, '').trim()).filter(Boolean)
                    : [];

                if (data.keywords && Array.isArray(data.keywords)) {
                    keywords = [...new Set([...keywords, ...data.keywords])];
                } else if (data.keywords && typeof data.keywords === 'string') {
                    const yamlKeywords = data.keywords.split('|').map(k => k.trim());
                    keywords = [...new Set([...keywords, ...yamlKeywords])];
                }

                return {
                    name: data.name || path.basename(path.dirname(file)),
                    description: data.description || '',
                    keywords: keywords,
                    path: file
                };
            } catch (err) {
                console.error(`Error parsing ${file}:`, err);
                return null;
            }
        }).filter(Boolean);

        res.json(skills);
    } catch (error) {
        console.error('Scan error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
