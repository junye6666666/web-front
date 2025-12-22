import axios from 'axios';
import { ElMessage } from 'element-plus';
import router from '@/router'

const baseURL = 'http://localhost:8080'; // 你的后端地址

const instance = axios.create({
    baseURL, 
    timeout: 5000 // 超时时间
});

// 1. 请求拦截器：每次发请求前，自动带上 Token
instance.interceptors.request.use(
    (config) => {
        // 从浏览器缓存获取 token
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    },
    (err) => Promise.reject(err)
);

// 2. 响应拦截器：统一处理返回结果
instance.interceptors.response.use(
    (res) => {
        // 只要是 200，说明后端通了
        if (res.data.code === 0) {
            return res.data; // 剥离外层，直接返回数据
        }
        // 如果 code 不是 0，说明业务失败（比如密码错误）
        ElMessage.error(res.data.message || '服务异常');
        return Promise.reject(res.data);
    },
    (err) => {
        // HTTP 状态码报错 (401, 500 等)
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