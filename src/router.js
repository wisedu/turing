
const Index = resolve => require(['./pages/index/index.vue'], resolve)
const EmapTable = resolve => require(['./pages/emap-table/emap-table.vue'], resolve)
const EmapForm = resolve => require(['./pages/emap-form/emap-form.vue'], resolve)
const EmapHeader = resolve => require(['./pages/emap-header/emap-header.vue'], resolve)
export default {
    routes: [
        { path: '/', component: Index },
        { path: '/emap-table', component: EmapTable },
        { path: '/emap-form', component: EmapForm },
        { path: '/emap-header', component: EmapHeader }
    ]
};