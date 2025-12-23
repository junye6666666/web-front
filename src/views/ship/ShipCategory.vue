<script setup>
import { Edit, Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { shipCategoryListService, shipCategoryAddService, shipCategoryUpdateService, shipCategoryDeleteService } from '@/api/category.js'
import { ElMessage, ElMessageBox } from 'element-plus'

// --- 数据定义 ---
const categoryList = ref([]) // 表格数据
const title = ref('') // 弹窗标题
const dialogVisible = ref(false) // 弹窗显示控制

// 表单数据模型
const categoryModel = ref({
    id: '',
    categoryName: '',
    categoryAlias: ''
})

// 表单校验规则
const rules = {
    categoryName: [
        { required: true, message: '请输入分类名称', trigger: 'blur' },
    ],
    categoryAlias: [
        { required: true, message: '请输入分类别名', trigger: 'blur' },
    ]
}

// --- 方法定义 ---

// 1. 获取列表
const getCategoryList = async () => {
    let result = await shipCategoryListService();
    categoryList.value = result.data;
}
// 页面加载时自动调用
getCategoryList();

// 2. 显示新增弹窗
const showAddDialog = () => {
    dialogVisible.value = true;
    title.value = '添加分类';
    // 重置表单
    categoryModel.value = {
        id: '',
        categoryName: '',
        categoryAlias: ''
    }
}

// 3. 显示编辑弹窗
const showEditDialog = (row) => {
    dialogVisible.value = true;
    title.value = '编辑分类';
    // 回显数据 (复制一份，防止直接修改表格)
    categoryModel.value = {
        id: row.id,
        categoryName: row.categoryName,
        categoryAlias: row.categoryAlias
    }
}

// 4. 提交表单 (新增或修改)
const submitCategory = async () => {
    // 根据是否有 id 判断是新增还是修改
    if (categoryModel.value.id) {
        // 修改
        await shipCategoryUpdateService(categoryModel.value);
        ElMessage.success('修改成功')
    } else {
        // 新增
        await shipCategoryAddService(categoryModel.value);
        ElMessage.success('添加成功')
    }
    // 关闭弹窗并刷新列表
    dialogVisible.value = false;
    getCategoryList();
}

// 5. 删除分类
const deleteCategory = (row) => {
    ElMessageBox.confirm(
        '你确认要删除该分类信息吗？',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            // 用户点击了确认
            await shipCategoryDeleteService(row.id);
            ElMessage.success('删除成功');
            getCategoryList();
        })
        .catch(() => {
            // 用户点击了取消
            ElMessage.info('已取消删除')
        })
}
</script>

<template>
    <el-card class="page-container">
        <template #header>
            <div class="header">
                <span>船舶分类</span>
                <div class="extra">
                    <el-button type="primary" @click="showAddDialog">添加分类</el-button>
                </div>
            </div>
        </template>
        
        <el-table :data="categoryList" style="width: 100%">
            <el-table-column label="序号" width="100" type="index"> </el-table-column>
            <el-table-column label="分类名称" prop="categoryName"></el-table-column>
            <el-table-column label="分类别名" prop="categoryAlias"></el-table-column>
            <el-table-column label="操作" width="100">
                <template #default="{ row }">
                    <el-button :icon="Edit" circle plain type="primary" @click="showEditDialog(row)"></el-button>
                    <el-button :icon="Delete" circle plain type="danger" @click="deleteCategory(row)"></el-button>
                </template>
            </el-table-column>
            <template #empty>
                <el-empty description="暂无数据" />
            </template>
        </el-table>

        <el-dialog v-model="dialogVisible" :title="title" width="30%">
            <el-form :model="categoryModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                <el-form-item label="分类名称" prop="categoryName">
                    <el-input v-model="categoryModel.categoryName" minlength="1" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="分类别名" prop="categoryAlias">
                    <el-input v-model="categoryModel.categoryAlias" minlength="1" maxlength="15"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitCategory"> 确认 </el-button>
                </span>
            </template>
        </el-dialog>
    </el-card>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>