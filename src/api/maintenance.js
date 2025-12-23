import request from '@/utils/request.js'

// 获取列表
export const maintenanceListService = () => {
    return request.get('/maintenance')
}

// 新增维修记录
export const maintenanceAddService = (data) => {
    return request.post('/maintenance', data)
}

// 完成维修
export const maintenanceCompleteService = (id) => {
    return request.put(`/maintenance/${id}/complete`)
}