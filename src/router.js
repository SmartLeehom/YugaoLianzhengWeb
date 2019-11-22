import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'layout',
            component: resolve => require(['./views/layout/index.vue'], resolve),
            children: [
                {
                    path: '/',
                    name: 'home',
                    meta: {
                        requireAuth: true
                    },
                    component: resolve => require(['./views/home/index.vue'], resolve),
                },
              {
                path: '/',
                name: 'reference',
                meta: {
                  requireAuth: true
                },
                component: resolve => require(['./views/home/index.vue'], resolve),
              },
              {
                path: '/',
                name: 'management',
                meta: {
                  requireAuth: true
                },
                component: resolve => require(['./views/home/index.vue'], resolve),
              },
              {
                path: '/',
                name: 'report',
                meta: {
                  requireAuth: true
                },
                component: resolve => require(['./views/home/index.vue'], resolve),
              },
            ]
        },
        /*{
            path: '/login',
            name: 'login',
            component: () => import('./views/Login.vue')
        }*/
    ]
})
