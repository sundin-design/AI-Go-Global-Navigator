import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/industry/:id',
    name: 'IndustryDetail',
    component: () => import('../views/IndustryDetail.vue')
  },
  {
    path: '/country/:id',
    name: 'CountryDetail',
    component: () => import('../views/CountryDetail.vue')
  },
  {
    path: '/mail-assistant',
    name: 'MailAssistant',
    component: () => import('../views/MailAssistant.vue')
  },
  {
    path: '/meeting-assistant',
    name: 'MeetingAssistant',
    component: () => import('../views/MeetingAssistant.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
