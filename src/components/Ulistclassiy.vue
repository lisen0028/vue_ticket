<script setup>
import {ref,onMounted} from 'vue'
import { useRoute } from 'vue-router';
import axios from "axios";
const route = useRoute();
const size = ref < 'default' | 'large' | 'small' > ('default')

const value1 = ref('')
const value2 = ref('')


const eventName = route.query.eventName;

const shortcuts = [
  {
    text: 'Today',
    value: new Date(),
  },
  {
    text: 'Yesterday',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24)
      return date
    },
  },
  {
    text: 'A week ago',
    value: () => {
      const date = new Date()
      date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
      return date
    },
  },
]

const disabledDate = (time) => {
  return time.getTime() > Date.now();
}

let currentCategory = ref('音乐节') // 初始化当前激活的分类为“音乐节”

const selectCategory = (category) => {
  currentCategory.value = category // 点击时更新当前激活的分类
}
const actInfos =ref([])
// ref({
//   eventid: '',
//   eventname: '',
//   category: '',
//   seatnumber: '',
//   status: '',
//   imgaddress: '',
//   classify: '',
//   createdby: '',
//   description: '',
//   venue: '',
//   eventdate: ''
// });
onMounted(async () => {
  console.log(eventName);
  await fetchUserInfo();
});
const fetchUserInfo = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/dalizi/search`, {
      params: {
        eventname: eventName
      }
    });
    actInfos.value = response.data;
  }catch(error){
    console.error('获取活动信息失败:', error);
  }
};


</script>

<template>
  <div class="w1200 box flex">
    <div class="search-box-flex">
      <div class="search-main">
        <div class="search-factor">
          <div class="factor-item">
           <span class="factor-title">
           分 类：
           </span>
            <div class="factor-content">
              <div class="factor-content-main">
                  <span v-for="(item, index) in ['音乐节', '演唱会', '话剧歌剧', '体育', '儿童亲子']"
                        :key="index"
                        class="factor-content-item"
                        :class="{ 'factor-content-item-active': currentCategory === item }"
                        @click="selectCategory(item)">
        {{ item }}
      </span>
              </div>
            </div>
          </div>
          <div class="factor-item">
                 <span  class="factor-title">
                 时 间：
                </span>
            <div class="factor-content">
              <div class="calendar">
                <div  class="calendar-slot">
                  <div class="demo-date-picker">
                    <div class="block">
                      <el-date-picker
                          v-model="value1"
                          type="date"
                          placeholder="请选择日期"
                          :size="size"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="search_itemlist" v-for=" item in actInfos">
          <div class="item_main">
            <div class="item_box">
              <div class="items">
                <a  class="items__img">
                  <img :src="item.imgaddress" alt="项目图片" lazy="loaded"></a>\\
                <div  class="items__txt" >
                  <div class="items__txt__title">
                    <a>{{ item.eventname }}</a>
                  </div>
                  <div class="items__txt__time">
                    <a class="items__txt__venue__icon"></a>
                    {{ item.venue }}
                  </div>
                  <div  class="items__txt__time">
                    <a d class="items__txt__time__icon"></a>
                    {{ item.eventdate }}
                  </div>
                  <div  class="items__txt__price">
                   <span>
            480-1880{{ item.price }}
            <i>元</i></span>
                    售票中
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.box {
  border: 0px solid #ebebeb;
  border-top: 0;
}
.w1200{
  width: 900px;
  margin: 0 auto;
}
.flex {
  display: flex;
}
.search-main {
  width: 928px;
}
.search-factor {
  padding: 0 24px;
  border: 1px solid #e9e9e9;
}
.factor-item {
  display: flex;
  padding: 10px 0;
  border-bottom: 1px dotted #dfdfdf;
}
.factor-title{
  width: 80px;
  line-height: 26px;
  color: #968788;
  text-align: right;
  margin-right: 18px;
}
.factor-content {
  flex: 1;
}
.factor-content-main{
  display: flex;
}
.factor-content-item-default{
  margin-right: 6px;
}
.factor-content{
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -moz-box-flex: 1;
  flex: 1;
}
.factor-content-item{
  display: inline-block;
  height: 26px;
  line-height: 26px;
  padding: 0 8px;
  margin-right: 24px;
  color: #333;
  white-space: nowrap;
  cursor: pointer;
}
.factor-item{
  display: flex;
  padding: 10px 0;
}
.factor-content-item-active, .factor-content-item:hover {
  background-color: #ed0b75;
  color: #fff;
}
.search_itemlist {
  zoom: 1;
  border: 1px solid #efefef;
  border-top: none;
}
.item_main {
  padding: 5px 18px;
  min-height: 211px;
  margin-bottom: 20px;
}

.items {
  position: relative;
  padding: 14px 0 220px;
  border-bottom: 1px dotted #cecece;
  margin: 0 10px;
  zoom: 1;
}
.items__img {
  position: relative;
  display: block;
  width: 153px;
  height: 206px;
  overflow: hidden;
  margin-right: 20px;
  float: left;
}
.items__img__tag{
  position: absolute;
  top: 10px;
  left: 10px;
  background: #ff1268;
  font-size: 12px;
  color: #fff;
  padding: 2px 4px;
  border-radius: 2px;
}
.items__img img{
  width: 100%;
  height: 100%;
}

.items__txt {
  width: 680px;
  line-height: 24px;
  float: left;
}
.items__txt__title{
  margin-bottom: 6px;
  font-size: 16px;
  font-weight: 400;
}
.items__txt__time {
  margin-bottom: 6px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #999;
}
.items__txt__venue__icon {
  background: url(//img.alicdn.com/tfs/TB1981syYGYBuNjy0FoXXciBFXa-36-323.png) no-repeat 0 -82px;
  padding-left: 17px;
}
.items__txt__time__icon{
  width: 14px;
  height: 14px;
  margin-top: 5px;
  cursor: text;
  display: block;
  float: left;
  margin-right: 5px;
  background: url(//img.alicdn.com/tfs/TB1981syYGYBuNjy0FoXXciBFXa-36-323.png) no-repeat;
  background-position: 0 -47px;
}

.items__txt__price {
  position: absolute;
  bottom: 12px;
  color: #999;
  overflow: hidden;
}
.items__txt__price {
  position: absolute;
  bottom: 12px;
  color: #999;
  overflow: hidden;
}
.items__txt__price span {
  color: #ff1268;
  font-weight: 700;
  font-size: 16px;
  margin-right: 20px;
  font-style: normal;
}
</style>