import FormConnectItem from '../FormConnectItem'

export default {
    name:"mint-fc-static",
    extends: FormConnectItem,
    template:`<div>
        <mt-cell :title="model.caption" :readonly="readonly">
            <div class="em-select-value mt-color-grey">
                <template>{{currentValue}}</template>
            </div>
        </mt-cell>
    </div>`,
}