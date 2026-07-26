/**
 * 图鉴核心功能 - 渲染、搜索、筛选、详情
 */

// ===== DOM 引用 =====
const grid = document.getElementById('pokedexGrid');
const searchInput = document.getElementById('searchInput');
const filterTabs = document.getElementById('filterTabs');
const totalCount = document.getElementById('totalCount');
const resultCount = document.getElementById('resultCount');

// 详情弹窗
const detailModal = document.getElementById('detailModal');
const detailTitle = document.getElementById('detailTitle');
const detailBody = document.getElementById('detailBody');
const detailCloseBtn = document.getElementById('detailCloseBtn');

// ===== 状态 =====
let currentFilter = 'all';
let currentSearch = '';

// ===== 渲染图鉴 =====
function renderPokedex() {
    const entries = Object.entries(PetDict);
    const filtered = entries.filter(([id, pet]) => {
        // 搜索匹配
        const searchMatch = !currentSearch || 
            pet.name.includes(currentSearch) || 
            pet.type.includes(currentSearch) || 
            pet.subject.includes(currentSearch) ||
            pet.desc.includes(currentSearch);
        
        // 筛选匹配
        let filterMatch = true;
        if (currentFilter === 'boss') {
            filterMatch = pet.type === 'boss';
        } else if (currentFilter !== 'all') {
            filterMatch = pet.type === currentFilter;
        }
        
        return searchMatch && filterMatch;
    });

    // 更新计数
    totalCount.textContent = `共 ${entries.length} 只精灵`;
    resultCount.textContent = `显示 ${filtered.length} 只精灵`;

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <div class="icon">🔍</div>
                <div class="text">没有找到匹配的精灵</div>
                <div style="font-size: 13px; color: rgba(255,255,255,0.1); margin-top: 4px;">试试调整搜索或筛选条件</div>
            </div>
        `;
        return;
    }

    grid.innerHTML = filtered.map(([id, pet]) => {
        const isBoss = pet.type === 'boss';
        const typeClass = isBoss ? 'type-boss' : `type-${pet.type}`;
        const bossIcon = isBoss ? '👑' : '';
        const descPreview = pet.desc ? pet.desc.slice(0, 30) + (pet.desc.length > 30 ? '...' : '') : '';

        return `
            <div class="pokedex-card" data-id="${id}" onclick="showDetail('${id}')">
                <div class="name">
                    ${pet.name}
                    ${bossIcon ? `<span class="boss-icon">${bossIcon}</span>` : ''}
                </div>
                <span class="type-tag ${typeClass}">${isBoss ? 'BOSS' : pet.type}</span>
                <div class="subject">📚 ${pet.subject}</div>
                ${descPreview ? `<div class="desc-preview">${descPreview}</div>` : ''}
            </div>
        `;
    }).join('');
}

// ===== 显示详情 =====
function showDetail(id) {
    const pet = PetDict[id];
    if (!pet) return;

    const isBoss = pet.type === 'boss';
    const typeClass = isBoss ? 'type-boss' : `type-${pet.type}`;
    const typeLabel = isBoss ? 'BOSS' : pet.type;

    // 进化信息
    let evolveHtml = '';
    if (pet.evolveFrom) {
        const fromPet = PetDict[pet.evolveFrom];
        evolveHtml += `
            <div class="detail-evolve">
                🔄 进化自：<strong>${fromPet ? fromPet.name : pet.evolveFrom}</strong>
                ${pet.evolveItem ? `（需要 ${pet.evolveItem}）` : ''}
            </div>
        `;
    }
    if (pet.evolveTo) {
        const toPet = PetDict[pet.evolveTo];
        evolveHtml += `
            <div class="detail-evolve" style="border-left-color: #4ade80;">
                ⬆️ 可进化至：<strong>${toPet ? toPet.name : pet.evolveTo}</strong>
                ${pet.evolveItem ? `（需要 ${pet.evolveItem}）` : ''}
            </div>
        `;
    }
    if (!pet.evolveFrom && !pet.evolveTo) {
        evolveHtml = `
            <div class="detail-evolve" style="border-left-color: #60a5fa;">
                ✨ 最终形态，无法继续进化
            </div>
        `;
    }

    detailTitle.textContent = `${isBoss ? '👑 ' : ''}${pet.name}`;
    detailBody.innerHTML = `
        <div class="detail-card">
            <div class="row">
                <span class="label">属性</span>
                <span class="value"><span class="tag ${typeClass}">${typeLabel}</span></span>
            </div>
            <div class="row">
                <span class="label">科目</span>
                <span class="value">${pet.subject}</span>
            </div>
            ${pet.habitat ? `
            <div class="row">
                <span class="label">栖息地</span>
                <span class="value">${pet.habitat}</span>
            </div>
            ` : ''}
        </div>
        <div class="detail-desc">
            <strong>📝 描述</strong><br>
            ${pet.desc || '暂无描述'}
        </div>
        ${evolveHtml}
    `;

    detailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// ===== 关闭详情 =====
function closeDetail() {
    detailModal.classList.remove('active');
    document.body.style.overflow = '';
}

// ===== 事件绑定 =====
// 搜索
searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim();
    renderPokedex();
});

// 筛选标签
filterTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.filter-tab');
    if (!tab) return;

    // 更新激活状态
    filterTabs.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    currentFilter = tab.dataset.filter;
    renderPokedex();
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
renderPokedex();
console.log('[图鉴] 已加载 ' + Object.keys(PetDict).length + ' 只精灵');