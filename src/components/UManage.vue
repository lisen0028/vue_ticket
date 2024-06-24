<template>
  <div class="topTool">
    <el-input v-model="sname" placeholder="请输入姓名搜索" @input="handleSearchName" :prefix-icon="Search">
    </el-input>
    <el-button type="danger" :icon="Delete" @click="handleDelList"
               v-if="multipleSelection.length>0">删除选中数据</el-button>
  </div>

  <el-table
      :data="tableDataForDisplay"
      style="width: 100%"
      @sort-change="handleSortChange"
      :empty-text="'暂无数据'"
      @selection-change="handleSelectionChange"
      :header-cell-style="{ background: '#f6f9fa' }">
    <el-table-column type="selection"/>
    <el-table-column prop="idcard" label="身份证号" width="180" sortable></el-table-column>
    <el-table-column prop="username" label="姓名" width="70"></el-table-column>
    <el-table-column prop="phonenumber" label="联系电话" width="120"></el-table-column>
    <el-table-column prop="gender" label="性别" width="70"></el-table-column>
    <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
    <el-table-column prop="address" label="地址" width="100"></el-table-column>
    <el-table-column label="操作" min-width="50">
      <template #default="{ row }">
        <el-button type="danger" size="small" @click="handleDelete(row)">
          删除
        </el-button>
        <el-button type="danger" size="small" @click="handleEdit(row)">
          编辑
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <br>
  <!--  分页组件-->
  <div class="demo-pagination-block">
    <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10,20,30,40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />

    <!--弹窗组件-->
    <el-dialog v-model="dialogFormVisible" :title="dialogTitle">
      <el-form :model="tableform">
        <el-form-item label="ID" :label-width="100">
          <el-input v-model="tableform.idcard" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item label="地址" :label-width="100">
          <el-input v-model="tableform.address" autocomplete="off" />
        </el-form-item>
        <el-form-item label="电子邮件" :label-width="100">
          <el-input v-model="tableform.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="电话" :label-width="100">
          <el-input v-model="tableform.phonenumber" autocomplete="off" />
        </el-form-item>
        <el-form-item label="性别" :label-width="100">
          <el-input v-model="tableform.gender" autocomplete="off" disabled/>
        </el-form-item>
        <el-form-item label="姓名" :label-width="100">
          <el-input v-model="tableform.username" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="密码" :label-width="100">
          <el-input v-model="tableform.password" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button type="primary" @click="dialogOk">
        确定
      </el-button>
    </span>
      </template>
    </el-dialog>

  </div>

</template>

<script lang="ts" setup>
import {Plus, Delete, Edit, Search} from "@element-plus/icons-vue";
import axios from "axios";
import {ElMessageBox,ElMessage} from "element-plus";
import { ref,computed,onMounted } from 'vue'
const handleEdit = (row) => {
  // 在这里处理编辑逻辑，例如显示编辑表单或调用API更新数据
  dialogFormVisible.value = true
  tableform.value = {...row}
  dialogType.value = 'edit'
  console.log(row);
};

const handleDelete = (row) => {
  // 在这里处理删除逻辑，例如调用API删除数据
  console.log(row);
  ElMessageBox.confirm(
      '您确定要删除姓名为【' + row.username + '】的数据吗?',
      '危险操作',

  ).then(() => {
    delrow(row)
    ElMessage({
      type: 'success',
      message: '完成删除！',
    })
  })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '取消删除!',
        })
      })
};

const delrow = (row) => {
  // 获取要删除的用户的 ID
  const userId = row.idcard;
  console.log(userId);
  // 发送 HTTP DELETE 请求来删除用户
  axios.delete(`http://localhost:8080/dalizi/deleteUser/${userId}`)
      .then(response => {
        // 处理删除成功后的逻辑，例如重新加载数据
        getData();
      })
      .catch(error => {
        // 处理错误
        console.error(error);
      });
};

// 分页后的数据
const tableDataForDisplay = ref();
//组件挂载到DOM后执行后端数据加载
onMounted(() => {
  getData()
})


const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)


