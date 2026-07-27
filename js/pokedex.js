/**
 * pokedex.js - 图鉴核心功能
 * 包含：图鉴渲染、搜索、筛选、详情、管理面板、GitHub同步
 */

// ===== DOM 引用 =====
const grid = document.getElementById('pokedexGrid');
const searchInput = document.getElementById('searchInput');
const filterTabs = document.getElementById('filterTabs');
const categoryTabs = document.getElementById('categoryTabs');
const totalCount = document.getElementById('totalCount');
const resultCount = document.getElementById('resultCount');

const detailModal = document.getElementById('detailModal');
const detailTitle = document.getElementById('detailTitle');
const detailBody = document.getElementById('detailBody');
const detailCloseBtn = document.getElementById('detailCloseBtn');

// ===== 状态 =====
let currentCategory = 'pet';
let currentFilter = 'all';
let currentSearch = '';
let isAdmin = false;

// ===== 获取当前数据 =====
function getCurrentData() {
    if (currentCategory === 'pet') {
        return Object.entries(PetDict).map(([id, data]) => ({ 
            id, ...data, _category: 'pet', 
            _searchFields: [data.name, data.type, data.subject, data.desc || ''] 
        }));
    } else if (currentCategory === 'item') {
        return ItemList.map(item => ({ 
            ...item, _category: 'item', 
            _searchFields: [item.name, item.type, item.desc || ''] 
        }));
    } else if (currentCategory === 'skill') {
        return Object.entries(SkillDict).map(([name, data]) => ({ 
            id: name, name, ...data, _category: 'skill', 
            _searchFields: [name, data.text, data.type || ''] 
        }));
    } else if (currentCategory === 'wear') {
        return Object.entries(WEARABLES).map(([name, data]) => ({ 
            id: name, name, ...data, _category: 'wear', 
            _searchFields: [name, data.part, data.desc || ''] 
        }));
    }
    return [];
}

// ===== 获取筛选选项 =====
function getFilterOptions() {
    if (currentCategory === 'pet') {
        return ['全部', '金', '木', '水', '火', '土', 'BOSS'];
    }
    if (currentCategory === 'item') {
        const map = { 
            'ball': '捕捉球', 'ball2': '变异球', 'heal': '治疗', 
            'elem': '灵石', 'coin': '金币', 'exp': '经验', 
            'score': '排行', 'addMaxPets': '扩容' 
        };
        return ['全部', ...new Set(ItemList.map(i => map[i.type] || i.type))];
    }
    if (currentCategory === 'skill') {
        return ['全部', ...new Set(Object.values(SkillDict).map(s => s.type || '其他'))];
    }
    if (currentCategory === 'wear') {
        const map = { 
            'head': '头部', 'torso': '躯干', 'body': '身体', 
            'righthand': '右手', 'lefthand': '左手' 
        };
        return ['全部', ...new Set(Object.values(WEARABLES).map(w => map[w.part] || w.part))];
    }
    return ['全部'];
}

// ===== 获取类型标签样式 =====
function getTypeClass(value) {
    if (currentCategory === 'pet') {
        return value === 'BOSS' ? 'type-boss' : `type-${value}`;
    }
    if (currentCategory === 'item') {
        const map = { 
            'ball': 'type-ball', 'ball2': 'type-ball2', 'heal': 'type-heal', 
            'elem': 'type-elem', 'coin': 'type-coin', 'exp': 'type-exp', 
            'score': 'type-score', 'addMaxPets': 'type-addMaxPets' 
        };
        return map[value] || '';
    }
    if (currentCategory === 'wear') {
        const map = { 
            'head': 'type-head', 'torso': 'type-torso', 'body': 'type-body', 
            'righthand': 'type-righthand', 'lefthand': 'type-lefthand' 
        };
        return map[value] || '';
    }
    return '';
}

// ===== 获取类型显示名称 =====
function getTypeLabel(value) {
    if (currentCategory === 'pet') {
        return value === 'BOSS' ? '👑 BOSS' : value;
    }
    if (currentCategory === 'item') {
        const map = { 
            'ball': '捕捉球', 'ball2': '变异球', 'heal': '治疗', 
            'elem': '灵石', 'coin': '金币', 'exp': '经验', 
            'score': '排行', 'addMaxPets': '扩容' 
        };
        return map[value] || value;
    }
    if (currentCategory === 'wear') {
        const map = { 
            'head': '头部', 'torso': '躯干', 'body': '身体', 
            'righthand': '右手', 'lefthand': '左手' 
        };
        return map[value] || value;
    }
    return value || '其他';
}

// ===== 渲染筛选标签 =====
function renderFilters() {
    const options = getFilterOptions();
    filterTabs.innerHTML = options.map(opt => `
        <button class="filter-tab ${opt === currentFilter || (opt === '全部' && currentFilter === 'all') ? 'active' : ''}" 
                data-filter="${opt === '全部' ? 'all' : opt}">
            ${opt}
        </button>
    `).join('');

    filterTabs.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            renderPokedex();
        });
    });
}

