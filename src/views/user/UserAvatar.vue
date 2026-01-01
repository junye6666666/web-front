<script setup>
import { Plus, Upload } from '@element-plus/icons-vue'
import { ref, computed } from 'vue' // ✅ 1. 引入 computed
import { userAvatarUpdateService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
import { useUserInfoStore } from '@/stores/userInfo.js'
import { useTokenStore } from '@/stores/counter.js' // ✅ 2. 引入 Token Store

const userInfoStore = useUserInfoStore()
const tokenStore = useTokenStore() // ✅ 3. 使用 Token Store

const imgUrl = ref(userInfoStore.info.userPic)

// ✅ 4. 使用 computed 动态获取最新的 token
// 这样即使页面刚刷新，也能从持久化的 Pinia 中正确拿到 token
const uploadHeaders = computed(() => {
    return {
        'Authorization': tokenStore.token
    }
})

// 上传成功回调 (此时只是上传到了服务器/OSS，还没更新用户数据库中的头像字段)
const handleAvatarSuccess = (result) => {
    if (result.code === 0) {
        imgUrl.value = result.data; 
        ElMessage.success('图片上传成功，请点击“确认修改”保存');
    } else {
        ElMessage.error(result.message || '图片上传失败');
    }
}

// 确认修改 (核心：调用接口更新数据库，并同步更新本地 Store)
const updateAvatar = async () => {
    try {
        // 调用 api/user.js 中的方法
        await userAvatarUpdateService(imgUrl.value);
        
        // ✅ 5. 更新本地 Pinia 中的用户信息，确保页面右上角等位置的头像同步变化
        userInfoStore.info.userPic = imgUrl.value;

        ElMessage.success('头像修改成功');
    } catch (error) {
        ElMessage.error('修改失败');
    }
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