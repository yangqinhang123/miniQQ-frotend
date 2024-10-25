<template>
  <div class="page-header">
    <div class="user" @click="drawer = true">
      <el-avatar
        :size="50"
        :src="userState?.user_avatar"
        fit="fill"
        @error="errorHandler"
      />
      <span>{{ userState?.nickName || "???" }}</span>
    </div>
  </div>
  <el-drawer
    v-model="drawer"
    direction="ltr"
    :before-close="handleClose"
    size="60%"
  >
    <div class="info-container">
      <div class="avatar">
        <div class="left">头像</div>
        <div class="right">
          <el-avatar
            :size="50"
            :src="userState?.user_avatar"
            fit="fill"
            @error="errorHandler"
          />
        </div>
      </div>
      <div class="operation">
        <el-button
          type="primary"
          style="width: 100px; height: 100%"
          @click="showUploadAvatar = true"
          >更换头像</el-button
        >
      </div>

      <div class="nick-name">
        <div class="left">昵称</div>
        <div class="right">{{ userState?.nickName || "???" }}</div>
      </div>
      <div class="user-name">
        <div class="left">QQ号</div>
        <div class="right">{{ userState?.user_name || "???" }}</div>
      </div>
      <div class="user-email">
        <div class="left">邮箱</div>
        <div class="right">{{ userState?.user_email || "???" }}</div>
      </div>
    </div>
    <div class="logout" @click="logout">退出登录</div>
  </el-drawer>
  <el-dialog v-model="showUploadAvatar" width="500">
    <div>
      <el-upload
        action="#"
        :auto-upload="false"
        :on-change="handleChange"
        :show-file-list="false"
        ref="UploadRef"
        class="avatar-uploader"
        accept="image/*"
      >
        <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
        <template #tip>
          <div class="el-upload__tip">只能选择图片文件噢～</div>
        </template>
      </el-upload>
      <div class="preview">
        <div class="text">当前头像</div>
        <el-avatar
          :size="50"
          :src="previewUrl === '' ? userState?.user_avatar : previewUrl"
          fit="fill"
        />
        <el-button type="primary" @click="setUserAvatar">确认替换</el-button>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button
          @click="
            showUploadAvatar = false;
            previewUrl = '';
          "
          >取消</el-button
        >
        <el-button type="primary" @click="showUploadAvatar = false">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
  <cropper
    v-if="showCropper"
    :dialog-visible="showCropper"
    :raw-file="currentSelectedFile"
    imgType="blob"
    :cropWidth="cropWidth"
    :cropHeight="cropHeight"
    @update-cropper="handleStart"
    @close-dialog="closeDialog"
    @upload-img="submitImg"
  />
</template>

<script setup lang="ts">
import { useUserStore } from "@/store/userStore";
import { storeToRefs } from "pinia";
import { nextTick, ref } from "vue";
import {
  ElMessageBox,
  type UploadFile,
  type UploadInstance,
  type UploadProps,
  type UploadUserFile,
} from "element-plus";
import Cropper from "@/components/CropperImage/Cropper.vue";
import { setUserAvatarReq, uploadImage } from "./api";
import { showTip } from "@/util";
import { Plus } from "@element-plus/icons-vue";
import { logout } from "@/util/logout";
const store = useUserStore();
const { setUserState } = store;
const { userState } = storeToRefs(store);
const drawer = ref(false);
const fileList = ref<UploadUserFile[]>([]);
const handleClose = () => {
  drawer.value = false;
};
const errorHandler = () => {
  console.log("error");
};
const UploadRef = ref<UploadInstance | null>(null);
const showUploadAvatar = ref(false);
const showCropper = ref(false);
// 当前上传文件的临时url
// const fileUrl = ref("");
// 当前上传图片的文件名
// const fileName = ref("");
/**当前选择的文件对象，初始化为空文件 */
const currentSelectedFile = ref<File>(new File([], ""));
// 截图框宽度
const cropWidth = ref(50);
// 截图框高度
const cropHeight = ref(50);
const previewUrl = ref("");
/**
 * 触发el-upload组件的选择文件事件
 */
const handleStart = () => {
  UploadRef.value!.$el.querySelector("input").click();
};
// 关闭窗口
const closeDialog = () => {
  showCropper.value = false;
};
const submitImg = async (file: any) => {
  try {
    const { url, msg } = await uploadImage(file);
    previewUrl.value = url;
    showTip(msg);
  } catch (error) {
    showTip("上传失败");
    console.log(error);
  }
};
/**
 * 获取选择文件的文件名，url
 * @param uploadFile 当前选择的文件
 * @param uploadFiles 已选择的文件列表
 */
const handleChange = (uploadFile: UploadFile) => {
  console.log(uploadFile);

  console.log(URL.createObjectURL(uploadFile.raw as File));
  if (!uploadFile.raw) {
    showTip("选择文件失败", "error");
    return;
  }
  // fileUrl.value = URL.createObjectURL(uploadFile.raw as File) || "";
  // fileName.value = uploadFile.name;
  currentSelectedFile.value = uploadFile.raw;
  nextTick(() => {
    showCropper.value = true;
  });
};

const setUserAvatar = async () => {
  try {
    if (previewUrl.value === userState.value?.user_avatar) {
      showTip("头像相同", "warning");
      return;
    }
    if (previewUrl.value === "") {
      showTip("图片不能为空", "warning");
      return;
    }
    ElMessageBox.confirm(
      "设置头像后需重新登录才生效，确认设置将退出到登录页，确认退出吗？",
      { confirmButtonText: "确认", cancelButtonText: "取消" }
    )
      .then(async () => {
        await setUserAvatarReq(previewUrl.value);
        logout();
        // showUploadAvatar.value = false;
      })
      .catch((error: any) => {
        // catch error
        console.log(error);
      });
    // await setUserAvatarReq(previewUrl.value);
    // showUploadAvatar.value = false;
  } catch (error) {
    console.log(error);
    showTip("设置头像失败", "error");
  }
};
</script>

<style lang="less" scoped>
.page-header {
  display: flex;
  width: 100%;
  // height: 60px;
  flex: 1;
  padding: 2px;
  padding-top: 40px;
  .user {
    display: flex;
    gap: 3px;
    justify-content: center;
    align-items: center;
  }
}
:global(.el-drawer__body) {
  display: flex;
  flex-direction: column;
}
.info-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  .operation {
    display: flex;
    height: 30px;
    justify-content: center;
  }
  & > div {
    display: flex;
    height: 60px;
    gap: 40px;
    .left {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #a1a1a1;
    }
    .right {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.logout {
  margin-top: 30px;
  color: #de2121;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
:deep(.avatar-uploader .el-upload) {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

:deep(.avatar-uploader .el-upload:hover) {
  border-color: var(--el-color-primary);
}

.preview {
  display: flex;
  width: 100%;
  gap: 30px;
  margin-top: 30px;
  .text {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #000000;
  }
}
</style>
