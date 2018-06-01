import ModelDrivenFormItem from '../ModelDrivenFormItem'

export default {
    name:"mint-md-static",
    extends: ModelDrivenFormItem,
    template:`<div>
        <mt-cell :title="model.caption" :readonly="readonly">
            <div class="em-select-value mt-color-grey">
                <template>{{currentValue}}</template>
            </div>
        </mt-cell>
    </div>`,
}