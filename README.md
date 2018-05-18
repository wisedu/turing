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
                name: { minWidth:120 },
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
        let metaid = props[0];
        let iviewtype = props[1];
        return iviewAdapter(iviewtype, this.getMeta(metaid), params);
    }
    toTreeData(data) {
        return iviewAdapter("tree", data, {ukey:"id", pkey:'pId', root: "", label:"name"})
    }
}
```

获取对应view table组件的columns定义

```js
let inst = new Dept();
let columns = inst.meta("默认表格:table")
console.log(columns)

```

```html
<Table :columns="columns" :data="rowData"></Table>
```




es5 写法

```

```

| 项目        | 价格   |  数量  |
| --------   | -----:  | :----:  |
| 计算机     | \$1600 |   5     |
| 手机        |   \$12   |   12   |
| 管线        |    \$1    |  234  |
