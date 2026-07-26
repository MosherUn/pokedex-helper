/**
 * 图鉴数据 - 精灵 + 道具 + 技能
 */

// ==================== 精灵图鉴 ====================
const PetDict = {
    // ===== BOSS =====
    boss1: {
        name: '竹牛尊者',
        type: 'boss',
        subject: '随机科目',
        desc: '竹青村的守护者，每晚7点至9点55分出没。击败后可获得稀有装备，是游戏中最具挑战性的BOSS之一。',
        habitat: '竹青村'
    },
    boss2: {
        name: '戴斯特洛伊亚',
        type: 'boss',
        subject: '随机科目',
        desc: '强大的火属性BOSS，击败6次后可开启专属宝箱。拥有极高的攻击力和防御力，需要精心准备才能挑战。',
        habitat: '火之领域'
    },

    // ===== 道馆精灵 =====
    怪1: {
        name: '初级全能怪兽',
        type: '木',
        subject: '语数英',
        desc: '道馆中的初级挑战者，适合新手训练家练手。虽然实力不强，但能帮助训练家熟悉战斗机制。',
        habitat: '道馆'
    },
    怪2: {
        name: '中级全能怪兽',
        type: '木',
        subject: '随机科目',
        desc: '道馆中的中级挑战者，比初级更强，需要更好的策略和更强大的精灵才能战胜。',
        habitat: '道馆'
    },

    // ===== 金系 - 鹿系列 =====
    鹿1: {
        name: '读诗小鹿',
        type: '金',
        subject: '古诗',
        desc: '热爱古诗的小鹿，擅长古诗词题目。击败后可获得金灵石，是鹿系列的初级形态。',
        evolveTo: '鹿2',
        evolveItem: '金灵石Lv1',
        habitat: '月白镇附近'
    },
    鹿2: {
        name: '背诗小鹿',
        type: '金',
        subject: '古诗',
        desc: '背诗小鹿是读诗小鹿的进化形态，古诗词造诣更深。能背诵更多经典诗篇，战斗力大幅提升。',
        evolveFrom: '鹿1',
        evolveTo: '鹿3',
        evolveItem: '金灵石Lv2',
        habitat: '月白镇附近'
    },
    鹿3: {
        name: '作诗鹿',
        type: '金',
        subject: '古诗',
        desc: '作诗鹿是鹿的最终形态，不仅能背诗还能即兴创作。拥有极高的古诗素养，是金系精灵的顶级存在。',
        evolveFrom: '鹿2',
        habitat: '月白镇附近'
    },

    // ===== 土系 - 松鼠系列 =====
    鼠1: {
        name: '算术松鼠',
        type: '土',
        subject: '四则运算',
        desc: '擅长基础算术的松鼠，是数学小精灵的初级形态。能快速完成加减乘除运算。',
        evolveTo: '鼠2',
        evolveItem: '土灵石Lv1',
        habitat: '数学森林'
    },
    鼠2: {
        name: '心算松鼠',
        type: '土',
        subject: '混合运算',
        desc: '心算松鼠能快速完成混合运算，比算术松鼠更强大。拥有更强的计算能力和战斗技巧。',
        evolveFrom: '鼠1',
        evolveTo: '鼠3',
        evolveItem: '土灵石Lv2',
        habitat: '数学森林'
    },
    鼠3: {
        name: '速算兽',
        type: '土',
        subject: '混合运算',
        desc: '速算兽是松鼠的最终形态，计算速度极快。能在瞬间完成复杂的数学运算，是土系精灵的巅峰。',
        evolveFrom: '鼠2',
        habitat: '数学森林'
    },

    // ===== 火系 - 鹰系列 =====
    鹰1: {
        name: '单词小鹰',
        type: '火',
        subject: '英语',
        desc: '英语小精灵的初级形态，擅长基础英语单词。拥有良好的英语基础，适合初学者。',
        evolveTo: '鹰2',
        evolveItem: '火灵石Lv1',
        habitat: '英语高地'
    },
    鹰2: {
        name: '词典小鹰',
        type: '火',
        subject: '英语',
        desc: '词典小鹰掌握大量英语词汇，比单词小鹰更强。能熟练运用各种英语表达。',
        evolveFrom: '鹰1',
        evolveTo: '鹰3',
        evolveItem: '火灵石Lv2',
        habitat: '英语高地'
    },
    鹰3: {
        name: '词库鹰',
        type: '火',
        subject: '英语',
        desc: '词库鹰是鹰的最终形态，拥有海量英语词汇库。是英语小精灵的顶级形态，战斗力极强。',
        evolveFrom: '鹰2',
        habitat: '英语高地'
    },

    // ===== 水系 - 企鹅系列 =====
    企1: {
        name: '寒冰小蛋',
        type: '水',
        subject: '化学',
        desc: '化学小精灵的初级形态，擅长基础化学知识。对化学元素和反应有初步了解。',
        evolveTo: '企2',
        evolveItem: '水灵石Lv1',
        habitat: '寒冰岛'
    },
    企2: {
        name: '冰雪企鹅',
        type: '水',
        subject: '化学',
        desc: '冰雪企鹅对化学知识有更深的理解，比寒冰小蛋更强。能掌握更多化学反应原理。',
        evolveFrom: '企1',
        evolveTo: '企3',
        evolveItem: '水灵石Lv2',
        habitat: '寒冰岛'
    },
    企3: {
        name: '冰企鲨',
        type: '水',
        subject: '化学',
        desc: '冰企鲨是企的最终形态，掌握高级化学知识。是化学小精灵的顶级形态，拥有强大的战斗能力。',
        evolveFrom: '企2',
        habitat: '寒冰岛'
    },

    // ===== 木系 - 熊系列 =====
    熊1: {
        name: '小木熊',
        type: '木',
        subject: '生物',
        desc: '生物小精灵的初级形态，擅长基础生物学知识。对生物世界充满好奇。',
        evolveTo: '熊2',
        evolveItem: '木灵石Lv1',
        habitat: '木木森林'
    },
    熊2: {
        name: '木木熊',
        type: '木',
        subject: '生物',
        desc: '木木熊对生物知识有更深的理解，比小木熊更强。掌握了更多生物学的奥秘。',
        evolveFrom: '熊1',
        evolveTo: '熊3',
        evolveItem: '木灵石Lv2',
        habitat: '木木森林'
    },
    熊3: {
        name: '大木熊',
        type: '木',
        subject: '生物',
        desc: '大木熊是熊的最终形态，掌握高级生物学知识。是生物小精灵的顶级形态，力量与智慧并存。',
        evolveFrom: '熊2',
        habitat: '木木森林'
    },

    // ===== 金系 - 龙系列 =====
    龙1: {
        name: '雷龙宝宝',
        type: '金',
        subject: '英语',
        desc: '雷龙宝宝是龙系小精灵的初级形态，擅长英语。虽然体型较小，但潜力巨大。',
        evolveTo: '龙2',
        evolveItem: '金灵石Lv1',
        habitat: '雷龙山谷'
    },
    龙2: {
        name: '雷电龙',
        type: '金',
        subject: '英语',
        desc: '雷电龙比雷龙宝宝更强大，英语水平更高。掌握了更多高级英语知识。',
        evolveFrom: '龙1',
        evolveTo: '龙3',
        evolveItem: '金灵石Lv2',
        habitat: '雷龙山谷'
    },
    龙3: {
        name: '驭雷魔龙',
        type: '金',
        subject: '英语',
        desc: '驭雷魔龙是龙的最终形态，拥有强大的英语能力。是龙系精灵的巅峰，战斗力极为恐怖。',
        evolveFrom: '龙2',
        habitat: '雷龙山谷'
    },

    // ===== 土系 - 鸭系列 =====
    鸭1: {
        name: '来算术鸭',
        type: '土',
        subject: '混合运算',
        desc: '算术鸭的初级形态，擅长混合运算。运算能力出众，是数学小精灵中的佼佼者。',
        evolveTo: '鸭2',
        evolveItem: '土灵石Lv1',
        habitat: '数学池塘'
    },
    鸭2: {
        name: '快算术鸭',
        type: '土',
        subject: '混合运算',
        desc: '快算术鸭运算速度更快，比来算术鸭更强。能在更短时间内完成复杂计算。',
        evolveFrom: '鸭1',
        evolveTo: '鸭3',
        evolveItem: '土灵石Lv2',
        habitat: '数学池塘'
    },
    鸭3: {
        name: '算术妙妙鸭',
        type: '土',
        subject: '混合运算',
        desc: '算术妙妙鸭是鸭的最终形态，运算能力极强。是数学小精灵的顶级形态。',
        evolveFrom: '鸭2',
        habitat: '数学池塘'
    },

    // ===== 火系 - 火龙系列 =====
    火龙1: {
        name: '火种龙',
        type: '火',
        subject: '历史',
        desc: '火种龙是火系小精灵的初级形态，擅长历史知识。对历史事件有浓厚兴趣。',
        evolveTo: '火龙2',
        evolveItem: '火灵石Lv1',
        habitat: '历史火山'
    },
    火龙2: {
        name: '薪火龙',
        type: '火',
        subject: '历史',
        desc: '薪火龙比火种龙更强大，历史知识更丰富。掌握了更多历史事件的来龙去脉。',
        evolveFrom: '火龙1',
        evolveTo: '火龙3',
        evolveItem: '火灵石Lv2',
        habitat: '历史火山'
    },
    火龙3: {
        name: '炼狱龙',
        type: '火',
        subject: '历史',
        desc: '炼狱龙是火龙系列的最终形态，掌握深厚的历史知识。是历史小精灵的顶级形态。',
        evolveFrom: '火龙2',
        habitat: '历史火山'
    },

    // ===== 火系 - 狼系列 =====
    狼1: {
        name: '小火狼',
        type: '火',
        subject: '成语',
        desc: '小火狼是成语小精灵的初级形态，擅长基础成语。对中华成语文化有初步了解。',
        evolveTo: '狼2',
        evolveItem: '火灵石Lv1',
        habitat: '成语草原'
    },
    狼2: {
        name: '炎狼',
        type: '火',
        subject: '成语',
        desc: '炎狼比小火狼更强大，成语知识更丰富。能熟练运用更多成语表达。',
        evolveFrom: '狼1',
        evolveTo: '狼3',
        evolveItem: '火灵石Lv2',
        habitat: '成语草原'
    },
    狼3: {
        name: '赤焰狼',
        type: '火',
        subject: '成语',
        desc: '赤焰狼是狼的最终形态，掌握大量成语。是成语小精灵的巅峰存在。',
        evolveFrom: '狼2',
        habitat: '成语草原'
    },

    // ===== 水系 - 水狼系列 =====
    水狼1: {
        name: '小汐狼',
        type: '水',
        subject: '化学',
        desc: '小汐狼是水系狼的初级形态，擅长化学知识。对化学世界充满探索欲望。',
        evolveTo: '水狼2',
        evolveItem: '水灵石Lv1',
        habitat: '汐狼湖畔'
    },
    水狼2: {
        name: '渊狼',
        type: '水',
        subject: '化学',
        desc: '渊狼比小汐狼更强大，化学知识更深。掌握了更多化学反应的原理。',
        evolveFrom: '水狼1',
        evolveTo: '水狼3',
        evolveItem: '水灵石Lv2',
        habitat: '汐狼湖畔'
    },
    水狼3: {
        name: '渊汐狼',
        type: '水',
        subject: '化学',
        desc: '渊汐狼是水狼系列的最终形态，掌握高级化学知识。是化学小精灵的顶级形态。',
        evolveFrom: '水狼2',
        habitat: '汐狼湖畔'
    },

    // ===== 水系 - 海马系列 =====
    海1: {
        name: '小溪海马',
        type: '水',
        subject: '古诗',
        desc: '小溪海马是海马系列的初级形态，擅长古诗。对古诗词有独特的理解。',
        evolveTo: '海2',
        evolveItem: '水灵石Lv1',
        habitat: '海滨小镇'
    },
    海2: {
        name: '小河海马',
        type: '水',
        subject: '古诗',
        desc: '小河海马比小溪海马更强大，古诗水平更高。能欣赏更多古诗词的意境。',
        evolveFrom: '海1',
        evolveTo: '海3',
        evolveItem: '水灵石Lv2',
        habitat: '海滨小镇'
    },
    海3: {
        name: '江流海马',
        type: '水',
        subject: '古诗',
        desc: '江流海马是海马的最终形态，拥有深厚的古诗功底。是古诗小精灵的顶级形态。',
        evolveFrom: '海2',
        habitat: '海滨小镇'
    },

    // ===== 木系 - 蛾系列 =====
    蛾1: {
        name: '树蛾种子',
        type: '木',
        subject: '四则运算',
        desc: '树蛾种子的初级形态，擅长基础四则运算。虽然小巧但潜力无限。',
        evolveTo: '蛾2',
        evolveItem: '木灵石Lv1',
        habitat: '树蛾森林'
    },
    蛾2: {
        name: '树蛾果实',
        type: '木',
        subject: '四则运算',
        desc: '树蛾果实比种子更强大，运算能力更强。是树蛾成长的重要阶段。',
        evolveFrom: '蛾1',
        evolveTo: '蛾3',
        evolveItem: '木灵石Lv2',
        habitat: '树蛾森林'
    },
    蛾3: {
        name: '树蛾精灵',
        type: '木',
        subject: '四则运算',
        desc: '树蛾精灵是蛾的最终形态，掌握高级运算技巧。是木系小精灵的顶级存在。',
        evolveFrom: '蛾2',
        habitat: '树蛾森林'
    },

    // ===== 木系 - 粽子系列 =====
    粽1: {
        name: '粽叶蛋',
        type: '木',
        subject: '端午节',
        desc: '粽叶蛋是节日小精灵的初级形态，擅长端午节知识。是端午节文化的象征。',
        evolveTo: '粽2',
        evolveItem: '木灵石Lv1',
        habitat: '哈哈农场'
    },
    粽2: {
        name: '粽叶叽',
        type: '木',
        subject: '端午节',
        desc: '粽叶叽比粽叶蛋更强大，端午节知识更丰富。是端午节文化的传承者。',
        evolveFrom: '粽1',
        evolveTo: '粽3',
        evolveItem: '木灵石Lv2',
        habitat: '哈哈农场'
    },
    粽3: {
        name: '粽姬',
        type: '木',
        subject: '端午节',
        desc: '粽姬是粽子系列的最终形态，掌握全面的端午节文化。是节日小精灵的巅峰。',
        evolveFrom: '粽2',
        habitat: '哈哈农场'
    },

    // ===== 土系 - 蝙蝠系列 =====
    蝠1: {
        name: '新月',
        type: '土',
        subject: '成语',
        desc: '新月是蝙蝠系列的初级形态，擅长成语知识。是成语小精灵中的新星。',
        evolveTo: '蝠2',
        evolveItem: '土灵石Lv1',
        habitat: '蝙蝠洞穴'
    },
    蝠2: {
        name: '夜影',
        type: '土',
        subject: '成语',
        desc: '夜影比新月更强大，成语知识更丰富。是成语小精灵中的高手。',
        evolveFrom: '蝠1',
        evolveTo: '蝠3',
        evolveItem: '土灵石Lv2',
        habitat: '蝙蝠洞穴'
    },
    蝠3: {
        name: '魇魔',
        type: '土',
        subject: '成语',
        desc: '魇魔是蝙蝠的最终形态，掌握大量成语。是成语小精灵的顶级存在。',
        evolveFrom: '蝠2',
        habitat: '蝙蝠洞穴'
    },

    // ===== 水系 - 雪系列 =====
    雪1: {
        name: '满月',
        type: '水',
        subject: '英语',
        desc: '满月是雪系列的初级形态，擅长英语知识。是英语小精灵中的新星。',
        evolveTo: '雪2',
        evolveItem: '水灵石Lv1',
        habitat: '寒冰岛'
    },
    雪2: {
        name: '戾鸣',
        type: '水',
        subject: '英语',
        desc: '戾鸣比满月更强大，英语水平更高。是英语小精灵中的高手。',
        evolveFrom: '雪1',
        evolveTo: '雪3',
        evolveItem: '水灵石Lv2',
        habitat: '寒冰岛'
    },
    雪3: {
        name: '刹明',
        type: '水',
        subject: '英语',
        desc: '刹明是雪系列的最终形态，拥有高超的英语能力。是英语小精灵的顶级存在。',
        evolveFrom: '雪2',
        habitat: '寒冰岛'
    },

    // ===== 土系 - 狗系列 =====
    狗1: {
        name: '小土狗',
        type: '土',
        subject: '历史',
        desc: '小土狗是狗系列的初级形态，擅长历史知识。对历史事件充满好奇。',
        evolveTo: '狗2',
        evolveItem: '土灵石Lv1',
        habitat: '土狗村落'
    },
    狗2: {
        name: '忠挚黄',
        type: '土',
        subject: '历史',
        desc: '忠挚黄比小土狗更强大，历史知识更丰富。是历史小精灵中的忠诚守护者。',
        evolveFrom: '狗1',
        evolveTo: '狗3',
        evolveItem: '土灵石Lv2',
        habitat: '土狗村落'
    },
    狗3: {
        name: '岩古帝',
        type: '土',
        subject: '历史',
        desc: '岩古帝是狗的最终形态，掌握深厚的历史知识。是历史小精灵的顶级存在。',
        evolveFrom: '狗2',
        habitat: '土狗村落'
    },

    // ===== 木系 - 椰子系列 =====
    椰1: {
        name: '椰仔',
        type: '木',
        subject: '地理',
        desc: '椰仔是椰子系列的初级形态，擅长地理知识。对世界地理充满探索欲望。',
        evolveTo: '椰2',
        evolveItem: '木灵石Lv1',
        habitat: '度假岛'
    },
    椰2: {
        name: '椰灵',
        type: '木',
        subject: '地理',
        desc: '椰灵比椰仔更强大，地理知识更丰富。是地理小精灵中的灵性存在。',
        evolveFrom: '椰1',
        evolveTo: '椰3',
        evolveItem: '木灵石Lv2',
        habitat: '度假岛'
    },
    椰3: {
        name: '幻屿椰',
        type: '木',
        subject: '地理',
        desc: '幻屿椰是椰子的最终形态，掌握全面的地理知识。是地理小精灵的顶级存在。',
        evolveFrom: '椰2',
        habitat: '度假岛'
    },

    // ===== 水系 - 猫系列 =====
    猫1: {
        name: '水茸猫',
        type: '水',
        subject: '生物',
        desc: '水茸猫是猫系列的初级形态，擅长生物知识。对生物世界充满好奇。',
        evolveTo: '猫2',
        evolveItem: '水灵石Lv1',
        habitat: '凌涟岛'
    },
    猫2: {
        name: '沫茉猫',
        type: '水',
        subject: '生物',
        desc: '沫茉猫比水茸猫更强大，生物知识更丰富。是生物小精灵中的优雅存在。',
        evolveFrom: '猫1',
        evolveTo: '猫3',
        evolveItem: '水灵石Lv2',
        habitat: '凌涟岛'
    },
    猫3: {
        name: '涟汐猫',
        type: '水',
        subject: '生物',
        desc: '涟汐猫是猫的最终形态，掌握高级生物知识。是生物小精灵的顶级存在。',
        evolveFrom: '猫2',
        habitat: '凌涟岛'
    },

    // ===== 木系 - 猴系列 =====
    猴1: {
        name: '木顽猴',
        type: '木',
        subject: '混合运算',
        desc: '木顽猴是猴系列的初级形态，擅长混合运算。是数学小精灵中的顽皮存在。',
        evolveTo: '猴2',
        evolveItem: '木灵石Lv1',
        habitat: '花园道馆'
    },
    猴2: {
        name: '迅行猴',
        type: '木',
        subject: '混合运算',
        desc: '迅行猴比木顽猴更强大，运算速度更快。是数学小精灵中的敏捷高手。',
        evolveFrom: '猴1',
        evolveTo: '猴3',
        evolveItem: '木灵石Lv2',
        habitat: '花园道馆'
    },
    猴3: {
        name: '斗神猴',
        type: '木',
        subject: '混合运算',
        desc: '斗神猴是猴的最终形态，运算能力极强。是数学小精灵的顶级存在。',
        evolveFrom: '猴2',
        habitat: '花园道馆'
    },

    // ===== 土系 - 兔系列 =====
    兔1: {
        name: '泥团兔',
        type: '土',
        subject: '化学',
        desc: '泥团兔是兔系列的初级形态，擅长化学知识。对化学世界充满探索欲望。',
        evolveTo: '兔2',
        evolveItem: '土灵石Lv1',
        habitat: '花园道馆'
    },
    兔2: {
        name: '砂茸兔',
        type: '土',
        subject: '化学',
        desc: '砂茸兔比泥团兔更强大，化学知识更丰富。是化学小精灵中的灵性存在。',
        evolveFrom: '兔1',
        evolveTo: '兔3',
        evolveItem: '土灵石Lv2',
        habitat: '花园道馆'
    },
    兔3: {
        name: '丘壤兔',
        type: '土',
        subject: '化学',
        desc: '丘壤兔是兔的最终形态，掌握高级化学知识。是化学小精灵的顶级存在。',
        evolveFrom: '兔2',
        habitat: '花园道馆'
    }
};


