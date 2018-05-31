import ModelDrivenFormItem from '../ModelDrivenFormItem'

export default {
    name:"mint-md-text",
    extends: ModelDrivenFormItem,
    template:`<div>
        <mt-cell v-if="readonly" :title="model.caption" :readonly="readonly">
            <div class="em-select-value mt-color-grey">
                <template>{{currentValue}}</template>
            </div>
        </mt-cell>
    </div>`,
}