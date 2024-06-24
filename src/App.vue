<!--<template>-->
<!--  <div class="common-layout">-->
<!--    <el-container>-->
<!--      <el-header>-->
<!--        <h1>-->
<!--          票务管理系统-->
<!--        </h1>-->
<!--        <el-dropdown>-->

<!--    <span class="el-dropdown-link custom-dropdown-link">-->
<!--      <el-icon><User /></el-icon>-->
<!--      管理员-->
<!--      <el-icon class="el-icon&#45;&#45;right">-->
<!--        <arrow-down />-->
<!--      </el-icon>-->
<!--    </span>-->
<!--          <template #dropdown>-->
<!--            <el-dropdown-menu>-->
<!--              <el-dropdown-item>我的信息</el-dropdown-item>-->
<!--              <el-dropdown-item>修改密码</el-dropdown-item>-->
<!--              <el-dropdown-item>退出登录</el-dropdown-item>-->
<!--            </el-dropdown-menu>-->
<!--          </template>-->
<!--        </el-dropdown>-->
<!--      </el-header>-->
<!--      <el-container>-->
<!--        <el-aside >-->
<!--          <el-row class="tac">-->
<!--            <el-col :span="12">-->
<!--                <h5 class="mb-2">首页</h5>-->
<!--              <el-menu-->
<!--                  default-active="2"-->
<!--                  class="el-menu-vertical-demo"-->
<!--                  @open="handleOpen"-->
<!--                  @close="handleClose"-->
<!--              >-->
<!--                <el-sub-menu index="1">-->
<!--                  <template #title>-->
<!--                    <el-icon><document /></el-icon>-->
<!--                    <span>账户管理</span>-->
<!--                  </template>-->
<!--                  <el-menu-item index="1-1" @click="$router.push('/managerManagement')">-->
<!--                    管理员管理</el-menu-item>-->
<!--                  <el-menu-item index="1-2" @click="$router.push('/usersManagement')">-->
<!--                    用户管理</el-menu-item>-->
<!--                  <el-menu-item index="1-3" >账户统计</el-menu-item>-->
<!--                </el-sub-menu>-->
<!--                <el-menu-item index="2" @click="$router.push('/activeManagement')" >-->
<!--                  <el-icon><document /></el-icon>-->
<!--                  <span>活动信息</span>-->
<!--                </el-menu-item>-->
<!--                <el-menu-item index="3" @click="$router.push('/venueManagement')">-->
<!--                  <el-icon><location /></el-icon>-->
<!--                  <span>场馆管理</span>-->
<!--                </el-menu-item>-->
<!--                <el-menu-item index="4"  @click="$router.push('/ticketManagement')">-->
<!--                  <el-icon><Ticket /></el-icon>-->
<!--                  <span>票务管理</span>-->
<!--                </el-menu-item>-->
<!--              </el-menu>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </el-aside>-->
<!--        <el-main>-->
<!--&lt;!&ndash;          <todoList v-show="todo" ></todoList>&ndash;&gt;-->
<!--&lt;!&ndash;          <user v-show="userMa" ></user>&ndash;&gt;-->
<!--          <router-view></router-view>-->
<!--        </el-main>-->
<!--      </el-container>-->
<!--    </el-container>-->
<!--  </div>-->
<!--</template>-->

<!--<style>-->

<!--</style>-->
<!--<script lang="ts" setup>-->
<!--import todoList from './components/todoList.vue';-->

<!--import user from './components/UserManagement.vue'-->

<!--import {ref} from "vue"; // 注意路径前的@符号-->

<!--import VueRouter from 'vue-router';-->
<!--import { ArrowDown } from '@element-plus/icons-vue'-->
<!--const handleOpen = (key, keyPath) => {-->

<!--};-->
<!--const handleClose = (key, keyPath) => {-->

<!--};-->

<!--</script>-->

<!--<style scoped>-->
<!--.example-showcase .el-dropdown-link {-->
<!--  cursor: pointer;-->
<!--  color: var(&#45;&#45;el-color-primary);-->
<!--  display: flex;-->
<!--  align-items: center;-->
<!--}-->
<!--.custom-dropdown-link {-->
<!--  margin-top: 20px;-->
<!--}-->
<!--.el-container{-->
<!--  background: #ffffff;-->
<!--}-->
<!--.mb-2{-->
<!--  text-align: center;-->
<!--}-->
<!--.el-header{-->
<!--  display: flex;-->
<!--  justify-content: space-between;-->
<!--  background-image: linear-gradient(to right,  #ffc0cb, #90ee90);-->
<!--}-->

<!--</style>-->

<template>
<!--  <login/>-->
  <router-view></router-view>
<!--  <UserInfo></UserInfo>-->
<!--  <SellerInfo/>-->
<!--  <ManagerInfo></ManagerInfo>-->
</template>
<script setup>
import UserInfo from "./components/UserInfo.vue";
import SellerInfo from "./components/SellerInfo.vue";
import ManagerInfo from "./components/ManagerInfo.vue";
import PInfo from "./components/PInfo.vue";
import Login from "./components/Login.vue";
</script>