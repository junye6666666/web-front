import request from '@/utils/request.js'

// 1. 获取租赁记录列表
export const charterListService = (params) => {
    return request.get('/charter', { params })
}

// 2. ✅✅✅ 租船接口 (必须有这个)
export const charterShipService = (shipId) => {
    // 注意：这里是 POST 请求，shipId 放在 params 里传给后端
    return request.post('/charter', null, { params: { shipId } })
}

// 3. 归还船舶
export const returnShipService = (recordId) => {
    return request.post('/charter/return', null, { params: { recordId } })
}