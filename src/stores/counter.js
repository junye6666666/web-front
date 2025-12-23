import { defineStore } from 'pinia'
import { ref } from 'vue'

/* ✅ 彻底重写：
   1. 名字改为 useTokenStore
   2. 加上 persist: true (配合 main.js 里的持久化插件)
*/
export const useTokenStore = defineStore('token', () => {
    // 1. 定义数据 (State)
    const token = ref('')

    // 2. 定义修改方法 (Action)
    const setToken = (newToken) => {
        token.value = newToken
    }

    const removeToken = () => {
        token.value = ''
    }

    // 3. 向外暴露
    return { token, setToken, removeToken }
}, {
    persist: true // 开启持久化
})