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
const loginData = ref({
    username: '',
    password: '',
    uuid: '', 
    code: ''  
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
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
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
.login-container {
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background-color: #f0f2f5;

    // 左侧区域
    .login-left {
        flex: 1.5; // 占据较大比例 (60%左右)
        // 使用在线图片，你也可以换成你本地的 @/assets/bg.jpg
        //background: url('https://images.unsplash.com/photo-1548270150-13170e28c775?q=80&w=2574&auto=format&fit=crop') no-repeat center center;
        background: url('@/assets/login_bg.jpg') no-repeat center center;
        background-size: cover;
        position: relative;

        // 遮罩层，让文字更清晰
        .login-left-mask {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            //background: linear-gradient(135deg, rgba(24, 144, 255, 0.8), rgba(0, 58, 140, 0.9));
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
/* ... 前面的 .login-container 和 .login-left 不用动 ... */

// --- ✅ 修改开始：右侧区域优化 ---
.login-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    // 1. 给右侧整体加一个极淡的灰蓝色背景，不再是死板的纯白
    background-color: #f6f8fa; 

    .form-box {
        width: 100%;
        max-width: 420px; // 稍微宽一点点
        padding: 50px 40px;
        
        // 2. ✅ 核心修改：卡片化效果
        background: #ffffff;
        border-radius: 16px; // 大圆角
        // 加一个柔和的投影，让表单浮起来
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05); 

        .form-header {
            text-align: center; // 让标题居中
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

        // 3. ✅ 优化输入框样式 (利用 :deep 穿透修改 Element Plus 样式)
        :deep(.el-input__wrapper) {
            background-color: #f5f7fa; // 输入框背景改成浅灰，不那么刺眼
            box-shadow: none; // 去掉默认边框
            border: 1px solid transparent;
            border-radius: 8px; // 输入框圆角
            padding: 8px 15px; // 增加内边距，显大
            transition: all 0.3s;
            
            &.is-focus {
                background-color: #fff;
                border-color: #409eff; // 聚焦时变回白色并亮起边框
                box-shadow: 0 0 0 1px #409eff inset; 
            }
        }

        .captcha-box {
            display: flex;
            gap: 12px;
            width: 100%;
            
            .captcha-img {
                width: 120px;
                height: 48px; // 和输入框高度对齐
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
            height: 48px; // 按钮加高
            font-size: 16px;
            font-weight: bold;
            border-radius: 8px;
            letter-spacing: 2px;
            background: linear-gradient(90deg, #409eff, #337ecc); // 按钮加渐变
            border: none;
            box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3); // 按钮光晕
            
            &:hover {
                background: linear-gradient(90deg, #66b1ff, #409eff);
                transform: translateY(-1px); // 鼠标悬停轻微上浮
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

// 响应式部分也稍微调整，保持统一
@media (max-width: 900px) {
    .login-left {
        display: none;
    }
    .login-right {
        // 手机端背景直接用图片
        background: url('@/assets/login_bg.jpg') no-repeat center center;
        background-size: cover;
        
        .form-box {
            // 手机端保持半透明磨砂效果
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            width: 90%;
        }
    }
}
</style>