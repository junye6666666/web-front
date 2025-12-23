import request from '@/utils/request.js'

// 1. 获取船舶列表 (带搜索条件)
export const shipListService = (params) => {
    return request.get('/ship', { params })
}

// 2. 新增船舶
export const shipAddService = (shipData) => {
    return request.post('/ship', shipData)
}

// 3. 修改船舶
export const shipUpdateService = (shipData) => {
    return request.put('/ship', shipData)
}

// 4. 删除船舶
export const shipDeleteService = (id) => {
    return request.delete('/ship', { params: { id } })
}