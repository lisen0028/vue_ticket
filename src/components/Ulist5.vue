<template>
  <div class="review-form">
    <h3>写下您的评价</h3>
    <textarea v-model="comment" placeholder="在这里输入您的评论..." @input="validateComment"></textarea>

    <!-- 简化的星星评分组件 -->
    <div class="star-rating">
      <span
          v-for="star in 5"
          :key="star"
          @click="setRating(star)"
          :class="{ 'active': star <= selectedRating }"
      >
        &#9733;
      </span>
    </div>
    <button :disabled="!canSubmit" @click="submitReview">提交评价</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from "axios";
// 状态定义
const comment = ref('');
const selectedRating = ref(0);

// 方法定义
const setRating = (value) => {
  selectedRating.value = value;
  console.log(selectedRating.value)
};

const validateComment = () => {
  // 可以根据需要增加更多验证逻辑
};

const canSubmit = computed(() => {
  return comment.value.trim() !== '' && selectedRating.value !== 0;
});

const submitReview = async () => {
  if (canSubmit.value) {
    // 获取当前时间
    const reviewDate = new Date().toISOString();

    console.log("评论内容:", comment.value);
    console.log("评分:", selectedRating.value);
    console.log("评价时间:", reviewDate);

    // 准备要发送的数据对象，确保字段名与后端要求一致
    const reviewData = {
      reviewid:"",
      reviewerid:"1234",
      rating: selectedRating.value,
      comment: comment.value,
      reviewdate: reviewDate, // 注意字段名匹配后端
    };
    try {
      // 使用axios发送POST请求到指定的后端API
      const response = await axios.post('http://localhost:8080/dalizi/addReview', reviewData);

      console.log("服务器响应:", response.data);
      alert("评价已成功提交！");
      resetForm();
    } catch (error) {
      console.error("提交评价时出错:", error);
      alert("提交评价时发生错误，请稍后再试！");
    }
  } else {
    alert("请填写评论内容并给出评分！");
  }
};

const resetForm = () => {
  comment.value = '';
  selectedRating.value = 0;
};
</script>

<style scoped>
.review-form {
  margin: 20px;
}
textarea {
  width: 100%;
  height: 150px;
  resize: vertical;
  margin-bottom: 10px;
}
button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.3s;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.star-rating span {
  cursor: pointer;
  font-size: 20px;
}
.star-rating .active {
  color: gold;
}
</style>

