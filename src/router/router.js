import { createRouter, createWebHistory, createWebHashHistory  } from 'vue-router'
import MainPage from '@/pages/MainPage.vue'
import ItemPage from '@/pages/ItemPage.vue'
import BasketStep1 from '@/pages/BasketStep1.vue'
import OrderStep from '@/pages/OrderStep.vue'
import OrderSuccess from '@/pages/OrderSuccess.vue'

const routes = [
  {
    path: '/',
    name: 'main',
    component: MainPage,
    meta: { defaultRoute: true },
  },
  {
    path: '/item/:id',
    name: 'item',
    component: ItemPage
  },
  {
    path: '/basket1',
    name: 'basket1',
    component: BasketStep1
  },
  {
    path: '/order',
    name: 'order',
    component: OrderStep
  },
  {
    path: '/order-success',
    name: 'order-success',
    component: OrderSuccess
  }

  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.defaultRoute)) {
    // Переадресация на дефолтный маршрут
    next();
  } else {
    // Продолжение нормальной навигации
    next();
  }
});

export default router
