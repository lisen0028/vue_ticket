<script setup>
import {ref, defineProps, onMounted,watch} from 'vue'
import axios from 'axios';
import { Search } from '@element-plus/icons-vue'
import NavBar from './NavBar.vue';
import Footer from './Footer.vue';
import { useRouter,useRoute } from 'vue-router';
const router = useRouter();
const route=useRoute();
const images = ref([
  { id: 1, src: 'https://images.wallpaperscraft.com/image/single/concert_performance_light_organ_137789_1280x720.jpg' },
  { id: 2, src: 'y3.png' },
  { id: 3, src: 'y1.png' },
]);
const isHomePage = ref(true);
const  name="";
const username = ref('');
const id=ref('');

onMounted(async () => {
  await fetchData();
});

// 使用watch来监听route.query.idcard的变化，并增加安全性检查
watch(() => route.query, async (newQuery) => {
  if (newQuery && newQuery.idcard) {
    await fetchData();
  }
}, { deep: true });

async function fetchData() {
  console.log("Fetching data...");

  const query = route.query;
  if (query && query.hasOwnProperty('idcard')) {
    id.value = query.idcard;
    console.log("Query Parameters:", query);

    // 添加打印idcard的语句
    console.log('Received ID Card:', id);
    try {
      const response = await axios.get(`http://localhost:8080/dalizi/selUser/${id.value}`);
      username.value = response.data.username;
      console.log('Fetched Username:', username.value);
    } catch (error) {
      console.error('Failed to fetch user name:', error);
    }
  } else {
    console.warn('ID card query parameter is missing or route.query is undefined.');
  }
}
</script>

