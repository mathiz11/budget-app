import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/default-categories',
      name: 'DefaultCategories',
      component: () => import('@/views/DefaultCategories.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/components/AuthForm.vue')
    }
  ]
})

// Navigation guard
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
  // Si l'auth est en cours de chargement, autoriser uniquement /login
  if (authStore.loading) {
    if (to.path === '/login') {
      next()
    } else {
      // Rediriger vers login pour toute autre page pendant le chargement
      next('/login')
    }
    return
  }
  
  // Auth chargée, vérifier l'authentification
  if (to.meta.requiresAuth && !authStore.user) {
    next('/login')
  } else if (to.path === '/login' && authStore.user) {
    next('/')
  } else {
    next()
  }
})

export default router
