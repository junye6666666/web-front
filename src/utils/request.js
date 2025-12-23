import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router'
// ✅ 1. 引入 Token 仓库
import { useTokenStore } from '@/stores/counter.js'

const baseURL = '/api';

const instance = axios.create({
    baseURL, 
    timeout: 10000 
});

// --- 请求拦截器 ---
instance.interceptors.request.use(
    (config) => {
        // ✅ 2. 在拦截器内部获取 store 实例
        const tokenStore = useTokenStore();
        
        // ✅ 3. 判断 store 里是否有 token
        if (tokenStore.token) {
            // 直接使用 store 里的 token，它是干净的字符串
            config.headers.Authorization = tokenStore.token;
        }
        return config;
    },
    (err) => Promise.reject(err)
);

// --- 响应拦截器 ---
instance.interceptors.response.use(
    (res) => {
        if (res.data.code === 0) {
            return res.data; 
        }
        ElMessage.error(res.data.message || '服务异常');
        return Promise.reject(res.data);
    },
    (err) => {
        if (err.response?.status === 401) {
            ElMessage.error('登录过期，请重新登录');
            router.push('/login');
        } else {
            ElMessage.error(err.message || '网络错误');
        }
        return Promise.reject(err);
    }
);

export default instance;