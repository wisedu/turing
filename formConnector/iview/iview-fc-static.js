import FormConnectItem from '../FormConnectItem'

export default {
    name:"iview-fc-static",
    extends: FormConnectItem,
    template:`<div>
        <FormItem :label="caption">
            {{currentValue}}&nbsp;
        </FormItem>
    </div>`,
}