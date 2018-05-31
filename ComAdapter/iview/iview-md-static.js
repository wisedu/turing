import ModelDrivenFormItem from '../ModelDrivenFormItem'

export default {
    name:"iview-md-static",
    extends: ModelDrivenFormItem,
    template:`<div>
        <FormItem :label="caption">
            {{currentValue}}&nbsp;
        </FormItem>
    </div>`,
}