// ==================== 道具图鉴 ====================
const ItemList = [
    // ===== 捕捉球 =====
    { id: 'b0', name: '试用型捕捉球', type: 'ball', desc: '最高可捕捉Lv5的野生精灵，捕捉失败可回收再用，新手必备。' },
    { id: 'b1', name: '捕捉球Lv1', type: 'ball', desc: '最高可捕捉Lv4的野生精灵，消耗品，使用后消失。' },
    { id: 'b2', name: '捕捉球Lv2', type: 'ball', desc: '最高可捕捉Lv8的野生精灵，比Lv1捕捉球更强。' },
    { id: 'b3', name: '捕捉球Lv3', type: 'ball', desc: '最高可捕捉Lv12的野生精灵，捕捉球系列的最强版本。' },

    // ===== 变异捕捉球 =====
    { id: 'by1', name: '变异捕捉球Lv1', type: 'ball2', desc: '最高可捕捉Lv4的野生变异精灵，专门用于捕捉变异精灵。' },
    { id: 'by2', name: '变异捕捉球Lv2', type: 'ball2', desc: '最高可捕捉Lv8的野生变异精灵，比Lv1更强。' },
    { id: 'by3', name: '变异捕捉球Lv3', type: 'ball2', desc: '最高可捕捉Lv12的野生变异精灵，变异捕捉球的最强版本。' },

    // ===== 治疗道具 =====
    { id: 'hh1', name: '药箱Lv1', type: 'heal', desc: '恢复所有精灵25%生命值，团队治疗必备。' },
    { id: 'hh2', name: '药箱Lv2', type: 'heal', desc: '恢复所有精灵50%生命值，比Lv1药箱治疗效果更好。' },
    { id: 'hh3', name: '药箱Lv3', type: 'heal', desc: '恢复所有精灵75%生命值，药箱系列的顶级版本。' },
    { id: 'h1', name: '药水Lv1', type: 'heal', desc: '恢复50点生命值，单体治疗，性价比高。' },
    { id: 'h2', name: '药水Lv2', type: 'heal', desc: '恢复100点生命值，比Lv1药水更有效。' },
    { id: 'h3', name: '药水Lv3', type: 'heal', desc: '恢复200点生命值，药水系列的强力版本。' },
    { id: 'm1', name: '魔力药箱Lv1', type: 'heal', desc: '恢复所有精灵50%魔力值，团队魔力恢复必备。' },
    { id: 'm2', name: '魔力药箱Lv2', type: 'heal', desc: '恢复所有精灵100%魔力值，魔力药箱的最强版本。' },

    // ===== 进化灵石 =====
    { id: 'goldC', name: '金灵石Lv1', type: 'elem', desc: '触发金属性精灵初次进化的魔法石（鹿、龙等）。' },
    { id: 'earthC', name: '土灵石Lv1', type: 'elem', desc: '触发土属性精灵初次进化的魔法石（鼠、鸭等）。' },
    { id: 'fireC', name: '火灵石Lv1', type: 'elem', desc: '触发火属性精灵初次进化的魔法石（鹰、狼等）。' },
    { id: 'waterC', name: '水灵石Lv1', type: 'elem', desc: '触发水属性精灵初次进化的魔法石（企、海等）。' },
    { id: 'woodC', name: '木灵石Lv1', type: 'elem', desc: '触发木属性精灵初次进化的魔法石（熊、蛾等）。' },
    { id: 'goldC2', name: '金灵石Lv2', type: 'elem', desc: '触发金属性精灵完全进化的魔法石，是Lv1的升级版。' },
    { id: 'earthC2', name: '土灵石Lv2', type: 'elem', desc: '触发土属性精灵完全进化的魔法石，是Lv1的升级版。' },
    { id: 'fireC2', name: '火灵石Lv2', type: 'elem', desc: '触发火属性精灵完全进化的魔法石，是Lv1的升级版。' },
    { id: 'waterC2', name: '水灵石Lv2', type: 'elem', desc: '触发水属性精灵完全进化的魔法石，是Lv1的升级版。' },
    { id: 'woodC2', name: '木灵石Lv2', type: 'elem', desc: '触发木属性精灵完全进化的魔法石，是Lv1的升级版。' },

    // ===== 货币和经验 =====
    { id: 'g100', name: '100金币盒子', type: 'coin', desc: '获得100金币，快速获取游戏货币。' },
    { id: 'g500', name: '500金币盒子', type: 'coin', desc: '获得500金币，比100金币盒子更丰厚。' },
    { id: 'g1k', name: '1000金币盒子', type: 'coin', desc: '获得1000金币，快速积累财富。' },
    { id: 'e1', name: '50经验盒子', type: 'exp', desc: '获得50经验，帮助精灵快速升级。' },
    { id: 'e2', name: '100经验盒子', type: 'exp', desc: '获得100经验，比50经验盒子更有效。' },
    { id: 'e3', name: '250经验盒子', type: 'exp', desc: '获得250经验，经验值丰厚的盒子。' },
    { id: 'e4', name: '500经验盒子', type: 'exp', desc: '获得500经验，快速提升精灵等级。' },
    { id: 'e5', name: '1000经验盒子', type: 'exp', desc: '获得1000经验，经验盒子中的顶级产品。' },

    // ===== 特殊道具 =====
    { id: 'rankS', name: '战绩排行卷轴', type: 'score', desc: '查看战绩排行，了解自己在玩家中的排名。' },
    { id: 'card1', name: '扩容卡', type: 'addMaxPets', desc: '增加精灵携带数上限1格，最多可扩容至8格。' }
];


