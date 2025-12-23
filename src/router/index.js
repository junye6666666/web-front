import { createRouter, createWebHistory } from 'vue-router'

// 导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'

import ShipManageVue from '@/views/ship/ShipManage.vue'
import ShipCategoryVue from '@/views/ship/ShipCategory.vue'
import CharterRecordVue from '@/views/charter/CharterRecord.vue'

// ✅ 导入个人中心组件
import UserInfoVue from '@/views/user/UserInfo.vue'
import UserAvatarVue from '@/views/user/UserAvatar.vue'
import UserResetPasswordVue from '@/views/user/UserResetPassword.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: LoginVue },
    {
      path: '/',
      component: LayoutVue,
      redirect: '/ship',
      children: [
        { path: '/ship', component: ShipManageVue },
        { path: '/category', component: ShipCategoryVue },
        { path: '/charter', component: CharterRecordVue },
        
        // ✅ 配置个人中心路由 (对应 Layout.vue 里的路径)
        { path: '/user/info', component: UserInfoVue },
        { path: '/user/avatar', component: UserAvatarVue },
        { path: '/user/password', component: UserResetPasswordVue }, // 注意这里是 /user/password
      ]
    }
  ]
})

export default router