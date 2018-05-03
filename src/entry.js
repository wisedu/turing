import utils from './utils.js';
import {DataAdapter} from './DataAdapter.js';
import {DataAdapterFactory} from './DataAdapterFactory.js';
import TgListview from './components/tg-listview.vue';
const version = "1.0.0";
const description = "turing components";
const author = "金智教育 wisedu";
const components = {
    TgListview
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
export {utils, version, description, author, DataAdapter, DataAdapterFactory}
export default Object.assign({}, {install, ...components});