<template>
    <div class="tg-mint-form" :class="{'tg-mint-form-readonly':readonly}">
        <div v-for="metaItem in fields" class="tg-mint-item" :key="metaItem.name">
            <slot :name="metaItem.name" :model="metaItem" :value="formValue[metaItem.name]" :ref="'field' + metaItem.name">
                <component :model="metaItem" :is="registedComponentList(props.data, mintForm, 'mint-fc-static')" 
                v-model="formValue[metaItem.name]" :options="optionsMap[metaItem.name]" :ref="'field' + metaItem.name"></component>
            </slot>
        </div>
    </div>
</template>

<script>
import mintForm from "./form";
import formConnector from "../FormConnector";
export default {
    name:"mint-fc-form",
    extends: formConnector,
    data(){
        return {
            mintForm: mintForm
        }
    },
}
</script>

<style lang="css">
.tg-mint-form .mint-cell-group > .tg-mint-item .mint-cell:first-child .mint-cell-wrapper {
    border-top: .5PX solid #e8e8e8;
}
.tg-mint-form .mint-cell .mint-cell-value {
    padding: 8px 0;
}
.tg-mint-item {
    position: relative;
}
.tg-mint-item .mint-field .mint-cell-value.mt-color-grey-lv3 input {
    color: inherit;
}
.tg-mint-form .mint-cell-group .tg-mint-item:first-child .mint-cell-wrapper {
    border-top: none;
}
/* .tg-mint-form .mint-cell-group-title {
    padding: 16px 20px 16px;
    font-size: 16px;
    line-height: 16px;
} */
.tg-mint-form .mint-cell-group-title:before {
    content: "｜";
    color: #52C7CA;
    font-size: 12px;
    position: relative;
    top: -2px;
    left: -4px;
}

.tg-mint-form .cellgroup-title-hidden .mint-cell-group-title:before {
    content: "";
    font-size: 0
}
.tg-mint-form .mint-cell-group-title {
    font-weight: 600;
    color: #1E2329;
}

/* .tg-mint-form.tg-mint-form-readonly .mint-hairline--top-bottom {
    position: inherit !important;
} */

.tg-mint-form input::-webkit-input-placeholder {
    font-weight: 400 !important;
}

.tg-mint-form input::-webkit-input-placeholder {
    font-weight: 400 !important;
}

.tg-mint-form input::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    font-weight: 400 !important;
}

.tg-mint-form input:-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    font-weight: 400 !important;
}

.tg-mint-form input:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    font-weight: 400 !important;
}

.tg-mint-form input {
    font-weight: 400 !important;
}

.tg-mint-form input:focus {
    font-weight: 400 !important;
}


/* 只读表单样式设置区 */
.tg-mint-form.tg-mint-form-readonly .mint-cell-group-title::before{
    content: ''
}
.tg-mint-form.tg-mint-form-readonly .mint-cell-group-title {
    padding: 16px 20px 16px;
    font-size: 16px;
    line-height: 16px;
}
.tg-mint-form.tg-mint-form-readonly .mint-cell-group .mint-cell-group-content .tg-mint-item .mint-cell {
    min-height:0px;
    padding:8px 0;
}
.tg-mint-form.tg-mint-form-readonly .mint-cell-group .mint-cell-group-content .tg-mint-item .mint-cell .mint-cell-wrapper{
    border-top-style: none;
    font-size: 14px;
}
.tg-mint-form.tg-mint-form-readonly .mint-cell .mint-cell-value {
    padding: 0;
}
.tg-mint-form.tg-mint-form-readonly .mint-cell-group-content {
    /* padding-top:16px; */
    padding-bottom:16px; 
}
.tg-mint-form.tg-mint-form-readonly .mint-hairline--top-bottom:after {
    border-bottom-width:1px;
    border-top-width:0;
    border-color:#e8e8e8;
}
.tg-mint-form.tg-mint-form-readonly .mint-cell-group .emap-cellgroup-hastitle + .mint-cell-group-content .tg-mint-item:first-child {
    padding-top:16px;
    border-top:solid 1px #f1f1f1;
}
.tg-mint-form.tg-mint-form-readonly .mint-cell-group .emap-cellgroup-notitle {
    border-bottom:solid 1px #f4f4f4;
}
.tg-mint-form.tg-mint-form-readonly .mint-cell-group .emap-cellgroup-notitle + .mint-cell-group-content .tg-mint-item:first-child{
    /* border-top:solid 1px #f4f4f4; */
    padding-top:16px;
}
.tg-mint-form.tg-mint-form-readonly .em-select-value,.tg-mint-form.tg-mint-form-readonly .mt-cell-diy-span {
    line-height: 16px;
}
</style>