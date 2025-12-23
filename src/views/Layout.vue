<script setup>
import { Management, List, Promotion, UserFilled, CaretBottom, SwitchButton, User } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// 下拉菜单命令处理
const handleCommand = (command) => {
    if (command === 'logout') {
        ElMessageBox.confirm(
            '确认要退出登录吗?',
            '温馨提示',
            {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning',
            }
        ).then(() => {
            // 1. 清空 token
            localStorage.removeItem('token')
            // 2. 跳转回登录页
            router.push('/login')
            ElMessage.success('退出成功')
        }).catch(() => {})
    }
}
</script>

<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <div class="el-aside__logo"></div>
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        text-color="#fff"
        router
        :default-active="$route.path"
      >
        <el-menu-item index="/ship">
          <el-icon><Promotion /></el-icon>
          <span>船舶管理</span>
        </el-menu-item>
        
        <el-menu-item index="/category">
          <el-icon><Management /></el-icon>
          <span>分类管理</span>
        </el-menu-item>
        
        <el-menu-item index="/charter">
          <el-icon><List /></el-icon>
          <span>租赁记录</span>
        </el-menu-item>

        <el-sub-menu index="/user">
            <template #title>
                <el-icon><UserFilled /></el-icon>
                <span>个人中心</span>
            </template>
            <el-menu-item index="/user/info">
                <el-icon><User /></el-icon>
                <span>基本资料</span>
            </el-menu-item>
            <el-menu-item index="/user/avatar">
                <el-icon><Crop /></el-icon>
                <span>更换头像</span>
            </el-menu-item>
            <el-menu-item index="/user/password">
                <el-icon><EditPen /></el-icon>
                <span>重置密码</span>
            </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <div>当前用户：<strong>管理员</strong></div>
        <el-dropdown placement="bottom-end" @command="handleCommand">
            <span class="el-dropdown__box">
                <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                <el-icon><CaretBottom /></el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="profile" :icon="User">基本资料</el-dropdown-item>
                    <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
      </el-header>
      
      <el-main>
        <router-view></router-view>
      </el-main>
      
      <el-footer>船舶管理系统 ©2023 Created by You</el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  
  .el-aside {
    background-color: #232323;
    &__logo {
      height: 120px;
      background: url('@/assets/shouye.jpg') no-repeat center / 200px auto;
    }
    .el-menu {
      border-right: none;
    }
  }
  
  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #dcdfe6;
    
    .el-dropdown__box {
      display: flex;
      align-items: center;
      cursor: pointer;
      .el-icon {
        color: #999;
        margin-left: 10px;
      }
      
      &:active,
      &:focus {
        outline: none;
      }
    }
  }
  
  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>