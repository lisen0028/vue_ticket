<template>

  <div class="top">
    <div ref="chartContainer" style="width: 60%; height: 300px;"></div>
    <div class="rate">
      <h1>系统评分</h1>
      <p style="font-size: 80px;margin-bottom: -10px;margin-top: -15px">{{ averageRating.toFixed(1) }}</p>
      <p >评论总数: {{ totalReviews }}</p>
    </div>
  </div>
  <button @click="openReviewForm">我要写评价</button>
  <div class="commit">
    <el-card v-for="review in comList" :key="review.id" shadow="hover" class="commit-card">
      <div slot="header" class="Review">
        <div class="reviewer">
          <p :style="{ fontSize: '15px', color:'gray' }">{{ review.reviewDate }}</p>
        </div>
        <div class="content">
          <p :style="{ fontSize: '15px', color:'gray'}">匿名用户</p>
          <p>{{ review.comment }}</p>
        </div>
        <div class="rating">
          <span v-for="n in 5" :key="n" :class="{ 'filled-star': n <= review.rating }">&#9733;</span>
        </div>
      </div>
      <!-- 添加删除按钮 -->
      <div class="delete-button">
        <el-button type="danger" @click="deleteReview(review.id)">Delete</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import axios from 'axios';
import {ref, onMounted, computed} from 'vue';
import * as echarts from 'echarts';
import {useRouter} from "vue-router"; // 引入ECharts

const router = useRouter();
let totalReviews = 0;
const comList = ref([]);

onMounted(async () => {
  await fetchReviews();
});

const fetchReviews = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/dalizi/getReviewsPage`);

    // 定义日期格式化选项
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    // 创建一个DateTimeFormat实例，可以根据需要调整locale和options
    const formatter = new Intl.DateTimeFormat('en-US', options);

    comList.value = response.data.map(item => {
      // 使用formatter格式化日期
      const formattedDate = item.reviewdate
          ? formatter.format(new Date(item.reviewdate))
          : ''; // 如果日期不存在，则留空

      return {
        id: item.reviewid,
        reviewDate: formattedDate, // 使用格式化后的日期
        comment: item.comment,
        rating: item.rating
      };
    });
  } catch (error) {
    if (error.response && error.response.status === 500) {
      console.error('Server Error: Unable to fetch reviews. Please try again later.');
      // 可以进一步处理，比如显示给用户的友好提示
    } else {
      console.error('An unexpected error occurred while fetching reviews:', error);
    }
  }
  console.log(comList.value);// 打印comList的值
  // 计算总评论数
  totalReviews = comList.value.length;
  console.log("Total Reviews:", totalReviews);
};
// 删除评论的方法
const deleteReview = async (reviewId) => {
  try {
    // 发起DELETE请求
    const response = await axios.delete(`http://localhost:8080/dalizi/delReview/${reviewId}`);

    if (response.data) { // 假设后端返回true/false表示操作成功与否
      // 请求成功，先从前端列表中移除该评论
      comList.value = comList.value.filter(review => review.id !== reviewId);
      totalReviews--; // 减少总评论数

      // 然后重新获取评论列表以刷新界面
      await fetchReviews();

      console.log("Review deleted successfully and page refreshed.");
    } else {
      console.error("Failed to delete the review.");
    }
  } catch (error) {
    console.error("An error occurred while deleting the review:", error);
  }
};



// 在fetchReviews之后初始化ECharts图表
onMounted(async () => {
  await fetchReviews();
  initChart();
});

const chartInstance = ref(null); // 用于存储ECharts实例
const chartContainer = ref(null); // 引用DOM元素

// 初始化ECharts图表
const initChart = () => {
  if (!chartInstance.value && chartContainer.value) {
    chartInstance.value = echarts.init(chartContainer.value);

    const option = {
      title: {
        text: '评分和评价',
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      // legend: {
      //   data: ['评分数量'],
      //   align: 'right'
      // },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        min: 0,
        max: 100,
        interval: 20,
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          formatter: function(value) {
            return `${value}%`;
          }
        }
      },
      yAxis: {
        type: 'category', // 将yAxis改为类目轴
        data: ['1星', '2星', '3星', '4星', '5星'],
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          interval: 0,
          rotate: 45
        }
      },
      series: [
        {
          name: '评分数量',
          type: 'bar',
          barWidth: '100%', // 保持不变，根据需要调整
          data: generateChartData(), // 直接使用百分比数组
          label: {
            show: true,
            position: 'top',
            // 直接使用百分比值，无需再调用toFixed，因为generateChartData已处理
            formatter: function(params) {
              return `{star${params.dataIndex + 1}:}${params.value}%`;
            }
          }
        }
      ],
    };

    chartInstance.value.setOption(option);
  }
};

// 生成数据
// 生成数据，确保每个对象中包含value和已经计算好的percent
const generateChartData = () => {
  const ratingsCount = Array.from({length: 5}, () => 0);
  let totalCount = 0;

  comList.value.forEach(review => {
    ratingsCount[review.rating - 1]++;
    totalCount += 1;
  });

  // 直接返回百分比数组，注意这里直接返回百分比，无需包含`value`和`percent`键
  return ratingsCount.map(count => ((count / totalCount) * 100).toFixed(2));
}

// 假设这是计算平均评分的简单示例
const calculateAverageRating = () => {
  if (comList.value.length === 0) return 0;
  const totalRating = comList.value.reduce((sum, review) => sum + review.rating, 0);
  return totalRating / comList.value.length;
};

const averageRating = computed(() => calculateAverageRating());

const openReviewForm = () => {
  router.push('/Ulist5');
};

</script>

<style scoped>
.commit-card {
  /* 在这里添加.commit-card的样式 */
}

.delete-button {
  text-align: right; /* 或其他对齐方式 */
  margin-top: 5px; /* 根据需要调整间距 */
}

.filled-star {
  color: gold; /* 或者其他你想要的颜色来表示选中的星星 */
}

.reviewer{
  border-bottom: 2px solid ghostwhite;
}
.content{
  border-bottom: 2px solid ghostwhite;
}
.top{
  display: flex;
}
.rate {
  display: flex; /* 让.rate盒子内部也使用Flex布局 */
  flex-direction: column; /* 设置为列布局 */
  justify-content: center; /* 垂直居中 */
  align-items: center; /* 水平居中 */
  text-align: center; /* 确保文本居中 */
  width: 30%; /* 或者根据实际情况调整宽度 */
}

.rate p {
  line-height: 1.2; /* 调整到合适的行高 */
}
</style>