import {
  createRouter as _createRouter,
  createMemoryHistory,
  createWebHistory
} from 'vue-router'

import HomeView from '../views/HomeView.vue'

const home = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  }
]

export function createRouter() {
  return _createRouter({
    history: import.meta.env.SSR ? createMemoryHistory('/') : createWebHistory('/'),
    routes: [...home]
  })
}
