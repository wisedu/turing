import utils from './src/utils.js';
import axios from 'axios';
import moment from 'moment';
import FormConnectItem from './formConnector/FormConnectItem.js';

import iviewForm from './formConnector/iview/form.js';
import mintForm from './formConnector/mint/form.js';

import {DataAdapter} from './DataBind/DataAdapter.js';
import {DataSourceManager} from './DataBind/DataSourceManager.js';
import TgContainer from './components/tg-container.vue';
import TgDiv from './components/tg-div.vue';
import TgForm from './components/tg-form.vue';
import TgImg from './components/tg-img.vue';
import TgLeftRightItem from './components/tg-left-right-item.vue';
import TgLeftRight from './components/tg-left-right.vue';
import TgLinkbutton from './components/tg-linkbutton.vue';
import TgListview from './components/tg-listview.vue';
import TgText from './components/tg-text.vue';
import IviewFcForm from './formConnector/iview/iview-fc-form';
import IviewFcStatic from './formConnector/iview/iview-fc-static';
import MintFcForm from './formConnector/mint/mint-fc-form';
import MintFcStatic from './formConnector/mint/mint-fc-static';
const version = "1.4.8";
const description = "turing components";
const author = "金智教育 wisedu";
const components = {
    TgContainer,TgDiv,TgForm,TgImg,TgLeftRightItem,TgLeftRight,TgLinkbutton,TgListview,TgText,IviewFcForm,IviewFcStatic,MintFcForm,MintFcStatic
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
    iview:{form:iviewForm}, mint:{form:mintForm},
    axios, moment
});
export {
    utils, version, description, author, 
    DataAdapter, DataSourceManager, FormConnectItem, 
    iviewForm, mintForm,
    axios, moment
}