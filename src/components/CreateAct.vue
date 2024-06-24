<script  setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { useRouter } from 'vue-router';
// import  { UploadProps } from 'element-plus';

const id = ref(1234);
let uploadedFile = null;
const router = useRouter(); // 初始化route

// 定义活动信息数据对象
const actInfo = ref({
  classify: '', // 活动类型
  name: '', // 活动名称
  place: '', // 活动地点
  description: '', // 活动描述
  time: '', // 活动时间
  imageUrl: '' ,// 活动图片URL
  createdby: '1234' // 创建者ID
});
let img = ref(null);

// 新增重置表单的方法
const resetForm = () => {
  actInfo.value = {
    classify: '', // 活动类型
    name: '', // 活动名称
    place: '', // 活动地点
    description: '', // 活动描述
    time: '', // 活动时间
    imageUrl: '' // 活动图片URL
  };
  isCreating.value = false; // 重置按钮状态
  img.value = null;
};

// const handleRemove = (file, fileList) => {
//   actInfo.value.imageUrl = ''; // 清空图片URL
// };
//
// const handlePictureCardPreview = (file) => {
//   actInfo.value.imageUrl = file.url;
//   dialogVisible.value = true;
// };
//
// const handleChange = (file, fileList) => {
//   //if (file.status === 'success') {
//     uploadedFile = file.raw; // 保存原始文件对象
//     actInfo.value.imageUrl = file.response.url; // 保留URL用于预览
//   //}
//   console.log(uploadedFile);
// };

const dialogVisible = ref(false);
const dialogImageUrl = ref('');

const isCreating = ref(false); // 用于控制按钮禁用状态

const createAct = async () => {
  // 验证表单数据完整性
  if (!actInfo.value.name || !actInfo.value.place || !actInfo.value.classify || !actInfo.value.time) {
    ElMessage.error('请确保所有必填信息都已填写');
    return;
  }

  // 准备请求体数据
  const formData = new FormData();
  formData.append('eventname', actInfo.value.name);
  formData.append('eventdate', actInfo.value.time); // 确保时间格式正确
  formData.append('venue', actInfo.value.place);
  formData.append('description', actInfo.value.description);
  formData.append('createdby', id.value);
  formData.append('classify', actInfo.value.classify);
  formData.append('file', actInfo.value.imageUrl || null);

  try {
    isCreating.value = true; // 防止重复点击
  console.log(actInfo.value)
    // 发送POST请求
    const response = await axios.post('http://localhost:8080/dalizi/Createventimg', {
      eventname: actInfo.value.name,
      eventdate: actInfo.value.time,
      venue: actInfo.value.place,
      description: actInfo.value.description,
      createdby: actInfo.value.createdby,
      classify: actInfo.value.classify,
      imgaddress: actInfo.value.imageUrl
      });

    // const response = await axios.request({
    //   url:'http://localhost:8080/dalizi/Createventimg',
    //   method:'POST',
    //   data:actInfo.value,
    // })
    // const response = await axios.post('http://localhost:8080/dalizi/Createventimg',actInfo)
        console.log(resetForm)
    console.log('----------84------------')
    if (response.status === 200) {
      ElMessage.success('活动创建成功！');
      resetForm(); // 表单重置
      const Toeventid = response.data.eventid;

      router.push({
       path: `/Category/${Toeventid}`
      }); // 页面跳转
    } else {
      ElMessage.error('活动创建失败，请检查输入信息或稍后再试');
    }
  } catch (error) {
    console.error('创建活动时发生错误:', error);
    ElMessage.error('网络错误，请检查网络连接');
  } finally {
    isCreating.value = false; // 请求完成后允许再次点击
  }
};


// const imageUrl = ref('')

// const handleAvatarSuccess: UploadProps['onSuccess'] = (
//     response,
//     uploadFile
// ) => {
//   actInfo.value.imageUrl=URL.createObjectURL(uploadFile.raw!)
//   //imageUrl.value = URL.createObjectURL(uploadFile.raw!);
// }

// 处理上传成功的方法
const handleAvatarSuccess = function(response, uploadFile) {
  console.log(response,'--115------------')
  // 确保uploadFile和其raw属性存在
  if (uploadFile && uploadFile.raw) {
    // 使用URL.createObjectURL创建一个可用于预览的URL

    //actInfo.value.imageUrl = URL.createObjectURL(uploadFile.raw);
    actInfo.value.imageUrl=response
    console.log(actInfo.value.imageUrl,'---121----------------')
    // 如果需要在非Vue环境下使用，这里可能直接操作DOM来显示图片预览
    // 例如：document.getElementById('preview').src = actInfo.value.imageUrl;
  } else {
    console.warn('uploadFile or uploadFile.raw is not defined');
  }
};
</script>

<template>
  <div class="actInfo">
    <h2>活动信息</h2>
    <el-form label-position="top">
      <el-form-item label="活动类型">
        <el-select v-model="actInfo.classify" placeholder="请选择活动类型">
          <el-option label="CONCERT" value="CONCERT"></el-option>
          <el-option label="THEATER" value="THEATER"></el-option>
          <el-option label="SPORTS" value="SPORTS"></el-option>
          <el-option label="KIDS" value="KIDS"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动名称">
        <el-input v-model="actInfo.name" placeholder="请输入活动名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="活动地点">
        <el-input v-model="actInfo.place" placeholder="请输入活动地点"></el-input>
      </el-form-item>
      <el-form-item label="活动描述">
        <el-input v-model="actInfo.description" placeholder="请输入活动描述"></el-input>
      </el-form-item>
      <el-form-item label="活动照片">
<!--        <el-upload-->
<!--            action="https://jsonplaceholder.typicode.com/photos/"-->
<!--            list-type="picture-card"-->
<!--            :on-preview="handlePictureCardPreview"-->
<!--            :on-remove="handleRemove"-->
<!--            :file-list="actInfo.imageUrl ? [{ url: actInfo.imageUrl }] : []"-->
<!--            :auto-upload="false"-->
<!--            @change="handleChange"-->
<!--        >-->
<!--          <i class="el-icon-plus"></i>-->
<!--        </el-upload>-->
        <el-upload
            class="avatar-uploader"
            action="http://localhost:8080/dalizi/uploadFile"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
        >
          <img v-if="actInfo.imageUrl" :src="actInfo.imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="活动照片预览">
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-date-picker
            v-model="actInfo.time"
            type="date"
            placeholder="选择活动时间"
            value-format="YYYY-MM-DD"

        />
      </el-form-item>
      <el-button type="danger" @click="resetForm">清空表单</el-button>
      <el-button type="primary" :disabled="isCreating" @click="createAct">创建活动</el-button>
    </el-form>
  </div>
</template>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
/* 你的样式代码 */
</style>
