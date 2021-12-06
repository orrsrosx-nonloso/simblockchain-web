import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home')
  },
  {
    path: '/login',
    name: 'LoginRegister',
    component: () => import('../views/LoginRegister')
  },
  {
    path: '/:catchAll(.*)',
    name: '404',
    component: () => import('../views/404')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