// ===== 渲染图鉴 =====
function renderPokedex() {
    const data = getCurrentData();
    const filtered = data.filter(item => {
        const searchMatch = !currentSearch || 
            item._searchFields.some(f => String(f).toLowerCase().includes(currentSearch.toLowerCase()));
        
        let filterMatch = true;
        if (currentFilter !== 'all') {
            if (currentCategory === 'pet') {
                filterMatch = item.type === currentFilter || 
                             (currentFilter === 'BOSS' && item.type === 'boss');
            } else if (currentCategory === 'item') {
                const map = { 
                    '捕捉球': 'ball', '变异球': 'ball2', '治疗': 'heal',
                    '灵石': 'elem', '金币': 'coin', '经验': 'exp',
                    '排行': 'score', '扩容': 'addMaxPets' 
                };
                filterMatch = item.type === (map[currentFilter] || currentFilter);
            } else if (currentCategory === 'skill') {
                filterMatch = (item.type || '其他') === currentFilter;
            } else if (currentCategory === 'wear') {
                const map = { 
                    '头部': 'head', '躯干': 'torso', '身体': 'body',
                    '右手': 'righthand', '左手': 'lefthand' 
                };
                filterMatch = item.part === (map[currentFilter] || currentFilter);
            }
        }
        return searchMatch && filterMatch;
    });

    totalCount.textContent = `共 ${data.length} 项`;
    resultCount.textContent = `显示 ${filtered.length} 项`;

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="icon">🔍</div>
                <div class="text">没有找到匹配的内容</div>
                <div style="font-size:13px;color:rgba(255,255,255,0.1);margin-top:4px;">试试调整搜索或筛选条件</div>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(item => {
        const typeLabel = getTypeLabel(item.type || item.part);
        const typeClass = getTypeClass(item.type || item.part);
        let subInfo = '', descPreview = '';

        if (currentCategory === 'pet') {
            subInfo = `📚 ${item.subject}`;
            descPreview = item.desc ? item.desc.slice(0, 30) + (item.desc.length > 30 ? '...' : '') : '';
        } else if (currentCategory === 'item') {
            descPreview = item.desc ? item.desc.slice(0, 35) + (item.desc.length > 35 ? '...' : '') : '';
        } else if (currentCategory === 'skill') {
            subInfo = `MP: ${item.mp}`;
            descPreview = item.text ? item.text.slice(0, 30) + (item.text.length > 30 ? '...' : '') : '';
        } else if (currentCategory === 'wear') {
            subInfo = `📐 ${Array.isArray(item.scale) ? item.scale.join('×') : item.scale}`;
            descPreview = item.desc ? item.desc.slice(0, 30) + (item.desc.length > 30 ? '...' : '') : '';
        }

        const itemId = item.id || item.name;
        return `
            <div class="pokedex-card" onclick="showDetail('${currentCategory}', '${itemId}')">
                <div class="name">${item.name}</div>
                <span class="tag ${typeClass}">${typeLabel}</span>
                ${subInfo ? `<div class="sub-info">${subInfo}</div>` : ''}
                ${descPreview ? `<div class="desc-preview">${descPreview}</div>` : ''}
            </div>
        `;
    }).join('');
}

