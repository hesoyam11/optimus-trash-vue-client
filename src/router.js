import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import UserDetail from './views/UserDetail.vue'
import Home from './views/Home.vue'
import store from './store.js'
import NotFound404 from "./views/NotFound404";
import BuildPath from "./views/BuildPath";
import UserList from "./views/UserList";

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/users/:id',
            name: 'userDetail',
            component: UserDetail,
            meta: {
                requiresIsConfirmed: true,
                requiresIsLoggedIn: true
            }
        },
        {
            path: '/users',
            name: 'userList',
            component: UserList,
            meta: {
                requiresIsLoggedIn: true,
                requiresIsConfirmed: true,
                requiresIsSuperuser: true
            }
        },
        {
            path: '/build-path',
            name: 'buildPath',
            component: BuildPath
        },
        {
            path: '*',
            name: 'notFound404',
            component: NotFound404
        }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresIsLoggedIn)) {
        if (!store.getters.isLoggedIn) {
            next({ name: 'login' });
            return;
        }
    }

    if (to.matched.some(record => record.meta.requiresIsSuperuser)) {
        if (!store.state.isSuperuser) {
            next({ name: 'login' });
            return;
        }
    }

    if (to.matched.some(record => record.meta.requiresIsConfirmed)) {
        if (!store.state.isConfirmed) {
            next({ name: 'login' });
            return;
        }
    }

    next();
});

export default router;
