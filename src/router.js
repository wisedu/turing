
const Index = resolve => require(['./pages/index/index.vue'], resolve)
const DataSource = resolve => require(['./pages/index/datasource.vue'], resolve)
export default {
    routes: [
        { path: '/', component: Index },
        { path: '/ds', component: DataSource },
    ]
};