// ===== 显示详情 =====
function showDetail(category, id) {
    let item, title, html = '';

    if (category === 'pet') {
        item = PetDict[id];
        if (!item) return;
        
        const isBoss = item.type === 'boss';
        const typeClass = isBoss ? 'type-boss' : `type-${item.type}`;
        const typeLabel = isBoss ? '👑 BOSS' : item.type;
        
        // 进化信息
        let evolveHtml = '';
        if (item.evolveFrom) {
            const fromPet = PetDict[item.evolveFrom];
            evolveHtml += `
                <div class="detail-tip" style="border-left-color: #fbbf24;">
                    🔄 进化自：<strong>${fromPet ? fromPet.name : item.evolveFrom}</strong>
                    ${item.evolveItem ? `（需要 ${item.evolveItem}）` : ''}
                </div>
            `;
        }
        if (item.evolveTo) {
            const toPet = PetDict[item.evolveTo];
            evolveHtml += `
                <div class="detail-tip" style="border-left-color: #4ade80;">
                    ⬆️ 可进化至：<strong>${toPet ? toPet.name : item.evolveTo}</strong>
                    ${item.evolveItem ? `（需要 ${item.evolveItem}）` : ''}
                </div>
            `;
        }
        if (!item.evolveFrom && !item.evolveTo && !isBoss) {
            evolveHtml = `
                <div class="detail-tip" style="border-left-color: #60a5fa;">
                    ✨ 最终形态，无法继续进化
                </div>
            `;
        }

        // 属性计算器
        let statsHtml = '';
        if (item._atk !== undefined) {
            const defaultLevel = 50;
            const stats = calcPetStats(id, defaultLevel);
            statsHtml = `
                <div class="stats-calculator">
                    <div class="stats-header">
                        <span style="color: #a78bfa; font-weight: 600;">📊 属性计算器</span>
                        <label>等级：</label>
                        <input type="number" id="petLevelInput" value="${defaultLevel}" min="0" max="151">
                        <button id="calcStatsBtn">计算</button>
                    </div>
                    <div class="stats-result" id="statsResult">
                        <div class="stat-row"><span class="stat-label">❤️ 生命值</span><span class="stat-value highlight">${stats.hpm}</span></div>
                        <div class="stat-row"><span class="stat-label">💧 魔力值</span><span class="stat-value">${stats.mpm}</span></div>
                        <div class="stat-row"><span class="stat-label">⚔️ 攻击力</span><span class="stat-value">${stats.atk}</span></div>
                        <div class="stat-row"><span class="stat-label">🛡️ 防御力</span><span class="stat-value">${stats.def}</span></div>
                        <div class="stat-row"><span class="stat-label">💥 暴击率</span><span class="stat-value">${stats.crt}%</span></div>
                        <div class="stat-row"><span class="stat-label">💢 暴击倍数</span><span class="stat-value">${stats.crtdmg}x</span></div>
                        ${stats.skill && stats.skill.length ? `<div class="stat-row"><span class="stat-label">⚡ 技能</span><span class="stat-value">${stats.skill.join('、')}</span></div>` : ''}
                    </div>
                </div>
            `;
        }

        title = `${isBoss ? '👑 ' : ''}${item.name}`;
        html = `
            <div class="detail-card">
                <div class="row">
                    <span class="label">属性</span>
                    <span class="value"><span class="tag ${typeClass}">${typeLabel}</span></span>
                </div>
                <div class="row">
                    <span class="label">科目</span>
                    <span class="value">${item.subject}</span>
                </div>
                ${item.habitat ? `
                <div class="row">
                    <span class="label">栖息地</span>
                    <span class="value">${item.habitat}</span>
                </div>
                ` : ''}
                ${item.fly !== undefined ? `
                <div class="row">
                    <span class="label">飞行能力</span>
                    <span class="value">${item.fly > 0 ? '✅ 可飞行' : item.fly < 0 ? '❌ 不可飞行' : '普通'}</span>
                </div>
                ` : ''}
            </div>
            <div class="detail-desc">
                <strong>📝 描述</strong><br>
                ${item.desc || '暂无描述'}
            </div>
            ${evolveHtml}
            ${statsHtml}
        `;

    } else if (category === 'item') {
        item = ItemList.find(i => i.id === id);
        if (!item) return;
        
        const typeClass = getTypeClass(item.type);
        const typeLabel = getTypeLabel(item.type);

        title = `🎒 ${item.name}`;
        html = `
            <div class="detail-card">
                <div class="row">
                    <span class="label">类型</span>
                    <span class="value"><span class="tag ${typeClass}">${typeLabel}</span></span>
                </div>
                <div class="row">
                    <span class="label">ID</span>
                    <span class="value" style="color:rgba(255,255,255,0.3);font-family:monospace;">${item.id}</span>
                </div>
            </div>
            <div class="detail-desc">
                <strong>📝 描述</strong><br>
                ${item.desc || '无描述'}
            </div>
            ${item.type === 'ball' ? '<div class="detail-tip" style="border-left-color:#60a5fa;">💡 捕捉球用于捕捉野生精灵，不同等级对应不同的捕捉上限。</div>' : ''}
            ${item.type === 'ball2' ? '<div class="detail-tip" style="border-left-color:#a78bfa;">💡 变异捕捉球专门用于捕捉变异精灵，比普通捕捉球更稀有。</div>' : ''}
            ${item.type === 'elem' ? '<div class="detail-tip" style="border-left-color:#fbbf24;">💡 灵石用于精灵进化，请确保精灵达到对应等级。</div>' : ''}
            ${item.type === 'heal' ? '<div class="detail-tip" style="border-left-color:#4ade80;">💡 治疗道具可以在战斗中和非战斗时使用，恢复精灵状态。</div>' : ''}
            ${item.type === 'coin' ? '<div class="detail-tip" style="border-left-color:#ffd700;">💡 金币盒子可以快速获得游戏货币，是积累财富的好帮手。</div>' : ''}
            ${item.type === 'exp' ? '<div class="detail-tip" style="border-left-color:#f87171;">💡 经验盒子可以帮助精灵快速升级，提升战斗力。</div>' : ''}
            ${item.type === 'score' ? '<div class="detail-tip" style="border-left-color:#60a5fa;">💡 排行卷轴可以查看战绩排行，了解自己的实力定位。</div>' : ''}
            ${item.type === 'addMaxPets' ? '<div class="detail-tip" style="border-left-color:#4ade80;">💡 扩容卡可以增加精灵携带上限，最多可扩容至8格。</div>' : ''}
        `;

    } else if (category === 'skill') {
        item = SkillDict[id];
        if (!item) return;

        title = `⚔️ ${id}`;
        html = `
            <div class="detail-card">
                <div class="row">
                    <span class="label">消耗魔力</span>
                    <span class="value">${item.mp} MP</span>
                </div>
                <div class="row">
                    <span class="label">类型</span>
                    <span class="value">${item.type || '通用'}</span>
                </div>
            </div>
            <div class="detail-desc">
                <strong>📝 效果描述</strong><br>
                ${item.text}
            </div>
            ${item.mp === 0 ? '<div class="detail-tip" style="border-left-color:#60a5fa;">💡 该技能不消耗魔力，可以无限使用。</div>' : ''}
            ${item.mp > 30 ? '<div class="detail-tip" style="border-left-color:#f87171;">💡 该技能消耗较高，请合理规划魔力使用。</div>' : ''}
            ${item.type === '恢复' ? '<div class="detail-tip" style="border-left-color:#4ade80;">💡 恢复型技能可以回复生命或魔力，是持久战的关键。</div>' : ''}
            ${item.type === '防御' ? '<div class="detail-tip" style="border-left-color:#60a5fa;">💡 防御型技能可以减免伤害，适合应对高攻击对手。</div>' : ''}
            ${item.type === '攻击' ? '<div class="detail-tip" style="border-left-color:#f87171;">💡 攻击型技能可以造成高额伤害，是输出的核心。</div>' : ''}
            ${item.type === '被动' ? '<div class="detail-tip" style="border-left-color:#a78bfa;">💡 被动型技能在特定条件下自动触发，无需主动使用。</div>' : ''}
        `;

    } else if (category === 'wear') {
        item = WEARABLES[id];
        if (!item) return;
        
        const map = { 
            'head': '头部', 'torso': '躯干', 'body': '身体', 
            'righthand': '右手', 'lefthand': '左手' 
        };
        const typeLabel = map[item.part] || item.part;
        const typeClass = getTypeClass(item.part);

        title = `👕 ${id}`;
        html = `
            <div class="detail-card">
                <div class="row">
                    <span class="label">部位</span>
                    <span class="value"><span class="tag ${typeClass}">${typeLabel}</span></span>
                </div>
                <div class="row">
                    <span class="label">偏移</span>
                    <span class="value" style="color:rgba(255,255,255,0.4);font-family:monospace;">[${item.offset.join(', ')}]</span>
                </div>
                <div class="row">
                    <span class="label">旋转</span>
                    <span class="value" style="color:rgba(255,255,255,0.4);font-family:monospace;">[${item.rot.join(', ')}]</span>
                </div>
                <div class="row">
                    <span class="label">缩放</span>
                    <span class="value" style="color:rgba(255,255,255,0.4);font-family:monospace;">${Array.isArray(item.scale) ? item.scale.join('×') : item.scale}</span>
                </div>
            </div>
            <div class="detail-desc">
                <strong>📝 描述</strong><br>
                ${item.desc || '暂无描述'}
            </div>
        `;
    }

    detailTitle.textContent = title;
    detailBody.innerHTML = html;
    detailModal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // 绑定属性计算器事件
    setTimeout(() => {
        const calcBtn = document.getElementById('calcStatsBtn');
        const levelInput = document.getElementById('petLevelInput');
        if (calcBtn && levelInput) {
            const updateStats = () => {
                const lv = parseInt(levelInput.value) || 1;
                const stats = calcPetStats(id, lv);
                if (stats) {
                    const resultDiv = document.getElementById('statsResult');
                    if (resultDiv) {
                        resultDiv.innerHTML = `
                            <div class="stat-row"><span class="stat-label">❤️ 生命值</span><span class="stat-value highlight">${stats.hpm}</span></div>
                            <div class="stat-row"><span class="stat-label">💧 魔力值</span><span class="stat-value">${stats.mpm}</span></div>
                            <div class="stat-row"><span class="stat-label">⚔️ 攻击力</span><span class="stat-value">${stats.atk}</span></div>
                            <div class="stat-row"><span class="stat-label">🛡️ 防御力</span><span class="stat-value">${stats.def}</span></div>
                            <div class="stat-row"><span class="stat-label">💥 暴击率</span><span class="stat-value">${stats.crt}%</span></div>
                            <div class="stat-row"><span class="stat-label">💢 暴击倍数</span><span class="stat-value">${stats.crtdmg}x</span></div>
                            ${stats.skill && stats.skill.length ? `<div class="stat-row"><span class="stat-label">⚡ 技能</span><span class="stat-value">${stats.skill.join('、')}</span></div>` : ''}
                        `;
                    }
                }
            };
            calcBtn.addEventListener('click', updateStats);
            levelInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') updateStats(); });
            levelInput.addEventListener('change', updateStats);
        }
    }, 100);
}

