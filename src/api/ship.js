import request from '@/utils/request'

// 1. 获取船舶列表 (带搜索条件)
export const shipListService = (params) => {
    return request.get('/ships', { params: params })
}

// 2. 新增船舶
export const shipAddService = (shipData) => {
    return request.post('/ships', shipData)
}

// 3. 修改船舶
export const shipUpdateService = (shipData) => {
    return request.put('/ships', shipData)
}

// 4. 删除船舶
export const shipDeleteService = (id) => {
    return request.delete('/ships', { params: { id } })
}