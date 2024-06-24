<template>
  <div class="personal-orders">
    <!-- 修改区域为包含搜索框和按钮的表单 -->
    <div class="search-header">
      <el-form :inline="true" class="demo-form-inline">
        <el-input v-model="searchKeyword" placeholder="请输入活动名称搜索" style="width: 1200px;" />
        <el-button type="primary" @click="searchOrdersByName(searchKeyword)">搜索</el-button>
        <el-button type="danger" @click="handleBatchDelete">删除</el-button>
      </el-form>
    </div>

    <el-card v-for="order in orders" :key="order.orderid" shadow="hover" class="order-card" >
      <div v-if="order.view == 1">
        <div slot="header" class="clearfix">
          <el-checkbox v-model="order.isSelected" />
          <strong>订单编号: {{ order.orderid }}</strong>
          <el-tag size="medium" :type="orderStatusTag(order.paymentstatus)">{{ orderStatusText(order.paymentstatus) }}</el-tag>
        </div>
        <div class="order-details">
          <div  class="ticket-item">
            <div class="ticket-info">
              <p>{{ username }}</p>
              <p>{{ order.event?.eventname || '活动名称加载中...' }}</p>
              <!--            <p>数量: {{ ticket.quantity }}</p>-->
            </div>
          </div>
        </div>
        <div class="order-footer">
          <p>总价: {{ order.orderprice }}元</p>
          <el-button type="primary" size="small" @click="viewDetails(order)">详情</el-button>
          <template v-if="order.paymentstatus === 'PENDING'">
            <el-button size="small" type="danger" @click="cancelOrder(order)">取消订单</el-button>
            <el-button type="primary" size="small" @click="payOrder(order.orderid)">去支付</el-button>
          </template>
          <!-- 退票按钮，需满足两个条件：paymentstatus为'COMPLETED'且当前时间在活动时间之前 -->
          <template v-else-if="order.paymentstatus === 'COMPLETED' && isBeforeEventDate(order)">
            <el-button size="small" type="warning" @click="refundTicket(order)">退票</el-button>
          </template>
          <!--        <el-button size="small" type="danger" @click="cancelOrder(order)">取消订单</el-button>-->
        </div>

        <!--      订单详情表格，初始隐藏-->
        <!-- 订单详情表格 -->
        <div v-if="order.showDetails" class="details-table-container">
          <el-table
              :data="order.event ? [order.event] : []"
              stripe
              style="width: 100%; table-layout: fixed;"
          >
            <el-table-column prop="eventname" label="活动名称" width="180"/>
            <el-table-column prop="eventdate" label="活动时间" width="180"/>
            <el-table-column prop="venue" label="活动地点" width="180"/>
            <el-table-column prop="classify" label="活动类型" width="180"/>
            <el-table-column label="座位号" width="120">
              <template #default="{ row }">
                {{ order.ticket && order.ticket.seatnumber || '座位号信息缺失' }}
              </template>
            </el-table-column>
            <el-table-column label="票务档次" width="120">
              <template #default="{ row }">
                {{ order.ticketcategory && order.ticketcategory.categoryname || '票务档次信息缺失' }}
              </template>
            </el-table-column>
            <el-table-column label="价格" width="120">
              <template #default="{ row }">
                <!-- 此处通过访问外部作用域的order来获取orderprice -->
                {{ order.orderprice }}元
              </template>
            </el-table-column>
          </el-table>
        </div>


      </div>
    </el-card>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from 'vue';
import {ElMessage} from 'element-plus';
import { ElMessageBox } from 'element-plus';
import axios from 'axios';
import { useUserStore } from '../stores/counter.js'
import router from "../router.js";


const userStore = useUserStore();
const id = ref(userStore.userId); // 示例用户ID，实际应从登录状态或其他方式动态获取
// const userInfo = ref({
//   username:'',
// });
const userInfo = ref({});
const orders = ref([]);
const loading = ref(false);
const error = ref(null);
const event = ref();
const eventsMap = ref({});
const ticketMap = ref({});
const ticketcategoryMap = ref({});
// 添加一个变量用于存储搜索关键词
const searchKeyword = ref('');

// 初始化时为每个订单添加isSelected属性
const initOrdersWithSelection = async () => {
  try {
    // 设置加载状态
    loading.value = true;
    // 发起获取订单数据的请求
    const response = await axios.get(`http://localhost:8080/dalizi/getOrders/${id.value}`);
    // 使用映射确保每个订单对象都包含isSelected属性，并默认设为false
    orders.value = response.data.map(order => ({...order, isSelected: false}));
    // 请求成功后，重置加载状态
    loading.value = false;
  } catch (err) {
    // 请求失败，记录错误信息并给出提示
    error.value = '获取订单信息失败，请稍后再试。';
    ElMessage.error(error.value);
    console.error('获取订单失败:', err);
    // 确保加载状态复位
    loading.value = false;
  }
};

