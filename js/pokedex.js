/**
 * 图鉴核心功能 - 支持精灵、道具、技能三大分类
 */

// ===== DOM 引用 =====
const grid = document.getElementById('pokedexGrid');
const searchInput = document.getElementById('searchInput');
const filterTabs = document.getElementById('filterTabs');
const categoryTabs = document.getElementById('categoryTabs');
const totalCount = document.getElementById('totalCount');
const resultCount = document.getElementById('resultCount');

// 详情弹窗
const detailModal = document.getElementById('detailModal');
const detailTitle = document.getElementById('detailTitle');
const detailBody = document.getElementById('detailBody');
const detailCloseBtn = document.getElementById('detailCloseBtn');

// ===== 状态 =====
let currentCategory = 'pet';
let currentFilter = 'all';
let currentSearch = '';

// ===== 获取当前数据 =====
function getCurrentData() {
    if (currentCategory === 'pet') {
        return Object.entries(PetDict).map(([id, data]) => ({ 
            id, 
            ...data, 
            _category: 'pet',
            _searchFields: [data.name, data.type, data.subject, data.desc || '']
        }));
    } else if (currentCategory === 'item') {
        return ItemList.map(item => ({
            ...item,
            _category: 'item',
            _searchFields: [item.name, item.type, item.desc || '']
        }));
    } else if (currentCategory === 'skill') {
        return Object.entries(SkillDict).map(([name, data]) => ({
            id: name,
            name: name,
            ...data,
            _category: 'skill',
            _searchFields: [name, data.text, data.type || '']
        }));
    }
    return [];
}

// ===== 获取筛选选项 =====
function getFilterOptions() {
    if (currentCategory === 'pet') {
        return ['全部', '金', '木', '水', '火', '土', 'BOSS'];
    } else if (currentCategory === 'item') {
        const types = [...new Set(ItemList.map(i => i.type))];
        return ['全部', ...types.map(t => {
            const map = {
                'ball': '捕捉球',
                'ball2': '变异球',
                'heal': '治疗',
                'elem': '灵石',
                'coin': '金币',
                'exp': '经验',
                'score': '排行',
                'addMaxPets': '扩容'
            };
            return map[t] || t;
        })];
    } else if (currentCategory === 'skill') {
        const types = [...new Set(Object.values(SkillDict).map(s => s.type || '其他'))];
        return ['全部', ...types];
    }
    return ['全部'];
}

// ===== 获取类型标签样式 =====
function getTypeClass(value) {
    if (currentCategory === 'pet') {
        if (value === 'BOSS') return 'type-boss';
        return `type-${value}`;
    } else if (currentCategory === 'item') {
        const map = {
            'ball': 'type-ball',
            'ball2': 'type-ball2',
            'heal': 'type-heal',
            'elem': 'type-elem',
            'coin': 'type-coin',
            'exp': 'type-exp',
            'score': 'type-score',
            'addMaxPets': 'type-addMaxPets'
        };
        return map[value] || '';
    }
    return '';
}

// ===== 获取类型显示名称 =====
function getTypeLabel(value) {
    if (currentCategory === 'pet') {
        return value === 'BOSS' ? '👑 BOSS' : value;
    } else if (currentCategory === 'item') {
        const map = {
            'ball': '捕捉球',
            'ball2': '变异球',
            'heal': '治疗',
            'elem': '灵石',
            'coin': '金币',
            'exp': '经验',
            'score': '排行',
            'addMaxPets': '扩容'
        };
        return map[value] || value;
    } else if (currentCategory === 'skill') {
        return value || '其他';
    }
    return value;
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

    // 绑定事件
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
        // 搜索匹配
        const searchMatch = !currentSearch || 
            item._searchFields.some(field => field.includes(currentSearch));
        
        // 筛选匹配
        let filterMatch = true;
        if (currentFilter !== 'all') {
            if (currentCategory === 'pet') {
                filterMatch = item.type === currentFilter || 
                             (currentFilter === 'BOSS' && item.type === 'boss');
            } else if (currentCategory === 'item') {
                filterMatch = item.type === currentFilter;
            } else if (currentCategory === 'skill') {
                filterMatch = (item.type || '其他') === currentFilter;
            }
        }
        
        return searchMatch && filterMatch;
    });

    // 更新计数
    const total = data.length;
    totalCount.textContent = `共 ${total} 项`;
    resultCount.textContent = `显示 ${filtered.length} 项`;

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="icon">🔍</div>
                <div class="text">没有找到匹配的内容</div>
                <div style="font-size: 13px; color: rgba(255,255,255,0.1); margin-top: 4px;">试试调整搜索或筛选条件</div>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(item => {
        let typeLabel = getTypeLabel(item.type);
        let typeClass = getTypeClass(item.type);
        let subInfo = '';
        let descPreview = '';

        if (currentCategory === 'pet') {
            subInfo = `📚 ${item.subject}`;
            descPreview = item.desc ? item.desc.slice(0, 30) + (item.desc.length > 30 ? '...' : '') : '';
        } else if (currentCategory === 'item') {
            descPreview = item.desc ? item.desc.slice(0, 35) + (item.desc.length > 35 ? '...' : '') : '';
        } else if (currentCategory === 'skill') {
            subInfo = `MP: ${item.mp}`;
            descPreview = item.text ? item.text.slice(0, 30) + (item.text.length > 30 ? '...' : '') : '';
        }

        return `
            <div class="pokedex-card" data-id="${item.id || item.name}" onclick="showDetail('${currentCategory}', '${item.id || item.name}')">
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
            </div>
            <div class="detail-desc">
                <strong>📝 描述</strong><br>
                ${item.desc || '暂无描述'}
            </div>
            ${evolveHtml}
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
        `;
    }

    detailTitle.textContent = title;
    detailBody.innerHTML = html;
    detailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
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

    // 更新分类标签激活状态
    categoryTabs.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.category === category);
    });

    // 清空搜索框
    searchInput.value = '';

    // 重新渲染筛选和内容
    renderFilters();
    renderPokedex();
}

// ===== 事件绑定 =====
// 搜索
searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim();
    renderPokedex();
});

// 分类切换
categoryTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.category-tab');
    if (!tab) return;
    switchCategory(tab.dataset.category);
});

// 关闭详情
detailCloseBtn.addEventListener('click', closeDetail);
detailModal.addEventListener('click', (e) => {
    if (e.target === detailModal) closeDetail();
});

// ESC 关闭
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDetail();
});

// ===== 初始化 =====
renderFilters();
renderPokedex();

console.log('[图鉴] 已加载:');
console.log(`  🧚 精灵: ${Object.keys(PetDict).length} 只`);
console.log(`  🎒 道具: ${ItemList.length} 件`);
console.log(`  ⚔️ 技能: ${Object.keys(SkillDict).length} 个`);

// ESC 关闭
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDetail();
});

// ===== 初始化 =====
renderPokedex();
console.log('[图鉴] 已加载 ' + Object.keys(PetDict).length + ' 只精灵');