<template>
  <NavBar  :isHomePage="isHomePage" :userName="username || '登录'"  :userIdcard="id" />
  <!--  <el-menu-->
  <!--      :default-active="props.isHomePage ? '1' : ''"-->
  <!--      class="el-menu-demo"-->
  <!--      mode="horizontal"-->
  <!--      :ellipsis="false"-->
  <!--      @select="handleSelect"-->
  <!--  >-->
  <!--    <el-menu-item index="0">-->
  <!--      <img-->
  <!--          style="width: 50px"-->
  <!--          src="/damai.png"-->
  <!--          alt="logo"-->
  <!--      />-->
  <!--    </el-menu-item>-->
  <!--    <div class="flex-grow" />-->
  <!--    <router-link to="/" custom v-slot="{ navigate }">-->
  <!--      <el-menu-item index="1" @click="navigateToHome" :class="{ 'is-active': props.isHomePage }">首页</el-menu-item>-->
  <!--    </router-link>-->

  <!--    <el-sub-menu index="2">-->
  <!--      <template #title>演出</template>-->
  <!--      <el-menu-item index="2-1" >演唱会</el-menu-item>-->
  <!--      <el-menu-item index="2-2">歌剧话剧</el-menu-item>-->
  <!--      <el-menu-item index="2-3">音乐节</el-menu-item>-->
  <!--    </el-sub-menu>-->
  <!--    <el-menu-item index="3">体育赛事</el-menu-item>-->
  <!--    <el-input-->
  <!--        v-model="input1"-->
  <!--        style="width: 200px;height: 40px;"-->
  <!--        placeholder="Type something"-->
  <!--        :prefix-icon="Search"-->
  <!--    />-->
  <!--    <div class="button-container">-->
  <!--      <el-button-->
  <!--          size="large"-->
  <!--          @click="handleSearch"-->
  <!--          v-for="button in buttons"-->
  <!--          :key="button.text"-->
  <!--          :type="button.type"-->
  <!--          bg-->
  <!--      >-->
  <!--        <p>搜索</p>-->
  <!--      </el-button>-->
  <!--    </div>-->

  <!--    <el-sub-menu index="4"  @mouseover.native="showMenu = true" @mouseout.native="showMenu = false">-->
  <!--      <template #title>-->
  <!--        <span @click="redirectToLogin">{{massage}}</span>-->
  <!--      </template>-->
  <!--      <el-menu-item v-show="showMenu" index="5-1">个人信息</el-menu-item>-->
  <!--      <el-menu-item v-show="showMenu" index="5-2">订单管理</el-menu-item>-->
  <!--      <el-menu-item v-show="showMenu" index="5-3" @click="navigateToEvaluation">评价系统</el-menu-item>-->
  <!--      <el-menu-item v-show="showMenu" index="5-4">退出登录</el-menu-item>-->
  <!--    </el-sub-menu>-->
  <!--  </el-menu>-->

  <div class="block text-center">
    <el-carousel height="300px">
      <el-carousel-item v-for="item in images" :key="item">
        <img :src="item.src" alt="Slide Image" class="carousel-image">
      </el-carousel-item>
    </el-carousel>
  </div>
  <div class="dm-content-wrap">
    <div class="dm-content dm-content-1" data-spm="card_0">
      <div class="head">
        <span class="head-title">演唱会</span>
      </div>
      <div class="box">
        <a href="http://localhost:5174/#/Ulist1/7058" class="box-left" target="_blank">
          <img class="box-left__bg" src="https://img.alicdn.com/bao/uploaded/i4/2251059038/O1CN01zUgwR32GdSbbiCH1C_!!0-item_pic.jpg">
          <div class="box-left__info">
            <div class="title"> 房东的猫「世界/青年」2024巡回演唱会-北京站</div>
            <div class="venue">首都体育馆</div>
            <div class="showtime">2024.06.29</div>
          </div>
        </a>
        <div class="box-right">
          <a href="http://localhost:5174/#/Ulist1/7057" class="box-right__item"  target="_blank">
            <div class="itemimg">
              <img src="https://img.alicdn.com/bao/uploaded/i1/2251059038/O1CN01Eqn9jQ2GdSbenhDYg_!!0-item_pic.jpg">
            </div>
            <div class="iteminfo">
              <div class="title" title="2024当我们谈论爱情梁静茹演唱会-北京站">2024当我们谈论爱情梁静茹演唱会-北京站</div>
              <div class="venue">华熙LIVE·五棵松·场馆</div>
              <div class="showtime">2024.07.13-07.14</div>
              <div class="showtime"></div>

            </div>
          </a>
          <a href="http://localhost:5174/#/Ulist1/7059" class="box-right__item" data-spm="ditem_2" target="_blank">
            <div class="itemimg">
              <img src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i4/2251059038/O1CN01HaGDbx2GdSbQGfhWa_!!2251059038.jpg">
            </div>
            <div class="iteminfo">
              <div class="title" title="动力火车“都是因为爱”演唱会·北京站">动力火车“都是因为爱”演唱会·北京站</div>
              <div class="venue">国家体育馆</div>
              <div class="showtime">2024.07.06 周六 19:00</div>
              <div class="showtime"></div>
            </div>
          </a>
          <a href="http://localhost:5174/#/Ulist1/7060" class="box-right__item" data-spm="ditem_3" target="_blank">
            <div class="itemimg">
              <img src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i1/2251059038/O1CN01DyGAWG2GdSbM0jJVM_!!2251059038.jpg">
            </div>
            <div class="iteminfo">
              <div class="title" >弦子“需要多久才能看完一场日落”2024巡回演唱会-北京站</div>
              <div class="venue">本土王牌LIVE</div>
              <div class="showtime">2024.07.13 周六 19:30</div>
              <div class="showtime"></div>
            </div>
          </a>
          <a href="http://localhost:5174/#/Ulist1/7066" class="box-right__item" data-spm="ditem_4" target="_blank">
            <div class="itemimg">
              <img src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i1/2251059038/O1CN012eZ5iw2GdSbUgLg9d_!!2251059038.png">
            </div>
            <div class="iteminfo">
              <div class="title" >BOYHOOD"Vacation一夏”巡回演唱会</div>
              <div class="venue">WeShow Live</div>
              <div class="showtime">2024.06.15 周六 18:00</div>
              <div class="showtime"></div>
            </div>
          </a>
          <a href="http://localhost:5174/#/Ulist1/7062" class="box-right__item" data-spm="ditem_5" target="_blank">
            <div class="itemimg">
              <img src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i1/2251059038/O1CN01Vr5NDF2GdSaqZ4FIO_!!2251059038.jpg">
            </div>
            <div class="iteminfo">
              <div class="title" title="2024 郁可唯“终身浪漫的开始”演唱会-北京站">2024 郁可唯“终身浪漫的开始”演唱会-北京站</div>
              <div class="venue">国家体育馆</div>
              <div class="showtime">2024.06.22 周六 19:30</div>
              <div class="showtime"></div>
            </div>
          </a>
          <a href="http://localhost:5174/#/Ulist1/7063" class="box-right__item" data-spm="ditem_6" target="_blank">
            <div class="itemimg">
              <img src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i2/2251059038/O1CN01clO1Lc2GdSbb7UmLi_!!2251059038.png">
            </div>
            <div class="iteminfo">
              <div class="title" title="灼海豚乐队「环球美梦」巡回演唱会—北京站">灼海豚乐队「环球美梦」巡回演唱会—北京站</div>
              <div class="venue">EAST LIVE</div>
              <div class="showtime">2024.07.20 周六 19:30</div>
              <div class="showtime"></div>
            </div>
          </a>

        </div>
      </div>
    </div>
  </div>
  <div class="dm-content-wrap">
    <div class="dm-content dm-content-1" data-spm="card_0">
      <div class="head">
        <span class="head-title">话剧歌剧</span>
      </div>
      <div class="box">
        <a href="http://localhost:5174/#/Ulist1/15" class="box-left" target="_blank" data-spm="ditem_0">
          <img class="box-left__bg" src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i2/2251059038/O1CN01q7DdOt2GdSbf4n03b_!!2251059038.jpg_q60.jpg_.webp">
          <div class="box-left__info">
            <div class="title">【北京】英文原版音乐剧《剧院魅影》</div>
            <div class="venue">北京市 | 天桥艺术中心-大剧场</div>
            <div class="showtime">2024-07-19 10:19:54</div>
          </div>
        </a>
        <div class="box-right">
          <a href="http://localhost:5174/#/Ulist1/16" class="box-right__item" data-spm="ditem_1" target="_blank">
            <div class="itemimg">
              <img src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i4/2251059038/O1CN011sy4SR2GdSbob0qoJ_!!2251059038.png_q60.jpg_.webp">
            </div>
            <div class="iteminfo">
              <div class="title" >【杭州】杨超越主演话剧《你好，疯子！》超越青春版 杭州站</div>
              <div class="venue">杭州市 | 杭州临平大剧院 </div>
              <div class="showtime">2024-07-19 10:19:54</div>
              <div class="showtime"></div>
            </div>
          </a><a href="http://localhost:5174/#/Ulist1/17" class="box-right__item" data-spm="ditem_2" target="_blank">
          <div class="itemimg">
            <img src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i3/2251059038/O1CN01SaOyb32GdSblldzfM_!!2251059038.png_q60.jpg_.webp">
          </div>
          <div class="iteminfo">
            <div class="title" >【北京】话剧《雷雨》</div>
            <div class="venue">北京市 | 首都剧场 </div>
            <div class="showtime">2024-07-22 10:19:54</div>
            <div class="showtime"></div>
          </div>
        </a><a href="http://localhost:5174/#/Ulist1/19" class="box-right__item" data-spm="ditem_3" target="_blank">
          <div class="itemimg">
            <img src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i3/2251059038/O1CN01MIWfzw2GdSbkDE1dL_!!2251059038.png_q60.jpg_.webp">
          </div>
          <div class="iteminfo">
            <div class="title" >【上海】上海·蓝人秀</div>
            <div class="venue">上海市 | A.F.A融侨商务中心ROJO艺术文化空间</div>
            <div class="showtime">2024-06-30 10:19:54</div>
            <div class="showtime"></div>
          </div>
        </a><a href="http://localhost:5174/#/Ulist1/20" class="box-right__item" data-spm="ditem_4" target="_blank">
          <div class="itemimg">
            <img src="https://img.alicdn.com/bao/uploaded/i2/2251059038/O1CN01JRigAR2GdSbgqfv4r_!!2-item_pic.png_q60.jpg_.webp">
          </div>
          <div class="iteminfo">
            <div class="title" >【杭州】法语原版音乐剧《巴黎圣母院》</div>
            <div class="venue">杭州市 | 杭州运河大剧院·歌剧厅 </div>
            <div class="showtime">2024-06-29 10:19:54</div>
            <div class="showtime"></div>
          </div>
        </a><a href="http://localhost:5174/#/Ulist1/21" class="box-right__item" data-spm="ditem_5" target="_blank">
          <div class="itemimg">
            <img src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i4/2251059038/O1CN01YTowug2GdSblFRh7Z_!!2251059038.jpg_q60.jpg_.webp">
          </div>
          <div class="iteminfo">
            <div class="title" >【重庆】舞台剧《魔幻时刻》重庆站</div>
            <div class="venue">重庆市 | 施光南大剧院</div>
            <div class="showtime">2024-06-30 10:19:54</div>
            <div class="showtime"></div>
          </div>
        </a><a href="http://localhost:5174/#/Ulist1/22" class="box-right__item" data-spm="ditem_6" target="_blank">
          <div class="itemimg">
            <img src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i2/2251059038/O1CN01SKXiH02GdSbdtTiu5_!!2251059038.png_q60.jpg_.webp">
          </div>
          <div class="iteminfo">
            <div class="title" >【上海】外百老汇悬疑音乐剧《THRILL ME》英文原版</div>
            <div class="venue">上海市 | 上海共舞台</div>
            <div class="showtime">2024-06-30 10:19:54</div>
            <div class="showtime"></div>
          </div>
        </a>
        </div>
      </div>
    </div>
  </div>
  <div class="dm-content-wrap">
    <div class="dm-content dm-content-1" data-spm="card_0">
      <div class="head">
        <span class="head-title">体育赛事</span>
      </div>
      <div class="box">
        <a href="http://localhost:5174/#/Ulist1/1" class="box-left" target="_blank" data-spm="ditem_0">
          <img  src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i2/2251059038/O1CN01rSylbD2GdSbjkUXGQ_!!2251059038.jpg_q60.jpg_.webp">
          <div class="box-left__info">
            <div class="title" >【苏州】2024 年中国男篮系列热身赛</div>
            <div class="venue">苏州市 | 昆山市体育中心体育馆</div>
            <div class="showtime">2024-06-30</div>
          </div>
        </a>
        <div class="box-right">
          <a href="http://localhost:5174/#/Ulist1/2" class="box-right__item" data-spm="ditem_1" target="_blank">
            <div class="itemimg">
              <img src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i4/2251059038/O1CN01oOY7kT2GdSboeT0Xt_!!2251059038.png_q60.jpg_.webp">
            </div>
            <div class="iteminfo">
              <div class="title" >【榆林】2024中国台协杯全国斯诺克团体锦标赛</div>
              <div class="venue">场馆：榆林市 | 榆林体育中心-体育馆</div>
              <div class="showtime">2024-06-30 10:19:54</div>
              <div class="showtime"></div>
            </div>
          </a><a href="http://localhost:5174/#/Ulist1/3" class="box-right__item" data-spm="ditem_2" target="_blank">
          <div class="itemimg">
            <img src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i1/2251059038/O1CN01AgWKgc2GdSbgAX4YN_!!2251059038.png_q60.jpg_.webp">
          </div>
          <div class="iteminfo">
            <div class="title" >【广州】中体杯SSL智能魔方超级联赛S3总决赛</div>
            <div class="venue">国家体育馆</div>
            <div class="showtime">2024-06-30 10:19:54</div>
            <div class="showtime"></div>
          </div>
        </a><a href="http://localhost:5174/#/Ulist1/4" class="box-right__item" data-spm="ditem_3" target="_blank">
          <div class="itemimg">
            <img src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i2/2251059038/O1CN01qyPPg92GdSZK1AqhN_!!2251059038.png_q60.jpg_.webp">
          </div>
          <div class="iteminfo">
            <div class="title" >天津市 | 天津泰达足球场 </div>
            <div class="venue">天津市 | 天津泰达足球场</div>
            <div class="showtime">2024-06-30 10:19:54</div>
            <div class="showtime"></div>
          </div>
        </a><a href="http://localhost:5174/#/Ulist1/5" class="box-right__item" data-spm="ditem_4" target="_blank">
          <div class="itemimg">
            <img src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i1/2251059038/O1CN019IKhoU2GdSaoZuF4S_!!2251059038.jpg_q60.jpg_.webp">
          </div>
          <div class="iteminfo">
            <div class="title">【长沙】2024长沙网球公开赛</div>
            <div class="venue">长沙市 | 湖南红土网球俱乐部</div>
            <div class="showtime">2024-07-19 10:19:54</div>
            <div class="showtime"></div>
          </div>
        </a><a href="http://localhost:5174/#/Ulist1/6" class="box-right__item" data-spm="ditem_5" target="_blank">
          <div class="itemimg">
            <img src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i3/2251059038/O1CN019qG3sr2GdSbMyVTEm_!!2251059038.jpg_q60.jpg_.webp">
          </div>
          <div class="iteminfo">
            <div class="title">【鄂尔多斯】2024年第零界内蒙古沙漠瑜伽节</div>
            <div class="venue">鄂尔多斯市 | 内蒙古库布齐沙漠</div>
            <div class="showtime">2024-08-17 10:19:54</div>
            <div class="showtime"></div>
          </div>
        </a><a href="http://localhost:5174/#/Ulist1/7" class="box-right__item" data-spm="ditem_6" target="_blank">
          <div class="itemimg">
            <img src="https://img.alicdn.com/bao/uploaded/i2/2251059038/O1CN01FYivvd2GdSbngSyt6_!!0-item_pic.jpg_q60.jpg_.webp">
          </div>
          <div class="iteminfo">
            <div class="title" >2024 TF家族夏日运动会（时代少年团）</div>
            <div class="venue">中国澳门 | 银河综艺馆</div>
            <div class="showtime">2024-09-05 10:19:54</div>
            <div class="showtime"></div>
          </div>
        </a>
        </div>
      </div>
    </div>
  </div>
  <div class="dm-content-wrap">
    <div class="dm-content dm-content-1" data-spm="card_0">
      <div class="head">
        <span class="head-title">亲子儿童</span>
      </div>
      <div class="box">
        <a href="http://localhost:5174/#/Ulist1/8" class="box-left" target="_blank" data-spm="ditem_0">
          <img class="box-left__bg" src="https://img.alicdn.com/bao/uploaded/i3/2251059038/O1CN01HIFyk12GdSbf7UiYD_!!2-item_pic.png_q60.jpg_.webp">
          <div class="box-left__info">
            <div class="title">儿童剧｜爱笑联盟X雍和宫-亲子家庭成长戏剧【即兴儿童嘉年华】喜剧大赛互动同款 </div>
            <div class="showtime">2024-07-11 10:19:54</div>
            <div class="venue">北京市 | 演艺戏剧街-星空间剧场</div>
          </div>
        </a>
        <div class="box-right">
          <a href="http://localhost:5174/#/Ulist1/9" class="box-right__item" data-spm="ditem_1" target="_blank">
            <div class="itemimg">
              <img src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i1/2251059038/O1CN01mb0NJ42GdSbX63UBQ_!!2251059038.jpg_q60.jpg_.webp">
            </div>
            <div class="iteminfo">
              <div class="title" >【上海】七幕人生出品 法国音乐剧《放牛班的春天》中文版</div>
              <div class="venue">上海市 | 上音歌剧院 </div>
              <div class="showtime">2024-07-12 10:19:54</div>
              <div class="showtime"></div>
            </div>
          </a><a href="http://localhost:5174/#/Ulist1/10" class="box-right__item" data-spm="ditem_2" target="_blank">
          <div class="itemimg">
            <img src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i2/2251059038/O1CN012PxAeT2GdSbmbElXW_!!2251059038.jpg_q60.jpg_.webp">
          </div>
          <div class="iteminfo">
            <div class="title" >音乐舞台剧《汪汪队立大功——海盗的宝藏》</div>
            <div class="venue">佛山市 | 佛山大剧院-大剧场</div>
            <div class="showtime">2024-07-04 10:19:54</div>
            <div class="showtime"></div>
          </div>
        </a><a href="http://localhost:5174/#/Ulist1/11" class="box-right__item" data-spm="ditem_3" target="_blank">
          <div class="itemimg">
            <img src="https://img.alicdn.com/bao/uploaded/i3/2251059038/O1CN01kDSzJY2GdSbcgnKOJ_!!2-item_pic.png_q60.jpg_.webp">
          </div>
          <div class="iteminfo">
            <div class="title" >【宜昌】【亚洲巡演宜昌站】《summer》《天空之城》《千与千寻》宫崎骏经典动漫视听音乐会</div>
            <div class="venue">上海市 | 要玩喜剧脱口秀-南京东路店</div>
            <div class="showtime">2024-07-26 10:19:54</div>
            <div class="showtime"></div>
          </div>
        </a><a href="http://localhost:5174/#/Ulist1/12" class="box-right__item" data-spm="ditem_4" target="_blank">
          <div class="itemimg">
            <img src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i1/2251059038/O1CN01v8ABVp2GdSbMKDnJw_!!2251059038.png_q60.jpg_.webp">
          </div>
          <div class="iteminfo">
            <div class="title" >外滩亲子秀-沉浸式互动近景魔术科学泡泡秀 | 要玩喜剧</div>
            <div class="venue">上海市 | 要玩喜剧脱口秀-南京东路店</div>
            <div class="showtime">2024-07-10 10:19:54</div>
            <div class="showtime"></div>
          </div>
        </a><a href="http://localhost:5174/#/Ulist1/13" class="box-right__item" data-spm="ditem_5" target="_blank">
          <div class="itemimg">
            <img src="https://img.alicdn.com/bao/uploaded/i4/2251059038/O1CN0186kOu32GdSbYPDuhn_!!0-item_pic.jpg_q60.jpg_.webp">
          </div>
          <div class="iteminfo">
            <div class="title">【北京】大型奇幻励志儿童舞台剧《冰雪奇缘》</div>
            <div class="venue">北京市 | 红剧场</div>
            <div class="showtime">2024-07-28 10:19:54</div>
            <div class="showtime"></div>
          </div>
        </a>
          <a href="http://localhost:5174/#/Ulist1/14" class="box-right__item" data-spm="ditem_6" target="_blank">
            <div class="itemimg">
              <img src="https://img.alicdn.com/bao/uploaded/https://img.alicdn.com/imgextra/i1/2251059038/O1CN01Qq2GEj2GdSbctGOud_!!2251059038.jpg_q60.jpg_.webp">
            </div>
            <div class="iteminfo">
              <div class="title" >【北京】大型原创儿童剧《哪吒闹海新传》</div>
              <div class="venue">北京市 | 国家大剧院-戏剧场</div>
              <div class="showtime">2024-08-22 10:19:54</div>
              <div class="showtime"></div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>

  <el-backtop :right="66" :bottom="100" />
  <Footer/>
