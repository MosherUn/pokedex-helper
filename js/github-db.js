/**
 * GitHub 数据库模块
 * 数据存储在 re_of_pokemon 仓库
 */

// ===== 从 localStorage 读取配置 =====
function getGitHubConfig() {
    try {
        const saved = localStorage.getItem('github_config');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (e) {}
    return null;
}

function saveGitHubConfigToLocal(config) {
    localStorage.setItem('github_config', JSON.stringify(config));
}

// ===== 默认配置 =====
let CONFIG = getGitHubConfig() || {
    owner: '',
    repo: 're_of_pokemon',
    token: '',
    path: 'data/pokedex.json',
    branch: 'main'
};

function getApiBase() {
    return `https://api.github.com/repos/${CONFIG.owner}/${CONFIG.repo}/contents`;
}

let syncStatus = 'idle';
let lastSyncTime = null;
let syncError = null;

// ===== 从 GitHub 读取数据 =====
async function fetchFromGitHub() {
    if (!CONFIG.token || !CONFIG.owner || !CONFIG.repo) {
        syncStatus = 'error';
        syncError = '请先配置 GitHub（点击右上角 ⚙️）';
        updateSyncUI();
        return { data: null, sha: null, error: '未配置' };
    }

    try {
        syncStatus = 'syncing';
        updateSyncUI();
        
        const url = `${getApiBase()}/${CONFIG.path}?ref=${CONFIG.branch}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `token ${CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.status === 404) {
            syncStatus = 'success';
            lastSyncTime = new Date();
            updateSyncUI();
            return { data: null, sha: null };
        }

        if (response.status === 401) {
            throw new Error('Token 无效，请重新配置');
        }

        if (!response.ok) {
            throw new Error(`GitHub API 错误: ${response.status}`);
        }

        const result = await response.json();
        const content = atob(result.content);
        const data = JSON.parse(content);
        
        syncStatus = 'success';
        lastSyncTime = new Date();
        syncError = null;
        updateSyncUI();
        
        return { data, sha: result.sha };
    } catch (error) {
        syncStatus = 'error';
        syncError = error.message;
        updateSyncUI();
        console.error('[GitHub DB] 读取失败:', error);
        return { data: null, sha: null, error: error.message };
    }
}

// ===== 写入数据到 GitHub =====
async function saveToGitHub(data, commitMessage = '更新图鉴数据') {
    if (!CONFIG.token || !CONFIG.owner || !CONFIG.repo) {
        syncStatus = 'error';
        syncError = '请先配置 GitHub';
        updateSyncUI();
        return { success: false, error: '未配置' };
    }

    try {
        syncStatus = 'syncing';
        updateSyncUI();
        
        const current = await fetchFromGitHub();
        const sha = current.sha;
        
        const content = btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2))));
        
        const body = {
            message: commitMessage,
            content: content,
            branch: CONFIG.branch
        };
        if (sha) {
            body.sha = sha;
        }
        
        const url = `${getApiBase()}/${CONFIG.path}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${CONFIG.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP ${response.status}`);
        }

        const result = await response.json();
        
        syncStatus = 'success';
        lastSyncTime = new Date();
        syncError = null;
        updateSyncUI();
        
        return { success: true, data: result };
    } catch (error) {
        syncStatus = 'error';
        syncError = error.message;
        updateSyncUI();
        console.error('[GitHub DB] 保存失败:', error);
        return { success: false, error: error.message };
    }
}

// ===== 同步所有数据到 GitHub =====
async function syncAllDataToGitHub() {
    const allData = {
        pet: PetDict,
        item: ItemList,
        skill: SkillDict,
        wear: WEARABLES,
        _meta: {
            lastUpdated: new Date().toISOString(),
            totalPets: Object.keys(PetDict).length,
            totalItems: ItemList.length,
            totalSkills: Object.keys(SkillDict).length,
            totalWears: Object.keys(WEARABLES).length,
            version: '3.0'
        }
    };
    return await saveToGitHub(allData, '同步图鉴数据');
}

// ===== 从 GitHub 加载数据 =====
async function loadFromGitHub() {
    const result = await fetchFromGitHub();
    if (result.data) {
        const data = result.data;
        if (data.pet) {
            Object.keys(data.pet).forEach(key => {
                PetDict[key] = data.pet[key];
            });
        }
        if (data.item) {
            const defaultIds = ItemListDefault.map(i => i.id);
            const newItems = data.item.filter(i => !defaultIds.includes(i.id));
            ItemList.push(...newItems);
        }
        if (data.skill) {
            Object.assign(SkillDict, data.skill);
        }
        if (data.wear) {
            Object.assign(WEARABLES, data.wear);
        }
        saveCustomData();
        return { success: true, data };
    }
    return { success: false, error: result.error };
}

function updateSyncUI() {
    const statusElement = document.getElementById('syncStatus');
    if (!statusElement) return;
    
    const statusMap = {
        'idle': { text: '⏸️ 已就绪', color: 'rgba(255,255,255,0.15)' },
        'syncing': { text: '🔄 同步中...', color: '#fbbf24' },
        'success': { text: '✅ 已同步', color: '#4ade80' },
        'error': { text: `❌ ${syncError || '同步失败'}`, color: '#f87171' }
    };
    
    const status = statusMap[syncStatus] || statusMap['idle'];
    statusElement.textContent = status.text;
    statusElement.style.color = status.color;
    
    const timeElement = document.getElementById('lastSyncTime');
    if (timeElement) {
        timeElement.textContent = lastSyncTime ? `上次同步: ${lastSyncTime.toLocaleString()}` : '';
        timeElement.style.color = 'rgba(255,255,255,0.15)';
    }
}

// ===== 导出/导入功能 =====
function exportAllData() {
    return {
        pet: PetDict,
        item: ItemList,
        skill: SkillDict,
        wear: WEARABLES,
        _meta: {
            exportedAt: new Date().toISOString(),
            version: '3.0',
            totalPets: Object.keys(PetDict).length,
            totalItems: ItemList.length,
            totalSkills: Object.keys(SkillDict).length,
            totalWears: Object.keys(WEARABLES).length
        }
    };
}

function downloadDataAsFile() {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pokedex_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function importAllData(data) {
    if (data.pet) { Object.assign(PetDict, data.pet); }
    if (data.item) {
        const existingIds = ItemList.map(i => i.id);
        data.item.forEach(item => {
            if (!existingIds.includes(item.id)) {
                ItemList.push(item);
            }
        });
    }
    if (data.skill) { Object.assign(SkillDict, data.skill); }
    if (data.wear) { Object.assign(WEARABLES, data.wear); }
    saveCustomData();
    return true;
}

function importDataFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                importAllData(data);
                saveCustomData();
                resolve(data);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

updateSyncUI();
console.log('[GitHub DB] 数据存储仓库: re_of_pokemon');
