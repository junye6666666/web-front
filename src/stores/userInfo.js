import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserInfoStore = defineStore('userInfo', () => {
    // 1. 定义用户信息数据
    const info = ref({})

    // 2. 修改用户信息的方法
    const setInfo = (newInfo) => {
        info.value = newInfo
    }

    // 3. 清空用户信息的方法
    const removeInfo = () => {
        info.value = {}
    }

    return { info, setInfo, removeInfo }
}, {
    persist: true // 开启持久化，刷新页面数据不丢失
})