/**
 * 应用主入口 - 极简启动
 */

(function() {
    'use strict';

    console.log('📖 小精灵图鉴 v2.0');
    console.log('📊 共加载 ' + Object.keys(PetDict).length + ' 只精灵');

    // 暴露 API 到控制台
    window.__pokedex = {
        PetDict: PetDict,
        search: (keyword) => {
            const results = Object.entries(PetDict)
                .filter(([id, pet]) => 
                    pet.name.includes(keyword) || 
                    pet.type.includes(keyword) || 
                    pet.subject.includes(keyword)
                )
                .map(([id, pet]) => pet.name);
            console.log('🔍 搜索结果:', results);
            return results;
        },
        getDetail: (id) => PetDict[id],
        getAll: () => PetDict
    };

    console.log('💡 在控制台输入 __pokedex 可查看 API');
})();