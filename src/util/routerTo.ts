import router from "@/router/index";
/**
 * 路由跳转
 * @param routerName 要跳转的路由名
 */
export function routerTo(routerName: string) {

  router.push({ name: routerName });
}
