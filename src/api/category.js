import request from '@/utils/request.js'

// 1. 获取分类列表 (统一命名为 shipCategoryListService)
export const shipCategoryListService = () => {
    return request.get('/ship-category')
}

// 2. 新增分类
export const shipCategoryAddService = (categoryData) => {
    return request.post('/ship-category', categoryData)
}

// 3. 修改分类
export const shipCategoryUpdateService = (categoryData) => {
    return request.put('/ship-category', categoryData)
}

// 4. 删除分类
export const shipCategoryDeleteService = (id) => {
    return request.delete('/ship-category', { params: { id } })
}