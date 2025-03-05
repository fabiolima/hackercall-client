import { createRouter, createWebHistory } from 'vue-router'
import CallView from '../views/CallView.vue'
import CanvasView from '@/views/CanvasView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: CallView,
    },
    {
      path: '/canvas',
      name: 'canvas',
      component: CanvasView,
    },
  ],
})

export default router
