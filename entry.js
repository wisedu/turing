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

import TgContainer from './components/tg-container.vue';
import TgDiv from './components/tg-div.vue';
import TgField from './components/tg-field.vue';
import TgForm from './components/tg-form.vue';
import TgGridview from './components/tg-gridview.vue';
import TgImg from './components/tg-img.vue';
import TgLeftRightItem from './components/tg-left-right-item.vue';
import TgLeftRight from './components/tg-left-right.vue';
import TgLinkbutton from './components/tg-linkbutton.vue';
import TgListview from './components/tg-listview.vue';
import TgText from './components/tg-text.vue';
import TgToolbar from './components/tg-toolbar.vue';
import TgValidator from './components/tg-validator.vue';
const version = "1.12.21";
const description = "turing components";
const author = "金智教育 wisedu";
const components = {
    TgContainer,TgDiv,TgField,TgForm,TgGridview,TgImg,TgLeftRightItem,TgLeftRight,TgLinkbutton,TgListview,TgText,TgToolbar,TgValidator
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

if (!String.prototype.startsWith) {
	String.prototype.startsWith = function(search, pos) {
		return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
	};
}

axios.defaults.headers['X-Requested-With'] = 'XMLHttpRequest';

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
}