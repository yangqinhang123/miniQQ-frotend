//本文件用于 代替原本的直接在main.ts中导入pinia的方式
// 本文件请勿随意改动
import { createPinia } from "pinia";
const pinia = createPinia();
export default pinia;