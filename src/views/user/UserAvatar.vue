<script setup>
import { Plus, Upload } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { userAvatarUpdateService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/stores/userInfo.js'

const userInfoStore = useUserInfoStore()
const imgUrl = ref(userInfoStore.info.userPic)

// ✅ 1. 获取 Token
const token = localStorage.getItem('token') 

// ✅ 2. 定义上传请求头 (根据你之前的要求，不加 Bearer)
const uploadHeaders = {
    'Authorization': token 
}

const handleAvatarSuccess = (result) => {
    // 处理后端返回结果 (Result对象)
    if (result.code === 0) {
        imgUrl.value = result.data; 
    } else {
        ElMessage.error(result.message || '上传失败');
    }
}

const updateAvatar = async () => {
    await userAvatarUpdateService(imgUrl.value);
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
                    :headers="uploadHeaders"
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