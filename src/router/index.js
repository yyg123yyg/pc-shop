import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const Login = () => import("../components/Login");
const Home = () => import("views/home/Home");
const Welcome = () => import("components/Welcome");
const User = () => import("components/user/User");
const Rights = () => import("components/power/Rights")
const Roles = () => import("components/power/Roles")
const Cate = () => import("components/goods/Cate")
const Params = () => import("components/goods/Params")
const GoodList = () => import("components/goods/List")
const  Add= () => import("components/goods/Add")
const  Order= () => import("components/order/Order")
const  Report= () => import("components/report/Report")

const routes = [
    {
        path: '/',
        redirect: "/login"
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        redirect: "/welcome",
        children: [
            {
                path: '/welcome',
                component: Welcome,
            }, {
                path: '/users',
                component: User,
            }, {
                path: '/rights',
                component: Rights,
            }, {
                path: '/roles',
                component: Roles,
            },{
                path: '/categories',
                component: Cate,
            },{
                path: '/params',
                component: Params,
            },{
                path: '/goods',
                component: GoodList,
            },{
                path: '/goods/add',
                component: Add,
            },{
                path: '/orders',
                component: Order,
            },{
                path: '/reports',
                component: Report,
            },

        ]
    }

]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
//路由导航守卫
router.beforeEach(((to, from, next) => {
    //next() 表示放行
    if (to.path === '/login') return next();
    //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login');
    next()
}))


export default router