// ==================== 技能图鉴 ====================
const SkillDict = {
    '攻击': {
        text: '普通的攻击，消耗0点魔力，最基础的战斗技能。',
        mp: 0,
        type: '基础'
    },
    '防御': {
        text: '本回合伤害减半，累积增加10%暴击率，消耗0点魔力，防御型技能。',
        mp: 0,
        type: '防御'
    },
    '破防': {
        text: '如果对手使用防御，会对其造成暴击伤害，消耗2点魔力，针对防御型对手。',
        mp: 2,
        type: '攻击'
    },
    '吸血攻击': {
        text: '对方受到的伤害用来恢复我方的生命，消耗20点魔力，强大的生存技能。',
        mp: 20,
        type: '恢复'
    },
    '攻击吸收': {
        text: '我方受到的伤害用来恢复我方的生命，消耗15点魔力，被动防御技能。',
        mp: 15,
        type: '防御'
    },
    '乾坤一掷': {
        text: '降低一半防御力，提高50%暴击率的攻击，消耗5点魔力，高风险高回报。',
        mp: 5,
        type: '攻击'
    },
    '本能一击': {
        text: '生命值越低，攻击和防御力反而越高，消耗10点魔力，绝地反击型技能。',
        mp: 10,
        type: '被动'
    },
    '绝地反击': {
        text: '生命值越低，伤害随之大幅增加，消耗50点魔力，濒死时的强力反击。',
        mp: 50,
        type: '攻击'
    },
    '背水一战': {
        text: '生命值越低，暴击率随之大幅增加，消耗20点魔力，孤注一掷的技能。',
        mp: 20,
        type: '被动'
    },
    '铁壁意志': {
        text: '生命值越低，防御随之大幅增加，消耗30点魔力，绝境中的防御技能。',
        mp: 30,
        type: '防御'
    },
    '自我再生': {
        text: '恢复40%的生命值，消耗15点魔力，强大的自我恢复技能。',
        mp: 15,
        type: '恢复'
    },
    '两倍攻击': {
        text: '以2倍攻击力出招，消耗8点魔力，强力的攻击技能。',
        mp: 8,
        type: '攻击'
    }
};
