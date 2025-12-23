<script setup>
import { ref, onMounted } from 'vue'
import { maintenanceListService, maintenanceAddService, maintenanceCompleteService } from '@/api/maintenance.js'
import { shipListService } from '@/api/ship.js'
import { Plus, Check, Search, Timer } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const tableData = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const ships = ref([]) // 用于下拉选择船舶

// 表单数据
const form = ref({
    shipId: '',
    description: '',
    startDate: '',
    cost: ''
})

// 获取列表
const getList = async () => {
    loading.value = true
    const res = await maintenanceListService()
    tableData.value = res.data
    loading.value = false
}

// 获取所有空闲船舶 (用于新增维修)
const getShips = async () => {
    // 这里简单复用 shipListService，实际可以写个专门查所有船的接口
    // pageNum: 1, pageSize: 1000 确保查出所有
    const res = await shipListService({ pageNum: 1, pageSize: 1000, state: 'Available' })
    ships.value = res.data.items
}

const openAdd = () => {
    form.value = { shipId: '', description: '', startDate: '', cost: '' }
    getShips() // 打开弹窗时获取最新空闲船舶
    dialogVisible.value = true
}

const submitForm = async () => {
    await maintenanceAddService(form.value)
    ElMessage.success('登记成功，船舶状态已更为维修中')
    dialogVisible.value = false
    getList()
}

const onComplete = (row) => {
    ElMessageBox.confirm('确认维修已完成吗？船舶将恢复为空闲状态。', '温馨提示', {
        type: 'warning'
    }).then(async () => {
        await maintenanceCompleteService(row.id)
        ElMessage.success('操作成功')
        getList()
    }).catch(() => {})
}

onMounted(() => {
    getList()
})
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>维护保养记录</span>
                <el-button type="primary" :icon="Plus" @click="openAdd">登记保养</el-button>
            </div>
        </template>

        <el-table :data="tableData" style="width: 100%" v-loading="loading">
            <el-table-column prop="shipName" label="船舶名称" width="150" />
            <el-table-column prop="description" label="维修内容" />
            <el-table-column prop="cost" label="费用 (元)" width="120">
                 <template #default="{ row }">
                     <span style="color: #f56c6c; font-weight: bold;">¥ {{ row.cost }}</span>
                 </template>
            </el-table-column>
            <el-table-column prop="startDate" label="开始日期" width="120" />
            <el-table-column prop="endDate" label="结束日期" width="120">
                <template #default="{ row }">
                    {{ row.endDate || '-' }}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                    <el-tag v-if="row.status === 'Completed'" type="success">已完成</el-tag>
                    <el-tag v-else type="warning">进行中</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
                <template #default="{ row }">
                    <el-button 
                        v-if="row.status === 'Pending'"
                        type="success" 
                        size="small" 
                        :icon="Check" 
                        @click="onComplete(row)"
                    >完成维修</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog v-model="dialogVisible" title="登记船舶保养" width="500px">
            <el-form :model="form" label-width="100px">
                <el-form-item label="选择船舶">
                    <el-select v-model="form.shipId" placeholder="请选择空闲船舶" style="width: 100%">
                        <el-option 
                            v-for="s in ships" 
                            :key="s.id" 
                            :label="s.name" 
                            :value="s.id" 
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="维修内容">
                    <el-input type="textarea" v-model="form.description" placeholder="请输入故障原因或保养项目"></el-input>
                </el-form-item>
                <el-form-item label="开始日期">
                    <el-date-picker v-model="form.startDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%"/>
                </el-form-item>
                <el-form-item label="预计费用">
                    <el-input v-model="form.cost" placeholder="请输入金额" type="number">
                        <template #prefix>¥</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">确认登记</el-button>
            </template>
        </el-dialog>
    </el-card>
</template>

<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.page-container {
    min-height: 100%;
}
</style>