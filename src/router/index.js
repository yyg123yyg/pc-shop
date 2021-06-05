import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const Login = () => import("../components/Login");
const Home = () => import("views/home/Home");
const Welcome = () => import("components/Welcome");
const User = () => import("components/user/User");

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
        redirect: "/Welcome",
        children: [
            {
                path: '/welcome',
                component: Welcome,
            }, {
                path: '/users',
                component: User,
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
