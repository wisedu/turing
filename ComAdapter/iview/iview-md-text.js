import ModelDrivenFormItem from '../ModelDrivenFormItem'

export default {
    name:"iview-md-text",
    extends: ModelDrivenFormItem,
    template:`<div>
        <Input v-model="currentValue" :placeholder="placeholder">
            <span slot="append">{{params.append}}</span>
        </Input>
    </div>`,
}