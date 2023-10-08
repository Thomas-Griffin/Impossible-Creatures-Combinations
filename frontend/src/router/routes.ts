import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: async () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/CombinationsPage.vue') },
    ],
  },

  {
    path: '/visualisations',
    component: async () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/VisualisationsPage.vue') },
    ],
  },

  {
    path: '/about',
    component: async () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/AboutPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