// 显示错误信息的辅助函数
const showError = (errorMsg) => {
  error.value = errorMsg;
  ElMessage.error(error.value);
};

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/dalizi/selUser/${id.value}`);
    userInfo.value = response.data;

    console.log("用户姓名：", userInfo.value.username)
  } catch (err) {
    error.value = '获取用户信息失败，请重试。';
    console.error(err);
  }

};



// 在setup函数中
const username = computed(() => {
  return userInfo.value ? userInfo.value.username : '';
});


// 按活动名称搜索订单的方法
const searchOrdersByName = async (searchKeyword) => {
  try {
    const response = await axios.get(`http://localhost:8080/dalizi/getOrdersByName/${searchKeyword}/${id.value}`);
    orders.value = response.data; // 更新orders状态

    // 清除之前的错误信息
    error.value = null;

    // 对新的订单列表重新获取票务信息和票务档次信息
    for (let index = 0; index < orders.value.length; index++) {
      const order = orders.value[index];
      await fetchTicketInfo(order.ticketid, index);
      await fetchTicketCategory(order.ticketid, index);
    }
  } catch (err) {
    error.value = '搜索订单失败，请重试。';
    console.error(err);
  }
};

// 获取用户的订单及活动信息
// 获取所有订单信息
const fetchOrders = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/dalizi/getOrders/${id.value}`);
    orders.value = response.data;

    // 遍历订单，获取每个订单的活动名称及票务详情
    for (let index = 0; index < orders.value.length; index++) {
      const order = orders.value[index];

      if (!eventsMap.value[order.eventid]) {
        console.log('Order:', order);
        // 如果映射中还没有这个eventid对应的名称，发起请求获取
        await fetchEventName(order.eventid);
      }

      // 获取票务详情，传递订单索引
      await fetchTicketInfo(order.ticketid, index);
      await fetchTicketCategory(order.ticketid, index);
    }
  } catch (err) {
    error.value = '获取订单信息失败，请重试。';
    console.error(err);
  }
  console.log("orders:", orders.value);
};

// 根据eventid获取并设置完整的活动信息
const fetchEventName = async (eventId) => {
  try {
    const response = await axios.get(`http://localhost:8080/dalizi/getEventByid/${eventId}`);
    // 假设response.data包含了完整的活动信息对象
    eventsMap.value[eventId] = response.data; // 整个活动对象存入映射中
  } catch (err) {
    console.error(`获取活动信息失败：${err}`);
  }
};


// 新增：根据ticketid获取票务信息
const fetchTicketInfo = async (ticketId, orderIndex) => {
  try {
    const response = await axios.get(`http://localhost:8080/dalizi/getticket/${ticketId}`);
    ticketMap.value[ticketId] = response.data;

    // 更新对应订单的ticket属性
    orders.value[orderIndex].ticket = response.data;
  } catch (err) {
    console.error(`获取票务信息失败：${err}`);
  }
  console.log("ticketMap:", ticketMap.value);
};


const fetchTicketCategory = async (ticketId, orderIndex) => {
  try {
    const response = await axios.get(` http://localhost:8080/dalizi/getTicketCByTicketId/${ticketId}`);
    ticketcategoryMap.value[ticketId] = response.data;

    // 更新对应订单的ticketCategory属性

  } catch (err) {
    console.error(`获取票务档次信息失败：${err}`);
  }

};

// 监听orders变化，确保每个订单都有对应的eventname
// 在watch回调中，直接从映射中获取完整的活动对象并赋值给order.event
watch(orders, async () => {
  for (const order of orders.value) {
    if (!order.event || !order.event.eventname) {
      if (!eventsMap.value[order.eventid]) {
        await fetchEventName(order.eventid);
      }
      // 现在直接从映射中获取完整的活动对象
      order.event = eventsMap.value[order.eventid] || {eventname: '未知活动'};
    }
  }
}, {immediate: true, deep: true});
onMounted(() => {
  fetchUserInfo();
  fetchOrders();
  initOrdersWithSelection();
});
// 搜索订单的方法示例
const searchOrders = () => {
  // 实际的搜索逻辑可以根据需要在这里实现
};


