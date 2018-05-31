import ModelDrivenFormItem from '../ModelDrivenFormItem'

export default {
    name:"iview-md-text",
    extends: ModelDrivenFormItem,
    template:`<div>
        <FormItem :label="caption">
            {{currentValue}}&nbsp;
        </FormItem>
    </div>`,
}