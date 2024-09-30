<template>
  <el-dialog
    v-model="isVisible"
    :close-on-click-modal="false"
    :before-close="handleClose"
    :fullscreen="true"
  >
    <div class="cropper-container">
      <div class="cropper-el" ref="cropperEl">
        <VueCropper
          ref="cropper"
          :img="cropperImg"
          :output-size="option.size"
          :output-type="option.outputType"
          :info="true"
          :full="option.full"
          :can-move="option.canMove"
          :can-move-box="option.canMoveBox"
          :original="option.original"
          :auto-crop="option.autoCrop"
          :auto-crop-width="option.autoCropWidth"
          :auto-crop-height="option.autoCropHeight"
          :center-box="option.centerBox"
          :high="option.high"
          :info-true="option.infoTrue"
          @realTime="realTime"
          :enlarge="option.enlarge"
          :fixed="option.fixed"
          :fixed-number="option.fixedNumber"
        />
      </div>
      <!-- 预览 -->
      <div class="prive-el">
        <div
          class="prive-style"
          :style="{
            overflow: 'hidden',
            margin: '0 25px',
            display: 'flex',
            'align-items': 'center',
          }"
        >
          <div class="preview" :style="previews.div">
            <el-image :src="previews.url" :style="previews.img"></el-image>
          </div>
        </div>
        <div class="btnList">
          <el-button @click="uploadBth" v-if="option.img" type="primary"
            >重新选择</el-button
          >
          <el-button @click="saveImg" v-if="option.img" type="primary"
            >上传</el-button
          >
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$emit('close-dialog')">取 消</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from "vue";
import VueCropper from "vue-cropper/src/vue-cropper.vue";

interface CropperData {
  dialogVisible: boolean;
  imgType: string;
  //   cropperImg: string;
  //   fileName: string;
  rawFile: File;
  cropHeight: number;
  cropWidth: number;
}
// 传入的自定义事件
const emits = defineEmits(["update-cropper", "close-dialog", "upload-img"]);
// 组件传入的参数
const props = defineProps<CropperData>();

const isVisible = ref(props.dialogVisible);
// vue-cropper实例
const cropper = ref();

const cropperEl = ref<HTMLDivElement | null>(null);

const previews = ref({ div: "", url: "", img: "" });
const cropperImg = computed(() => {
  return URL.createObjectURL(props.rawFile);
});
// vue-cropper组件配置项
const option = reactive({
  // 裁剪图片的地址，可选值：blob，base64，url
  img: cropperImg,
  // 默认生成截图框宽度
  autoCropWidth: props.cropWidth,
  // 默认生成截图框高度
  autoCropHeight: props.cropHeight,
  // 	是否开启截图框宽高固定比例
  fixed: true,
  // 截图框的宽高比例, 开启fixed生效
  fixedNumber: [props.cropWidth, props.cropHeight],
  // 裁剪生成图片的质量，0.1~1
  size: 1,
  // 是否输出原图比例的截图
  full: false,
  // 裁剪生成图片的格式
  outputType: "png",
  // 上传图片是否可以移动
  canMove: false,
  // 上传图片按照原始比例渲染
  original: false,
  // 截图框能否拖动
  canMoveBox: true,
  // 是否默认生成截图框
  autoCrop: true,
  // 截图框是否被限制在图片里面
  centerBox: true,
  // 是否按照设备的dpr 输出等比例图片
  high: false,
  // 	图片根据截图框输出比例倍数
  enlarge: 1,
  // 图片默认渲染方式
  mode: "contain",
  // 限制图片最大宽度和高度
  maxImgSize: 2000,
  // 裁剪框限制最小区域
  limitMinSize: [100, 120],
  // 裁剪框的大小信息
  infoTrue: false,
});

const realTime = (data: any) => {
  previews.value = data;
};

// 重新选择图片
const uploadBth = () => {
  emits("update-cropper");
};

// 关闭弹框
const handleClose = () => {
  emits("close-dialog", false);
};

// 获取裁剪之后的图片，默认blob，也可以获取base64的图片
const saveImg = () => {
  if (props.imgType === "blob") {
    cropper.value.getCropBlob((data: any) => {
      let file = new window.File([data], props.rawFile.name, {
        type: "image/png",
      });
      emits("upload-img", file);
      emits("close-dialog");
    });
  } else {
    // 该方法暂未实现，请使用blob
    cropper.value.getCropData((data: any) => {
      emits("upload-img", data);
      emits("close-dialog");
    });
  }
};
const getImgSize = (file: File) => {
  return new Promise<{ width: number; height: number }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as any; // 设置图片源

      img.onload = () => {
        // 获取图片的宽度和高度
        let width = img.width;
        let height = img.height;

        // 如果宽度大于400，则调整宽度为400
        if (width > 400) {
          height = (height * 400) / width; // 自适应高度
          width = 400; // 设置宽度为400
        }
        resolve({ width, height });
      };
    };

    reader.onerror = (e) => {
      console.log("读取文件出错", e);
      reject(new Error("读取文件出错"));
    };

    reader.readAsDataURL(file); // 读取文件为 Data URL
  });
};
onMounted(async () => {
  nextTick(async () => {
    console.log(cropperEl.value);
    try {
      if (!cropperEl.value) {
        return;
      }
      const { width, height } = await getImgSize(props.rawFile);
      console.log(width, height);

      cropperEl.value.style.width = `${width}px`;
      cropperEl.value.style.height = `${height}px`;
    } catch (error) {
      console.log(error);
    }
  });
});
</script>

<style lang="less" scoped>
// .cropper-el {
//   height: 400px;
//   width: 400px;
// }

.cropper-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .prive-el {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    text-align: center;
    margin-top: 30px;

    .prive-style {
      margin: 0 auto;
      // margin-left: 40px;
    }

    .preview {
      overflow: hidden;
    }

    .btnList {
      width: 100%;

      .el-button {
        margin-top: 20px;
      }
    }
  }
}
</style>
