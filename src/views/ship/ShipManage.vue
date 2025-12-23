<script setup>
import { ref, onMounted } from 'vue'
import { Edit, Delete, Plus, Search } from '@element-plus/icons-vue'
import { shipListService, shipAddService, shipUpdateService, shipDeleteService } from '@/api/ship.js'
// ✅ 关键修复点：这里必须引用 shipCategoryListService
import { shipCategoryListService } from '@/api/category.js'
import { ElMessage, ElMessageBox } from 'element-plus'

// --- 1. 数据定义 ---
const shipList = ref([]) // 表格数据
const total = ref(0)     // 总条数
const loading = ref(false) // 加载状态

// 搜索条件模型
const searchModel = ref({
    pageNum: 1,
    pageSize: 5,
    name: '',       // 船名
    categoryId: '', // 分类ID
    state: ''       // 状态
})

// 分类下拉框数据
const categorys = ref([])

// --- 2. 核心功能函数 ---

// 获取分类列表 (用于下拉框)
const getCategorys = async () => {
    // ✅ 修复点：调用正确的方法名
    let result = await shipCategoryListService();
    // 后端返回的是列表数组，直接赋值
    categorys.value = result.data; 
}

// 获取船舶列表
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

// 搜索按钮
const onSearch = () => {
    searchModel.value.pageNum = 1; // 搜索时重置到第一页
    getShipList();
}

// 重置按钮
const onReset = () => {
    searchModel.value.name = '';
    searchModel.value.categoryId = '';
    searchModel.value.state = '';
    onSearch();
}

// 翻页处理
const onCurrentChange = (page) => {
    searchModel.value.pageNum = page;
    getShipList();
}

// --- 3. 新增/编辑 功能 ---
const dialogVisible = ref(false) // 控制弹窗显示
const title = ref('') // 弹窗标题
const shipForm = ref({ // 表单数据模型
    id: '',
    name: '',
    manufacturer: '',
    imoNum: '',
    categoryId: '',
    state: 'Available',
    imageUrl: ''
})

// 打开新增弹窗
const openAdd = () => {
    title.value = '添加船舶'
    dialogVisible.value = true
    // 清空表单
    shipForm.value = {
        name: '',
        manufacturer: '',
        imoNum: '',
        categoryId: '',
        state: 'Available',
        imageUrl: ''
    }
}

// 打开编辑弹窗 (回显数据)
const openEdit = (row) => {
    title.value = '编辑船舶'
    dialogVisible.value = true
    // 复制当前行数据到表单
    shipForm.value = { ...row }
}

// 提交表单 (新增或修改)
const submitForm = async () => {
    if (title.value === '添加船舶') {
        await shipAddService(shipForm.value);
        ElMessage.success('添加成功');
    } else {
        await shipUpdateService(shipForm.value);
        ElMessage.success('修改成功');
    }
    dialogVisible.value = false; // 关弹窗
    getShipList(); // 刷新列表
}

// --- 4. 删除功能 ---
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

// 页面加载时执行
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
        <el-input v-model="searchModel.name" placeholder="请输入船名/制造商"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="searchModel.categoryId" placeholder="请选择" style="width: 150px">
          <el-option 
            v-for="c in categorys" 
            :key="c.id" 
            :label="c.categoryName" 
            :value="c.id">
          </el-option>
        </el-select>
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
      <el-table-column label="ID" prop="id" width="60"></el-table-column>
      <el-table-column label="船名" prop="name"></el-table-column>
      <el-table-column label="图片" width="100">
         <template #default="{ row }">
             <el-image v-if="row.imageUrl" :src="row.imageUrl" style="width: 50px; height: 50px" fit="cover" preview-teleported></el-image>
             <span v-else>无图</span>
         </template>
      </el-table-column>
      <el-table-column label="分类" prop="categoryName"></el-table-column>
      <el-table-column label="制造商" prop="manufacturer"></el-table-column>
      <el-table-column label="状态">
          <template #default="{ row }">
              <el-tag v-if="row.state === 'Available'" type="success">空闲</el-tag>
              <el-tag v-else-if="row.state === 'Chartered'" type="warning">已租出</el-tag>
              <el-tag v-else type="danger">维修中</el-tag>
          </template>
      </el-table-column>
      
      <el-table-column label="操作" width="150">
        <template #default="{ row }">
          <el-button :icon="Edit" circle plain type="primary" @click="openEdit(row)"></el-button>
          <el-button :icon="Delete" circle plain type="danger" @click="onDelete(row)"></el-button>
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
            <el-form-item label="图片链接">
                <el-input v-model="shipForm.imageUrl" placeholder="http://..."></el-input>
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
</style>