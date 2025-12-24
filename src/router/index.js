import { createRouter, createWebHistory } from 'vue-router'

// 导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'
import DashboardVue from '@/views/Dashboard.vue' // ✅ 新增引入

import ShipManageVue from '@/views/ship/ShipManage.vue'
import ShipCategoryVue from '@/views/ship/ShipCategory.vue'
import CharterRecordVue from '@/views/charter/CharterRecord.vue'

import UserInfoVue from '@/views/user/UserInfo.vue'
import UserAvatarVue from '@/views/user/UserAvatar.vue'
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue'
import MaintenanceVue from '@/views/maintenance/MaintenanceRecord.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: LoginVue },
    {
      path: '/',
      component: LayoutVue,
      redirect: '/dashboard', // ✅ 核心修改：登录后重定向到首页
      children: [
        { path: '/dashboard', component: DashboardVue }, // ✅ 新增首页路由
        { path: '/ship', component: ShipManageVue },
        { path: '/category', component: ShipCategoryVue },
        { path: '/charter', component: CharterRecordVue },
        
        { path: '/user/info', component: UserInfoVue },
        { path: '/user/avatar', component: UserAvatarVue },
        { path: '/user/password', component: UserResetPasswordVue },
        { path: '/maintenance', component: MaintenanceVue },
      ]
    }
  ]
})

export default router