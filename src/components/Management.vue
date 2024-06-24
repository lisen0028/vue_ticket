<script setup>
const tableData = [
  {
    UserId: 1,
    UserName: '张三',
    Email: 'zhangsan@example.com',
    PhoneNumber: '1234567890',
  },
  {
    UserId: 2,
    UserName: '李四',
    Email: 'lisi@example.com',
    PhoneNumber: '9876543210',
  },
];
const tickert={
  UserId: 2,
  UserName: '李四',
  Email: 'lisi@example.com',
  PhoneNumber: '9876543210',
}
const ticketList = [
  {
    TicketId: 1,
    TicketName: '演唱会门票',
    Price: 100,
    Quantity: 50,
    Sold: 20,
    Remaining: 30,
  },
  {
    TicketId: 2,
    TicketName: '话剧门票',
    Price: 50,
    Quantity: 100,
    Sold: 50,
    Remaining: 50,
  },
];
let type="";
const userClick=()=>{
type="user";
}

const managerClick=()=>{
  type="manager";
}
const accountClick=()=>{
  type="account";
}
const activeClick=()=>{
  type="active";
}

const venueClick=()=>{
  type="venue";
}
const handleOpen = (key, keyPath) => {
  alert(key+"  "+keyPath);
  if (key==3){
        type="account";
  }
  console.log(key, keyPath);
};
const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};

</script>
<!--http://localhost:5173/#/manager-->
<template>

  <div class="common-layout">
    <el-container>
      <el-header>
        <h1>
          票务管理系统
        </h1>
      </el-header>
      <el-container>
        <el-aside >
          <el-row class="tac">
            <el-col :span="12">
              <h5 class="mb-2">首页</h5>
              <el-menu
                  default-active="2"
                  class="el-menu-vertical-demo"
                  @open="handleOpen"
                  @close="handleClose"
              >
                <el-sub-menu index="1">
                  <template #title>
                    <el-icon><location /></el-icon>
                    <span>账户管理</span>
                  </template>
                    <el-menu-item index="1-1" @click="managerClick">管理员管理</el-menu-item>
                    <el-menu-item index="1-2" @click="userClick">用户管理</el-menu-item>
                    <el-menu-item index="1-3" @click="accountClick">账户统计</el-menu-item>
                </el-sub-menu>
                <el-menu-item index="2" @click="activeClick">
                  <el-icon><icon-menu /></el-icon>
                  <span>活动信息</span>
                </el-menu-item>
                <el-menu-item index="3" @click="venueClick">
                  <el-icon><document /></el-icon>
                  <span>场馆管理</span>
                </el-menu-item>
                <el-menu-item index="4">
                  <el-icon><icon-menu /></el-icon>
                  <span>票务管理</span>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>
        <el-main>
          <section id="user"   v-show="user">
            <input type="text" placeholder="按姓名搜索" v-model="searchText" />
            <el-table :data="tableData" style="width: 100%">
              <el-table-column prop="UserId" label="id" width="180" />
              <el-table-column prop="UserName" label="姓名" width="150" />
              <el-table-column prop="Email" label="邮箱" width="200" />
              <el-table-column prop="PhoneNumber" label="电话" />
              <el-table-column label="操作">
                <template #default="scope">
                  <el-button
                      size="mini"
                      @click="handleEdit(scope.row)"
                  >编辑</el-button>
                  <el-button
                      size="mini"
                      type="danger"
                      @click="handleDelete(scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </section>
          <section id="manager" v-if="type === 'manager'">
            管理员管理界面
          </section>
          <section id="active" v-else-if="type === 'active'">
            活动管理界面
          </section>
          <section id="account" v-else-if="type === 'account'">
            账户统计界面
          </section>
          <section id="ticket" v-else-if="type === 'ticket'">
          票务管理界面
        </section>
          <section id="venue" v-else-if ="type === 'venue'">
            场馆管理界面
          </section>
        </el-main>
    </el-container>
    </el-container>
  </div>
</template>


<style scoped>



</style>