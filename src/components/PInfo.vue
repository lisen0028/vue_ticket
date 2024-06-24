<template>

  <h1>
    {{ userInfo.name }}
  </h1>
  <div class="p-info-container">
    <h2>个人信息</h2>
    <el-form label-position="top">
      <el-form-item label="姓名">
        <el-input v-model="userInfo.username" placeholder="请输入姓名" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="身份证号">
        <el-input v-model="userInfo.idcard" placeholder="请输入身份证号" :readonly="true"></el-input>
      </el-form-item>
      <el-form-item label="登录密码">
        <el-input
            v-model="userInfo.password"
            placeholder="请输入"
            show-password
            @mousedown.native="showPassword = true"
            @mouseup.native="showPassword = false"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系电话">
        <el-input v-model="userInfo.phonenumber" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="性别">
        <el-radio-group v-model="userInfo.gender">
          <el-radio label="男">男</el-radio>
          <el-radio label="女">女</el-radio>
          <!-- 根据需要，你可以添加更多选项，例如不确定或其他 -->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="userInfo.address" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="userInfo.email" placeholder="请输入邮箱"></el-input>
      </el-form-item>
      <!-- 更多表单项... -->
      <el-button type="primary" @click="saveUserInfo">保存信息</el-button>
    </el-form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; // 确保你已经安装并导入axios库用于HTTP请求
import { useUserStore } from '../stores/counter.js'


const userStore = useUserStore();
const userInfo = ref({
});

const id = ref(userStore.userId);
sessionStorage.setItem('id',id)
console.log(sessionStorage.getItem('id'));

const fetchUserInfo = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/dalizi/selUser/${id.value}`).then(response => {
      userInfo.value = response.data;
    })
        .catch(error => {
          console.error(error);
        });

  } catch (error) {
    console.error('获取用户信息失败:', error);
  }
  console.log(userInfo.value)
};

onMounted(() => {
  fetchUserInfo(); // 页面加载时自动获取用户信息
});


const saveUserInfo = async () => {
  try {
    // 确保URL中包含正确的ID，并使用PUT方法
    const response = await axios.put(`http://localhost:8080/dalizi/updateUser`, userInfo.value);

    if (response.status === 200) {
      console.log('保存成功，服务器响应:', response.data);
      // 可以在这里添加成功后的UI反馈
    } else {
      console.warn('服务器返回非200状态码，详细响应:', response.data);
    }
  } catch (error) {
    console.error('保存用户信息失败:', error.message);
    // 异常处理
  }

};
</script>

<style scoped>
.p-info-container {
  padding: 20px;
}
</style>
