<script setup>
import { ref } from 'vue';
import { User, Lock } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import axios from "axios";
import { useUserStore } from '../stores/counter.js'



const router = useRouter();
const idNumber = ref('');
const password = ref('');

const handleLogin = async () => {
  // 验证输入是否为空
  if (!idNumber.value.trim() || !password.value.trim()) {
    alert('身份证号和密码不能为空');
    return;
  }
  console.log(idNumber.value);
  console.log(password.value);
  const user=ref({})
  try {
    // 调用后端API进行登录验证
    const response = await axios.get(`http://localhost:8080/dalizi/selUser/${idNumber.value}`,
    );
    user.value=response.data;
    console.log(user.value);
    // 假设后端返回的数据结构包含success字段来指示操作是否成功
    if (user.value.password == password.value) {
      // 登录成功，跳转到首页
      const userStore = useUserStore();
      userStore.setUserId(idNumber.value)



      router.push({ path: '/Ulist', query: { idcard: idNumber.value } });

    } else {
      // 登录失败，显示错误信息
      alert(response.data.message || '登录失败，请重试');
    }
  } catch (error) {
    // 处理网络错误或服务器错误
    console.error('登录请求出错:', error);
    alert('登录过程中发生错误，请检查网络或稍后重试。');
  }
}




</script>
<template>
  <div id="login-form"><form @submit.prevent="handleLogin" >
    <p>登录</p>
    <div class="form-group">
      <div class="input-with-icon">
        <el-icon class="icon"><User /></el-icon>
        <input type="text" id="idNumber" v-model="idNumber" placeholder="请输入身份证号"  required>
      </div>
    </div>

    <div class="form-group">
      <div class="input-with-icon">
        <el-icon class="icon"><Lock /></el-icon>
        <input type="password" id="password" placeholder="请输入密码" v-model="password" required >
      </div>
    </div>
    <button type="submit">登录</button>
  </form>
  </div>
</template>
<style scoped>
#login-form {
  background-image: url('https://images.wallpaperscraft.com/image/single/microphone_black_and_white_blur_905259_1280x720.jpg');
  background-position: center center; /* 图片居中显示 */
  background-repeat: no-repeat;
  background-size: cover; /* 图片覆盖整个容器，可能会拉伸 */
  position: relative;
  height: 100vh; /* 设置高度为视口高度 */
  display: flex;
  justify-content: center;
  align-items: center; /* 垂直居中对齐表单 */
}

#login-form::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.1); /* 半透明白色覆盖层 */
  z-index: 1; /* 确保覆盖层在表单之前 */
}

#login-form > form {
  width: 300px;
  padding: 20px;
  border: 1px solid #000000;
  border-radius: 5px;
  background-color: transparent;
  position: relative; /* 为表单内的元素定位提供上下文 */
  z-index: 2; /* 确保表单内容在覆盖层之上 */
  backdrop-filter: blur(5px);
}
p{
  font-size: 20px;
  height: 32px;
  margin-top: 5px;
  color: #23c9e9;
}
.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
}

input[type="text"],
input[type="password"] {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #000; /* 添加黑色边框 */

//background-color: transparent; /* 输入框背景设为透明 */
  outline: none; /* 移除焦点时的轮廓，可选 */
  background-color: rgba(255, 255, 255, 0.5);
}
input[type="text"]::placeholder,
input[type="password"]::placeholder {
  color: #d3dce6; /* 将颜色值替换为您希望的提示文字颜色 */
}
button {
  width: 100%;
  padding: 10px;
  background-color: #23c9e9;
  color: white;
  border: none;
  cursor: pointer;
}
.form-group {
  display: flex;
  align-items: center; /* 使输入框和图标垂直居中 */
}

.input-with-icon {
  display: flex; /* 使用flex布局 */
  align-items: center; /* 垂直居中对齐 */
}

.input-with-icon .icon {
  margin-right: 5px; /* 图标与输入框之间的间距 */
  color: #000000; /* 图标颜色 */
}
.input-with-icon input {
  width: calc(100% - 30px); /* 减去图标宽度和一些间距 */
  padding-left: 87px; /* 为输入框左侧留出图标空间，根据图标实际大小调整 */
}
</style>