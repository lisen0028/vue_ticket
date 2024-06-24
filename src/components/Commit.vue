<template>
  <div class="top">
    <!--    <el-input v-model="searchQuery" placeholder="Search reviews" />-->
  </div>
  <div class="commit">
    <el-card v-for="(review, index) in comList" :key="review.id" shadow="hover" class="commit-card">
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
        <el-button type="danger" @click="deleteReview(index)">Delete</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import axios from 'axios';
import {ref, onMounted} from 'vue';
import { useUserStore } from '../stores/counter.js'


const userStore = useUserStore();

const id = ref(userStore.userId);
const comList = ref(
    {
      reviewid: '',
      reviewdate: '',
      comment: '',
      rating: ''
    }
); // 移除重复声明
const searchQuery = ref('');

onMounted(async () => {
  await fetchReviews();
});

const fetchReviews = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/dalizi/SelectReviewsByUserId/${id.value}`);

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
};
// 删除评论的方法
const deleteReview = (index) => {
  comList.value.splice(index, 1);
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
</style>
