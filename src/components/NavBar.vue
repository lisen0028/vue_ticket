
<script setup>
import {ref, defineProps, onMounted,defineEmits} from 'vue'
import axios from 'axios';
import { Search } from '@element-plus/icons-vue'
import { useRouter,useRoute } from 'vue-router';
import {useUserStore} from "../stores/counter.js";
const router = useRouter();
const route = useRoute();
const emits = defineEmits(['logoutSuccess']);
const userStore = useUserStore();
const userId =ref(userStore.userId);
const userdata=ref({});
const { emit } = emits;

// 定义emits


const handleSelect = (key, keyPath) => {
  console.log(key, keyPath)
}
const input1 = ref('');


const buttons = [
  { type: '', text: 'plain' },
]

const handleSearch = () => {
  router.push({ path: '/Ulist3' ,query:{eventName:input1.value} }); // 跳转到Ulist3页面，并携带查询参数
};
const { isHomePage, userName ,userIdcard} = defineProps({
  isHomePage:Boolean ,

  userName: {
    type: String,
    default: '', // 可选，默认值为空字符串
  },
  userIdcard: String
});
onMounted(() => {
  console.log('userIdcard received:', userIdcard);
});
/*跳转首页*/
const navigateToHome = () => {
  // 然后使用Vue Router的push方法进行页面跳转
  router.push('/Ulist');
};
/*跳转登录*/

const redirectToLogin = () => {
  // 然后使用Vue Router的push方法进行页面跳转
  router.push('/Login');
};
const navigateTo = (routeName) => {
  router.push({ path: routeName });
};
//跳转分类界面
const navigateto = (routeName, category) => {
  router.push({ path: routeName, query: { category } });
};

const navigatetoLi = async () => {
  try {
    // 调用后端API进行登录验证
    const response = await axios.get(`http://localhost:8080/dalizi/selUser/${userId.value}`).then(response => {
      userdata.value = response.data;
    })
    console.log(userdata.value);
    // 假设后端返回的数据结构包含success字段来指示操作是否成功

      switch (userdata.value.role) {
        case "SELLER":
          router.push({path: '/SellerInfo'});
          break;
        case "MANAGER":
          router.push({path: '/ManagerInfo'});
          break;
        case "BUYER":
          router.push({path: '/UserInfo'});
          break;
      }
  }catch (error) {
    // 处理网络错误或服务器错误
    console.error('登录请求出错:', error);
    alert('登录过程中发生错误，请检查网络或稍后重试。');
  }


};



</script>

<template>
  <el-menu
      :default-active="isHomePage ? '1' : ''"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      @select="handleSelect"
  >
    <el-menu-item index="0">
      <img
          style="width: 50px"
          src="D:\code\vueTest\vite-project\pnpm-vue-app\public\90897360d1b1f1bc01ea83a7e9ccf985.jpg"
          alt="logo"
      />
    </el-menu-item>
    <div class="flex-grow" />
    <router-link to="/" custom v-slot="{ navigate }">
      <el-menu-item index="1" @click="navigateToHome" :class="{ 'is-active':isHomePage }">首页</el-menu-item>
    </router-link>

    <el-sub-menu index="2">
      <template #title>演出</template>
      <el-menu-item index="2-1"  @click="navigateto('/Ulist3', 'CONCERT')" >演唱会</el-menu-item>
      <el-menu-item index="2-2" @click="navigateto('/Ulist3', 'THEATER')">歌剧话剧</el-menu-item>
      <el-menu-item index="2-3"  @click="navigateto('/Ulist3', 'KIDS')">儿童亲子</el-menu-item>
    </el-sub-menu>
    <el-menu-item index="3" @click="navigateto('/Ulist3', 'SPORTS')" >体育赛事</el-menu-item>
    <el-input
        v-model="input1"
        style="width: 200px;height: 40px;"
        placeholder="Type something"
        :prefix-icon="Search"
    />
    <div class="button-container">
      <el-button
          size="large"
          @click="handleSearch"
          v-for="button in buttons"
          :key="button.text"
          :type="button.type"
          bg
      >
        <p>搜索</p>
      </el-button>
    </div>

    <el-sub-menu v-if="userName" index="4"  >
      <template #title>
        <span @click="redirectToLogin" >{{ userName }}</span>
      </template>
      <el-menu-item  index="5-1" @click="navigatetoLi('Login')">个人信息</el-menu-item>
      <el-menu-item  index="5-2" @click="navigateTo('Login')">退出登录</el-menu-item>
      <el-menu-item  index="5-3"  @click="navigateTo('Ulist4')">评价系统</el-menu-item>

    </el-sub-menu>
  </el-menu>

</template>

<style >
.flex-grow {
  flex-grow: 1;
}
.button-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中，如果需要 */
  height: 100%; /* 如果容器高度不是固定的，可能需要设置一个高度来使垂直居中生效 */
}
.el-input{
  align-items: center;
  padding-top: 16px;
}


</style>

