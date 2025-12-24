<script setup>
import { ref, onMounted } from 'vue'
import { getDashboardStatsService } from '@/api/dashboard.js'
import * as echarts from 'echarts'
// 引入图标
import { Ship, Money, Tools, DataBoard } from '@element-plus/icons-vue'

const stats = ref({
    totalShips: 0,
    availableShips: 0,
    charteredShips: 0,
    maintenanceShips: 0,
    activeCharters: 0,
    pendingMaintenance: 0
})

const initChart = () => {
    const chartDom = document.getElementById('ship-pie-chart');
    if(!chartDom) return;
    
    const myChart = echarts.init(chartDom);
    const option = {
        title: { text: '船舶状态分布', left: 'center' },
        tooltip: { trigger: 'item' },
        legend: { bottom: '5%', left: 'center' },
        series: [
            {
                name: '数量',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: { show: false, position: 'center' },
                emphasis: {
                    label: { show: true, fontSize: 20, fontWeight: 'bold' }
                },
                data: [
                    { value: stats.value.availableShips, name: '空闲中', itemStyle: { color: '#67C23A' } },
                    { value: stats.value.charteredShips, name: '已租出', itemStyle: { color: '#E6A23C' } },
                    { value: stats.value.maintenanceShips, name: '维修中', itemStyle: { color: '#F56C6C' } }
                ]
            }
        ]
    };
    myChart.setOption(option);
}

const getStats = async () => {
    const res = await getDashboardStatsService()
    if(res.code === 0) {
        stats.value = res.data
        initChart()
    }
}

onMounted(() => {
    getStats()
})
</script>

<template>
    <div class="dashboard-container">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card shadow="hover" class="data-card blue-card">
                    <div class="card-content">
                        <div class="text">
                            <div class="label">船舶总数</div>
                            <div class="value">{{ stats.totalShips }}</div>
                        </div>
                        <el-icon class="icon"><Ship /></el-icon>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="data-card green-card">
                    <div class="card-content">
                        <div class="text">
                            <div class="label">空闲可用</div>
                            <div class="value">{{ stats.availableShips }}</div>
                        </div>
                        <el-icon class="icon"><DataBoard /></el-icon>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="data-card orange-card">
                    <div class="card-content">
                        <div class="text">
                            <div class="label">正在租赁</div>
                            <div class="value">{{ stats.activeCharters }}</div>
                        </div>
                        <el-icon class="icon"><Money /></el-icon>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" class="data-card red-card">
                    <div class="card-content">
                        <div class="text">
                            <div class="label">待维修</div>
                            <div class="value">{{ stats.pendingMaintenance }}</div>
                        </div>
                        <el-icon class="icon"><Tools /></el-icon>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="20" style="margin-top: 20px;">
            <el-col :span="12">
                <el-card shadow="hover">
                    <div id="ship-pie-chart" style="height: 350px;"></div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover" style="height: 390px;">
                    <template #header>
                        <div class="card-header">
                            <span>快捷入口</span>
                        </div>
                    </template>
                    <div class="quick-access">
                        <el-button type="primary" size="large" plain @click="$router.push('/ship')">🚢 管理船舶</el-button>
                        <el-button type="success" size="large" plain @click="$router.push('/charter')">📝 查看订单</el-button>
                        <el-button type="warning" size="large" plain @click="$router.push('/maintenance')">🔧 登记维修</el-button>
                        <el-button type="info" size="large" plain @click="$router.push('/category')">📂 分类管理</el-button>
                    </div>
                    <div class="welcome-text">
                        <h3>欢迎回来</h3>
                        <p>今天也是出海的好日子。目前系统运行平稳，所有数据已实时更新。</p>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped lang="scss">
.dashboard-container { padding: 10px; }
.data-card {
    border: none; color: #fff;
    .card-content {
        display: flex; justify-content: space-between; align-items: center;
        .text { .label { font-size: 14px; opacity: 0.9; } .value { font-size: 28px; font-weight: bold; margin-top: 5px; } }
        .icon { font-size: 48px; opacity: 0.8; }
    }
}
.blue-card { background: linear-gradient(135deg, #36d1dc, #5b86e5); }
.green-card { background: linear-gradient(135deg, #67c23a, #95d475); }
.orange-card { background: linear-gradient(135deg, #e6a23c, #f3d19e); }
.red-card { background: linear-gradient(135deg, #f56c6c, #f89898); }

.quick-access {
    display: flex; gap: 15px; flex-wrap: wrap; margin-bottom: 30px;
    .el-button { flex: 1; min-width: 120px; height: 60px; font-size: 16px; }
}
.welcome-text { background: #f4f4f5; padding: 20px; border-radius: 8px; color: #909399; h3 { color: #303133; margin-bottom: 10px; } }
</style>