// ===== 关闭详情 =====
function closeDetail() {
    detailModal.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== 切换分类 =====
function switchCategory(category) {
    currentCategory = category;
    currentFilter = 'all';
    currentSearch = '';

    categoryTabs.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === category);
    });

    searchInput.value = '';
    renderFilters();
    renderPokedex();
}

// ===== Toast 提示 =====
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => { 
        toast.style.opacity = '0'; 
        toast.style.transition = 'opacity 0.3s'; 
        setTimeout(() => toast.remove(), 300); 
    }, 2000);
}

// ================================================================
//  管理员功能
// ================================================================

// ===== 打开管理面板 =====
function openAdminPanel() {
    const adminModal = document.getElementById('adminModal');
    const adminBody = document.getElementById('adminBody');
    
    if (!isAdmin) {
        adminBody.innerHTML = `
            <div class="admin-login">
                <div class="lock-icon">🔒</div>
                <p style="color:rgba(255,255,255,0.3);margin-bottom:12px;">请输入管理员密码</p>
                <input type="password" id="adminPasswordInput" placeholder="输入密码..." onkeydown="if(event.key==='Enter') adminLogin()">
                <div id="adminLoginError" class="login-error"></div>
                <button onclick="adminLogin()">验证身份</button>
            </div>
        `;
        adminModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => document.getElementById('adminPasswordInput')?.focus(), 100);
        return;
    }
    renderAdminPanel(adminBody);
    adminModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== 管理员登录 =====
function adminLogin() {
    const input = document.getElementById('adminPasswordInput');
    const error = document.getElementById('adminLoginError');
    if (!input) return;
    
    if (input.value.trim() === 'Mosher50018863') {
        isAdmin = true;
        renderAdminPanel(document.getElementById('adminBody'));
        error.textContent = '';
        input.value = '';
        updateUserUI();
    } else {
        error.textContent = '❌ 密码错误，请重试';
        input.value = '';
        input.focus();
    }
}

