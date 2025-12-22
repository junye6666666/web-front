import request from '@/utils/request'

// 获取分类列表 (这里我们不需要分页，假设后端有一个查所有的接口，或者我们取第一页查100个)
export const categoryListService = () => {
    // 如果后端没有专门的“查所有”接口，我们就查第一页，给个大点的 pageSize
    return request.get('/ship-category', { params: { pageNum: 1, pageSize: 100 } })
}                                                                                                                                                                                                                                                                                                                    