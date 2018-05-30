import utils from './src/utils.js';
import axios from 'axios';
import moment from 'moment';
import ModelDrivenFormItem from './ComAdapter/ModelDrivenFormItem.js';
import iviewAdapter from './ComAdapter/iview/iviewAdapter.js';
import iviewForm from './ComAdapter/iview/iviewForm.js';
import {DataAdapter} from './DataBind/DataAdapter.js';
import {DataSourceManager} from './DataBind/DataSourceManager.js';
import TgContainer from './components/tg-container.vue';
import TgDiv from './components/tg-div.vue';
import TgImg from './components/tg-img.vue';
import TgLeftRight from './components/tg-left-right.vue';
import TgLinkbutton from './components/tg-linkbutton.vue';
import TgListview from './components/tg-listview.vue';
import TgText from './components/tg-text.vue';
import IviewMdForm from './ComAdapter/iview/iview-md-form';
import IviewMdText from './ComAdapter/iview/iview-md-text';
const version = "1.2.1";
const description = "turing components";
const author = "金智教育 wisedu";
const components = {
    TgContainer,TgDiv,TgImg,TgLeftRight,TgLinkbutton,TgListview,TgText,IviewMdForm,IviewMdText
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
    iviewAdapter, iviewForm,
    axios, moment
});
export {
    utils, version, description, author, 
    DataAdapter, DataSourceManager, ModelDrivenFormItem, 
    iviewAdapter, iviewForm,
    axios, moment
}