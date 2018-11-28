export class QuerySettingBuilder {
    constructor() {

    }
    static EMAP(form_data) {
        let model = this.searchDefine.meta;
        let operate_blank_value = true;
        let condition = [];
        let text_fields = model.map(function (item) {
            if (!item.xtype || item.xtype == 'text') {
                return item.name;
            }
        });
        for (let k in form_data) {
            if (operate_blank_value === true && form_data[k] === '') {
                continue;
            }
            if (/_DISPLAY$/.test(k)) continue;
            let modelItem = model.filter(function (item) {
                return item.name == k
            })[0];
            if (!modelItem) continue;
            let item_filter = {
                name: k,
                caption: modelItem.caption,
                linkOpt: "AND",
                builderList: modelItem.builderList,
                builder: modelItem.defaultBuilder,
                value: form_data[k]
            };
            if (form_data[k + '_DISPLAY'] !== undefined) {
                item_filter.value_display = form_data[k + '_DISPLAY'];
            }
            if (operate_blank_value === true) {
                item_filter.value = item_filter.value === '@__blank__value' ? '' : item_filter.value;
            }
            condition.push(item_filter);
        }
        let result = _adaptCondition(condition, model);
        return JSON.stringify(result);
        // 搜索条件数据适配
        function _adaptCondition(condition, model) {
            let resultCondition = [];
            let len = condition.length;
            for (let i = 0; i < len; i++) {
                let condition_item = condition[i];
                if (!(condition_item instanceof Array)) {
                    let model_item = model.filter(function (m_item) {
                        return m_item.name == condition_item.name;
                    })[0];
                    let attr = model_item;
                    // 文本类型控件包含 , 时  builder转化为多值包含
                    if ((!attr.xtype || attr.xtype == 'text') && condition_item.value.toString().indexOf(',') > 0) {
                        condition_item.builder = 'm_value_include';
                    }
                    // 按钮组类型的控件，将value转为string
                    else if (attr.xtype === 'buttonlist' || attr.xtype === 'multi-buttonlist') {
                        if (condition_item.value !== undefined && condition_item.value !== null) {
                            condition_item.value = condition_item.value + '';
                        }
                    }
                    // number 类型，过滤value中的非数字
                    else if (attr.xtype === 'number') {
                        if (condition_item.value) {
                            condition_item.value = condition_item.value.toString().replace(/\D/g, '')
                        }
                        condition_item.value = condition_item.value === null ? '' : numVal * 1;
                    }
                    // 下拉多选、复选框、多选按钮组类型, builder 转化为多值相等
                    else if (attr.xtype == 'multi-select2' || attr.xtype == 'checkboxlist' || attr.xtype == 'multi-buttonlist' || /multi-tree/.test(attr.xtype)) {
                        // 对于空值选项 不支持多值相等
                        if (condition_item.value !== '@__blank__value' && /,/.test(condition_item.value)) {
                            if (condition_item.builder === 'equal' || condition_item.builder === 'include') {
                                condition_item.builder = 'm_value_' + condition_item.builder
                            }
                        } else if (condition_item.value === '@__blank__value' && (condition_item.builder === 'm_value_equal' || condition_item.builder === 'm_value_include')) {
                            // 多值相等或多值包含 下 选择空值时， 转为相等或包含
                            condition_item.builder = condition_item.builder.replace(/m_value_/, '');
                        }
                    }
                    // 类型为date-range日期范围  num-range数字区间 时, 拆分成 两个条件
                    else if (attr.xtype == 'date-range' || attr.xtype == 'number-range') {
                        let date_value = condition_item.value;
                        if (date_value[0] !== "") {
                            condition_item.builder = 'moreEqual';
                            condition_item.value = date_value[0];
                        }
                        if (date_value[1] !== "" && date_value[1] !== undefined) {
                            resultCondition.push({
                                name: condition_item.name,
                                caption: condition_item.caption,
                                builder: 'lessEqual',
                                linkOpt: 'AND',
                                builderList: 'cbl_Other',
                                value: date_value[1]
                            });
                        }
                    }
                }
                resultCondition.push(condition_item)
            }
            return resultCondition;
        }
    }
    static lite(params) {
        if (Object.keys(params).length > 0 && !params.querySetting) {
            let query = [];
            for (let key in params) {
                let value = params[key];
                if (Array.isArray(value)) {
                    value = value.join(",");
                }
                query.push({
                    name: key,
                    value: value,
                    linkOpt: 'AND',
                    builder: 'include'
                });
            }
            return JSON.stringify(query);
        } else {
            return undefined;
        }
    }
    static sequelize(searchValues, defaultScope, ignoreEmpty) {
        let ie = ignoreEmpty === undefined ? true : ignoreEmpty;
        let newQS = {};
        newQS[defaultScope] = {};
        for (const key in searchValues) {
            const element = searchValues[key];
            if (ie) {
                if (element === "") {
                    continue;
                } else if (element instanceof Array && !element.some(item => item !== "")) {
                    continue;
                }
            }
            if (key.indexOf("@") > -1) {
                let newScope = key.substring(0, key.indexOf("@"));
                let newKey = key.substring(key.indexOf("@") + 1, key.length);
                if (newQS[newScope] === undefined) {
                    newQS[newScope] = {}
                }
                newQS[newScope][newKey] = element;
            } else {
                newQS[defaultScope][key] = element;
            }
        }
        return newQS;
    }
}