// ===== 渲染管理面板 =====
function renderAdminPanel(container) {
    const totalPets = Object.keys(PetDict).length;
    const totalItems = ItemList.length;
    const totalSkills = Object.keys(SkillDict).length;
    const totalWears = Object.keys(WEARABLES).length;
    
    const hasConfig = CONFIG && CONFIG.token && CONFIG.token !== '';

    container.innerHTML = `
        <div style="margin-bottom:12px;color:rgba(255,255,255,0.3);font-size:13px;">
            ✅ 已登录管理员 | 数据统计: 🧚${totalPets} 🎒${totalItems} ⚔️${totalSkills} 👕${totalWears}
            <button onclick="resetAllData()" style="float:right;background:rgba(248,113,113,0.1);border:1px solid rgba(248,113,113,0.2);color:#f87171;padding:4px 16px;border-radius:8px;cursor:pointer;font-size:12px;">🔄 重置数据</button>
        </div>
        
        <!-- 云端同步区域 -->
        <div style="margin-bottom:16px;padding:12px 16px;background:rgba(123,104,238,0.05);border-radius:12px;border:1px solid rgba(123,104,238,0.1);">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                <div>
                    <span style="color:#a78bfa;font-weight:600;">☁️ 云端同步</span>
                    <span style="font-size:11px;color:rgba(255,255,255,0.2);margin-left:8px;">数据仓库: pokedex-helper</span>
                    <span id="syncStatus" style="margin-left:12px;font-size:12px;"></span>
                    <span id="lastSyncTime" style="margin-left:12px;font-size:11px;color:rgba(255,255,255,0.2);"></span>
                </div>
                <div style="display:flex;gap:6px;flex-wrap:wrap;">
                    <button onclick="openConfigModal()" style="background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2);color:#a78bfa;padding:4px 16px;border-radius:8px;cursor:pointer;font-size:12px;">⚙️ 配置</button>
                    ${hasConfig ? `
                        <button onclick="syncToCloud()" style="background:rgba(74,222,128,0.1);border:1px solid rgba(74,222,128,0.2);color:#4ade80;padding:4px 16px;border-radius:8px;cursor:pointer;font-size:12px;">📤 上传到云端</button>
                        <button onclick="loadFromCloud()" style="background:rgba(96,165,250,0.1);border:1px solid rgba(96,165,250,0.2);color:#60a5fa;padding:4px 16px;border-radius:8px;cursor:pointer;font-size:12px;">📥 从云端加载</button>
                    ` : `
                        <span style="font-size:12px;color:rgba(255,255,255,0.2);">⚠️ 请先点击配置</span>
                    `}
                    <button onclick="downloadDataAsFile()" style="background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.2);color:#fbbf24;padding:4px 16px;border-radius:8px;cursor:pointer;font-size:12px;">💾 导出备份</button>
                    <button onclick="document.getElementById('importFileInput').click()" style="background:rgba(167,139,250,0.1);border:1px solid rgba(167,139,250,0.2);color:#a78bfa;padding:4px 16px;border-radius:8px;cursor:pointer;font-size:12px;">📂 导入备份</button>
                    <input type="file" id="importFileInput" accept=".json" style="display:none" onchange="importFromFile(event)">
                </div>
            </div>
            ${syncError ? `<div style="margin-top:6px;font-size:12px;color:#f87171;">❌ 错误: ${syncError}</div>` : ''}
        </div>
        
        <div class="admin-section">
            <div class="admin-section-title">🧚 精灵管理 (${totalPets})</div>
            <div class="admin-grid" id="adminPetList"></div>
            <button class="admin-add-btn" onclick="openAddForm('pet')">➕ 添加精灵</button>
        </div>
        
        <div class="admin-section">
            <div class="admin-section-title">🎒 道具管理 (${totalItems})</div>
            <div class="admin-grid" id="adminItemList"></div>
            <button class="admin-add-btn" onclick="openAddForm('item')">➕ 添加道具</button>
        </div>
        
        <div class="admin-section">
            <div class="admin-section-title">⚔️ 技能管理 (${totalSkills})</div>
            <div class="admin-grid" id="adminSkillList"></div>
            <button class="admin-add-btn" onclick="openAddForm('skill')">➕ 添加技能</button>
        </div>
        
        <div class="admin-section" style="border-bottom:none;">
            <div class="admin-section-title">👕 装备管理 (${totalWears})</div>
            <div class="admin-grid" id="adminWearList"></div>
            <button class="admin-add-btn" onclick="openAddForm('wear')">➕ 添加装备</button>
        </div>
    `;

    renderAdminList('pet', Object.keys(PetDict));
    renderAdminList('item', ItemList.map(i => i.id));
    renderAdminList('skill', Object.keys(SkillDict));
    renderAdminList('wear', Object.keys(WEARABLES));
    updateSyncUI();
}

// ===== 渲染管理列表 =====
function renderAdminList(category, ids) {
    const containerId = category === 'pet' ? 'adminPetList' : 
                        category === 'item' ? 'adminItemList' : 
                        category === 'skill' ? 'adminSkillList' : 'adminWearList';
    const container = document.getElementById(containerId);
    if (!container) return;

    const displayNames = ids.map(id => {
        if (category === 'pet') return { id, name: PetDict[id]?.name || id };
        if (category === 'item') {
            const item = ItemList.find(i => i.id === id);
            return { id, name: item?.name || id };
        }
        if (category === 'skill') return { id, name: id };
        if (category === 'wear') return { id, name: id };
        return { id, name: id };
    });

    const isDefault = (id) => {
        if (category === 'pet') return PetDictDefault[id];
        if (category === 'item') return ItemListDefault.some(i => i.id === id);
        if (category === 'skill') return SkillDictDefault[id];
        if (category === 'wear') return WEARABLESDefault[id];
        return false;
    };

    container.innerHTML = displayNames.map(({ id, name }) => `
        <div class="admin-item">
            <span class="name">${name} ${isDefault(id) ? '' : '⭐'}</span>
            <div class="actions">
                <button class="edit-btn" onclick="openEditForm('${category}', '${id}')">✏️</button>
                ${!isDefault(id) ? `<button class="del-btn" onclick="deleteItem('${category}', '${id}')">🗑️</button>` : ''}
            </div>
        </div>
    `).join('');
}

// ===== 获取分类标签 =====
function getCategoryLabel(category) {
    const map = { 'pet': '精灵', 'item': '道具', 'skill': '技能', 'wear': '装备' };
    return map[category] || category;
}

