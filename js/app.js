/**
 * 应用主入口
 */

(function() {
    'use strict';

    console.log('📖 小精灵图鉴 v2.0');
    console.log('📊 数据统计:');
    console.log(`  🧚 精灵: ${Object.keys(PetDict).length} 只`);
    console.log(`  🎒 道具: ${ItemList.length} 件`);
    console.log(`  ⚔️ 技能: ${Object.keys(SkillDict).length} 个`);

    // 暴露 API 到控制台
    window.__pokedex = {
        PetDict: PetDict,
        ItemList: ItemList,
        SkillDict: SkillDict,
        search: (keyword, category) => {
            let data = [];
            if (!category || category === 'pet') {
                data = Object.entries(PetDict).filter(([id, p]) => 
                    p.name.includes(keyword) || p.type.includes(keyword)
                ).map(([id, p]) => ({ category: 'pet', id, ...p }));
            }
            if (!category || category === 'item') {
                data = data.concat(ItemList.filter(i => 
                    i.name.includes(keyword) || i.type.includes(keyword)
                ).map(i => ({ category: 'item', ...i })));
            }
            if (!category || category === 'skill') {
                data = data.concat(Object.entries(SkillDict).filter(([name, s]) => 
                    name.includes(keyword) || s.text.includes(keyword)
                ).map(([name, s]) => ({ category: 'skill', name, ...s })));
            }
            console.log('🔍 搜索结果:', data);
            return data;
        },
        getPet: (id) => PetDict[id],
        getItem: (id) => ItemList.find(i => i.id === id),
        getSkill: (name) => SkillDict[name],
        getAll: () => ({ PetDict, ItemList, SkillDict })
    };

    console.log('💡 在控制台输入 __pokedex 可查看 API');
})();
