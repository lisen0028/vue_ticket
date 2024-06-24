<script setup>

import {ref, reactive, onMounted} from 'vue';
import {ElMessage} from "element-plus";
import { useRoute  } from 'vue-router';
import axios from "axios";
const inputs = reactive([
  {
    categoryname: "", // 票务档次名称
    totalQuantity: 0, // 总数量
    price: 0.0, // 票价
    description: "", // 描述
    eventid: "", // 事件ID，从路由参数中获取，确保在实际使用前已定义ToeventId
  }
]); // 用于存储复合输入框的状态
const num = ref(0);
let ToeventId='';


onMounted(() => {
  const route = useRoute(); // 初始化route
// 获取路由参数
   ToeventId = route.params.eventid;
  console.log(ToeventId);
})



// 处理数量变化
const handleChange = () => {
  // 清空现有输入框状态并重新初始化
  inputs.splice(0, inputs.length);
  for (let i = 0; i < num.value; i++) {
    inputs.push({ text: '', number: 0 });
  }
  console.log(ToeventId+"==================");
};

// 提交表单数据
const handleSubmit = async () => {
  // 验证输入数据
  const hasEmptyFields = inputs.some(input =>
      !input.categoryname ||
      !input.totalQuantity ||
      !input.price
  );


  if (hasEmptyFields) {
    alert('请确保票务档次的名称、总数量和票价都已填写！');
    return; // 停止执行后续代码
  }

  // 创建一个新数组来存储用户输入的数据
  const submittedData = inputs.map(input => ({
    categoryname: input.categoryname,
    totalquantity: input.totalQuantity,
    price: input.price,
    description: input.description,
    remainquantity: input.totalQuantity, // 假设剩余数量初始化为总数量，根据实际情况调整
    eventid: ToeventId // 假设每个输入都与同一个活动相关联，根据实际情况调整
  }));

  for(const item of submittedData) {
    try {
      console.log('==========变量的值==============',item);

      const response = await axios.post(`http://localhost:8080/dalizi/CreateTicketcategory`, item); // 确保URL正确
      console.log(response.data+"+++++++++++++++++++++++"); // 根据后端实际返回处理
      alert("添加成功");
      // 创建活动成功后的跳转逻辑
      console.log('+++++++++++++++++++++++++提交的数据:', submittedData); // 打印或处理提交的数据
      // 这里你可以继续处理submittedData，比如发送到服务器
    } catch (error) {
      console.error('创建票务档次时发生错误:', error);
      ElMessage.error('创建票务档次失败，请稍后再试！');
    }
  }
  await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟异步操作，如发送请求后等待
  ElMessage.success('票务信息添加成功！');


};



</script>

<template>
  <div class="C-container">
    <el-form>
      <h2>票务档次详情</h2>
      <el-form-item label="档次数量" >
        <el-input-number v-model="num" :min="1" :max="10"/>
        <el-button type="primary" @click="handleChange">确定</el-button>
      </el-form-item>

      <!-- 动态生成复合输入框 -->
      <div v-for="(input, index) in inputs" :key="index" class="composite-input-group">
        <el-form-item label="票务档次的名称">
          <el-input v-model="input.categoryname" placeholder="票务档次的名称" />
        </el-form-item>
        <el-form-item label="该档次的总数量">
          <el-input-number v-model="input.totalQuantity" :min="0" placeholder="该档次的总数量" />
        </el-form-item>
        <el-form-item label="票价">
          <el-input-number v-model="input.price" :precision="2" :step="0.1" :min="0" :max="10"  placeholder="该档次的票价" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="input.description" placeholder="票务档次的描述" />
        </el-form-item>
      </div>

      <el-button type="primary" @click="handleSubmit"><router-link to="SActivities" style="color: white;text-decoration: none">提交</router-link></el-button>
    </el-form>

  </div>
</template>

<style scoped>
.composite-input-group {
  margin-bottom: 30px; /* 调整数值以改变间距大小 */
  border: 1px solid #ccc;
  padding: 5px 10px 10px 10px;
  margin-top: 20px;
}

</style>

