<template>
  <div class="todo-app">
    <div class="title">Todo App</div>

    <div class="todo-from">
      <input type="text"
             class="todo-input"
             placeholder="请输入待办事项"
             v-model="str"
      />
      <div class="todo-button"  @click="add" >添加</div>
    </div>


    <div :class="[item.isCompleted ? 'completed' : 'item']"
         v-for="(item,index) in list">
      <div class="right">
        <input v-model="item.isCompleted" type="checkbox" />
        <span class="name">{{item.name}}</span>
      </div>
      <div class="del" @click="del(index)">删除</div>
    </div>



  </div>


</template>

<style>
body {
  background-image: linear-gradient(to right, #ADD8E6, #DDA0DD);
}

.item{
  text-align: center;
  justify-content: space-between;
  line-height: 35px;
  display: flex;
  height: 35px;
  margin-top: 10px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border-sizing:border-box;
}
.completed{
  text-decoration: line-through;
  opacity: 0.4;
  text-align: center;
  justify-content: space-between;
  line-height: 35px;
  display: flex;
  height: 35px;
  margin-top: 10px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  border-sizing:border-box;
}

.name{
  font-size: 15px;
  font-weight: 555;
}

.todo-from{
  display: flex;
  margin-top: 20px;
  margin-left: 40px;
}
.todo-input{
  border: 1px solid  #999999;
  outline: none;
  width: 60%;
  height: 50px;
  border-radius: 20px 0 0 20px;
  padding-left:15px ;
}
.todo-button{
  text-align: center;
  line-height: 53px;
  width: 100px;
  height: 53px;
  color: #ffffff;
  user-select: none;
  cursor: pointer;
  border-radius: 0 20px 20px 0;
  background-image: linear-gradient(to right, #ADD8E6, #DDA0DD);
}
.del{
  color: darkred;
  margin-right: 10px;
}
.todo-app{
  justify-content: center; /* 水平居中 */
  align-items: center;
  width: 50%;
  heigth: 70%;
  background-color: #f0f0f0;
  border-radius: 7px;
  margin-top: 40px;
  margin-left: 1%;
  padding: 10px;
  box-sizing: border-box;
}

.title{
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  margin-top: 10px;
}

</style>
<script lang="ts" setup>
import {ref} from "vue";

const str = ref('');
const list = ref([
  {
    isCompleted:false,
    name:'今天要学习Vue'
  },
  {
    isCompleted:false,
    name:'吃饭'
  },
  {
    isCompleted:false,
    name:'复习六级'
  }
]);
function add(){
  list.value.push({
    isCompleted:false,
    name:str.value
  })
  str.value = '';
}
//参数index是数组下标
function  del(index){
  list.value.splice(index,1);
}
</script>
