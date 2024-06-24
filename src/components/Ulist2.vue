
<script setup>
import axios from 'axios';
import { ref, computed,onMounted ,watch} from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const originalArray = ref([]);

//使用 JSON.parse 解析 JSON 字符串，将其转换回原始的 JavaScript 对象或数组。
const jsonData = JSON.parse(route.query.data);
console.log(jsonData)
// [
//	{name: '张三', age: '18'}，
//	{name: '李四', age: '17'}，
//	{name: '王五', age: '16'}
//]








// 使用useRoute获取路由信息
// const route = useRoute();
// 定义props来接收外部传入的值
// 从路由的查询参数中解构获取数据
//const { eventId, eventName, eventDate, selectedPrice, quantity,userId } = route.query;
let eventId=jsonData.eventId;
let eventName=jsonData.eventName;
let eventDate=jsonData.eventDate;
let selectedPrice=jsonData.selectedPrice;
let quantity=jsonData.quantity;
let userId=jsonData.userId;
let UpdataOrderIds=ref([]);
UpdataOrderIds=jsonData.orderIds;


// 根据需要使用这些变量
console.log(eventId, eventName, eventDate, selectedPrice, quantity,  userId);

const userName = ref('');
const phoneNumber = ref('');

// 使用传过来的idCard计算maskedIdCard
const maskedIdCard = computed(() => {
  if (!userId) return ''; // 防止idCard未定义时的错误
  const visibleChars = 3;
  const hiddenChars = userId.length - visibleChars * 2;
  return userId.slice(0, visibleChars) + '*'.repeat(hiddenChars) + userId.slice(-visibleChars);
});

// 更新totalPrice计算属性，使用解构的selectedPrice和quantity
const totalPrice = computed(() => {
  return selectedPrice * quantity;
});
// 定义一个异步函数来获取用户信息
async function getUserInfo(userId) {
  try {
    const response = await axios.get(`http://localhost:8080/dalizi/selUser/${userId}`);
    return response.data; // 假设后端返回的数据结构包含了用户名和电话号码
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error; // 也可以选择处理错误或返回一个默认值
  }
}
// 使用userId查询用户信息
onMounted(async () => {
  if (userId && userId !== 'undefined') { // 额外检查userId不是'undefined'字符串
    try {
      const userInfo = await getUserInfo(userId);
      userName.value = userInfo.username;
      phoneNumber.value = userInfo.phonenumber;
    } catch (error) {
      console.error("Failed to fetch user info on mount:", error);
    }
  }
});
// 在其他methods之后添加
async function updatePaymentStatusToCompleted() {
  try {
    // 假设你有orderId，或者可以根据eventId等信息从后端获取
    const response = await axios.put(`http://localhost:8080/dalizi/updateOrderStatusBatchToCom`,UpdataOrderIds);
    console.log("==========orderidsInUlist2",UpdataOrderIds)
    if (response.status === 200) {
      console.log('订单支付状态更新为COMPLETED');
      // 可以在此处添加额外的成功处理逻辑，如关闭对话框、显示成功消息等
    } else {
      console.error('更新订单状态失败，状态码：', response.status);
    }
  } catch (error) {
    console.error('更新订单状态时出错:', error);
  }
}
async function updatePaymentStatusToFailed() {
  try {
    // 假设你有orderId，或者可以根据eventId等信息从后端获取
    const response = await axios.put(`http://localhost:8080/dalizi/updateOrderStatusBatchTofalse`,UpdataOrderIds);

    if (response.status === 200) {
      console.log('订单支付状态更新为COMPLETED');
      // 可以在此处添加额外的成功处理逻辑，如关闭对话框、显示成功消息等
    } else {
      console.error('更新订单状态失败，状态码：', response.status);
    }
  } catch (error) {
    console.error('更新订单状态时出错:', error);
  }
}

const outerVisible = ref(false)
const innerVisible = ref(false)
</script>

<template>
  <div class="order-confirm">
    <h2>{{ eventName}}</h2>
    <p>{{ eventDate }} </p>
    <p>￥{{ selectedPrice }}票档 × {{ quantity }}张</p>

    <div class="real-name-info">
      <h3>实名观影人信息</h3>
      <p>用户名：{{ userName }}</p>
      <p>身份证：{{ userId }}</p>
    </div>

    <div class="contact-info">
      <h3>联系方式</h3>
      <p>电话号码：{{ phoneNumber }}</p>
    </div>

    <p class="total-price">总计：￥{{ totalPrice }}</p>


    <el-button class="submit-order" plain @click="outerVisible = true">
      提交订单 (支付总额：￥{{ totalPrice }})
    </el-button>

    <el-dialog v-model="outerVisible"  width="800">
      <span>确认支付订单(支付总额：￥{{ totalPrice }})</span>
      <el-dialog
          v-model="innerVisible"
          width="500"
          append-to-body
      >
        <span>支付成功</span>
        <template #footer>
    <span class="dialog-footer">
      <el-button @click="updatePaymentStatusToFailed ">取消</el-button>
      <el-button type="primary" @click="updatePaymentStatusToCompleted">确认</el-button>
    </span>
        </template>
      </el-dialog>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="outerVisible = false">取消</el-button>
          <el-button type="primary" @click="innerVisible = true">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.order-confirm {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f8f8f8;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #23c9e9;
  margin-bottom: 1rem;
}

p {
  color: #555;
  line-height: 1.5;
}

.real-name-info, .contact-info {
  margin-top: 1.5rem;
  border-top: 1px solid #ddd;
  padding-top: 1rem;
}

h3 {
  color: #555;
  margin-bottom: 0.5rem;
}

.total-price {
  font-weight: bold;
  color: #007bff;
  margin-bottom: 1.5rem;
}

.submit-order {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  text-transform: uppercase;
  font-size: 0.9rem;
  border-radius: 3px;
  transition: all 0.3s ease;
}

.submit-order:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>

