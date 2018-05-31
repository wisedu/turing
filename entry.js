import utils from './src/utils.js';
import axios from 'axios';
import moment from 'moment';
import ModelDrivenFormItem from './ComAdapter/ModelDrivenFormItem.js';

import iviewForm from './ComAdapter/iview/form.js';
import mintForm from './ComAdapter/mint/form.js';


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
import IviewMdForm from './ComAdapter/iview/iview-md-form';
import IviewMdStatic from './ComAdapter/iview/iview-md-static';
import MintMdForm from './ComAdapter/mint/mint-md-form';
import MintMdStatic from './ComAdapter/mint/mint-md-static';
const version = "1.3.5";
const description = "turing components";
const author = "金智教育 wisedu";
const components = {
    TgContainer,TgDiv,TgForm,TgImg,TgLeftRightItem,TgLeftRight,TgLinkbutton,TgListview,TgText,IviewMdForm,IviewMdStatic,MintMdForm,MintMdStatic
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
    DataAdapter, DataSourceManager, ModelDrivenFormItem, 
    iview:{form:iviewForm}, mint:{form:mintForm},
    axios, moment
});
export {
    utils, version, description, author, 
    DataAdapter, DataSourceManager, ModelDrivenFormItem, 
    iviewForm, mintForm,
    axios, moment
}