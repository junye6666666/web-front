<script setup>
import { Management, List, Promotion, UserFilled, CaretBottom, SwitchButton, User, Crop, EditPen, Tools, Odometer, Search, Loading } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserInfoStore } from '@/stores/userInfo.js'
import { userInfoService } from '@/api/user.js'
import request from '@/utils/request'

const router = useRouter()
const userInfoStore = useUserInfoStore()

// --- 全局搜索相关逻辑 ---
const searchKeyword = ref('')
const searchDialogVisible = ref(false)
const searchLoading = ref(false)
const searchResults = ref({ ships: [], charters: [], maintenances: [] })

const handleGlobalSearch = async () => {
    if (!searchKeyword.value.trim()) return;
    
    searchDialogVisible.value = true;
    searchLoading.value = true;
    searchResults.value = { ships: [], charters: [], maintenances: [] };

    try {
        const res = await request.get('/search/global', {
            params: { keyword: searchKeyword.value }
        });
        searchResults.value = res.data; 
    } catch (error) {
        ElMessage.error('搜索失败');
    } finally {
        searchLoading.value = false;
    }
}

const hasResults = computed(() => {
    const s = searchResults.value;
    return (s.ships && s.ships.length > 0) || 
           (s.charters && s.charters.length > 0) || 
           (s.maintenances && s.maintenances.length > 0);
})

const goToDetail = (path) => {
    searchDialogVisible.value = false;
    router.push(path);
}

// --- 原有逻辑 ---
const getUserInfo = async () => {
    let result = await userInfoService();
    userInfoStore.setInfo(result.data);
}
getUserInfo();

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
            localStorage.removeItem('token')
            userInfoStore.removeInfo()
            router.push('/login')
            ElMessage.success('退出成功')
        }).catch(() => {})
    } else {
        router.push('/user/' + (command === 'profile' ? 'info' : command))
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
        <el-menu-item index="/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>系统首页</span>
        </el-menu-item>
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
        <el-menu-item index="/maintenance">
          <el-icon><Tools /></el-icon> 
          <span>维护保养</span>
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
        <div></div>

        <div class="header-search">
            <el-input
                v-model="searchKeyword"
                placeholder="搜索船舶、租户或维修记录..."
                prefix-icon="Search"
                @keyup.enter="handleGlobalSearch"
                clearable
                style="width: 300px;"
            />
        </div>

        <div class="header-right">
            <el-dropdown placement="bottom-end" @command="handleCommand">
                <div class="el-dropdown__box">
                    <el-avatar :size="40" :src="userInfoStore.info.userPic || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'" />
                    <span class="user-nickname">{{ userInfoStore.info.nickname || '用户' }}</span>
                </div>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="logout" :icon="SwitchButton">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
      </el-header>
      
      <el-main>
        <router-view></router-view>
      </el-main>
      
      <el-footer>船舶管理系统 ©2025 Created by 祁小俊</el-footer>
    </el-container>

    <el-dialog v-model="searchDialogVisible" title="全站搜索结果" width="60%">
        <div v-if="searchLoading" class="loading-box">
            <el-icon class="is-loading" size="24"><Loading /></el-icon> 正在努力搜索中...
        </div>

        <div v-else class="search-results">
            <div v-if="searchResults.ships && searchResults.ships.length > 0" class="result-section">
                <h3>🚢 船舶 ({{ searchResults.ships.length }})</h3>
                <el-table :data="searchResults.ships" size="small" border stripe>
                    <el-table-column prop="name" label="船名" width="150" />
                    <el-table-column prop="manufacturer" label="制造商" />
                    <el-table-column prop="categoryName" label="分类" width="100" />
                    <el-table-column prop="state" label="状态" width="100">
                         <template #default="{ row }">
                            <el-tag :type="row.state === 'Available' ? 'success' : 'warning'">{{ row.state }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="80" align="center">
                        <template #default>
                            <el-button link type="primary" @click="goToDetail('/ship')">去管理</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div v-if="searchResults.charters && searchResults.charters.length > 0" class="result-section">
                <h3>📄 租赁记录 ({{ searchResults.charters.length }})</h3>
                <el-table :data="searchResults.charters" size="small" border stripe>
                    <el-table-column prop="shipName" label="租赁船舶" width="150" />
                    <el-table-column prop="userName" label="租赁人" width="100" />
                    <el-table-column prop="charterTime" label="时间" />
                    <el-table-column prop="status" label="状态" width="100">
                         <template #default="{ row }">
                            <el-tag :type="row.status === 'Active' ? 'danger' : 'info'">{{ row.status }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="80" align="center">
                         <template #default>
                            <el-button link type="primary" @click="goToDetail('/charter')">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <div v-if="searchResults.maintenances && searchResults.maintenances.length > 0" class="result-section">
                <h3>🔧 维修记录 ({{ searchResults.maintenances.length }})</h3>
                <el-table :data="searchResults.maintenances" size="small" border stripe>
                    <el-table-column prop="shipName" label="维修船舶" width="150" />
                    <el-table-column prop="description" label="故障描述" />
                    <el-table-column prop="cost" label="费用" width="100" />
                    <el-table-column prop="status" label="状态" width="100">
                         <template #default="{ row }">
                            <el-tag :type="row.status === 'Pending' ? 'danger' : 'success'">{{ row.status }}</el-tag>
                        </template>
                    </el-table-column>
                     <el-table-column label="操作" width="80" align="center">
                         <template #default>
                            <el-button link type="primary" @click="goToDetail('/maintenance')">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <el-empty v-if="!hasResults" description="暂无相关数据，换个关键词试试？" />
        </div>
    </el-dialog>

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
    padding: 0 20px;
    height: 80px; /* ✅ 加高Header，防止头像和文字放不下 */
    
    .header-search {
        flex: 1;
        display: flex;
        justify-content: center;
    }

    .header-right {
        display: flex;
        align-items: center;
    }

    /* ✅ 修改后的用户区域样式 */
    .el-dropdown__box {
      display: flex;
      flex-direction: column; /* 垂直排列 */
      align-items: center;
      justify-content: center;
      cursor: pointer;
      line-height: 1; /* 紧凑一点 */
      
      .user-nickname {
          margin-top: 6px;
          font-size: 13px;
          font-weight: bold;
          color: #555;
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

.loading-box {
    text-align: center;
    padding: 40px;
    font-size: 16px;
    color: #666;
}

.result-section {
    margin-bottom: 20px;
    h3 {
        margin-bottom: 10px;
        color: #333;
        border-left: 4px solid #409EFF;
        padding-left: 10px;
    }
}
</style>