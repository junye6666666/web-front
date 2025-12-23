<script setup>
import { Plus, Upload } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { userAvatarUpdateService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/stores/userInfo.js'

const userInfoStore = useUserInfoStore()
const imgUrl = ref(userInfoStore.info.userPic)

// 获取 Token
const token = localStorage.getItem('token')

// ✅ 1. 上传成功回调
// 这里的 result 是上传接口返回的图片地址
const handleAvatarSuccess = (result) => {
    // 根据后端返回结构，result.data 通常是图片 URL
    if (result.code === 0) {
        imgUrl.value = result.data; 
    } else {
        ElMessage.error(result.message || '图片上传失败');
    }
}

// ✅ 2. 确认修改 (核心：调用 UserController)
const updateAvatar = async () => {
    // 调用 api/user.js 中的方法，发送 PATCH 请求给 UserController
    await userAvatarUpdateService(imgUrl.value);
    
    // 更新本地显示
    userInfoStore.info.userPic = imgUrl.value;

    ElMessage.success('头像修改成功');
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>更换头像</span>
            </div>
        </template>
        <el-row>
            <el-col :span="12">
                <el-upload
                    class="avatar-uploader"
                    action="/api/upload"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :headers="{'Authorization': token}"
                    name="file"
                >
                    <img v-if="imgUrl" :src="imgUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
                <br />
                <el-button type="primary" :icon="Plus" size="large" @click="updateAvatar">
                    确认修改
                </el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<style lang="scss" scoped>
.avatar-uploader {
    :deep() {
        .avatar {
            width: 278px;
            height: 278px;
            display: block;
        }
        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
        }
        .el-upload:hover {
            border-color: var(--el-color-primary);
        }
        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 278px;
            height: 278px;
            text-align: center;
        }
    }
}
</style>