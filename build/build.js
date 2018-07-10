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

let template = 
`import 'es6-promise/auto';
import utils from './utils.js';
import uuid from 'uuid'
import axios from 'axios';
import moment from 'moment';
import accounting from 'accounting-js';
import ConnectItem from './formConnector/ConnectItem.js';
import FormConnector from './formConnector/FormConnector.js';
import DocConnector from './formConnector/DocConnector.js';

import {EMAPDataAdapter} from './DataBind/EMAPDataAdapter.js';
import {DataAdapter} from './DataBind/DataAdapter.js';
import {DataSourceManager} from './DataBind/DataSourceManager.js';
import defaults from './Defaults.js';

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
    Vue.directive('tg-funckey', {
        inserted: function(el,binding) {
            let authkeys = [];
            let authkeys_str = window.sessionStorage.getItem("tg-authkeys");
            if (authkeys_str !== undefined && authkeys_str !== null) {
                authkeys = authkeys_str.split(",")
            }
            let funckeys = binding.value.split(",");
            if (authkeys.some(item => funckeys.indexOf(item) > -1) ) {
                el.parentNode.removeChild(el);
            }
        }
    })
};
if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}
export default Object.assign({}, {
    install, ...components, 
    utils, version, description, author, EMAPDataAdapter,
    DataAdapter, DataSourceManager, ConnectItem, FormConnector, DocConnector, defaults,
    axios, moment, accounting, uuid
});
export {
    utils, version, description, author, EMAPDataAdapter,
    DataAdapter, DataSourceManager, ConnectItem, FormConnector, DocConnector, defaults,
    axios, moment, accounting, uuid
}`

fs.writeFileSync(OUTPUT_PATH, template);
console.log('[build entry] DONE:' + OUTPUT_PATH);