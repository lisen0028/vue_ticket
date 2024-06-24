<script setup>
import {ref,onMounted,watch} from 'vue'
import { useRoute ,useRouter} from 'vue-router';
import axios from "axios";
const route = useRoute();
const router=useRouter();
const size = ref < 'default' | 'large' | 'small' > ('default')

const value1 = ref('')
const value2 = ref('')
const eventId=ref('')
//接受传过来的分类
const { category } = route.query;
console.log(category);

const eventName = route.query.eventName;
console.log("-----------------------活动名字--------",eventName);
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
const actInfos =ref([])

onMounted(async () => {
  console.log(eventName);
  await fetchUserInfo();
});
//根据活动名称搜索
const fetchUserInfo = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/dalizi/search`, {
      params: {
        eventName: eventName
      }
    });
    actInfos.value = response.data;
    console.log(actInfos.value)
  }catch(error){
    console.error('获取活动信息失败:', error);
  }
};

//根据分类搜索
const fetchUserInfoByCategory = async (selectedCategory) => {
  try {
    // 根据传过来的分类值（或默认值）查询活动
    const response = await axios.get('http://localhost:8080/dalizi/search', {
      params: {
        classify: selectedCategory, // 如果没有传分类，则使用默认值
      },
    })
    actInfos.value = response.data
    console.log("act",actInfos.value)
  } catch (error) {
    console.error('获取活动信息失败:', error)
  }
}
onMounted(async () => {
  if (category) { // 确保有分类参数时才按分类搜索
    await fetchUserInfoByCategory(category);
  } else {
    console.warn("No category provided in the query.");
  }
});
// 监听路由query.category的变化
watch(() => route.query.category, async (newCategory) => {
  if (newCategory) {
    await fetchUserInfoByCategory(newCategory);
  } else {
    console.warn("Category parameter removed from the query.");
  }
}, { immediate: true }); // immediate: true 确保首次加载时也会执行
</script>

<template>
  <div class="w1200 box flex">
    <div class="search-box-flex">
      <div class="search-main">
        <div class="search-factor">
          <div class="factor-item">
            <div class="factor-content">
              <div class="calendar">
                <div  class="calendar-slot">
                  <div class="demo-date-picker">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="search_itemlist" v-for=" item in actInfos" >
          <div class="item_main" @click="router.push({ path: `/Ulist1/${item.eventid}`})">
            <div class="item_box">
              <div class="items">
                <a  class="items__img" >
                  <img :src="item.imgaddress" alt="项目图片" lazy="loaded"></a>
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