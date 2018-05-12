import utils from './utils.js';
import axios from 'axios';
import moment from 'moment';
import {iviewAdapter} from './ComAdapter/iviewAdapter.js';
import {DataAdapter} from './DataBind/DataAdapter.js';
import {DataSource} from './DataBind/DataSource.js';
import TgDiv from './components/tg-div.vue';
import TgImg from './components/tg-img.vue';
import TgLinkbutton from './components/tg-linkbutton.vue';
import TgListview from './components/tg-listview.vue';
import TgText from './components/tg-text.vue';
const version = "1.0.1";
const description = "turing components";
const author = "金智教育 wisedu";
const components = {
    TgDiv,TgImg,TgLinkbutton,TgListview,TgText
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
export {utils, version, description, author, DataAdapter, DataSource, axios, moment}
export default Object.assign({}, {install, ...components});