<script setup>
import { User, Lock, Key } from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { userRegisterService, userLoginService, getCaptchaService } from '@/api/user.js'
import { useTokenStore } from '@/stores/counter.js'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const isRegister = ref(false)
const router = useRouter()
const tokenStore = useTokenStore()

// 表单数据
const registerData = ref({ username: '', password: '', rePassword: '' })

// ✅ 1. 在 loginData 中增加 rememberMe 字段
const loginData = ref({
    username: '',
    password: '',
    uuid: '', 
    code: '',
    rememberMe: false 
})

const captchaImg = ref('')

const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { len: 4, message: '验证码长度为4位', trigger: 'blur' }
    ]
}

const refreshCaptcha = async () => {
    try {
        const res = await getCaptchaService()
        if(res.code === 0) {
            loginData.value.uuid = res.data.uuid
            captchaImg.value = res.data.img
            loginData.value.code = '' 
        }
    } catch (err) {
        console.error("验证码获取失败", err)
    }
}

onMounted(() => {
    refreshCaptcha()
    
    // ✅ 2. 页面加载时，检查本地是否有存过的用户名
    const savedName = localStorage.getItem('saved_username')
    if (savedName) {
        loginData.value.username = savedName
        loginData.value.rememberMe = true // 自动勾选上
    }
})

const register = async () => {
    if(registerData.value.password !== registerData.value.rePassword){
        ElMessage.error('两次密码输入不一致')
        return
    }
    await userRegisterService(registerData.value)
    ElMessage.success('注册成功，请登录')
    isRegister.value = false
    clearRegisterData()
    refreshCaptcha()
}

const login = async () => {
    let result = await userLoginService(loginData.value)
    ElMessage.success('登录成功')
    tokenStore.setToken(result.data)

    // ✅ 3. 登录成功后，根据是否勾选决定是存储还是清除
    if (loginData.value.rememberMe) {
        localStorage.setItem('saved_username', loginData.value.username)
    } else {
        localStorage.removeItem('saved_username')
    }

    router.push('/')
}

const clearRegisterData = () => {
    registerData.value = { username: '', password: '', rePassword: '' }
}
</script>

<template>
    <div class="login-container">
        <div class="login-left">
            <div class="login-left-mask">
                <div class="login-left-content">
                    <h1>船舶管理系统</h1>
                    <p>Intelligent Ship Management System</p>
                    <p class="subtitle">高效 · 安全 · 智能 · 便捷</p>
                </div>
            </div>
        </div>

        <div class="login-right">
            <div class="form-box">
                <div class="form-header">
                    <h2>{{ isRegister ? '创建账号' : '欢迎登录' }}</h2>
                    <p class="desc"></p>
                </div>

                <el-form 
                    ref="form" 
                    size="large" 
                    autocomplete="off" 
                    v-if="isRegister" 
                    :model="registerData" 
                    :rules="rules"
                >
                    <el-form-item prop="username">
                        <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
                    </el-form-item>
                    <el-form-item prop="rePassword">
                        <el-input :prefix-icon="Lock" type="password" placeholder="请再次输入密码" v-model="registerData.rePassword"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="submit-btn" type="primary" auto-insert-space @click="register">
                            立即注册
                        </el-button>
                    </el-form-item>
                    <div class="form-footer">
                        <span>已有账号？</span>
                        <el-link type="primary" :underline="false" @click="isRegister = false; clearRegisterData(); refreshCaptcha()">
                            去登录
                        </el-link>
                    </div>
                </el-form>

                <el-form 
                    ref="form" 
                    size="large" 
                    autocomplete="off" 
                    v-else 
                    :model="loginData" 
                    :rules="rules"
                >
                    <el-form-item prop="username">
                        <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="loginData.username"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="loginData.password"></el-input>
                    </el-form-item>
                    
                    <el-form-item prop="code">
                        <div class="captcha-box">
                            <el-input 
                                :prefix-icon="Key" 
                                placeholder="验证码" 
                                v-model="loginData.code"
                                @keyup.enter="login"
                            ></el-input>
                            <img 
                                :src="captchaImg" 
                                @click="refreshCaptcha" 
                                class="captcha-img"
                                title="看不清？点击刷新"
                            />
                        </div>
                    </el-form-item>

                    <div class="form-options">
                        <el-checkbox v-model="loginData.rememberMe">记住用户名</el-checkbox>
                       
                    </div>

                    <el-form-item>
                        <el-button class="submit-btn" type="primary" auto-insert-space @click="login">登录</el-button>
                    </el-form-item>
                    
                    <div class="form-footer">
                        <span>还没有账号？</span>
                        <el-link type="primary" :underline="false" @click="isRegister = true; clearRegisterData()">
                            去注册
                        </el-link>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
/* 样式保持和你之前的一样，直接复制过来即可 */
.login-container {
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background-color: #f0f2f5;

    .login-left {
        flex: 1.5; 
        background: url('@/assets/login_bg.jpg') no-repeat center center;
        background-size: cover;
        position: relative;

        .login-left-mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            
            .login-left-content {
                color: #fff;
                text-align: center;
                
                h1 {
                    font-size: 48px;
                    font-weight: bold;
                    margin-bottom: 20px;
                    letter-spacing: 2px;
                }
                
                p {
                    font-size: 20px;
                    opacity: 0.9;
                }
                
                .subtitle {
                    margin-top: 30px;
                    font-size: 16px;
                    opacity: 0.8;
                    letter-spacing: 5px;
                }
            }
        }
    }
}

.login-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f6f8fa; 

    .form-box {
        width: 100%;
        max-width: 420px;
        padding: 50px 40px;
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05); 

        .form-header {
            text-align: center;
            margin-bottom: 40px;
            
            h2 {
                font-size: 26px;
                color: #333;
                font-weight: 600;
                margin-bottom: 12px;
            }
            .desc {
                color: #999;
                font-size: 14px;
                letter-spacing: 0.5px;
            }
        }

        :deep(.el-input__wrapper) {
            background-color: #f5f7fa; 
            box-shadow: none; 
            border: 1px solid transparent;
            border-radius: 8px; 
            padding: 8px 15px; 
            transition: all 0.3s;
            
            &.is-focus {
                background-color: #fff;
                border-color: #409eff; 
                box-shadow: 0 0 0 1px #409eff inset; 
            }
        }

        .captcha-box {
            display: flex;
            gap: 12px;
            width: 100%;
            
            .captcha-img {
                width: 120px;
                height: 48px; 
                border-radius: 8px;
                cursor: pointer;
                border: 1px solid #eee;
            }
        }

        .form-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
            padding: 0 5px;
        }

        .submit-btn {
            width: 100%;
            height: 48px; 
            font-size: 16px;
            font-weight: bold;
            border-radius: 8px;
            letter-spacing: 2px;
            background: linear-gradient(90deg, #409eff, #337ecc); 
            border: none;
            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3); 
            
            &:hover {
                background: linear-gradient(90deg, #66b1ff, #409eff);
                transform: translateY(-1px); 
            }
            &:active {
                transform: translateY(0);
            }
        }

        .form-footer {
            margin-top: 24px;
            text-align: center;
            font-size: 14px;
            color: #666;
            
            .el-link {
                margin-left: 5px;
                font-weight: 500;
            }
        }
    }
}

@media (max-width: 900px) {
    .login-left {
        display: none;
    }
    .login-right {
        background: url('@/assets/login_bg.jpg') no-repeat center center;
        background-size: cover;
        
        .form-box {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            width: 90%;
        }
    }
}
</style>