//获取当前页数据
const getData = () => {
  axios.get(`http://localhost:8080/dalizi/getUsersPage/${currentPage.value}/${pageSize.value}`)
      .then(response => {
        tableDataForDisplay.value = response.data.records;
        total.value = response.data.total;
      })
      .catch(error => {
        console.error(error);
      });
};
//处理页码变化点击事件
const handleCurrentChange = (pageNum) => {
  currentPage.value = pageNum;
  getData();
};
//处理每页显示多少条事件
const handleSizeChange=(pagesize)=>{
  pageSize.value=pagesize;
  getData();
}

//字段排序
// 定义 handleSortChange 方法，接收 sortData 参数
const handleSortChange = (sortData) => {
  // 解构 sortData 参数，得到 prop 和 order 两个属性
  const { prop, order } = sortData;
  // 使用 sort 方法对 displayedItems 数组进行排序，并更新其值
  tableDataForDisplay.value = tableDataForDisplay.value.sort((a, b) => {
    if (order === 'ascending') { // 升序排序
      return a[prop] > b[prop] ? 1 : -1;
    } else { // 降序排序
      return a[prop] < b[prop] ? 1 : -1;
    }
  });
}

//按姓名搜索处理方法
const sname=ref('');
const handleSearchName = (val) => {
  if(val.length>0){//输入框有内容
    axios.get(`http://localhost:8080/dalizi/userByName/${val}`).then(response=>{
      tableDataForDisplay.value=response.data
    }).catch(error=>{
      console.error(error)
    })
  }else {//输入框无内容，显示当前数据
    getData()
  }
}


const dialogFormVisible = ref(false)//设置弹窗不显示
const tableform = ref({
  username: '',
  password: '',
  idcard: '',
  gender: '',
  phonenumber: '',
  email: '',
  address: ''
});//清空弹窗内容
const dialogType = ref('add')//初始化弹出框的类型为增加弹窗
//处理增加按钮点击事件
const handleAdd = () => {
  dialogFormVisible.value = true
  dialogType.value = 'add'
}
//设置弹窗的标题
const dialogTitle = computed(() => {
  return dialogType.value === 'add' ? '新增数据' : '编辑数据'
})


//处理弹窗确认按钮点击事件
const dialogOk = () => {
  dialogFormVisible.value = false
  if (dialogType.value === 'add') {
    const newUser = { ...tableform.value }
    console.log(newUser)
    axios.post('http://localhost:8080/dalizi/addUser', newUser)
        .then(response => {// 处理成功响应
          getData(); // 在添加数据后调用获取数据的方法
        })
        .catch(error => {// 处理错误
          console.log(error);
        });
  }
  else {
    // 获取要更新的用户的 ID
    const userId = tableform.value.idcard;
    // 创建一个副本来保存更新后的用户信息
    const updatedUser = { ...tableform.value };
    // 发送 HTTP PUT 请求来更新用户信息
    axios.put(`http://localhost:8080/dalizi/updateUser`, updatedUser)
        .then(response => {
          // 处理成功响应
          ElMessage({type: 'success', message: '修改成功!'})
          // 重新获取数据，更新表格显示
          getData();
        })
        .catch(error => {
          // 处理错误
          console.error('用户更新失败');
          console.error(error);
        });
  }
}


//多行删除
// 创建响应式变量multipleSelection，用于存储当前选中的数据行
let multipleSelection = ref([])
// 处理表格行选中状态变化的方法，val是当前选中的数据行数组
const handleSelectionChange = (val) => {
  // 清空数组，确保每次更新都是最新选中状态
  multipleSelection.value = []
  val.forEach(item => { // 遍历选中的数据行数组
    multipleSelection.value.push(item.idcard) // 将选中的每一行数据存入multipleSelection数组中
  })}
// 删除多条数据
const handleDelList = () => {
  ElMessageBox.confirm(
      '您确定要删除选择的数据吗?',
      '危险操作',
  ).then(() => {
    const userIds = multipleSelection.value;
    console.log(userIds)
    axios.put(`http://localhost:8080/dalizi/deluserViewBatch`, userIds)
        .then(response => {
          // 处理删除成功后的逻辑，例如重新加载数据
          getData();
          ElMessage({ type: 'success', message: '完成批量删除！' });
        })
        .catch(error => {
          console.error(error);
          ElMessage({ type: 'error', message: '删除失败！' });
        });
  }).catch(() => {
    ElMessage({ type: 'info', message: '取消删除!' });
  });
}


</script>
<style scoped>
.topTool{
  display: flex;
  justify-content: space-between;margin-bottom: 8px;
}
</style>