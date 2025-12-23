import request from '@/utils/request.js'

// 1. 注册
export const userRegisterService = (registerData) => {
    const params = new URLSearchParams()
    for (let key in registerData) {
        params.append(key, registerData[key])
    }
    return request.post('/auth/register', params)
}

// 2. 登录
export const userLoginService = (loginData) => {
    const params = new URLSearchParams()
    for (let key in loginData) {
        params.append(key, loginData[key])
    }
    return request.post('/auth/login', params)
}

// 3. 获取个人信息
export const userInfoService = () => {
    return request.get('/user/me')
}

// 4. 修改个人信息
export const userInfoUpdateService = (userInfoData) => {
    return request.put('/user', userInfoData)
}

// 5. ✅ 修改头像 (核心业务：调用 UserController 更新数据库)
export const userAvatarUpdateService = (avatarUrl) => {
    // 根据你的 UserController，参数是 @RequestParam String avatarUrl
    return request.patch('/user/avatar', null, {
        params: {
            avatarUrl
        }
    })
}

// 6. 修改密码
export const userPasswordUpdateService = (pwdData) => {
    return request.patch('/user/password', pwdData)
}