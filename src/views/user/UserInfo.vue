<script setup>
import { ref } from 'vue'
import { useTokenStore } from '@/stores/counter.js' // 现在 counter.js 里已经是 useTokenStore 了
import { userInfoService, userInfoUpdateService } from '@/api/user.js'
import { ElMessage } from 'element-plus'

const userInfo = ref({
    id: 0,
    username: '',
    nickname: '',
    email: ''
})

const rules = {
    nickname: [
        { required: true, message: '请输入用户昵称', trigger: 'blur' },
        { pattern: /^\S{2,10}$/, message: '昵称必须是2-10位的非空字符串', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入用户邮箱', trigger: 'blur' },
        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
    ]
}

// 获取用户信息
const getUserInfo = async () => {
    let result = await userInfoService();
    userInfo.value = result.data;
}
getUserInfo();

// 提交修改
const updateUserInfo = async () => {
    await userInfoUpdateService(userInfo.value);
    ElMessage.success('修改成功');
    getUserInfo();
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>基本资料</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
                    <el-form-item label="登录名称">
                        <el-input v-model="userInfo.username" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="用户昵称" prop="nickname">
                        <el-input v-model="userInfo.nickname"></el-input>
                    </el-form-item>
                    <el-form-item label="用户邮箱" prop="email">
                        <el-input v-model="userInfo.email"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="updateUserInfo">提交修改</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </el-card>
</template>