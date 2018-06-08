var fs = require('fs');
var path = require('path');

var packageJSON = JSON.parse(fs.readFileSync("./package.json"));

var OUTPUT_PATH = path.join(__dirname, '../entry.js')
var components = [];
var cmpPath = 'components/';

// 根据目录生成vue文件名: 'bh-button' -> 'bhButton'
// 所以组件和目录命名要遵循此规则
fs.readdirSync(cmpPath).forEach((dir) => {
    // 跳过隐藏文件
    if (dir.indexOf('.') === 0) return
    let itemPath = "";
    let vueName = "";
    var vueClassName = dir.replace(/(-\w)/g, (val) => {
        return val.substring('1').replace(/(\w)/, (first) => {
            return first.toUpperCase();
        });
    });

    if (dir.endsWith(".vue")) {
        //文件形式存储的组件
        vueClassName = vueClassName.substring(0, vueClassName.length - 4)
        vueName = vueName.substring(0, dir.length - 4)
        itemPath = dir;
    } else {
        //目录形式存储的组件
        try {
            if (fs.readFileSync(path.join(cmpPath, dir, dir + '.vue'), 'utf-8') === '') {
                console.log('file empty:' + dir);
                return;
            }
            itemPath = dir + "/" + dir + '.vue';
            vueName = dir;
        } catch (e) {
            console.warn(e.message);
            return;
        }
    }

    var upperName = vueClassName.substring(0, 1).toUpperCase() + vueClassName.substring(1);

    components.push({
        className: upperName,
        path: "./components/" + itemPath,
        vueName: dir
    });
});

let jsImport = [];
let jsClass = [];
components.forEach(item => {
    jsImport.push('import ' + item.className + ' from \'' + item.path + '\';');
    jsClass.push(item.className);
});

jsImport.push(`import IviewFcForm from './formConnector/iview/iview-fc-form';`);
jsClass.push("IviewFcForm");

jsImport.push(`import IviewFcStatic from './formConnector/iview/iview-fc-static';`);
jsClass.push("IviewFcStatic");

jsImport.push(`import MintFcForm from './formConnector/mint/mint-fc-form';`);
jsClass.push("MintFcForm");

jsImport.push(`import MintFcStatic from './formConnector/mint/mint-fc-static';`);
jsClass.push("MintFcStatic");

let template = 
`import utils from './src/utils.js';
import 'core-js';
import axios from 'axios';
import moment from 'moment';
import FormConnectItem from './formConnector/FormConnectItem.js';

import iviewForm from './formConnector/iview/form.js';
import mintForm from './formConnector/mint/form.js';

import {DataAdapter} from './DataBind/DataAdapter.js';
import {DataSourceManager} from './DataBind/DataSourceManager.js';
import DataFilter from './DataBind/DataFilter.js';
${jsImport.join("\r\n")}
const version = "${packageJSON.version}";
const description = "${packageJSON.description}";
const author = "${packageJSON.author}";
const components = {
    ${jsClass.join(",")}
};
const install = function (Vue, opts = {}) {
    if (install.installed) return;
    Object.keys(components).forEach((key) => {
        if (key === "utils") return;
        Vue.component(components[key].name, components[key]);
    });
};
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}
export default Object.assign({}, {
    install, 
    ...components,
    utils, version, description, author, 
    DataAdapter, DataSourceManager, FormConnectItem, 
    iview:{form:iviewForm}, mint:{form:mintForm}, DataFilter,
    axios, moment
});
export {
    utils, version, description, author, 
    DataAdapter, DataSourceManager, FormConnectItem, 
    iviewForm, mintForm, DataFilter,
    axios, moment
}`

fs.writeFileSync(OUTPUT_PATH, template);
console.log('[build entry] DONE:' + OUTPUT_PATH);