// ===== 生成表单HTML =====
function getFormHTML(category, id) {
    let data = null;
    let defaultData = {};

    if (category === 'pet') {
        data = id ? PetDict[id] : null;
        defaultData = {
            name: '', type: '金', subject: '', desc: '',
            _atk: 2, _hpm: 10, _mpm: 1, _def: 1, _crt: 0.007, _crtdmg: 0.02,
            atk: 10, hpm: 30, mpm: 20, def: 2, crt: 0.05, crtdmg: 2,
            habitat: '', evolveFrom: '', evolveTo: '', evolveItem: ''
        };
    } else if (category === 'item') {
        data = id ? ItemList.find(i => i.id === id) : null;
        defaultData = { id: '', name: '', type: 'ball', desc: '' };
    } else if (category === 'skill') {
        data = id ? SkillDict[id] : null;
        defaultData = { text: '', mp: 0, type: '基础' };
    } else if (category === 'wear') {
        data = id ? WEARABLES[id] : null;
        defaultData = { offset: '[0,0,0]', rot: '[0,0,0]', scale: 1, part: 'head', desc: '' };
    }

    const values = data || defaultData;

    if (category === 'pet') {
        return `
            <form class="edit-form" onsubmit="saveItem(event, 'pet', '${id || ''}')">
                <div class="form-row">
                    <div class="form-group"><label>ID</label><input name="id" value="${id || ''}" placeholder="唯一标识" ${id ? 'readonly' : ''}></div>
                    <div class="form-group"><label>名称</label><input name="name" value="${values.name || ''}" required></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>属性</label>
                        <select name="type">
                            ${['金','木','水','火','土','boss'].map(t => `<option ${values.type===t?'selected':''}>${t}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group"><label>科目</label><input name="subject" value="${values.subject || ''}"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>基础攻击</label><input name="atk" type="number" value="${values.atk || 0}" step="0.1"></div>
                    <div class="form-group"><label>攻击成长</label><input name="_atk" type="number" value="${values._atk || 0}" step="0.01"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>基础生命</label><input name="hpm" type="number" value="${values.hpm || 0}"></div>
                    <div class="form-group"><label>生命成长</label><input name="_hpm" type="number" value="${values._hpm || 0}" step="0.1"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>基础魔力</label><input name="mpm" type="number" value="${values.mpm || 0}"></div>
                    <div class="form-group"><label>魔力成长</label><input name="_mpm" type="number" value="${values._mpm || 0}" step="0.1"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>基础防御</label><input name="def" type="number" value="${values.def || 0}" step="0.1"></div>
                    <div class="form-group"><label>防御成长</label><input name="_def" type="number" value="${values._def || 0}" step="0.01"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>基础暴击率</label><input name="crt" type="number" value="${values.crt || 0}" step="0.01"></div>
                    <div class="form-group"><label>暴击成长</label><input name="_crt" type="number" value="${values._crt || 0}" step="0.001"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>基础暴击倍数</label><input name="crtdmg" type="number" value="${values.crtdmg || 0}" step="0.1"></div>
                    <div class="form-group"><label>暴击倍数成长</label><input name="_crtdmg" type="number" value="${values._crtdmg || 0}" step="0.001"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>栖息地</label><input name="habitat" value="${values.habitat || ''}"></div>
                    <div class="form-group"><label>进化自</label><input name="evolveFrom" value="${values.evolveFrom || ''}"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>可进化至</label><input name="evolveTo" value="${values.evolveTo || ''}"></div>
                    <div class="form-group"><label>进化道具</label><input name="evolveItem" value="${values.evolveItem || ''}"></div>
                </div>
                <div class="form-group"><label>描述</label><textarea name="desc">${values.desc || ''}</textarea></div>
                <div class="form-actions">
                    <button type="button" class="btn-cancel" onclick="closeEditModal()">取消</button>
                    <button type="submit" class="btn-save">保存</button>
                </div>
            </form>
        `;
    } else if (category === 'item') {
        return `
            <form class="edit-form" onsubmit="saveItem(event, 'item', '${id || ''}')">
                <div class="form-row">
                    <div class="form-group"><label>ID</label><input name="id" value="${id || ''}" placeholder="唯一标识" ${id ? 'readonly' : ''}></div>
                    <div class="form-group"><label>名称</label><input name="name" value="${values.name || ''}" required></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>类型</label>
                        <select name="type">
                            ${['ball','ball2','heal','elem','coin','exp','score','addMaxPets'].map(t => 
                                `<option ${values.type===t?'selected':''}>${t}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-group"><label>描述</label><textarea name="desc">${values.desc || ''}</textarea></div>
                <div class="form-actions">
                    <button type="button" class="btn-cancel" onclick="closeEditModal()">取消</button>
                    <button type="submit" class="btn-save">保存</button>
                </div>
            </form>
        `;
    } else if (category === 'skill') {
        return `
            <form class="edit-form" onsubmit="saveItem(event, 'skill', '${id || ''}')">
                <div class="form-row">
                    <div class="form-group"><label>技能名</label><input name="id" value="${id || ''}" ${id ? 'readonly' : ''}></div>
                    <div class="form-group"><label>类型</label>
                        <select name="type">
                            ${['基础','攻击','防御','恢复','被动','其他'].map(t => 
                                `<option ${(values.type||'基础')===t?'selected':''}>${t}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-group"><label>魔力消耗</label><input name="mp" type="number" value="${values.mp || 0}"></div>
                <div class="form-group"><label>效果描述</label><textarea name="text">${values.text || ''}</textarea></div>
                <div class="form-actions">
                    <button type="button" class="btn-cancel" onclick="closeEditModal()">取消</button>
                    <button type="submit" class="btn-save">保存</button>
                </div>
            </form>
        `;
    } else if (category === 'wear') {
        return `
            <form class="edit-form" onsubmit="saveItem(event, 'wear', '${id || ''}')">
                <div class="form-row">
                    <div class="form-group"><label>装备名</label><input name="id" value="${id || ''}" ${id ? 'readonly' : ''}></div>
                    <div class="form-group"><label>部位</label>
                        <select name="part">
                            ${['head','torso','body','righthand','lefthand'].map(t => 
                                `<option ${(values.part||'head')===t?'selected':''}>${t}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>偏移 [x,y,z]</label><input name="offset" value="${Array.isArray(values.offset) ? JSON.stringify(values.offset) : values.offset || '[0,0,0]'}"></div>
                    <div class="form-group"><label>旋转 [x,y,z]</label><input name="rot" value="${Array.isArray(values.rot) ? JSON.stringify(values.rot) : values.rot || '[0,0,0]'}"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>缩放</label><input name="scale" value="${typeof values.scale === 'number' ? values.scale : values.scale || 1}"></div>
                </div>
                <div class="form-group"><label>描述</label><textarea name="desc">${values.desc || ''}</textarea></div>
                <div class="form-actions">
                    <button type="button" class="btn-cancel" onclick="closeEditModal()">取消</button>
                    <button type="submit" class="btn-save">保存</button>
                </div>
            </form>
        `;
    }
    return '<p>错误：未知分类</p>';
}

// ===== 打开添加表单 =====
function openAddForm(category) {
    document.getElementById('editTitle').textContent = `➕ 添加${getCategoryLabel(category)}`;
    document.getElementById('editBody').innerHTML = getFormHTML(category, null);
    document.getElementById('editModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== 打开编辑表单 =====
function openEditForm(category, id) {
    document.getElementById('editTitle').textContent = `✏️ 编辑${getCategoryLabel(category)}`;
    document.getElementById('editBody').innerHTML = getFormHTML(category, id);
    document.getElementById('editModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== 关闭编辑弹窗 =====
function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
    document.body.style.overflow = '';
}

// ===== 保存数据 =====
function saveItem(event, category, id) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = {};

    for (const [key, value] of formData.entries()) {
        if (!isNaN(value) && value !== '' && 
            key !== 'id' && key !== 'name' && key !== 'desc' && 
            key !== 'habitat' && key !== 'evolveFrom' && key !== 'evolveTo' && key !== 'evolveItem') {
            data[key] = parseFloat(value);
        } else {
            data[key] = value;
        }
    }

    if (data.offset && typeof data.offset === 'string') {
        try { data.offset = JSON.parse(data.offset); } catch(e) { data.offset = [0,0,0]; }
    }
    if (data.rot && typeof data.rot === 'string') {
        try { data.rot = JSON.parse(data.rot); } catch(e) { data.rot = [0,0,0]; }
    }
    if (data.scale && typeof data.scale === 'string') {
        const val = parseFloat(data.scale);
        if (!isNaN(val)) data.scale = val;
    }

    const newId = data.id || id;

    if (category === 'pet') {
        if (id && PetDict[id]) {
            Object.assign(PetDict[id], data);
        } else {
            PetDict[newId] = data;
        }
    } else if (category === 'item') {
        if (id) {
            const item = ItemList.find(i => i.id === id);
            if (item) Object.assign(item, data);
        } else {
            ItemList.push(data);
        }
    } else if (category === 'skill') {
        if (id && SkillDict[id]) {
            Object.assign(SkillDict[id], data);
        } else {
            SkillDict[newId] = data;
        }
    } else if (category === 'wear') {
        if (id && WEARABLES[id]) {
            Object.assign(WEARABLES[id], data);
        } else {
            WEARABLES[newId] = data;
        }
    }

    saveCustomData();
    closeEditModal();
    document.getElementById('adminModal').classList.remove('active');
    renderPokedex();
    updateUserUI();
    setTimeout(() => openAdminPanel(), 300);
    showToast('✅ 保存成功！');
}

// ===== 删除数据 =====
function deleteItem(category, id) {
    if (!confirm(`确定要删除这个${getCategoryLabel(category)}吗？`)) return;
    
    if (category === 'pet') {
        delete PetDict[id];
    } else if (category === 'item') {
        const index = ItemList.findIndex(i => i.id === id);
        if (index !== -1) ItemList.splice(index, 1);
    } else if (category === 'skill') {
        delete SkillDict[id];
    } else if (category === 'wear') {
        delete WEARABLES[id];
    }
    
    saveCustomData();
    renderPokedex();
    const adminBody = document.getElementById('adminBody');
    if (adminBody) renderAdminPanel(adminBody);
    showToast('🗑️ 已删除');
}

// ===== 重置所有数据 =====
function resetAllData() {
    if (!confirm('⚠️ 确定要重置所有数据为默认值吗？自定义数据将丢失！')) return;
    if (!confirm('再次确认：此操作不可撤销！')) return;
    
    resetToDefault();
    document.getElementById('adminModal').classList.remove('active');
    renderPokedex();
    updateUserUI();
    showToast('🔄 已重置为默认数据');
    setTimeout(() => openAdminPanel(), 300);
}

// ===== 更新用户UI状态 =====
function updateUserUI() {
    const statusSpan = document.getElementById('dataStatus');
    if (statusSpan) {
        statusSpan.textContent = isAdmin ? '👑 管理员模式' : '📦 数据已持久化';
        statusSpan.style.color = isAdmin ? '#ffd700' : 'rgba(255,255,255,0.15)';
    }
}

// ================================================================
//  GitHub 云端同步函数
// ================================================================

// ===== 上传到云端 =====
async function syncToCloud() {
    if (!CONFIG.token || CONFIG.token === '' || !CONFIG.owner || !CONFIG.repo) {
        showToast('⚠️ 请先在管理面板中配置 GitHub');
        openConfigModal();
        return;
    }
    
    const result = await syncAllDataToGitHub();
    if (result.success) {
        showToast('✅ 数据已上传到 GitHub！');
    } else {
        showToast(`❌ 上传失败: ${result.error}`);
    }
    const adminBody = document.getElementById('adminBody');
    if (adminBody) renderAdminPanel(adminBody);
}

// ===== 从云端加载 =====
async function loadFromCloud() {
    if (!CONFIG.token || CONFIG.token === '' || !CONFIG.owner || !CONFIG.repo) {
        showToast('⚠️ 请先在管理面板中配置 GitHub');
        openConfigModal();
        return;
    }
    
    showToast('🔄 正在从云端加载...');
    const result = await loadFromGitHub();
    if (result.success) {
        showToast('✅ 从云端加载成功！');
        renderPokedex();
        const adminBody = document.getElementById('adminBody');
        if (adminBody) renderAdminPanel(adminBody);
    } else {
        showToast(`❌ 加载失败: ${result.error || '未知错误'}`);
    }
}

// ===== 从文件导入 =====
async function importFromFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
        const data = await importDataFromFile(file);
        showToast(`✅ 导入成功！共 ${Object.keys(data.pet || {}).length} 只精灵`);
        renderPokedex();
        const adminBody = document.getElementById('adminBody');
        if (adminBody) renderAdminPanel(adminBody);
    } catch (error) {
        showToast(`❌ 导入失败: ${error.message}`);
    }
    event.target.value = '';
}

// ================================================================
//  GitHub 配置弹窗
// ================================================================

// ===== 打开配置弹窗 =====
function openConfigModal() {
    document.getElementById('configModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('configOwner').value = CONFIG.owner || '';
    document.getElementById('configRepo').value = CONFIG.repo || 'pokedex-helper';
    document.getElementById('configToken').value = CONFIG.token || '';
}

// ===== 关闭配置弹窗 =====
function closeConfigModal() {
    document.getElementById('configModal').classList.remove('active');
    document.body.style.overflow = '';
}

// ===== 保存 GitHub 配置 =====
function saveGitHubConfig(event) {
    event.preventDefault();
    const owner = document.getElementById('configOwner').value.trim();
    const repo = document.getElementById('configRepo').value.trim();
    const token = document.getElementById('configToken').value.trim();
    
    CONFIG.owner = owner;
    CONFIG.repo = repo;
    CONFIG.token = token;
    saveGitHubConfigToLocal(CONFIG);
    
    closeConfigModal();
    showToast('✅ GitHub 配置已保存（仅保存在浏览器本地）');
    const adminBody = document.getElementById('adminBody');
    if (adminBody) renderAdminPanel(adminBody);
}

// ================================================================
//  事件绑定
// ================================================================

// ===== 搜索 =====
searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim();
    renderPokedex();
});

// ===== 分类切换 =====
categoryTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.category-tab');
    if (tab) switchCategory(tab.dataset.category);
});

// ===== 关闭详情 =====
detailCloseBtn.addEventListener('click', closeDetail);
detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) closeDetail();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDetail();
});

