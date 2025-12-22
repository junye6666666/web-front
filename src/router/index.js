import { createRouter, createWebHistory } from 'vue-router'

// 导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'

import ShipManageVue from '@/views/ship/ShipManage.vue'
import ShipCategoryVue from '@/views/ship/ShipCategory.vue'
import CharterRecordVue from '@/views/charter/CharterRecord.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: LoginVue },
    { 
      path: '/', 
      component: LayoutVue,
      redirect: '/ship', // 登录进来默认看“船舶管理”
      children: [
        { path: '/ship', component: ShipManageVue },
        { path: '/category', component: ShipCategoryVue },
        { path: '/charter', component: CharterRecordVue },
      ]
    }
  ]
})

export default router