</template>

<style scoped>
.demonstration {
  color: var(--el-text-color-secondary);
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.carousel-image {
  /* 可以自定义图片的样式，例如宽度、高度等 */
  width: 100%;
  height: 1000px;
  object-fit: cover; /* 确保图片填充容器且保持宽高比 */
}

.dm-content-wrap {
  width: 1504px;
  margin: 0 auto 30px auto;
  position: relative;
  font-size: 0;

}

.dm-content {
  width: 1160px;
  position: relative;
  padding: 0px;
  border: 1px solid #EBEBEB;
  margin-top: 15px;
}
.head {
  width: 100%;
  height: 40px;
  line-height: 40px;
}

.box {
  margin-top: 14px;
}
.dm-content {
  width: 1260px;
  display: block;
  position: relative;
  padding: 20px;
  border: 1px solid #EBEBEB;
  margin-top: 15px;

}
.head-title {
  font-size: 24px;
  display: inline-block;
  vertical-align: middle;
  margin-left: 5px;
  color: #111;
  width: 500px;
  height: 40px;
  overflow: hidden;
}
.head-more {
  display: inline-block;
  vertical-align: middle;
  float: right;
  margin-right: 23px;
  font-size: 14px;
  color: #9B9B9B;
  max-width: 450px;
  height: 100%;
  overflow: hidden;
}
.box-left {
  display: inline-block;
  width: 290px;
  height: 360px;
  position: relative;
  overflow: hidden;
}

.box-left__bg {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  border: 1px solid #efefef;
}

.box-left__info {
  width: 250px;
  height: 84px;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 17px 10px;
  background-color: rgba(0, 0, 0, .5);
}

.title {
  height: 45px;
  font-size: 16px;
  color: #fff;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.details {
  margin-top: 12px;
  font-size: 20px;
  color: #fff;
}
.box-right {
  display: inline-block;
  width: 1109px;
  margin-left: 40px;
  height: 360px;
  vertical-align: top;
  overflow: hidden;
}

.box-right__item{
  width: 304px;
  height: 161px;
  margin-right: 20px;
  display: inline-block;
  margin-bottom: 42px;
  color: #000;
  overflow: hidden;
}

.itemimg {
  width: 118px;
  height: 158px;
  overflow: hidden;
  position: relative;
  display: inline-block;
  border: 1px solid #efefef;
}

.itemimg img {
  width: 100%;
}

.iteminfo {
  width: 150px;
  height: 100%;
  position: relative;
  padding-left: 15px;
  display: inline-block;
  vertical-align: top;
}
.iteminfo .title {
  line-height: 23px;
  font-size: 14px;
  color: #4A4A4A;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
.iteminfo .showtime {
  margin-top: 7px;
}
.iteminfo .showtime,.iteminfo .venue {
  width: 100%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 12px;
  margin-top: 14px;
  color: #9B9B9B;
  overflow: hidden;
  word-break: break-all;
}
.iteminfo .price {
  width: 138px;
  position: absolute;
  left: 15px;
  bottom: 0;
  font-size: 16px;
  color: #FF1268;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dm-content-wrap{
  padding-left: 0px;
  padding-right: 0px;
  margin-left: 0px;
  margin-right: 0px;
}
.dm-content{
  width:1462px;
}
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