<script setup>

import {ref,onMounted} from "vue";
import { ElForm, ElFormItem, ElRow, ElCol, ElButton,} from 'element-plus';
import 'element-plus/dist/index.css';
import {Edit, Plus, Search} from "@element-plus/icons-vue";
import axios from 'axios';
import { ElMessage } from 'element-plus'; // 引入Element Plus的消息提示组件

const input3=ref();
const userId=ref(1234);
// 定义变量存储数据
const actInfos = ref([]);
const ticketcategoryMap=ref({});

const getEvents = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/dalizi/getEvents`);
    actInfos.value = response.data;

    // 遍历订单，获取每个订单的活动名称及票务详情
    for (let index = 0; index < actInfos.value.length; index++) {
      const actInfo = actInfos.value[index];

      if (!ticketcategoryMap.value[actInfo.eventid]) {
        console.log('actInfo:', actInfo);
      }

      // 获取票务详情，传递活动索引
      await fetchTicketCategories(actInfo.eventid, index);
    }
  } catch (err) {
    error.value = '获取活动信息失败，请重试。';
    console.error(err);
  }
  console.log("actInfos:", actInfos.value);
};

//根据活动ID获取票务档次信息
const fetchTicketCategories = async (eventId, actInfoIndex) => {
  try {
    const response = await axios.get(` http://localhost:8080/dalizi/getCateByEventId/${eventId}`);
    ticketcategoryMap.value[eventId] = response.data;

    // 更新对应订单的ticketCategory属性
    actInfos.value[actInfoIndex].ticketcategory = response.data;
  } catch (err) {
    console.error(`获取票务档次信息失败：${err}`);
  }
  console.log("ticketcategoryMap:", ticketcategoryMap.value);
};

// 在组件挂载后调用获取数据的方法
onMounted(() => {
  getEvents();
});

// 编辑表单数据模型
const editForm = ref({
  time: "",
  address: "",
});

const deleteSingleEvent = async (eventId) => {
  try {
    await axios.delete(`http://localhost:8080/dalizi/delEvent/${eventId}`);
    ElMessage.success('活动删除成功');
    getEvents(); // 删除后重新获取活动列表
  } catch (error) {
    ElMessage.error('删除活动时发生错误: ' + error.message);
  }
};

// 在setup部分添加以下代码
const searchEventsByName = async () => {
  try {
    if (input3.value.trim() === '') {
      ElMessage.warning('请输入活动名称进行查询');
      return;
    }
    const response = await axios.get(`http://localhost:8080/dalizi/getEventsByName/${input3.value}`);
    actInfos.value = response.data;
  } catch (err) {
    ElMessage.error('查询活动信息失败，请重试。');
    console.error(err);
  }
  console.log("input3:", input3.value);
};

// 监听输入框的输入事件，当用户按下回车键时触发查询
const handleInputEnter = (event) => {
  if (event.key === 'Enter') {
    searchEventsByName();
  }
};


</script>

<template>
  <h2>活动信息</h2>

  <div class="search">
    <el-input
        v-model="input3"    style="max-width: 600px"
        placeholder="请输入活动名称搜索"
        class="input-with-select"
        @keyup.enter="handleInputEnter"
    >
      <template #prepend>
        <el-button :icon="Search" />
      </template>
    </el-input>

  </div>
  <el-card v-for="actInfo in actInfos" :key="actInfo.id" shadow="hover" class="actIfo-card">
    <div class="hd">
      <div class="cont">
        <div class="cover">
          <div class="poster-wrap">
            <img
                alt=""
                class="poster"
                :src="actInfo.imgaddress"
                lazy="loaded"
                >
          </div>
          <div class="order">
            <div class="title">
              <span class="tip">总票代</span>
              <span>{{ actInfo.eventname }}</span>
            </div>
            <el-form label-position="top" class="form-info">
              <el-row>
                <el-col :span="8">
                  <!-- 使用活动对象的startTime -->
                  <el-form-item>
                    <span>活动时间：{{ actInfo.eventdate }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <span>活动地点：{{ actInfo.venue }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item>
                    <span>活动编号：{{ actInfo.eventid }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <div class="perform_order_box">
              <div class="perform_order_select">
                <div class="select_left">票档</div>
                <ul class="ticket-list">
                  <li v-for="(ticketcategory, index) in actInfo.ticketcategory" :key="index">
                    {{ ticketcategory.categoryname }} - {{ ticketcategory.remainquantity }}
                  </li>

                </ul>
              </div>
            </div>
            <div class="Description">
              <el-form-item label="详情">
                <el-text>
                  {{actInfo.description}}
                </el-text>
              </el-form-item>
              <el-button type="danger" :icon="Delete" @click="deleteSingleEvent(actInfo.eventid)"
                         style="margin-left: 20px;"
              >删除</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.cont {
  display: flex;
}
.search{
  margin-bottom: 5px;
}
.cover {
  display: flex;
  flex-direction: row; /* 行布局，图片和文字横向排列 */
  flex: 1;
  height: 300px; /* 若希望图片容器有固定高度，可设定，否则可移除 */
}

.poster-wrap {
  display: flex;
  justify-content: center; /* 水平居中图片 */
  align-items: center; /* 垂直居中图片 */
  flex: 0 0 20%; /* 修改这里，让图片容器占据30%宽度，且不缩放 */
  overflow: hidden; /* 防止图片溢出 */
  width: 100px;
}

.poster {
  max-width: 100%;
  max-height: 100%; /* 限制图片最大高度为容器高度 */
  object-fit: cover; /* 保持图片宽高比并填充容器 */
}

.order {
  flex: 1; /* 文字容器自动填充剩余空间 */
  padding-left: 20px; /* 可选间距 */
}

.address .time {
  padding-bottom: 10px;
}
.address .addr, .address {
  display: inline-block;
}

.title{
  font-size: 20px; /* 设置字体大小 */
  font-weight: bold; /* 设置字体加粗 */
}
.tip {
  display: inline-block;
  width: 60px;
  height: 24px;
  position: relative;
  top: -3px;
  text-align: center;
  line-height: 24px;
  background: linear-gradient(-45deg, #23c9e9, #29c6de);
  z-index: 10;
  font-size: 15px;
  color: #fff;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
}
.ticket-list {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(3, 200px); /* 每个格子宽度固定为20px */
  gap: 3px; /* 列之间的间隙 */
}

.ticket-list li {
  padding: 2px; /* 调整内边距以适应20px的宽度，根据内容具体调整 */
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: whitesmoke;
}
.select_left{
  font-weight: bold;
}

/* 添加按钮样式 */
.Description button {
  cursor: pointer;
  margin-bottom: 10px;
}

</style>