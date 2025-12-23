<script setup>
import { ref, onMounted, computed } from 'vue' // ✅ 1. 引入 computed
import { Edit, Delete, Plus, Search, Goods } from '@element-plus/icons-vue'
import { shipListService, shipAddService, shipUpdateService, shipDeleteService } from '@/api/ship.js'
import { shipCategoryListService } from '@/api/category.js'
import { charterShipService } from '@/api/charter.js'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTokenStore } from '@/stores/counter.js'

// --- 数据定义 ---
const shipList = ref([]) 
const total = ref(0)     
const loading = ref(false) 

const tokenStore = useTokenStore()

// ✅✅✅ 关键修改：使用 computed 包裹 headers
// 这样每次上传时，都会去 store 里拿最新的 token，防止刷新页面后 token 丢失
const uploadHeaders = computed(() => {
    return {
        'Authorization': tokenStore.token
    }
})

const searchModel = ref({
    pageNum: 1,
    pageSize: 5,
    name: '',       
    categoryId: '', 
    state: ''       
})

const categorys = ref([])

// --- 方法定义 ---
const handleUploadSuccess = (result) => {
    if (result.code === 0) {
        shipForm.value.imageUrl = result.data; 
        ElMessage.success('图片上传成功');
    } else {
        ElMessage.error(result.message || '上传失败');
    }
}
const handleUploadError = (error) => {
    // 如果是 401，提示去登录
    if (error.status === 401) {
        ElMessage.error('登录已过期，请重新登录');
    } else {
        ElMessage.error('上传失败，请检查网络');
    }
    console.error(error);
}

const getCategorys = async () => {
    let result = await shipCategoryListService();
    categorys.value = result.data; 
}

const getShipList = async () => {
    loading.value = true
    try {
        let result = await shipListService(searchModel.value);
        shipList.value = result.data.items;
        total.value = result.data.total;
    } finally {
        loading.value = false
    }
}

const onSearch = () => {
    searchModel.value.pageNum = 1; 
    getShipList();
}

const onReset = () => {
    searchModel.value.name = '';
    searchModel.value.categoryId = '';
    searchModel.value.state = '';
    onSearch();
}

const onCurrentChange = (page) => {
    searchModel.value.pageNum = page;
    getShipList();
}

// --- 弹窗逻辑 ---
const dialogVisible = ref(false)
const title = ref('')
const shipForm = ref({
    id: '',
    name: '',
    manufacturer: '',
    imoNum: '',
    categoryId: '',
    state: 'Available',
    imageUrl: '' 
})

const openAdd = () => {
    title.value = '添加船舶'
    dialogVisible.value = true
    shipForm.value = {
        name: '',
        manufacturer: '',
        imoNum: '',
        categoryId: '',
        state: 'Available',
        imageUrl: ''
    }
}

const openEdit = (row) => {
    title.value = '编辑船舶'
    dialogVisible.value = true
    shipForm.value = { ...row }
}

const submitForm = async () => {
    if (title.value === '添加船舶') {
        await shipAddService(shipForm.value);
        ElMessage.success('添加成功');
    } else {
        await shipUpdateService(shipForm.value);
        ElMessage.success('修改成功');
    }
    dialogVisible.value = false; 
    getShipList(); 
}

const onDelete = (row) => {
    ElMessageBox.confirm('确认删除该船舶吗?', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        await shipDeleteService(row.id);
        ElMessage.success('删除成功');
        getShipList();
    }).catch(() => {})
}

// --- 租借功能 ---
const onCharter = (row) => {
    ElMessageBox.confirm(
        `确认要租借【${row.name}】吗？`,
        '租船确认',
        {
            confirmButtonText: '立即租借',
            cancelButtonText: '取消',
            type: 'success',
        }
    ).then(async () => {
        await charterShipService(row.id);
        ElMessage.success('租借成功！');
        getShipList(); 
    }).catch(() => {})
}

