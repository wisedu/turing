<style>

</style>

<script>

</script>

## Actionsheet 行动按钮

### 使用指南
``` javascript
import { Actionsheet } from 'vant';

Vue.component(Actionsheet.name, Actionsheet);
```

### 代码演示

#### 基础用法

需要传入一个`actions`的属性，该属性为一个数组，数组的每一项是一个对象，可以根据下面的[action对象](#actions)设置你想要的信息。

:::demo 基础用法
```html
<van-button @click="show1 = true">弹出actionsheet</van-button>
<van-actionsheet v-model="show1" :actions="actions1">
</van-actionsheet>
```

```javascript
export default {
  data() {
    return {
      show1: false,
      actions1: [
        {
          name: '微信安全支付',
          className: 'actionsheet-wx',
          callback: this.handleActionClick
        },
        {
          name: '支付宝支付',
          loading: true
        },
        {
          name: '信用卡支付'
        },
        {
          name: '其他支付方式'
        }
      ]
    };
  },

  methods: {
    handleActionClick(item) {
      console.log(item);
    }
  }
}
```
:::

#### 带取消按钮的 Actionsheet

如果传入了`cancelText`属性，且不为空，则会在下方显示一个取消按钮，点击会将当前`Actionsheet`关闭。

:::demo 带取消按钮的 Actionsheet
```html
<van-button @click="show2 = true">弹出带取消按钮的actionsheet</van-button>
<van-actionsheet v-model="show2" :actions="actions1" cancel-text="取消">
</van-actionsheet>
```

```javascript
export default {
  data() {
    return {
      show2: false,
      actions1: [
        {
          name: '微信安全支付',
          className: 'actionsheet-wx',
          callback: this.handleActionClick
        },
        {
          name: '支付宝支付',
          loading: true
        },
        {
          name: '信用卡支付'
        },
        {
          name: '其他支付方式'
        }
      ]
    };
  }
}
```
:::

#### 带标题的 Actionsheet

如果传入了`title`属性，且不为空，则另外一种样式的`Actionsheet`，里面内容需要自定义。

:::demo 带标题的 Actionsheet
```html
<van-button @click="show3 = true">弹出带标题的actionsheet</van-button>
<van-actionsheet v-model="show3" title="支持以下配送方式" class="title-actionsheet">
  <p>一些内容</p>
</van-actionsheet>
```
:::

### API

| 参数       | 说明      | 类型       | 默认值       | 可选值       |
|-----------|-----------|-----------|-------------|-------------|
| actions | 行动按钮数组 | `Array`  | `[]` |    |
| title | 标题 | `String`  |  |    |
| cancelText | 取消按钮文案 | `String`  |  |    |
| overlay | 是否显示遮罩 | `Boolean`  |  |    |
| closeOnClickOverlay | 点击遮罩是否关闭`Actionsheet` | `Boolean`  |  |    |

### actions


`API`中的`actions`为一个对象数组，数组中的每一个对象配置每一列，每一列有以下`key`：

| key       | 说明      |
|-----------|-----------|
| name | 标题 |
| subname | 二级标题 |
| className | 为对应列添加特殊的`class` |
| loading | 是否是`loading`状态 |
| callback | 点击时的回调。该回调接受一个参数，参数为当前点击`action`的对象信息 |
