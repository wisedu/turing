# tg-turing

> * tg-turing 视图数据适配引擎
> * 模型驱动组件库：[res.wisedu.com](http://res.wisedu.com/pc/tg-listview)

## 基本用法

```
npm i tg-turing --save
```

### 定义一个视图数据适配器，如：Dept.js

适配器中包含两部分： 
1. 视图的定义； 即表单、表格所需要呈现的字段属性的定义。
2. 数据操作的定义；

> es6 写法

```js
import {DataAdapter} from 'tg-turing'
import TgAntd from 'tg-turing-antd'
export default class extends DataAdapter {
    constructor() {
        super()
        //视图定义
        let views = {
            //default这一段是基础属性会与以下其他的视图定义做合并输出
            "default": {
                id: { caption: "编号" },
                name: { caption: "名称" },
                pId: { caption: "父级部门编号" },
            },
            //以下视图定义根据业务需要，进行追加，每个属性即对于default的扩展
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
        this.actions.delete.url = "/api/dept/{id}";
        this.actions.delete.method = "delete"

        this.initView(views);
    }
    view(name, params) {
        let props = name.split(":")
        let antdtype = props[1];
        return TgTgAntd.Adapter(antdtype, this.getView(props), params);
    }
    toTreeData(data) {
        return TgAntd.Adapter("tree", data, {ukey:"id", pkey:'pId', root: "", label:"name"})
    }
    scdFindAll() {
        //覆盖一个findAll，一般用在新的实例上。
        this.actions.find.url = "/api/dept/scdFindAll";
        return this.findAll().then(datas => datas === undefined ? [] : datas)
    }
}
```

获取对应view table组件的columns定义

```js
let inst = new Dept();
let columns = inst.view("默认列表:table")

console.log(columns)

[
    {"caption":"编号","title":"编号","key":"id","minWidth":120},
    {"caption":"名称","title":"名称","key":"name","minWidth":150},
    {"caption":"父级部门编号","title":"父级部门编号","key":"pId","minWidth":120}
]
```

`默认列表:table` 属性与 `default` 属性 合并再经过 antdAdapter 转换，返回以上属性结果，与 [iview table column](https://www.iviewui.com/components/table#column) 相匹配，可以如下方示例，直接绑定到 table 的 columns 属性上

```html
<Table :columns="columns" :data="rowData"></Table>
```

### 数据赋值

为了配合 [Vue.js的响应式机制](https://cn.vuejs.org/v2/guide/reactivity.html) ，需要初始化时就构造完整的数据项，以便在过程中补充新的数据项时，监听器仍然生效。
1. 提供了根据视图模型构造初始数据对象的方法：initData
1. 整个数据赋值，为了保证每个数据项的监听器可以被正确的触发，请使用浅拷贝方法：Object.assign。IE系列不支持，需要通过[Polyfill](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)来支持

```js
export default {
    data(){
        return {
            fields: inst.view("默认表单:form"),
            data: inst.initData("默认表单:form"),
        }
    },
    mounted(){
        inst.execute({url:"http://localhost:2500/axsfw/data.json", method:"get"}).then(results => {
            Object.assign(this.data, results.data);
        })
    },
}

```



### 查询数据动态条件 querySetting

```js
/**
 * Dept.vue：
 * this.searchValues = {"字段":"值","User.字段":"值"}
 * 
 * */
methods: {
    query() {
        inst.querySetting = inst.querySettingBuilder(this.searchValues, "Dept");
        inst.findAll().then(datas => {
            this.data5 = datas;
        });
    },
}
/**
 * 提交值：
 * {
 *   querySetting:{ "Dept":{"字段":"值"},"User":{"字段":"值"} }
 *   where:{...}
 * }
 * */
```


### 获取数据 findAll

继承后，带有 findAll 方法可以查询数据

```js
let inst = new Dept();
inst.findAll({ parentId:"00001" }).then(datas => {
    this.rowData = inst.toTreeData(datas.data);
});
```

提交地址在构造函数中的 `this.actions.findAll.url` 中已经配置，默认提交的数据结构如下：

> * `this.actions.findAll.params` 中可以配置固定查询参数，会与findAll传入的参数做合并，传入参数的优先级高
> * 数据格式与 Sequelize 接近

```js
{
    "where":{
        "created_at":["2018-05-16T15:41:16.000Z"],
        "parentId":"00001"
    },
    "order":[{"created_at":"+"},{"workcode":"+"}],
    "offset":0,"limit":100
}
```

#### 排序

使用order方法，设置排序，该参数只在findAll方法中生效。

```js
methods: {
    query() {
        inst.querySetting = inst.querySettingBuilder(this.searchValues, "Dept");
        inst.findAll().then(datas => {
            this.data5 = datas;
        });
    },
    sortHandler(param) {
        let keys = param.key.split(".")
        if (param.order !== "normal"){
            inst.order(keys.concat([param.order]));
        } else {
            inst.order(keys);
        }
        this.query()
    }
}
```


#### 提交参数格式需要 自定义

findAll 执行过程中提供以下两个事件可以用于参数 格式处理：

* function beforeFindAll(action, params, props) : Object 
* function afterFindAll(data, action) : Object

需要在构造函数中进行定义，具体示例可以参见底部的 es5 示例


### 保存数据 save

```js
inst.save(this.deptData).then(result => {
    alert("ok")
})
```


### 删除数据 delete

```js
inst.delete(deptId).then(result => {
    alert("ok")
})
```


## 视图属性的定义

以下定义为我们所约定的标准化属性，依此映射到不同风格的实现组件库，如：ant desgin

使用视图定义的展现组件:

1. 表单组件：[formConnector](./formConnector.md)
1. 表格组件：[gridBuilder](./gridBuilder.md)


## action 默认定义

```js
actions = {
    save:{
        url: "",
        method: "post",
        name: ""
    },
    delete:{
        url: "",
        method: "post",
        name: ""
    },
    find:{
        url: "",
        method: "post",
        name: "",
        params: {},
        orders: [],
        include: []
    }
}
```

### 变量参数

url里面可以写{变量名}，会由params中的数据替换掉
如：
```js
this.actions.delete.url = "/api/dept/{id}";
...

this.delete({id:"123"})

```

---

## es5 写法

```js
(function (exports) {
    function ExampleDataAdapter(meta){
            exports.DataAdapter.call(this, meta);
            exports.axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
            exports.axios.defaults.transformRequest = [function (data) {
                var ret = []
                for (var it in data) {
                    ret.push(encodeURIComponent(it) + '=' + encodeURIComponent(data[it]))
                }
                return ret.join('&');
            }],
            this.beforeFindAll = function(action, params, props) {
                return Object.assign({}, params.where, {
                    pageSize: props.pageSize,
                    pageNumber: props.pageNumber
                })
            }
            this.afterFindAll = function(data, action){
                return data.datas[action.name];
            }
    }
    ExampleDataAdapter.prototype = new exports.DataAdapter();
    exports.ExampleDataAdapter = ExampleDataAdapter;
})(window["tg-turing"])


var da = new window["tg-turing"].ExampleDataAdapter();
```


