import { showTip } from "@/util";
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
//路由守卫 变化前
router.beforeEach((to, from, next) => {
  if (to.path == "/") next();
  else if (to.name == "404") next();
  else if (to.name === RouterName.LOGIN) next();
  else if (to.matched.length === 0) {
    //如果未匹配到路由
    console.log("未匹配到路由，来自", from.path, "去往", to.path);
    next({ name: "404" }); //去往404页面
  } else if (!localStorage.getItem("token")) {
    //没有token就去登录   //完成登录模块的API对接后，请把此处解开
    showTip("请先登录！", "error");
    next("/");
  } else next(); //如果匹配到正确跳转
});

export default router;