onMounted(() => {
    getCategorys();
    getShipList();
})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>船舶管理</span>
        <div class="extra">
             <el-button type="primary" :icon="Plus" @click="openAdd">新增船舶</el-button>
        </div>
      </div>
    </template>

    <el-form inline>
      <el-form-item label="船名">
        <el-input v-model="searchModel.name" placeholder="请输入船名"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="searchModel.state" placeholder="请选择" style="width: 150px">
          <el-option label="空闲" value="Available"></el-option>
          <el-option label="已租出" value="Chartered"></el-option>
          <el-option label="维修中" value="Maintenance"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :icon="Search" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="shipList" style="width: 100%" v-loading="loading">
      <el-table-column label="船名" prop="name" width="150"></el-table-column>
      <el-table-column label="图片" width="100" align="center">
         <template #default="{ row }">
             <el-image v-if="row.imageUrl" :src="row.imageUrl" style="width: 50px; height: 50px; border-radius: 4px;" fit="cover" preview-teleported></el-image>
             <span v-else style="color:#ccc; font-size:12px">暂无</span>
         </template>
      </el-table-column>
      <el-table-column label="分类" prop="categoryName" width="120"></el-table-column>
      <el-table-column label="制造商" prop="manufacturer"></el-table-column>
      <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
              <el-tag v-if="row.state === 'Available'" type="success" effect="light">空闲</el-tag>
              <el-tag v-else-if="row.state === 'Chartered'" type="warning" effect="light">已租出</el-tag>
              <el-tag v-else type="danger" effect="light">维修中</el-tag>
          </template>
      </el-table-column>
      <el-table-column label="操作" width="240" align="center" fixed="right">
        <template #default="{ row }">
          <div style="display: flex; justify-content: center; align-items: center; gap: 8px;">
              <el-button 
                v-if="row.state === 'Available'"
                type="success" 
                plain 
                size="small"
                :icon="Goods"
                @click="onCharter(row)"
              >
                租借
              </el-button>
              <el-button :icon="Edit" circle plain type="primary" size="small" @click="openEdit(row)"></el-button>
              <el-button :icon="Delete" circle plain type="danger" size="small" @click="onDelete(row)"></el-button>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty description="暂无数据" />
      </template>
    </el-table>

    <el-pagination
      v-model:current-page="searchModel.pageNum"
      v-model:page-size="searchModel.pageSize"
      :page-sizes="[5, 10, 20]"
      layout="jumper, total, sizes, prev, pager, next"
      :total="total"
      @current-change="onCurrentChange"
      @size-change="onSearch"
      style="margin-top: 20px; justify-content: flex-end"
    />

    <el-dialog v-model="dialogVisible" :title="title" width="30%">
        <el-form :model="shipForm" label-width="100px" style="padding-right: 30px">
            <el-form-item label="船舶名称">
                <el-input v-model="shipForm.name" placeholder="请输入名称"></el-input>
            </el-form-item>
            <el-form-item label="船舶分类">
                <el-select v-model="shipForm.categoryId" placeholder="请选择分类" style="width:100%">
                    <el-option v-for="c in categorys" :key="c.id" :label="c.categoryName" :value="c.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="制造商">
                <el-input v-model="shipForm.manufacturer" placeholder="请输入制造商"></el-input>
            </el-form-item>
            <el-form-item label="IMO编号">
                <el-input v-model="shipForm.imoNum" placeholder="IMO-xxxx"></el-input>
            </el-form-item>
            <el-form-item label="当前状态">
                 <el-radio-group v-model="shipForm.state">
                    <el-radio label="Available">空闲</el-radio>
                    <el-radio label="Maintenance">维修</el-radio>
                 </el-radio-group>
            </el-form-item>
            
            <el-form-item label="船舶图片">
                <el-upload
                    class="avatar-uploader"
                    action="/api/upload"
                    :show-file-list="false"
                    :on-success="handleUploadSuccess"
                    :on-error="handleUploadError"
                    :headers="uploadHeaders" 
                    name="file"
                >
                    <img v-if="shipForm.imageUrl" :src="shipForm.imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </el-form-item>

        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitForm">确认</el-button>
            </span>
        </template>
    </el-dialog>

  </el-card>
</template>

<style scoped lang="scss">
.page-container {
    min-height: 100%;
    box-sizing: border-box;
}
.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.avatar-uploader {
    :deep() {
        .avatar {
            width: 120px;
            height: 120px;
            display: block;
            object-fit: cover;
        }

        .el-upload {
            border: 1px dashed var(--el-border-color);
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);
            width: 120px;
            height: 120px;
        }

        .el-upload:hover {
            border-color: var(--el-color-primary);
        }

        .el-icon.avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 120px;
            height: 120px;
            text-align: center;
            line-height: 120px;
        }
    }
}
</style>