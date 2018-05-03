var fs = require('fs');
var path = require('path');
require('shelljs/global');
require('cross-env');

var packageJSON = JSON.parse(fs.readFileSync("./package.json"));

var OUTPUT_PATH = 'runtime/'
var components = [];
var cmpPath = 'src/style/variables/';

if (!fs.existsSync('runtime')) {
  fs.mkdirSync('runtime');
}

exec(`npm run buildcss`)

// 根据目录生成vue文件名: 'bh-button' -> 'bhButton'
// 所以组件和目录命名要遵循此规则
fs.readdirSync(cmpPath).forEach((dir) => {
    // 跳过隐藏文件
    if (dir.indexOf('.') === 0) return
    var theme = dir.replace(/\.css/, '')
    fs.writeFileSync(OUTPUT_PATH + 'theme.css', `/*COLOR_THEME:${theme}*/\n` + fs.readFileSync(cmpPath + dir, 'utf-8'));
    exec(`npm run build`)
});
