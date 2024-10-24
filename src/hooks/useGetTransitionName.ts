import { noAnimation, routes } from "@/router/index";
import { ref, watch } from "vue";
import { useRoute, type RouteRecordRaw } from "vue-router";
/**
 * 获取动画名。go代表前进路由动画，back代表后退路由动画
 * @returns 当前动画名。
 */
export function useGetTransitionName() {
  const transitionName = ref("");
  const route = useRoute();
  watch(
    () => route.path,
    (to, from) => {
      if (from === "/login" && to === "/register") {
        return (transitionName.value = "go");
      }
      if (to === "/login" && from === "/register") {
        return (transitionName.value = "back");
      }
      if (noAnimation.indexOf(from) !== -1 && noAnimation.indexOf(to) !== -1) {
        return (transitionName.value = "");
      }
      const toDepth = routes.findIndex((v: RouteRecordRaw) => v.path === to);
      const fromDepth = routes.findIndex(
        (v: RouteRecordRaw) => v.path === from
      );
      transitionName.value = toDepth > fromDepth ? "go" : "back";
    }
  );
  return { transitionName };
}
