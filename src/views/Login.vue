<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { userRegisterService, userLoginService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const isRegister = ref(false) // 控制是登录还是注册
const router = useRouter()

// 表单数据模型
const registerData = ref({
    username: '',
    password: '',
    rePassword: ''
})

const loginData = ref({
    username: '',
    password: ''
})

// 校验密码一致性
const checkRePassword = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入密码'))
    } else if (value !== registerData.value.password) {
        callback(new Error('两次输入密码不一致!'))
    } else {
        callback()
    }
}

// 表单校验规则
const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 5, max: 16, message: '长度在 5 到 16 个字符', trigger: 'blur' }
    ],
    rePassword: [
        { validator: checkRePassword, trigger: 'blur' }
    ]
}

// 注册函数
const register = async () => {
    try {
        await userRegisterService(registerData.value);
        ElMessage.success('注册成功');
        isRegister.value = false; // 切换回登录页
    } catch (error) {
        // 错误已经在 request.js 拦截器处理了，这里可以不做处理
    }
}

// 登录函数
const login = async () => {
    try {
        const result = await userLoginService(loginData.value);
        ElMessage.success('登录成功');
        // 保存 token 到本地
        localStorage.setItem('token', result.data); 
        // 跳转到首页 (Layout)
        router.push('/');
    } catch (error) {
    }
}
</script>

<template>
  <div class="login-page">
    <div class="form-box">
      <div class="title">船舶管理系统</div>
      
      <el-form v-if="isRegister" :model="registerData" :rules="rules" size="large">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="registerData.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="registerData.password" :prefix-icon="Lock" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input v-model="registerData.rePassword" :prefix-icon="Lock" type="password" placeholder="请再次确认密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn" type="primary" auto-insert-space @click="register">注册</el-button>
        </el-form-item>
        <el-form-item>
          <el-link type="info" :underline="false" @click="isRegister = false">
            ← 返回登录
          </el-link>
        </el-form-item>
      </el-form>

      <el-form v-else :model="loginData" :rules="rules" size="large">
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input v-model="loginData.username" :prefix-icon="User" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginData.password" :prefix-icon="Lock" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="btn" type="primary" auto-insert-space @click="login">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-link type="info" :underline="false" @click="isRegister = true">
            注册新账号 →
          </el-link>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  height: 100vh;
  background-color: #2d3a4b; /* 深色背景 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-box {
  width: 400px;
  background: #fff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 0 20px rgba(0,0,0,0.2);
}

.title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.btn {
  width: 100%;
}
</style>