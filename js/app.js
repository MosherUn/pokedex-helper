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
    console.log('');
    console.log('🔐 管理功能:');
    console.log('  点击右上角 ⚙️ 按钮进入管理面板');
    console.log('  默认密码: Mosher50018863');
    console.log('  支持: 添加/编辑/删除 精灵、道具、技能、装备');
    console.log('  数据自动保存到浏览器本地');

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
})();
