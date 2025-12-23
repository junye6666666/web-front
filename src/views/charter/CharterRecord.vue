<script setup>
import { ref, onMounted } from 'vue'
import { Search, Timer } from '@element-plus/icons-vue' // 引入图标
import { charterListService, returnShipService } from '@/api/charter.js'
import { ElMessage, ElMessageBox } from 'element-plus'

// --- 数据定义 ---
const tableData = ref([])
const loading = ref(false)

// 搜索条件
const status = ref('') // 空字符串查全部，'Active'查在租，'Returned'查已还

// --- 方法定义 ---

// 1. 获取列表
const getList = async () => {
    loading.value = true
    try {
        // 传递 status 参数给后端 (如果为空就不传)
        const params = status.value ? { status: status.value } : {}
        const result = await charterListService(params)
        tableData.value = result.data
    } finally {
        loading.value = false
    }
}

// 2. 搜索/筛选
const onSearch = () => {
    getList()
}

// 3. 归还船舶
const onReturn = (row) => {
    ElMessageBox.confirm(
        `确认要归还【${row.shipName}】吗？`,
        '归还确认',
        {
            confirmButtonText: '立即归还',
            cancelButtonText: '再用一会',
            type: 'warning',
        }
    ).then(async () => {
        // 调用接口
        await returnShipService(row.id)
        ElMessage.success('归还成功！')
        // 刷新列表
        getList()
    }).catch(() => {})
}

// 初始化加载
onMounted(() => {
    getList()
})
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>租赁记录</span>
            </div>
        </template>

        <el-form inline class="search-form">
            <el-form-item label="当前状态">
                <el-select v-model="status" placeholder="全部状态" style="width: 200px" @change="onSearch">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="租赁中 (Active)" value="Active"></el-option>
                    <el-option label="已归还 (Returned)" value="Returned"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :icon="Search" @click="onSearch">查询</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableData" style="width: 100%" v-loading="loading" border stripe>
            <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
            
            <el-table-column label="船舶名称" prop="shipName" min-width="150">
                <template #default="{ row }">
                    <span style="font-weight: bold">{{ row.shipName }}</span>
                </template>
            </el-table-column>

            <el-table-column label="租借时间" prop="charterTime" width="180">
                <template #default="{ row }">
                    <el-icon><Timer /></el-icon>
                    <span style="margin-left: 5px">{{ row.charterTime ? row.charterTime.replace('T', ' ') : '' }}</span>
                </template>
            </el-table-column>

            <el-table-column label="归还时间" prop="returnTime" width="180">
                <template #default="{ row }">
                    <span v-if="row.returnTime">{{ row.returnTime.replace('T', ' ') }}</span>
                    <span v-else style="color: #999">-</span>
                </template>
            </el-table-column>

            <el-table-column label="状态" prop="status" width="120" align="center">
                <template #default="{ row }">
                    <el-tag v-if="row.status === 'Active'" type="success" effect="dark">租赁中</el-tag>
                    <el-tag v-else type="info">已归还</el-tag>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="120" align="center">
                <template #default="{ row }">
                    <el-button 
                        v-if="row.status === 'Active'"
                        type="primary" 
                        size="small" 
                        @click="onReturn(row)"
                    >
                        归还
                    </el-button>
                    <el-button v-else type="text" disabled size="small">无操作</el-button>
                </template>
            </el-table-column>

            <template #empty>
                <el-empty description="暂无租赁记录" />
            </template>
        </el-table>
    </el-card>
</template>

<style scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.search-form {
    margin-bottom: 20px;
}
</style>