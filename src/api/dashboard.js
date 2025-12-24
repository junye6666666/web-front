import request from '@/utils/request.js'

export const getDashboardStatsService = () => {
    return request.get('/dashboard/stats')
}