// ===== 管理面板 =====
document.getElementById('adminBtn').addEventListener('click', openAdminPanel);
document.getElementById('adminCloseBtn').addEventListener('click', () => {
    document.getElementById('adminModal').classList.remove('active');
    document.body.style.overflow = '';
});
document.getElementById('editCloseBtn').addEventListener('click', closeEditModal);
document.getElementById('configCloseBtn').addEventListener('click', closeConfigModal);

// ===== 点击外部关闭 =====
document.getElementById('adminModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) {
        document.getElementById('adminModal').classList.remove('active');
        document.body.style.overflow = '';
    }
});
document.getElementById('editModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeEditModal();
});
document.getElementById('configModal').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeConfigModal();
});

// ================================================================
//  暴露全局函数
// ================================================================

window.showDetail = showDetail;
window.calcPetStats = calcPetStats;
window.adminLogin = adminLogin;
window.openAdminPanel = openAdminPanel;
window.openAddForm = openAddForm;
window.openEditForm = openEditForm;
window.saveItem = saveItem;
window.deleteItem = deleteItem;
window.resetAllData = resetAllData;
window.closeEditModal = closeEditModal;
window.showToast = showToast;
window.renderAdminPanel = renderAdminPanel;
window.syncToCloud = syncToCloud;
window.loadFromCloud = loadFromCloud;
window.importFromFile = importFromFile;
window.downloadDataAsFile = downloadDataAsFile;
window.openConfigModal = openConfigModal;
window.closeConfigModal = closeConfigModal;
window.saveGitHubConfig = saveGitHubConfig;

// ================================================================
//  初始化
// ================================================================

const originalRenderPokedex = renderPokedex;
renderPokedex = function() {
    loadCustomData();
    originalRenderPokedex();
    updateUserUI();
    updateSyncUI();
};

renderFilters();
renderPokedex();
updateUserUI();
updateSyncUI();

console.log('📖 pokedex.js 加载完成');
console.log(`  🧚 精灵: ${Object.keys(PetDict).length} 只`);
console.log(`  🎒 道具: ${ItemList.length} 件`);
console.log(`  ⚔️ 技能: ${Object.keys(SkillDict).length} 个`);
console.log(`  👕 装备: ${Object.keys(WEARABLES).length} 件`);
console.log('🔐 管理密码: Mosher50018863');
console.log('☁️ 数据存储仓库: pokedex-helper');