// 批量删除方法
const handleBatchDelete = async () => {
  const selectedOrderIds = orders.value
      .filter(order => order.isSelected)
      .map(order => order.orderid);

  if (selectedOrderIds.length === 0) {
    ElMessage.warning('请至少选择一个订单');
    return;
  }

  try {
    // 调用后端批量删除的API
    const response = await axios.put('http://localhost:8080/dalizi/delOrdersViewBatch', selectedOrderIds);
    console.log(response.data); // 打印服务端返回的消息
    ElMessage.success(response.data); // 显示成功的提示信息

    // 更新UI，移除已删除的订单（如果前端也需要同步）
    orders.value = orders.value.filter(order => !selectedOrderIds.includes(order.orderid));
  } catch (error) {
    ElMessage.error('批量删除失败，请重试');
    console.error('批量删除错误:', error);
  }
};

const viewDetails = (order) => {
  order.showDetails = !order.showDetails;
};

//取消订单
const cancelOrder =  async (order) => {
  try {
    // 使用ElMessageBox显示确认对话框
    const confirmResult = await ElMessageBox.confirm(
        `确认退订订单 ${order.orderid}？`,
        '退票确认',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        },
    );
    if (confirmResult === 'confirm') {
      // 用户点击了确认按钮，执行
      const response = await axios.put(`http://localhost:8080/dalizi/cancelOrder/${order.orderid}`);
      ElMessageBox.alert('订单取消成功',
          {
            confirmButtonText: '确定',
            type: 'success',
          });
      // 成功后刷新订单列表（如果需要）
      await initOrdersWithSelection();
    } else {
      ElMessage.error('退票失败，请稍后重试');
    }
  } catch (error) {
    ElMessage.error('订单取消失败');
    console.error('退票错误:', error);
  }
};

// 添加计算属性
const orderStatusTag = (status) => {
  switch (status) {
    case 'COMPLETED':
      return 'success';
    case 'FAILED':
      return 'danger';
    default: // Assuming 'PENDING' and any other cases not explicitly handled
      return 'info';
  }
};

const orderStatusText = (status) => {
  switch (status) {
    case 'COMPLETED':
      return '已完成';
    case 'FAILED':
      return '失败';
    default: // Assuming 'PENDING' or any other custom handling
      return '待处理';
  }
};

// 在<script setup>部分的其他方法上方或下方添加
const convertToDate = (dateString) => {
  // 假设dateString格式为"YYYY-MM-DD"，您可以根据实际情况调整解析格式
  const [year, month, day] = dateString.split('-');
  return new Date(`${year}-${month}-${day}T00:00:00`);
};

//跳转到支付界面
const payOrder=async (id) => {
   await axios.put(`http://localhost:8080/dalizi/updatePaymentStatus/${id}`);
   ElMessageBox.alert('支付成功',
       {
         confirmButtonText: '确定',
         type: 'success',
       });

};
const isBeforeEventDate = (order) => {
  // 确保order和order.event不为undefined，并且eventdate存在
  if (!order || !order.event || !order.event.eventdate) {
    return false; // 或者根据需要处理这种情况，比如显示警告信息
  }

  const eventDate = convertToDate(order.event.eventdate);
  const currentDate = new Date();

  return currentDate < eventDate;
};

//退票
const refundTicket = async (order) => {
  try {
    // 使用ElMessageBox显示确认对话框
    const confirmResult = await ElMessageBox.confirm(
        `确认退订订单 ${order.orderid}？`,
        '退票确认',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
        },
    );

    if (confirmResult === 'confirm') {
      // 用户点击了确认按钮，执行退票逻辑
      const response = await axios.put(`http://localhost:8080/dalizi/cancelOrder/${order.orderid}`);

      if (response.status === 200) {
        // 退票成功后，再次使用ElMessageBox显示成功消息
        ElMessageBox.alert('退票成功，退款' + order.orderprice + '元将打到您的账户', '退票成功', {
          confirmButtonText: '确定',
          type: 'success',
        });

        // 成功后刷新订单列表（如果需要）
        await initOrdersWithSelection();
      } else {
        ElMessage.error('退票失败，请稍后重试');
      }
    }
  } catch (error) {
    ElMessage.error('网络错误，退票失败');
    console.error('退票错误:', error);
  }
};


</script>

<style scoped>
/* 保持原有的样式代码不变 */
</style>
<style scoped>
> .personal-orders {
  display: grid;
  grid-template-areas:
    "header"
    "content";
  grid-template-rows: auto 1fr;
  gap: 20px;
  justify-items: center;
}

.search-header {
  grid-area: header;
}

.order-card {
  /* 增加卡片的高度和宽度 */
  width: 80%; /* 或者使用固定像素值，如 600px */
  min-height: 200px; /* 设置最小高度，根据需要调整 */
  margin: 0 auto 20px;
  /* 保持原有样式不变，可根据需求调整 */
}

.order-details {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ticket-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.ticket-info p {
  margin: 0;
}
</style>
