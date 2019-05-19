import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import Secure from './views/SecuredExample.vue'
import UserDetail from './views/UserDetail.vue'
import Home from './views/Home.vue'
import store from './store.js'
import NotFound404 from "./views/NotFound404";

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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
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
      path: '/secure',
      name: 'secure',
      component: Secure,
      meta: {
        requiresIsLoggedIn: true
      }
    },
    {
      path: '/superuser',
      name: 'superuser',
      component: Secure,
      meta: {
        requiresIsSuperuser: true
      }
    },
    {
      path: '/confirmed',
      name: 'confirmed',
      component: Secure,
      meta: {
        requiresIsConfirmed: true
      }
    },
    {
      path: '/users/:id',
      name: 'userDetail',
      component: UserDetail
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
