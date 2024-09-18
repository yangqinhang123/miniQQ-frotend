import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from "vue-router";
export enum RouterName {
  LAYOUT = "layout",
  INFO = "info",
  DIALOG = "dialog",
  CONTACT = "contact",
  LIFE = "life",
  CHANNELS = "channels",
  LOGIN = "login",
  REGISTER = "register",
}
/**
 * 以下路由路径不采用动画切换路由（后续可添加）
 */
export const noAnimation = [
  "/",
  "/Layout",
  "/Layout/info",
  "/Layout/contact",
  "/Layout/life",
  "/Layout/channels",
  "/login",
  "/register",
];

export const routes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/Layout",
    name: RouterName.LAYOUT,
    component: () => import("@/views/pagesLayout/index.vue"),
    children: [
      {
        path: "/Layout/info",
        name: RouterName.INFO,
        component: () => import("@/views/infoList/index.vue"),
      },
      {
        path: "/Layout/contact",
        name: RouterName.CONTACT,
        component: () => import("@/views/contact/index.vue"),
      },
      {
        path: "/Layout/life",
        name: RouterName.LIFE,
        component: () => import("@/views/life/index.vue"),
      },
      {
        path: "/Layout/channels",
        name: RouterName.CHANNELS,
        component: () => import("@/views/channels/index.vue"),
      },
    ],
  },
  {
    path: "/Dialog",
    name: RouterName.DIALOG,
    component: () => import("@/views/Dialog/index.vue"),
  },
  {
    path: "/login",
    name: RouterName.LOGIN,
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/register",
    name: RouterName.REGISTER,
    component: () => import("@/views/register/index.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
