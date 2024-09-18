<template>
  <div class="chat-room" @touchstart="recordStartPos" @touchend="handleMoveEnd">
    <div class="room-header" @click="router.back()">
      <IconBack size="20px" color="#050505" />
      <span>杨钦航</span>
    </div>
    <div class="room-main">
      <ul class="chat_list-container">
        <li
          v-for="(item, index) in chatInfoList"
          :key="index"
          :class="`chat-item ${item.user === userName ? 'reverse' : ''}`"
        >
          <div class="avatar-container">
            <el-avatar :size="50" src="/images/sanye.jpg" fit="fill" />
          </div>
          <div class="chat_content-container">
            <div class="name">{{ item.user }}</div>
            <div class="content">{{ item.content }}</div>
          </div>
        </li>
      </ul>
    </div>
    <div class="room-footer">
      <div class="enter-part">
        <div class="input">
          <el-input
            v-model="input"
            style="width: 100%; height: 100%; max-height: 40px"
            placeholder="Please input"
            type="textarea"
            autosize
            :rows="1"
            :input-style="{ innerHeight: '30px' }"
          />
        </div>
        <div class="send" @click="send">发送</div>
      </div>
      <div class="other-part"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import IconBack from "@/components/icons/IconBack.vue";
import { ref } from "vue";
const router = useRouter();
const input = ref("");
const userName = ref("杨钦航");

/**手指开始触摸时的x坐标位置 */
let startX = 0;
/**手指开始触摸时的y坐标位置 */
let startY = 0;
/**手指开始触摸时的时间 */
let startTime = 0;

/**
 * 记录开始触摸时的x坐标，y坐标，时间
 * @param event 手指触摸事件的事件对象
 */
const recordStartPos = (event: TouchEvent) => {
  event.stopPropagation();
  startX = event.touches[0].pageX;
  startY = event.touches[0].clientY;
  startTime = Date.now();
};
/**
 * 结束触摸时触发的回调函数
 * @param event 结束触摸事件的事件对象
 */
const handleMoveEnd = (event: TouchEvent) => {
  event.stopPropagation();
  const moveEndX = event.changedTouches[0].pageX;
  const moveEndY = event.changedTouches[0].pageY;
  const endTime = Date.now();
  isRouteBack(startX, moveEndX, startY, moveEndY, endTime - startTime);
};
/**
 * 判断是否要回退到上一个路由
 * @param startX 手指触摸开始的x坐标
 * @param endX 手指触摸结束的x坐标
 * @param startY 手指触摸开始的y坐标
 * @param endY 手指触摸结束的y坐标
 * @param timeInterval 从触摸开始到触摸结束的间隔时间
 */
const isRouteBack = (
  startX: number,
  endX: number,
  startY: number,
  endY: number,
  timeInterval: number
) => {
  const X = endX - startX;
  const Y = endY - startY;
  if (X > 0 && Math.abs(Y) <= 10 && timeInterval <= 200) {
    router.back();
  }
};
const chatInfoList = ref([
  {
    user: "杨钦航",
    content: "你好！今天过得怎么样？",
  },
  {
    user: "杨钦航",
    content: "最近有没有看过什么好电影？",
  },
  {
    user: "杨钦航",
    content: "听说你去旅行了，哪里好玩？",
  },
  {
    user: "杨钦航",
    content: "你喜欢的音乐是什么类型的？",
  },
  {
    user: "杨钦航",
    content: "最近在忙什么呢？",
  },
  {
    user: "杨钦航",
    content: "有什么好书推荐吗？",
  },
  {
    user: "杨钦航",
    content: "周末有什么计划吗？",
  },
  {
    user: "杨钦航",
    content: "最近的天气真不错，你觉得呢？",
  },
  {
    user: "杨钦航",
    content: "最近的天气真不错，你觉得呢？",
  },
  {
    user: "杨钦航",
    content: "喜欢喝咖啡还是茶？",
  },
  {
    user: "杨钦航",
    content: "对于新出的游戏，你有什么看法？",
  },
  {
    user: "杨钦航",
    content:
      "嗨！最近我在尝试学习一种新的乐器，虽然一开始有点困难，但我发现音乐真的很治愈，你有没有尝试过学习乐器的经历？",
  },
  {
    user: "杨钦航",
    content: "呵呵\n你好",
  },
]);

const send = () => {
  chatInfoList.value.push({
    user: "杨钦航",
    content: input.value,
  });
};
</script>

<style lang="less" scoped>
.chat-room {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.room-header {
  //   height: 30px;
  flex: 1;
  // background-color: #2d2d2f;
  padding: 5px;
  color: #050505;
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: #f7f7f7;
  // border-bottom: 2px;
}
.room-footer {
  // border-top: 2px;
  // flex: 2;
  height: auto;
  //   height: 40px;
  // background-color: #2d2d2f;
  background-color: #f7f7f7;
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  .enter-part {
    // height: 30px;
    display: flex;
    padding: 2px 5px;
    gap: 10px;
    .input {
      flex: 6;
      background-color: #fff;
      border-radius: 5px;
    }
    .send {
      flex: 1;
      height: 30px;
      background-color: #30aff6;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5px;
    }
  }
  .other-part {
    height: 30px;
  }
}
.room-main {
  //   height: calc(100vh - 70px);
  flex: 12;
  overflow: auto;
  background-color: #f1f1f1;
  .chat_list-container {
    width: 100%;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px 0;
  }
  .chat-item {
    width: 100%;
    display: flex;
    color: #fff;
    padding: 0 10px 0 0;
    gap: 10px;
    .chat_content-container {
      display: flex;
      flex-direction: column;
      .name {
        display: flex;
        flex-direction: row-reverse;
        color: #8f8f8f;
      }
      .content {
        background-color: #009dff;
        border-radius: 5px;
        padding: 10px;
        max-width: 250px;
        font-size: 16px;
      }
    }
  }
}
.reverse {
  flex-direction: row-reverse;
}
</style>
