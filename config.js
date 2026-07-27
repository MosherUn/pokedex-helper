/**
 * GitHub 配置
 * ⚠️ 此文件包含敏感信息，请勿提交到 GitHub！
 * 
 * 使用方式：
 * 1. 复制此文件为 config.js
 * 2. 填写你的 GitHub 信息
 * 3. 确保 config.js 在 .gitignore 中
 */

const GITHUB_CONFIG = {
    // 你的 GitHub 用户名
    owner: 'shengcun123456',
    
    // 仓库名
    repo: 're_of_pokemon',
    
    // 数据文件路径
    path: 'data/pokedex.json',
    
    // Personal Access Token（请保密！）
    token: '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',
    
    // 分支名
    branch: 'main'
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GITHUB_CONFIG;
}
