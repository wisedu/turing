import utils from './utils.js';
import uuid from 'uuid'
import axios from 'axios';
import moment from 'moment';
import accounting from 'accounting-js';
import ConnectItem from './formConnector/ConnectItem.js';
import FormConnector from './formConnector/FormConnector.js';
import DocConnector from './formConnector/DocConnector.js';

import {QuerySettingBuilder} from './dataBind/QuerySettingBuilder.js';
import {EMAPDataAdapter} from './dataBind/EMAPDataAdapter.js';
import {DataAdapter} from './dataBind/DataAdapter.js';
import {DataSourceManager} from './dataBind/DataSourceManager.js';
import defaults from './Defaults.js';

import TgCollectionView from './components/tg-collection-view.vue';
import TgContainer from './components/tg-container.vue';
import TgDiv from './components/tg-div.vue';
import TgEditableGrid from './components/tg-editable-grid.vue';
import TgForm from './components/tg-form.vue';
import TgGridview from './components/tg-gridview.vue';
import TgIcon from './components/tg-icon.vue';
import TgImg from './components/tg-img.vue';
import TgLeftRightItem from './components/tg-left-right-item.vue';
import TgLeftRight from './components/tg-left-right.vue';
import TgLinkbutton from './components/tg-linkbutton.vue';
import TgListview from './components/tg-listview.vue';
import TgPerson from './components/tg-person.vue';
import TgText from './components/tg-text.vue';
import TgToolbar from './components/tg-toolbar.vue';
import TgValidator from './components/tg-validator.vue';
const version = "1.30.3";
const description = "turing components";
const author = "金智教育 wisedu";
const components = {
    TgCollectionView,TgContainer,TgDiv,TgEditableGrid,TgForm,TgGridview,TgIcon,TgImg,TgLeftRightItem,TgLeftRight,TgLinkbutton,TgListview,TgPerson,TgText,TgToolbar,TgValidator
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

            let hasKey = false;
            if (authkeys.some(item => funckeys.indexOf(item) > -1) ) {
                hasKey = true;
            }

            if (hasKey === false) {
                el.parentNode.removeChild(el);
            }
        }
    })
    Vue.filter('date', function (value, format) {
        if (!value) return ''
        if (!format) {
            format = 'YYYY-MM-DD'
        }
        let newstr = moment(value).format(format);
        return newstr;
    })
    Vue.filter('uppercase', function (value) {
        if (!value) return ''
        return value.toString().toUpperCase()
    })
    Vue.filter('lowercase', function (value) {
        if (!value) return ''
        return value.toString().toLowerCase()
    })
    Vue.filter('currency', function (value, symbol='￥', format='%s%v', precision=2, thousand=',', decimal='.') {
        if (value === undefined || value === null || value === "") return ''
        value = value.toString();
        return accounting.formatMoney(value, {symbol, precision, thousand, decimal, format})
    })
    Vue.filter('percent', function (value, precision, thousand, decimal) {
        if (value === undefined || value === null || value === "") return ''
        return accounting.formatNumber(value, {precision, thousand, decimal})
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
    utils, version, description, author, EMAPDataAdapter, QuerySettingBuilder,
    DataAdapter, DataSourceManager, ConnectItem, FormConnector, DocConnector, defaults,
    axios, moment, accounting, uuid
});
export {
    utils, version, description, author, EMAPDataAdapter, QuerySettingBuilder,
    DataAdapter, DataSourceManager, ConnectItem, FormConnector, DocConnector, defaults,
    axios, moment, accounting, uuid
}