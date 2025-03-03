import { createRouter, createWebHistory } from 'vue-router'
import CallView from '../views/CallView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CallView,
    },
  ],
})

export default router
