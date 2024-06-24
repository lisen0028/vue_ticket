<script setup>

import {ChatLineSquare, Document, Grid, Ticket} from "@element-plus/icons-vue";

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};

const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};
</script>

<template>

  <div class="Seller-layout">
    <el-container>
      <el-header style="background-color: lightblue;border-bottom: black solid 2px;">
        <h1>小狗购票系统</h1>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <!-- 侧边栏内容 -->
          <div class="aside">
            <h2 class="mb-1">管理员中心</h2>
            <el-menu
                default-active="2"
                class="el-menu-Seller"
                @open="handleOpen"
                @close="handleClose"
            >
              <el-sub-menu index="1">
                <template #title>
                  <el-icon><grid /></el-icon>
                  <span>账户管理</span>
                </template>
                <el-menu-item index="1-1" @click="$router.push('/MInfo')">
                  <el-icon><document /></el-icon>
                  <span>个人信息</span>
                </el-menu-item>
              </el-sub-menu>

              <el-sub-menu index="2">
                <template #title>
                  <el-icon><document /></el-icon>
                  <span>信息管理</span>
                </template>
                <el-menu-item index="2-1" @click="$router.push('/ActManage')">
                  <el-icon><ticket /></el-icon>
                  <span>活动管理</span>
                </el-menu-item>
                <el-menu-item index="2-2" @click="$router.push('/UManage')">
                  <el-icon><ticket /></el-icon>
                  <span>用户信息管理</span>
                </el-menu-item>
                <el-menu-item index="1-2" @click="$router.push('/CManage')">
                  <el-icon><ChatLineSquare /></el-icon>
                  <span>系统评价</span>
                </el-menu-item>
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

<style scoped>
.aside{
  text-align: center;
  background-color: lightblue;
}
</style>
