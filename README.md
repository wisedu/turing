# tg-turing

> tg-turing 数据适配引擎 + 模型驱动组件库

## 基本用法

```
npm i tg-turing --save
```

### 定义一个数据适配器，如：Dept.js

> es6 写法

```js
import {DataAdapter, iviewAdapter} from 'tg-turing'
export default class extends DataAdapter {
    constructor() {
        super()
        //模型定义
        let struct = {
            //default这一段是模型的基础属性会与以下其他的模型做合并输出
            "default": {
                id: { caption: "编号" },
                name: { caption: "名称" },
                pId: { caption: "父级部门编号" },
            },
            //以下节点根据业务需要，进行追加，每个属性即对于default的扩展
            "默认列表:table": {
                id: { },
                name: { minWidth:150 },
                pId: {},
            },
            "默认表单:form": {
                id: {},
                name: {},
                pId: { xtype:"tree", url:"/api/dept" },
            },
            "查询": {
            }
        }
        this.actions.find.url = "/api/dept";
        this.actions.find.method = "get"
        this.actions.save.url = "/api/dept/save";
        this.actions.delete.url = "/api/dept";
        this.actions.delete.method = "delete"

        this.setMeta(struct);
    }
    meta(name, params) {
        let props = name.split(":")
        let iviewtype = props[1];
        return iviewAdapter(iviewtype, this.getMeta(props), params);
    }
    toTreeData(data) {
        return iviewAdapter("tree", data, {ukey:"id", pkey:'pId', root: "", label:"name"})
    }
}
```

获取对应view table组件的columns定义

```js
let inst = new Dept();
let columns = inst.meta("默认列表:table")

console.log(columns)

[
    {"caption":"编号","title":"编号","key":"id","minWidth":120},
    {"caption":"名称","title":"名称","key":"name","minWidth":150},
    {"caption":"父级部门编号","title":"父级部门编号","key":"pId","minWidth":120}
]
```

`默认列表:table` 属性与 `default` 属性 合并再经过 iviewAdapter 转换，返回以上属性结果，与 [iview table column](https://www.iviewui.com/components/table#column) 相匹配，可以如下方示例，直接绑定到 table 的 columns 属性上

```html
<Table :columns="columns" :data="rowData"></Table>
```


## 模型定义

这些属性由标准模型定义，依此映射到不同的实现组件库，如：iview

### 标准属性

#### default

| 属性 | 描述 | 数据类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| caption | 显示文字 | String | 空 |
| hidden | 是否隐藏 | Boolean | false |
| format | 日期、数字组件专用 | String | 空 |


#### 列表

| 属性 | 描述 | 数据类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| width | 列宽 | Number | 空 |
| isFixed | 固定列 | Boolean | 空 |

#### 表单

| 属性 | 描述 | 数据类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| xtype | 显示控件类型 | Enum | text |
| required | 必填 | Boolean | false |
| url | 远程数据地址 | String | 空 |
| col | 所占列数 | Integer | 1 |
| placeholder | 提示文字 | String | 空 |
| options | 数据选项 | Array | 空 |
| default | 默认值 | String | 空 |
| dataSize | 最大长度校验值 | Integer | 空 |
| checkType | 校验类型 | Enum | 空 |
| JSONParam | 传递个实际组件的参数 | Object | 空 |

xtype 控件类型枚举

| 属性 | 描述 | 
| :--- | :--- | 
| select | 单选下拉 
| multi-select | 多选下拉
| selecttable | 下拉表格/模糊搜索 
| date-ym | 年月选择框， 默认 yyyy-MM 
| date-local | 日期选择框， 默认 yyyy-MM-dd 
| date-full | 日期时间选择框， 默认 yyyy-MM-dd HH:mm 
| date-range | 日期范围选择， 默认 yyyy-MM-dd 
| radiolist | 单选按钮组 
| checkboxlist | 多选按钮组 
| tree | 单选下拉树 
| multi-tree | 多选下拉树 
| switcher | 开关 
| buttonlist | 单选按钮组 
| multi-buttonlist | 多选按钮组 
| textarea | 计数文本域
| number | 数字文本框
| number-range | 数字区间
| uploadfile | 文件上传
| uploadsingleimage | 单图片上传 
| uploadmuiltimage | 多图片上传
| text | 文本 
| div | div占位 
| static | 表单静态字段 


### iviewAdapter 组件属性适配器

以上标准配置由该适配器内部实现属性转换。如果超出的属性，可以直接在模型上定义所需属性，如 minWidth 属性

```js
"默认列表:table": {
    id: { },
    name: { minWidth:150 },
    pId: {},
},
```


---

es5 写法

```

```