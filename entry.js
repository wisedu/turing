import utils from './utils.js';
import axios from 'axios';
import moment from 'moment';
import ConnectItem from './formConnector/ConnectItem.js';
import FormConnector from './formConnector/FormConnector.js';
import DocConnector from './formConnector/DocConnector.js';

import {DataAdapter} from './DataBind/DataAdapter.js';
import {DataSourceManager} from './DataBind/DataSourceManager.js';
import defaults from './Defaults.js';
import TgContainer from './components/tg-container.vue';
import TgDiv from './components/tg-div.vue';
import TgField from './components/tg-field.vue';
import TgForm from './components/tg-form.vue';
import TgImg from './components/tg-img.vue';
import TgLeftRightItem from './components/tg-left-right-item.vue';
import TgLeftRight from './components/tg-left-right.vue';
import TgLinkbutton from './components/tg-linkbutton.vue';
import TgListview from './components/tg-listview.vue';
import TgText from './components/tg-text.vue';
const version = "1.8.4";
const description = "turing components";
const author = "金智教育 wisedu";
const components = {
    TgContainer,TgDiv,TgField,TgForm,TgImg,TgLeftRightItem,TgLeftRight,TgLinkbutton,TgListview,TgText
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
    install, ...components,
    utils, version, description, author, 
    DataAdapter, DataSourceManager, ConnectItem, FormConnector, DocConnector, defaults,
    axios, moment
});
export {
    utils, version, description, author, 
    DataAdapter, DataSourceManager, ConnectItem, FormConnector, DocConnector, defaults,
    axios, moment
}