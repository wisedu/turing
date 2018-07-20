# formConnector

该组件配套turing的视图定义使用

## 支持格式

default段必须存在，它作为基础属性会与以下其他的视图定义做合并输出
一般只定义 caption、hidden、format 属性

### 平铺表单格式

```js
let views = {
    "default": {
        ...
    },
    "平铺表单:form": {
        "WID": {},
        "XSBH": {},
        "XH": {},
        "XM": {},
        ...
    }
}
```

运行时格式为：

```js
[
    {"name":"WID","xtype":"text","caption":"WID"},
    {"name":"XSBH","xtype":"text","caption":"登录名","dataSize":40}
    ...
]
```

### 分组表单格式

```js
let views = {
    "default": {
        ...
    },
    "分组表单:form": {
        "WID": {"xtype": "text","dataSize": 40},//定义在外部的字段，显示时会被忽略
        "group:[个人基本信息]":{
            desc:"~个人基本信息~",
            items:{
                "XSBH": {"xtype": "text","dataSize": 40},
                "XMPY": {"dataSize": 120},
                "XBDM": {"dict":dict("XBDM->性别"),"xtype": "buttonlist","dataSize": 1},
                "CSRQ": {"xtype": "date-local","dataSize": 10},
                ...
            }
        },
        "group:[学籍信息]":{
            desc:"~学籍信息~",
            items:{
                "XJZTDM": {"url": "/axsfw/code/12eb4f7c-69a1-41c2-b21e-c99fe850264a.do","xtype": "select","dataSize": 6},
                "YJBYRQ": {"xtype": "date-local","dataSize": 30},
                ...
            }
        },
        "group:[入学信息]":{
            desc:"~入学信息~",
            items:{
                "KSH": {"xtype": "text","dataSize": 20},
                "KSLBDM": {"url": "/axsfw/code/acc2e70d-21d8-48fd-8c11-762fb2d01c47.do","xtype": "select","dataSize": 10},
                "KM5FS": {"xtype": "text","dataSize": [5,2]},
                ...
            }
        },
    }
}
```

运行时格式为：

```js
[
    {
        "name":"group:[个人基本信息]",
        "title":"个人基本信息",
        "desc":"~个人基本信息~",
        "items":[
            {"name":"XSBH","xtype":"text","caption":"登录名","dataSize":40}
            ...
        ]
    },{
        "name":"group:[学籍信息]",
        "title":"学籍信息",
        "desc":"~学籍信息~",
        "items":[
            {"name":"XJZTDM","url": "/axsfw/code/12eb4f7c-69a1-41c2-b21e-c99fe850264a.do","xtype": "select","dataSize": 6}
            ...
        ]
    },
    ...
]
```


## 标准属性

### default

| 属性 | 描述 | 数据类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| caption | 显示文字 | String | 空 |
| hidden | 是否隐藏 | Boolean | false |
| format | 前端只读文本格式化 | String | 空 |

format：日期、数字、金额，或字符串格式化，因效率一般通过后端处理


### 列表

| 属性 | 描述 | 数据类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| width | 列宽 | Number | 空 |
| isFixed | 固定列 | Boolean | 空 |

### 表单

| 属性 | 描述 | 数据类型 | 默认值 |
| :--- | :--- | :--- | :--- |
| xtype | 显示控件类型 | Enum | text |
| required | 必填 | Boolean | false |
| url | 远程数据地址 | String | 空 |
| fullrow | 占满一行 | Boolean | false |
| placeholder | 提示文字 | String | 空 |
| options | 数据选项 | Array | 空 |
| default | 默认值 | String | 空 |
| dataSize | 最大长度校验值 | Integer | 空 |
| checkType | 校验类型 | Enum | 空 |
| params | 传递个实际组件的参数 | Object | 空 |

xtype 控件类型枚举

| 属性 | 描述 | 特征 |
| :--- | :--- | :--- | 
| select | 单选下拉 | 大量数据，远程搜索，展开，字典映射 |
| multi-select | 多选下拉 | |
| autocomplete | 下拉表格/模糊搜索 | 大数据量，远程搜索，展开，补全选择内容 |
| date-ym | 年月选择框， 默认 yyyy-MM | 年月 |
| date-local | 日期选择框， 默认 yyyy-MM-dd | 年月日 |
| date-full | 日期时间选择框， 默认 yyyy-MM-dd HH:mm | 年月日时分 |
| date-range | 日期范围选择， 默认 yyyy-MM-dd | 年月日，开始、结束 |
| radiolist | 单选按钮组 | 平铺，适用极少选项，字典映射 |
| checkboxlist | 多选按钮组 | 平铺，适用极少选项，字典映射 |
| tree | 单选下拉树 | 展开，大量数据，树状结构，字典映射 |
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


## antdAdapter 组件属性适配器

以上标准配置由该适配器内部实现属性转换。如果超出的属性，可以直接在模型上定义所需属性，如 minWidth 属性

```js
"默认列表:table": {
    id: { },
    name: { minWidth:150 },
    pId: {},
},
```

### table类型返回结果
```js
console.log(new Dept().view("默认列表:form"));

[
    {"caption":"编号","title":"编号","key":"id","minWidth":120},
    {"caption":"名称","title":"名称","key":"name","minWidth":150},
    {"caption":"父级部门编号","title":"父级部门编号","key":"pId","minWidth":120}
]
```

### form类型返回结果
```js
console.log(new Dept().view("默认表单:form"));

[
    {"caption":"编号","name":"id"},
    {"caption":"名称","name":"name","placeholder":"请填写"},
    {"caption":"父级部门编号","name":"pId","xtype":"select"}
]
```

### tree类型返回结果
```js
var data = [
    {"id": "1","name": "党群组织","pId": "","isParent": 1},
    {"id": "000010","name": "党群组织/工会","pId": "1","isParent": 0},
    {"id": "000012","name": "行政部门/校长办公室","pId": "3","isParent": 1}
]
console.log(iviewAdapter("tree", data, {ukey:"id", pkey:'pId', root: "", label:"name"}))
```

