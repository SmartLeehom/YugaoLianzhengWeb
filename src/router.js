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
                path: '/reference',
                name: 'reference',
                meta: {
                  requireAuth: true
                },
                component: resolve => require(['./views/pages/reference/reference.vue'], resolve),
                children: [
                  {
                    path: '/refDeptDetail',
                    name: 'refDeptDetail',
                    meta: {
                      requireAuth: true
                    },
                    component: resolve => require(['./views/pages/reference/refDeptDetail.vue'], resolve),
                  },
                  {
                    path: '/refProjDetail',
                    name: 'refProjDetail',
                    meta: {
                      requireAuth: true
                    },
                    component: resolve => require(['./views/pages/reference/refProjDetail.vue'], resolve),
                  },
                  {
                    path: '/dept',
                    name: 'dept',
                    meta: {
                      requireAuth: true
                    },
                    component: resolve => require(['./views/pages/reference/dept.vue'], resolve),
                  },
                  {
                    path: '/project',
                    name: 'project',
                    meta: {
                      requireAuth: true
                    },
                    component: resolve => require(['./views/pages/reference/project.vue'], resolve),
                  },
                  {
                    path: '/missing',
                    name: 'missing',
                    meta: {
                      requireAuth: true
                    },
                    component: resolve => require(['./views/pages/reference/refAnalysis.vue'], resolve),
                  },
                  {
                    path: '/refmodule',
                    name: 'refmodule',
                    meta: {
                      requireAuth: true
                    },
                    component: resolve => require(['./views/pages/reference/refmodule.vue'], resolve),
                  }
                ]
              },
              {
                path: '/management',
                name: 'management',
                meta: {
                  requireAuth: true
                },
                component: resolve => require(['./views/pages/management/index.vue'], resolve),
              },
              {
                path: '/report',
                name: 'report',
                meta: {
                  requireAuth: true
                },
                component: resolve => require(['./views/pages/report/index.vue'], resolve),
              },
              {
                path: '/mgmtcentral',
                name: 'mgmtcentral',
                meta: {
                  requireAuth: true
                },
                component: resolve => require(['./views/pages/mgmtcentral/index.vue'], resolve),
                children:[
                  {
                    path: '/dongtaiMgmt',
                    name: 'dongtaiMgmt',
                    meta: {
                      requireAuth: true
                    },
                    component: resolve => require(['./views/pages/mgmtcentral/dongtaiMgmt.vue'], resolve),
                  },
                  {
                    path: '/reportMgmt',
                    name: 'reportMgmt',
                    meta: {
                      requireAuth: true
                    },
                    component: resolve => require(['./views/pages/mgmtcentral/reportMgmt.vue'], resolve),
                  },
                  {
                    path: '/userMgmt',
                    name: 'userMgmt',
                    meta: {
                      requireAuth: true
                    },
                    component: resolve => require(['./views/pages/mgmtcentral/userMgmt.vue'], resolve),
                  },
                  {
                    path: '/refmoduleMgmt',
                    name: 'refmoduleMgmt',
                    meta: {
                      requireAuth: true
                    },
                    component: resolve => require(['./views/pages/mgmtcentral/refmoduleMgmt.vue'], resolve),
                  }
                ]
              },
              {
                path: '/dongtai',
                name: 'dongtai',
                meta: {
                  requireAuth: true
                },
                component: resolve => require(['./views/pages/dongtai/index.vue'], resolve),
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
