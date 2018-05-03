# wisedu-h5tag

> wisedu-h5tag 业务组件库

## 开发流程

#### 1、 初始化项目，**必须** 调整package.json中的配置项，关键字段如下：

```json
{
    "name": "wisedu-h5tag",  //one word, no spaces
    "packageName": "wisedu-h5tag",   //打包出来的文件名称，npm publish时的包名称，可能需要考虑全球唯一性
    "version": "1.0.0",     //打包时，版本号会跟入包内，npm publish时，每个版本号仅能发布一次
    "main": "dist/wisedu-h5tag.min.js",  //与packageName的名称一致，仅在npm publish时使用，作为包的入口地址
    ...
}
```

#### 2、 新增组件，规则有两种：

##### 单文件组件，在文件夹 ./src/components 中，直接建立一个组件文件

> * ./src/components/xxx.vue 

> 组件实现文件，具体开发方法见 [VUE单文件组件](https://cn.vuejs.org/v2/guide/single-file-components.html)

##### 多文件组件，在文件夹 ./src/components 中，建立一个文件夹，其中可以包含多个文件

> * ./src/components/xxx/xxx.vue 
> * ./src/components/xxx/xxx-1.vue 

> 打包的时候仅认与文件夹名称相同的文件为该组件的入口

命名规则：多个单词间以 "-" 连接，全部小写


#### 3、 当前库中调试组件，在index.vue中引用该组件，关键点如下：

> * import EmapFlowToolbar from '../../components/emap-flow-toolbar.vue'
> * components: { EmapFlowToolbar },

> html中增加该标签：< emap-flow-toolbar>< /emap-flow-toolbar>

``` bash
# 组件调试环境启动命令，localhost:8080
npm run dev
```

#### 4、 打包生成组件

``` bash
#开发
npm run dev

# 组件编译打包
npm run build

#编译Element css样式
npm run buildcss

#编译element css + 编译emap组件css + 打包组件js
npm run deploy
```

> ./dist/目录下，生成了打包好的组件文件

## 开发注意事项

### 1. 组件打包出来只有一个文件 xxx.min.js，所以请注意：

* 尽量不含有图片文件
* * 如果必须要使用图片，文件请放置在目录 src/assets/ 中，最终打包会以base64的编码方式直接打入min.js的源码中，组件包的体积会变大。 
* * 引用方式必须按照该格式：< img src="../assets/logo.png" >
* * 可能遇到的情况如：上传头像组件中必须带有的默认上传图片
* 如果需要图标，请以样式方式引用外部的字体图标库

### 2. 浏览器运行时报错，不支持原生es6语法

* 打出来的包未经过编译器降级兼容es5处理，这是由于babel编译器未生效，请检查项目根目录下该配置文件是否存在：.babelrc
* windows用户，可以通过sublime Text创建该文件


## 常规运行命令

``` bash
# 初始化安装
cnpm install

# 组件调试环境启动命令，localhost:8080
npm run dev

# 组件编译打包
npm run build
```


## 目录结构说明

```
wisedu-h5tag/
│
├── build/                              打包脚本
│   └── ...        
├── mock/                               本地mock数据存放位置，不会被打包
│   └── data1.json                      访问示例：http://0.0.0.0:8080/mock/data1.json
├── src/                                源码
│   ├── components/                     开发的组件文件
│   │   ├── com1.vue                    com1的实现文件（必须实现）
│   │   ├── com1.js                     com1的打包引用文件（必须实现）
│   │   └── ···/
│   ├── pages/      
│   │   ├── index/
│   │   │   ├── index.vue               调试页，入口页面
│   │   │   └── ···
│   │   └── ···/
│   └── assets/                         图片文件存放目录
│       ├── logo.png
│       └── ···
├── static/                             仅在调试页面中使用的静态资源文件
│   └── mobile/
│       ├── css/
│       │   ├── base.css
│       │   └── style.css
│       └── js/
├── build-components.js                 打包配置（必须修改）
├── package.json                        组件库的配置（必须修改）
└── index.html                          入口页面
```