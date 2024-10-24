<template>
  <div class="contact">
    <el-dialog
      v-model="dialogVisible"
      title="搜索好友"
      width="400"
      :before-close="handleClose"
    >
      <div style="display: flex; gap: 10px; flex-direction: column">
        <el-input
          v-model="state.input"
          style="width: 100%"
          placeholder="请输入好友qq号"
          :oninput="handleInputWithDebounce"
        />
        <el-empty v-if="!state.searchRes.length" description="暂无内容哦！" />
        <div v-else class="search-res">
          <div
            v-for="(i, index) in state.searchRes"
            :key="index"
            :class="`contact-item ${
              i.user_name === currentSelected?.user_name ? 'selected' : ''
            }`"
            @click="setCurrentSelected(i)"
          >
            <el-avatar :size="30" :src="i.user_avatar" fit="fill" />
            <div>
              <span>
                {{
                  (i.nickName + `(${i.user_name})`).substring(
                    0,
                    (i.nickName + `(${i.user_name})`).indexOf(state.input)
                  )
                }}
              </span>
              <span style="color: #0091ff">{{ state.input }}</span>
              <span>
                {{
                  (i.nickName + `(${i.user_name})`).substring(
                    (i.nickName + `(${i.user_name})`).indexOf(state.input) +
                      state.input.length
                  )
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">退出</el-button>
          <el-button type="primary" @click="addContact"> 确认添加 </el-button>
        </div>
      </template>
    </el-dialog>
    <div class="search" @click="dialogVisible = true">
      <IconSearch size="20px" />
      搜索
    </div>
    <div class="friend-list">
      <ContactList :gap="10" :router-name="RouterName.DETAIL" />
    </div>
  </div>
</template>

<script setup lang="ts">
import IconSearch from "@/components/icons/IconSearch.vue";
import { getCurrentInstance, inject, reactive, ref } from "vue";
import { ElMessageBox } from "element-plus";
import { debounce } from "@/hooks/debounce";
import { addContactReq, searchUser, type SearchUserResType } from "./api";
import { showTip } from "@/util";
import { useUserStore } from "@/store/userStore";
import { storeToRefs } from "pinia";
import ContactList from "../infoList/component/ContactList.vue";
import { RouterName } from "@/router";
const store = useUserStore();
type state = {
  input: string;
  searchRes: SearchUserResType[];
};
const dialogVisible = ref(false);
const state = reactive<state>({
  input: "",
  searchRes: [],
});
const { userState } = storeToRefs(store);

const currentSelected = ref<SearchUserResType | null>(null);
const setCurrentSelected = (value: SearchUserResType | null) => {
  currentSelected.value = value;
};
const cxt = getCurrentInstance(); //相当于Vue2中的this
const bus = cxt?.appContext.config.globalProperties.$bus;

const handleClose = () => {
  state.input = "";
  setCurrentSelected(null);
  state.searchRes = [];
  dialogVisible.value = false;
};
const handleInput = async () => {
  try {
    if (state.input === "") {
      state.searchRes = [];
      setCurrentSelected(null);
      return;
    }
    const res = await searchUser(state.input);
    state.searchRes = res;
    setCurrentSelected(null);
  } catch (error) {
    console.log(error);
    showTip("搜索失败", "error");
  }
};

const handleInputWithDebounce = debounce(handleInput, 600);

const addContact = async () => {
  try {
    if (!userState.value || !currentSelected.value) return;
    const res = await addContactReq(
      userState.value.user_name,
      currentSelected.value.user_name
    );
    if (res.isOk) {
      showTip(res.msg, "success");
      bus.emit('updateContactList')
    } else {
      showTip(res.msg, "warning");
    }
  } catch (error) {
    console.log(error);
    showTip("添加失败", "error");
  }
};
</script>

<style lang="less" scoped>
.contact {
  height: 100%;
  background-color: #fff;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  .friend-list {
    width: 100%;
    height: calc(100%-30px-30px-20px);
    background-color: #e2f0fe;
    display: flex;
    flex-direction: column;
    gap: 10px;
    overflow: auto;
  }

  .search-res {
    height: 300px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 5px;
    .contact-item {
      display: flex;
      align-items: center;
      padding: 10px;
      gap: 10px;
    }
  }
}
.selected {
  border: 1px solid #0091ff;
}
</style>
