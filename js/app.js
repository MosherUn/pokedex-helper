/**
 * 应用主入口
 * 功能：初始化 + 自动加载云端数据
 */

(function() {
    'use strict';

    console.log('📖 小精灵图鉴 v3.0');
    console.log(`  🧚 精灵: ${Object.keys(PetDict).length} 只`);
    console.log(`  🎒 道具: ${ItemList.length} 件`);
    console.log(`  ⚔️ 技能: ${Object.keys(SkillDict).length} 个`);
    console.log(`  👕 装备: ${Object.keys(WEARABLES).length} 件`);

    // ================================================================
    //  🔄 自动从云端加载最新数据（核心功能）
    // ================================================================

    async function autoLoadFromCloud() {
        const config = getGitHubConfig();
        
        // 如果没有配置 GitHub，跳过
        if (!config || !config.token || !config.owner || !config.repo) {
            console.log('ℹ️ 未配置 GitHub，使用本地数据');
            return;
        }

        console.log('☁️ 正在从云端加载最新数据...');
        
        try {
            const result = await loadFromGitHub();
            if (result.success) {
                // 重新渲染页面
                renderPokedex();
                console.log('✅ 云端数据加载成功！');
                // 状态栏显示同步时间
                const timeEl = document.getElementById('lastSyncTime');
                if (timeEl) {
                    timeEl.textContent = `上次同步: ${new Date().toLocaleString()}`;
                    timeEl.style.color = 'rgba(255,255,255,0.2)';
                }
            } else {
                console.log('ℹ️ 使用本地缓存数据');
            }
        } catch (e) {
            console.warn('⚠️ 自动加载失败，使用本地数据:', e.message);
        }
    }

    // ================================================================
    //  🚀 页面加载后自动执行
    // ================================================================

    // 延迟 1 秒，等页面渲染完成
    setTimeout(() => {
        autoLoadFromCloud();
    }, 1000);

    // ================================================================
    //  📋 暴露 API
    // ================================================================

    window.__pokedex = {
        PetDict: PetDict,
        ItemList: ItemList,
        SkillDict: SkillDict,
        WEARABLES: WEARABLES,
        calcPetStats: calcPetStats,
        syncToCloud: syncToCloud,
        loadFromCloud: loadFromCloud,
        autoLoadFromCloud: autoLoadFromCloud,
        getConfig: () => CONFIG,
        getAll: () => ({ pet: PetDict, item: ItemList, skill: SkillDict, wear: WEARABLES })
    };

    console.log('💡 在控制台输入 __pokedex 可查看 API');
    console.log('🔄 页面已开启自动加载云端数据');
})();
