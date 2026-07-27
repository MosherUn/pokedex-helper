/**
 * 应用主入口
 */

(function() {
    'use strict';

    console.log('📖 小精灵图鉴 v3.0');
    console.log('📊 数据统计:');
    console.log(`  🧚 精灵: ${Object.keys(PetDict).length} 只`);
    console.log(`  🎒 道具: ${ItemList.length} 件`);
    console.log(`  ⚔️ 技能: ${Object.keys(SkillDict).length} 个`);
    console.log(`  👕 装备: ${Object.keys(WEARABLES).length} 件`);
    console.log('☁️ 数据存储仓库: re_of_pokemon');
    console.log('🔐 管理密码: Mosher50018863');

    window.__pokedex = {
        PetDict: PetDict,
        ItemList: ItemList,
        SkillDict: SkillDict,
        WEARABLES: WEARABLES,
        calcPetStats: calcPetStats,
        isAdmin: () => isAdmin,
        saveData: saveCustomData,
        resetData: resetToDefault,
        loadData: loadCustomData,
        exportData: exportAllData,
        importData: importAllData,
        downloadData: downloadDataAsFile,
        syncToCloud: syncToCloud,
        loadFromCloud: loadFromCloud,
        fetchFromGitHub: fetchFromGitHub,
        saveToGitHub: saveToGitHub,
        syncAllDataToGitHub: syncAllDataToGitHub,
        getConfig: () => CONFIG,
        setConfig: (config) => { CONFIG = config; saveGitHubConfigToLocal(config); },
        search: (keyword, category) => {
            let results = [];
            if (!category || category === 'pet') {
                results = results.concat(Object.entries(PetDict)
                    .filter(([id, p]) => p.name.includes(keyword) || p.type.includes(keyword))
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
        getPet: (id) => PetDict[id],
        getItem: (id) => ItemList.find(i => i.id === id),
        getSkill: (name) => SkillDict[name],
        getWear: (name) => WEARABLES[name],
        getAll: () => ({ PetDict, ItemList, SkillDict, WEARABLES })
    };

    console.log('💡 在控制台输入 __pokedex 可查看 API');
    console.log('📤 使用 __pokedex.syncToCloud() 上传到云端');
    console.log('📥 使用 __pokedex.loadFromCloud() 从云端加载');
})();
