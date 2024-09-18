<template>
  <div class="contact">
    <el-dialog v-model="dialogVisible" title="搜索好友" width="400">
      <div>
        <el-input
          v-model="state.input"
          style="width: 100%;"
          placeholder="请输入好友qq号"
        />
        <el-empty description="暂无内容哦！" />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            Confirm
          </el-button>
        </div>
      </template>
    </el-dialog>
    <div class="search" @click="dialogVisible = true">
      <IconSearch size="20px" />
      搜索
    </div>
  </div>
</template>

<script setup lang="ts">
import IconSearch from "@/components/icons/IconSearch.vue";
import { reactive, ref } from "vue";
import { ElMessageBox } from "element-plus";

const dialogVisible = ref(false);
const state = reactive({
    input: ''
})
const handleClose = (done: () => void) => {
  ElMessageBox.confirm("Are you sure to close this dialog?")
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
</script>

<style lang="less" scoped>
.contact {
  height: 100%;
  background-color: #fff;
  padding: 15px;
  .search {
    width: 100%;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #8a8a8a;
    gap: 10px;
    background-color: #e2f0fe;
  }
}
</style>
