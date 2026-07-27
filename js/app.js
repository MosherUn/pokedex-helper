/**
 * 应用主入口
 * 功能：初始化、自动检查更新、暴露API
 */

(function() {
    'use strict';

    console.log('📖 小精灵图鉴 v3.0');
    console.log('📊 数据统计:');
    console.log(`  🧚 精灵: ${Object.keys(PetDict).length} 只`);
    console.log(`  🎒 道具: ${ItemList.length} 件`);
    console.log(`  ⚔️ 技能: ${Object.keys(SkillDict).length} 个`);
    console.log(`  👕 装备: ${Object.keys(WEARABLES).length} 件`);
    console.log('☁️ 数据存储仓库: MosherUn/pokedex-helper');
    console.log('🔐 管理密码: Mosher50018863');

    // ================================================================
    //  🔄 检查云端更新功能
    // ================================================================

    /**
     * 检查云端是否有更新，如果有则自动加载
     * 普通玩家打开页面时会自动调用
     */
    async function checkForUpdates() {
        const statusEl = document.getElementById('updateStatus');
        if (statusEl) {
            statusEl.textContent = '🔄 检查更新中...';
            statusEl.style.color = '#fbbf24';
        }
        
        // 获取 GitHub 配置
        const config = getGitHubConfig();
        if (!config || !config.token || !config.owner || !config.repo) {
            if (statusEl) {
                statusEl.textContent = '⚠️ 未配置 GitHub';
                statusEl.style.color = '#f87171';
            }
            return;
        }
        
        try {
            // 从云端加载数据
            const result = await loadFromGitHub();
            if (result.success) {
                // 重新渲染图鉴
                renderPokedex();
                if (statusEl) {
                    statusEl.textContent = '✅ 已加载最新数据！';
                    statusEl.style.color = '#4ade80';
                    // 3秒后隐藏提示
                    setTimeout(() => {
                        if (statusEl) statusEl.textContent = '';
                    }, 3000);
                }
                showToast('✅ 数据已更新到最新！');
                console.log('✅ 自动加载云端数据成功！');
            } else {
                if (statusEl) {
                    statusEl.textContent = 'ℹ️ 已是最新数据';
                    statusEl.style.color = 'rgba(255,255,255,0.2)';
                }
                console.log('ℹ️ 使用本地缓存数据');
            }
        } catch (error) {
            console.error('❌ 检查更新失败:', error);
            if (statusEl) {
                statusEl.textContent = '❌ 检查更新失败';
                statusEl.style.color = '#f87171';
            }
        }
    }

    // 暴露到全局，供按钮调用
    window.checkForUpdates = checkForUpdates;

    // ================================================================
    //  🔄 强制刷新数据（从云端重新加载）
    // ================================================================

    /**
     * 强制从云端重新加载数据（会覆盖本地修改）
     * 用于"从云端加载"按钮
     */
    async function forceLoadFromCloud() {
        const result = await loadFromCloud();
        if (result.success) {
            renderPokedex();
            showToast('✅ 已从云端加载最新数据！');
        } else {
            showToast('❌ 加载失败: ' + (result.error || '未知错误'));
        }
        return result;
    }

    window.forceLoadFromCloud = forceLoadFromCloud;

    // ================================================================
    //  📤 上传数据到云端
    // ================================================================

    /**
     * 上传本地数据到云端（管理员使用）
     */
    async function forceSyncToCloud() {
        const result = await syncToCloud();
        if (result.success) {
            showToast('✅ 数据已上传到云端！');
        } else {
            showToast('❌ 上传失败: ' + (result.error || '未知错误'));
        }
        return result;
    }

    window.forceSyncToCloud = forceSyncToCloud;

    // ================================================================
    //  🚀 页面加载时自动检查更新
    // ================================================================

    // 延迟 2.5 秒，等页面完全渲染后再检查
    setTimeout(() => {
        const config = getGitHubConfig();
        if (config && config.token && config.owner && config.repo) {
            console.log('☁️ 自动检查云端更新...');
            checkForUpdates();
        } else {
            console.log('ℹ️ 未检测到 GitHub 配置，跳过自动更新检查');
            // 显示提示
            const statusEl = document.getElementById('updateStatus');
            if (statusEl) {
                statusEl.textContent = '💡 点击 ⚙️ 配置 GitHub 以同步数据';
                statusEl.style.color = 'rgba(255,255,255,0.15)';
            }
        }
    }, 2500);

    // ================================================================
    //  📋 暴露 API 到控制台
    // ================================================================

    window.__pokedex = {
        // 数据
        PetDict: PetDict,
        ItemList: ItemList,
        SkillDict: SkillDict,
        WEARABLES: WEARABLES,
        
        // 工具函数
        calcPetStats: calcPetStats,
        getCurrentUserId: getCurrentUserId,
        isAdmin: () => isAdmin,
        
        // 数据操作
        saveData: saveCustomData,
        resetData: resetToDefault,
        loadData: loadCustomData,
        exportData: exportAllData,
        importData: importAllData,
        downloadData: downloadDataAsFile,
        
        // GitHub 同步
        syncToCloud: forceSyncToCloud,
        loadFromCloud: forceLoadFromCloud,
        checkForUpdates: checkForUpdates,
        fetchFromGitHub: fetchFromGitHub,
        saveToGitHub: saveToGitHub,
        syncAllDataToGitHub: syncAllDataToGitHub,
        getConfig: () => CONFIG,
        setConfig: (config) => {
            CONFIG = config;
            saveGitHubConfigToLocal(config);
        },
        
        // 搜索功能
        search: (keyword, category) => {
            let results = [];
            if (!category || category === 'pet') {
                results = results.concat(Object.entries(PetDict)
                    .filter(([id, p]) => p.name.includes(keyword) || p.type.includes(keyword) || p.subject.includes(keyword))
                    .map(([id, p]) => ({ category: 'pet', id, ...p })));
            }
            if (!category || category === 'item') {
                results = results.concat(ItemList
                    .filter(i => i.name.includes(keyword) || i.type.includes(keyword))
                    .map(i => ({ category: 'item', ...i })));
            }
            if (!category || category === 'skill') {
                results = results.concat(Object.entries(SkillDict)
                    .filter(([name, s]) => name.includes(keyword) || s.text.includes(keyword))
                    .map(([name, s]) => ({ category: 'skill', name, ...s })));
            }
            if (!category || category === 'wear') {
                results = results.concat(Object.entries(WEARABLES)
                    .filter(([name, w]) => name.includes(keyword) || w.part.includes(keyword))
                    .map(([name, w]) => ({ category: 'wear', name, ...w })));
            }
            console.log('🔍 搜索结果:', results);
            return results;
        },
        
        // 单条查询
        getPet: (id) => PetDict[id],
        getItem: (id) => ItemList.find(i => i.id === id),
        getSkill: (name) => SkillDict[name],
        getWear: (name) => WEARABLES[name],
        
        // 获取全部
        getAll: () => ({ 
            pet: PetDict, 
            item: ItemList, 
            skill: SkillDict, 
            wear: WEARABLES 
        })
    };

    console.log('💡 在控制台输入 __pokedex 可查看 API');
    console.log('📤 使用 __pokedex.syncToCloud() 上传到云端');
    console.log('📥 使用 __pokedex.loadFromCloud() 从云端加载');
    console.log('🔄 使用 __pokedex.checkForUpdates() 检查更新');
    console.log('🔍 使用 __pokedex.search("关键词") 搜索数据');
})();
