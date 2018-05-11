const webpack = require("webpack");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpackConfig = require('./webpack.skin.config.js');
var path = require('path');
var fs = require('fs');
var packageJSON = JSON.parse(fs.readFileSync("./package.json"));

let skins = []
const skinPath = './src/skins'
fs.readdirSync(skinPath).forEach((file) => {
  const fileName = file.replace('.scss', '')
  if (file !== ".DS_Store") {
    skins.push({
      path:skinPath+"/"+fileName,
      filename:fileName,
      content:`@import ${skinPath}/${fileName}`,
      priority:4
    })
  }
})

function getScssFileName(pathname){
  let template = [];
  fs.readdirSync(pathname).forEach((file) => {
    if (file !== ".DS_Store") {
      var info = fs.statSync(pathname+"/"+file)      
      if(info.isDirectory()){
        template = template.concat(getScssFileName(pathname+"/"+file))
      } else {
        let priority = 0;
        let fullpath = pathname + file;
        if (fullpath.toString().indexOf("variable") > -1){
          priority = 3
        } else if(fullpath.toString().indexOf("mixin") > -1) {
          priority = 2
        } else if(fullpath.toString().indexOf("index.scss") > -1) {
          priority = 1
        }
        let item = {
          path:pathname, 
          content:`@import "${pathname}/${file}";\n`,
          priority: priority
        }
        template.push(item)
      }
    }
  })
  return template;
}

const cmpPath = './src/scss'
let files = getScssFileName(cmpPath)
let temp = [];
files.sort((a,b) => {
  if (a.priority < b.priority) {
    return 1
  }
  if (a.priority > b.priority) {
    return -1
  }
  return 0;
}).map(item => {
  temp += item.content
})

skins.map(item => {
  let skinTemp = `@import "./src/skins/${item.filename}.scss";\n` + temp
  var OUTPUT_PATH = path.join(__dirname, `../src/entry-${item.filename}.scss`)
  fs.writeFileSync(OUTPUT_PATH, skinTemp);

  webpackConfig.entry.main = './src/entry-' + item.filename + ".scss";
  webpackConfig.plugins.push(new ExtractTextPlugin({filename: './dist/css/'+item.filename+'/'+packageJSON.packageName+'.min.css', allChunks: true}))

  webpack(webpackConfig, (err, stats) => {
    if (err || stats.hasErrors()) {
        console.error(err.details);
    }
    // console.log(stats)
  });
})
