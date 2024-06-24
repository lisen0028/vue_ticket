<script setup>
import {ref, computed, onMounted} from 'vue';
import { useRoute,useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();

import NavBar from './NavBar.vue';
import Footer from './Footer.vue';
import axios from "axios";



const dataList = [
  {name: '张三', age: '18'},
	{name: '李四', age: '17'},
	{name: '王五', age: '16'}
]
//使用 JSON.stringify 将数据转换为 JSON 字符串，以便在 URL 上进行传递。
const shuzu=async ()=>{
  router.push({
    path: '/Ulist2',
    query: {
      data: JSON.stringify(dataList )
    }
  })
}


const view= ref(1);
const categoryId = ref(null);
const selectedIndex = ref(); // 默认选中第一个价格
const quantity = ref(1);
// 定义一个响应式数据用来存储活动详情
const eventDetails = ref(null);
const selectedNavIndex = ref(0); // 默认第一个选项被选中
// 定义一个响应式变量来存储eventId

let eventId ='1';
eventId = route.params.eventid;
// onMounted( () => {
//   eventId = route.params.eventId;
//   console.log("=================", eventId)
// })

const userId=ref(1234);
console.log('验证是否成功传值：', eventId);
const selectPrice = (index) => {
  selectedIndex.value = index;
  categoryId.value = ticketPrices.value[index]?.categoryId;
};
function increment() {
  if (quantity.value < 3) {
    quantity.value++;
  }
}

function decrement() {
  if (quantity.value > 1) {
    quantity.value--;
  }
}
const totalAmount = computed(() => {
  // 确保selectedIndex.value是有效的，并且pricesArray已初始化且有值
  if (selectedIndex.value !== undefined && pricesArray.value !== null && pricesArray.value.length > 0 && selectedIndex.value < pricesArray.value.length) {
    // 直接从pricesArray中获取价格，无需再进行字符串处理，因为假设已经是数值类型
    const selectedPrice = pricesArray.value[selectedIndex.value];
    return (selectedPrice * quantity.value).toFixed(2);
  } else {
    // 如果价格信息尚未加载或索引无效，可以返回一个默认值或者提示信息
    return '价格信息加载中...';
  }
});

const navItems = [
  { title: "项目详情" },
  { title: "购票须知" },
  { title: "观演须知" }
];


// 方法
const selectNavItem = (index) => {
  selectedNavIndex.value = index;
};




// 使用eventId来进一步处理逻辑，例如发送请求获取活动详情
async function fetchEventData() {
  console.log("=========eventId==============",eventId);
  if (eventId) {
    try {
      const response = await fetch(`http://localhost:8080/dalizi/getEventByid/${eventId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("=========response==============",response);
      const eventData = await response.json();
      eventDetails.value = eventData;
      console.log('活动详情获取成功:', eventDetails.value);
    } catch (error) {
      console.error("获取活动详情失败:", error);
    }
  } else {
    console.warn('eventId未定义，无法获取活动详情。');
  }
}
// 组件挂载后立即获取活动信息
onMounted(() => {
  fetchEventData();
  fetchTicketPrices();
});

// 定义一个响应式数据用来存储票价信息
const ticketPrices = ref(null);
const pricesArray = ref(null);
// 异步函数用于获取票价信息
async function fetchTicketPrices() {
  try {
    const response = await fetch(`http://localhost:8080/dalizi/getCateByEventId/${eventId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const detailedPricesData = await response.json();

    // 假设detailedPricesData是包含{price, currency, remainingTickets}的对象数组
    // 提取所有票价信息并构造包含价格和余票的新数组
    const ticketInfo = detailedPricesData.map(item => ({
      price: item.price,
      currency: item.currency,
      remainquantity: parseInt(item.remainquantity, 10) ,// 确保remainingTickets是整数
      categoryId: item.categoryid
    }));

    ticketPrices.value = ticketInfo; // 更新ticketPrices以包含价格和余票信息

    // 如果仍然需要单独的pricesArray只包含价格，可以这样提取
    const prices = ticketInfo.map(item => item.price);
    pricesArray.value = prices;

    console.log('票务票价信息及余票获取成功:', ticketPrices.value);
    console.log('票价信息获取成功:', pricesArray.value);
  } catch (error) {
    console.error("获取票价及余票信息失败:", error);
  }
}


// 在<script setup>部分的checkRemainingTickets方法也需要相应调整
const checkRemainingTickets = () => {
  const selectedTicket = ticketPrices.value[selectedIndex.value];
  if (selectedTicket && selectedTicket.remainquantity < quantity.value) {
    alert('余票不足，不能购买！');
    return false;
  }
  return true;
};


// 异步函数用于添加订单
async function addOrder() {
  if (!checkRemainingTickets()) return; // 确保余票足够

  // 获取当前时间作为订单日期
  const orderDate = new Date().toISOString().split('T')[0];


  // 遍历用户选择的数量，为每张票创建一个订单记录
  const orderData = {
    eventid: eventId,
    idcard: userId.value,
    orderdate: orderDate,
    orderprice: pricesArray.value[selectedIndex.value], // 单张票价格
    paymentstatus: 'PENDING',
    view: 1,
    orderid:null,
    ticketid:''
  };

  // try {
  //   // 调用后端API添加订单，使用categoryId作为路径参数
  //   const response = await fetch post(`http://localhost:8080/dalizi/addOrder/${categoryId.value}/${quantity.value}`, orderData{
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(orderData),
  //   });
  const orderIds = ref([]);
  try {
    const response = await axios.post(`http://localhost:8080/dalizi/addOrder?categoryid=${categoryId.value}&count=${quantity.value}`, orderData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    // ${quantity.value}
    console.log("Response Data:", response.data);
    if (response.status !== 200) {
      // 错误处理逻辑
    } else {
      console.log("Response Data:", response.data.orderid);
      response.data.forEach(item => {
        if (item.eventid) { // 确保item.eventid存在，避免undefined被添加到数组中
          orderIds.value.push(item.orderid);
        }
      });
      console.log('订单添加成功，准备跳转');
      console.log("准备查询参数对象")
      const data = {
        eventId: eventId,
        eventName: eventDetails.value.eventname,
        eventDate: eventDetails.value.eventdate,
        selectedPrice: pricesArray.value[selectedIndex.value],
        quantity: quantity.value,
        totalPrice: totalAmount.value,
        userId: userId.value,
        orderIds: response.data,
      };
      console.log("orderids==========",orderIds.value)
      console.log("参数内容==========",data)

      await router.push({
        path: '/Ulist2',
        query: {
          data: JSON.stringify(data)
        }
      })
      console.log('订单添加成功');
      // 成功处理逻辑
    }
  } catch (error) {
    console.error('添加订单时发生错误:', error);
  }
}

// 修改去支付按钮的点击事件处理器
const navigateToAnother = async () => {
  try {
    if (checkRemainingTickets()) {
      // 尝试添加订单
      await addOrder();


    }
  } catch (error) {
    console.error('在准备跳转前添加订单时出错:', error);
    // 可能需要处理错误情况，如提示用户订单添加失败
  }
};

</script>

<template>
  <NavBar/>
  <div class="perform">
    <div class="w1200 box flex">
      <div class="flex1">
        <div class="hd">
          <div class="cont">
            <div class="cover">
              <div v-if="eventDetails">
                <img :src="eventDetails.imgaddress" alt="" class="poster"  lazy="loaded">
                <div class="order">
                  <div class="title">
                    <span class="tip">总票代</span>
                    <span>{{eventDetails.eventname}}</span>
                    <div  class="address">
                      <div class="time">时间：{{eventDetails.eventdate}}</div>
                      <div class="place">
                        <div class="addr">场馆：{{eventDetails.venue}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <p>加载中...</p>
              </div>
            </div>
            <div class="perform_order_box">
              <div class="perform_order_select">
                <div class="select_left">票档</div>
                <div class="select_right">
                  <div class="select_right_list" >
                    <div
                        v-for="(priceInfo, index) in ticketPrices"
                        :key="index"
                        class="select_right_list_item sku_item"
                        :class="{ active: selectedIndex === index }"
                        @click="selectPrice(index, priceInfo.priceType)"
                    >
                      <div class="skuname" >
                        {{ priceInfo.price }} {{ priceInfo.currency || '元' }}  {{ priceInfo.priceType }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="perform_order_price">
                <div class="number_left">数量</div>
                <div class="number_right">
                  <div class="number_right_info">
                    <div class="cafe-c-input-number">
                      <a class="cafe-c-input-number-handler cafe-c-input-number-handler_down cafe-c-input-number-handler-disabled" @click="decrement">-</a>
                      <div class="cafe-c-input-number-input-wrap">
                        <input autocomplete="off" spellcheck="false" placeholder class="cafe-c-input-number-input" id="numberInput" v-model.number="quantity">

                        <span class="input-unit">张</span>
                        <span class="input-nuit_gray"></span>
                      </div>
                      <a class="cafe-c-input-number-handler cafe-c-input-number-handler_up" @click="increment">+</a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="perform_order_price">
                <div class="number_left">合计</div>
                <div class="number_right">
                    <span class="totol_price">
                      <i>￥</i>
                      {{ totalAmount }}
                    </span>
                </div>
              </div>
              <el-button class="button1" type="primary" @click="navigateToAnother">去支付</el-button>
              <el-button @click="shuzu">shuzu</el-button>
            </div>
          </div>
        </div>

        <div class="perform_bd">
          <div class="notice">
            <div class="notice-nav">
              <span
                  v-for="(item, index) in navItems"
                  :key="index"
                  class="notice-nav-item"
                  :class="{ 'notice-nav-item-active': selectedNavIndex === index }"
                  @click="selectNavItem(index)"
              >
        {{ item.title }}
        <span
            class="notice-nav-item-flag"
            :style="{ display: selectedNavIndex === index ? 'block' : 'none' }"
        ></span>
      </span>
            </div>
            <div class="notice-content">
              <div class="detail">
                <div class="list"  v-if="selectedNavIndex === 0">
                  <div class="title">活动介绍</div>
                  <div class="words">
                    <p>
                      <p>活动介绍：</p>
                      <p class="item_title"></p>
                    </p>
                  </div></div>
                <div class="list" v-if="selectedNavIndex === 1">
                  <div class="title">购票须知</div>
                  <div class="words"><div>
                    <p class="item_title">限购规则</p>
                    <ul><li>每笔订单最多购买6张</li></ul>
                  </div>
                    <div>
                      <p class="item_title">退票/换票规则</p>
                      <ul><li>票品为有价票券，非普通商品，其背后承载的文化服务具有时效性，稀缺性等特征，不支持退换。</li></ul>
                    </div>
                    <div>
                      <p class="item_title">配送信息说明</p>
                      <ul><li>不支持修改配送电话、地址等信息</li></ul>
                    </div>
                    <div>
                      <p class="item_title">入场规则</p>
                      <ul><li>须打开【票夹】扫码入场，截图无效。</li></ul>
                    </div>
                    <div>
                      <p class="item_title">儿童购票</p>
                      <ul><li>儿童一律凭票入场</li></ul>
                    </div>
                    <div><p class="item_title">发票说明</p>
                      <ul><li>演出开始前，去【订单详情页】提交发票申请。我们会将电子发票发送至您的邮箱。</li></ul>
                    </div>
                    <div><p class="item_title">实名购票规则</p>
                      <ul><li>一张门票对应一个证件；证件支持：身份证</li></ul>
                    </div>
                    <div><p class="item_title">异常排单说明</p>
                      <ul><li>对于异常订购行为，大麦网有权在订单成立或者生效之后取消相应订单。异常订购行为包括但不限于以下情形：（1）通过同一ID订购超出限购张数的订单。（2）经合理判断认为非真实消费者的下单行为，包括但不限于通过批量相同或虚构的支付账号、收货地址（包括下单时填写及最终实际收货地址）、收件人、电话号码订购超出限购张数的订单。</li></ul>
                    </div>
                    <div>
                      <p class="item_title">温馨提示</p>
                      <ul><li>1.购买前请您提前规划好行程，做好相应准备，以免影响您的正常观演，感谢您的理解和配合。2.若演出受不可抗力影响延期或取消，大麦将对演出票订单按照项目官方通知方案进行处理，其他因观演发生的费用需由您自行承担。</li></ul>
                    </div>
                  </div>
                </div>
                <div  class="list" v-if="selectedNavIndex === 2">
                  <div class="title">观演须知</div>
                  <div class="words"><div>
                    <p class="item_title">演出时长</p>
                    <ul><li>以现场为准</li></ul>
                  </div>
                    <div>
                      <p class="item_title">入场时间</p>
                      <ul><li>请于演出前约90分钟入场</li></ul>
                    </div>
                    <div><p class="item_title">禁止携带物品</p>
                      <ul><li>由于安保和版权的原因，大多数演出、展览及比赛场所禁止携带食品、饮料、专业摄录设备、打火机等物品，请您注意现场工作人员和广播的提示，予以配合。</li></ul>
                    </div>
                    <div>
                      <p class="item_title">寄存说明</p>
                      <ul><li>有寄存处,具体位置请联系现场工作人员。</li></ul></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-backtop :right="66" :bottom="100" />
  <Footer/>
</template>

<style scoped>

.perform {
  margin-bottom: 64px;
}
.flex{
  display: flex;
}
.perform .box {
  border: 1px solid #ebebeb;
  border-top: 0;
}
.w1200 {
  width: 900px;
  margin: 0 auto;
}
.flex1{
  -webkit-box-flex: 1;
  -moz-box-flex: 1;
  flex: 1;
}
.perform .hd {
  position: relative;
  padding: 40px 0 30px;
  min-height: 360px;
}
.perform .hd .cont {
  padding-left: 350px;
  font-size: 22px;
  color: #000;
}
.poster {
  position: absolute;
  left: 45px;
  top: 40px;
  width: 270px;
  height: 370px;
}
.perform .order {
  position: relative;
  padding-right: 30px;
}
.perform .tip {
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
.address .time {
  padding-bottom: 10px;
}
.address .addr, .address .mapicon {
  display: inline-block;
}
.address {
  position: relative;
  font-size: 16px;
  color: #4a4a4a;
  margin-top: 21px;
  zoom: 1;
}
.perform_order_select {
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: flex;
  margin-top: 24px;
}
.select_left {
  display: inline-block;
  font-size: 16px;
  color: #000;
  height: 48px;
}
.select_right {
  display: inline-block;
  vertical-align: top;
  margin-left: 15px;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -moz-box-flex: 1;
  flex: 1;
}
.select_right_list {
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  flex-direction: row;
  flex-wrap: wrap;
}
.sku_item {
  box-sizing: border-box;
  padding: 8px 24px 6px;
}
.active {
  border-color: #23c9e9;
  color: #29c6de;
  background: #fff;
}
.skuname {
  text-align: left;
  margin: 1px 0;
}
.select_right_list_item {
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -moz-box-orient: vertical;
  -moz-box-direction: normal;
  flex-direction: column;
  -webkit-box-pack: center;
  -moz-box-pack: center;
  justify-content: center;
  display: flex;
  float: left;
  font-size: 12px;
  margin: 0 6px 6px 0;
  position: relative;
  cursor: pointer;
  border-radius: 3px;
  background: #f6f7f8;
  border: 1px solid rgba(0, 0, 0, .1);
  text-align: left;
}
.perform_order_price {
  margin-top: 7px;
}
.number_left {
  display: inline-block;
  font-size: 16px;
  color: #4a4a4a;
  vertical-align: top;
  line-height: 40px;
}
.number_right {
  display: inline-block;
  height: 40px;
  vertical-align: top;
  margin-left: 9px;
  line-height: 40px;
}
.number_right_info {
  height: 38px;
  display: inline-block;
  line-height: 38px;
}
.cafe-c-input-number{
  float: right;
  margin: 0 6px;
  position: relative;
  display: inline-block;
  user-select: none;
  font-size: 0;
}
.cafe-c-input-number-handler-disabled {
  background-color: #e5e5e5;
  color: #ccc;
}
.cafe-c-input-number-handler {
  display: inline-block;
  width: 24px;
  font-size: 14px;
  border-radius: 2px;
  border: 1px solid #e5e5e5;
  color: #000;
  background-color: #f2f3f4;
  z-index: 1;
  box-sizing: border-box;
  text-align: center;
  cursor: pointer;
  vertical-align: middle;
  -webkit-transition: all .2s linear;
  -moz-transition: all .2s linear;
  transition: all .2s linear;
  line-height: 26px;
  height: 28px;
}
a {
  text-decoration: none;
}
.cafe-c-input-number-input-wrap {
  text-align: center;
  display: inline-block;
  margin: 0 4px;
  padding: 0 18px;
}
.cafe-c-input-number-input {
  text-align: center;
  outline: 0;
  font-size: 16px;
  color: #000;
  -moz-appearance: textfield;
  width: 17px;
  height: 24px;
  line-height: 24px;
  border-radius: 2px;
  box-sizing: border-box;
  vertical-align: middle;
  transition: all .2s linear;
  border: none;
}
.input-unit{
  display: inline-block;
  height: 24px;
  line-height: 24px;
  font-size: 16px;
  color: #000;
  vertical-align: middle;
}
.input-nuit_gray{
  display: inline-block;
  height: 24px;
  line-height: 28px;
  font-size: 12px;
  color: #999;
  vertical-align: middle;
}
.number_left {
  display: inline-block;
  font-size: 16px;
  color: #4a4a4a;
  vertical-align: top;
  line-height: 40px;
}
.number_right {
  display: inline-block;
  height: 40px;
  vertical-align: top;
  margin-left: 9px;
  line-height: 40px;
}
.totol_price {
  font-size: 21px;
  color:  #29c6de;
  margin-left: -9px;
}
.totol__price i {
  position: relative;
  left: 3px;
  font-size: 16px;
  font-style: normal;
}
.button1{
  background-color: #29c6de;
  margin-top: 10px;
}
.notice{
  font-size: 16px;
}
.notice-nav{
  height: 54px;
  line-height: 54px;
  padding-left: 30px;
  border-top: 1px solid #e2e2e2;
  border-bottom: 1px solid #e2e2e2;
}
.notice-nav-item{
  font-size: 16px;
  color: #9c9ca5;
  margin-right: 60px;
  cursor: pointer;
}
.notice-nav-item-active{
  position: relative;
  font-size: 20px;
  color: #000;
}
.notice-nav-item-flag{
  position: absolute;
  height: 4px;
  width: 18px;
  bottom: -4px;
  left: 32px;
  right: 22px;
  background: #29c6de;
  border-radius: 40px;
}
.notice-content{
  padding: 60px 30px 0;
}
.detail .list {
  padding-bottom: 100px;
}
.detail .words p {
  font-size: 16px;
  color: #4a4a4a;
  line-height: 30px;
}
div{
  margin: 0;
  padding: 0;
}
.title {
  padding-bottom: 14px;
  margin-bottom: 23px;
  font-size: 20px;
  color: #000;
  border-bottom: 1px solid #e2e2e2;
}

.words {
  word-break: break-word;
}
.words img {
  display: block;
  max-width: 100%;
  height: auto;
}
.item_title {
  color: #999;
  font-size: 13px;
}

</style>