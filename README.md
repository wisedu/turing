# tg-turing

> tg-turing 数据适配引擎 + 模型驱动组件库

## 基本用法

### 定义一个数据适配器

es6 写法

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

`默认列表:table` 属性与 `default` 属性 合并再经过 iviewAdapter 转换，返回以上属性结果，与 [iview table column](https://www.iviewui.com/components/table#column) 相匹配，可以如下方示例，直接绑定到 table 的 columns 属性上

```html
<Table :columns="columns" :data="rowData"></Table>
```


## 模型标准属性


## iviewAdapter

| 类型        | 价格   |  数量  |
| --------   | -----:  | :----:  |
| table     |  |   5     |
| form        |      |   12   |
| tree        |        |  234  |


---

es5 写法

```

```