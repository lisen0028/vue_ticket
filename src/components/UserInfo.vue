<template>
  <div class="common-layout">
    <el-container>
      <el-header style="background-color: lightblue;border-bottom: black solid 2px;">
        <h1>小够在线购票系统</h1>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- 侧边栏内容 -->
          <div class="tac">
            <h3 class="mb-2">个人管理中心</h3>
            <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
            >
              <el-sub-menu index="1">
                <template #title>
                  <el-icon><grid /></el-icon>
                  <span>账户管理</span>
                </template>
                <el-menu-item index="1-1" @click="$router.push('/PInfo')">
                  <el-icon><document /></el-icon>
                  <span>个人信息</span>
                </el-menu-item>
                <el-menu-item index="1-2" @click="$router.push('/Commit')">
                  <el-icon><ChatLineSquare /></el-icon>
                  <span>历史评价</span>
                </el-menu-item>
              </el-sub-menu>

              <!-- 订单管理菜单 -->
              <el-sub-menu index="2">
                <template #title>
                  <el-icon><document /></el-icon>
                  <span>订单管理</span>
                </template>
                <el-menu-item index="2-1" @click="$router.push('/POrder')">
                  <el-icon><ticket /></el-icon>
                  <span>个人订单</span>
                </el-menu-item>
                <!-- 可以继续添加其他订单相关的菜单项 -->
              </el-sub-menu>
            </el-menu>
          </div>
        </el-aside>
        <el-main>
          <!-- 主要内容区域，这里将显示子目录对应的界面内容 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Document, Ticket, ChatLineSquare, User ,Grid} from '@element-plus/icons-vue';
// 假设 handleOpen 和 handleClose 是处理菜单展开和关闭的方法，这里简化未给出具体实现

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};
</script>

<style scoped>
.common-layout {
  height: 100vh;
}

.el-header h1 {
  align-self: center;
}
.tac {
  text-align: center;
  background-color: lightblue;
}
.mb-2 {
  margin-bottom: 0.5em;
}
/* 可根据需要调整其他样式 */
</style>