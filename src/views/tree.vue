<template>
  <el-row>
    <el-col :span="8"><div class="grid-content bg-purple" /></el-col>
    <el-col :span="8"
      ><div class="grid-content bg-purple-light" />
      <el-form >
        <el-descriptions title="项目描述" :column="1"
         >
          <el-descriptions-item
            label="项目名称"
            label-align="left"
            align="left"
            min-width="100px"
            ><el-tag size="small">SIMBLOCKCHAIN</el-tag></el-descriptions-item
          >
          <el-descriptions-item label="项目开始时间" label-align="left" align="left">2021-11-18</el-descriptions-item>
          <el-descriptions-item label="技术栈" label-align="left" align="left">
            SpringBoot+Redis+Mysql+Vue
          </el-descriptions-item>
          
          <el-descriptions-item label="基本描述" label-align="left" align="left">本项目主要为区块链的仿真实验平台,仿真内容包括单流程仿真和全流程仿真</el-descriptions-item>
          <el-descriptions-item label="推荐浏览器" label-align="left" align="left">Google Chrome/Microsoft Edge</el-descriptions-item>
         
        </el-descriptions></el-form
      >
    </el-col>
    <el-col :span="8"><div class="grid-content bg-purple" /></el-col>
  </el-row>
</template>

<style>
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
