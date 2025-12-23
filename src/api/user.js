import request from '@/utils/request.js'

// 1. 注册
export const userRegisterService = (registerData) => {
    const params = new URLSearchParams()
    for (let key in registerData) {
        params.append(key, registerData[key])
    }
    return request.post('/auth/register', params)
}

// 2. ✅✅✅ 登录接口 (关键修改)
export const userLoginService = (loginData) => {
    const params = new URLSearchParams()
    // 遍历 loginData 对象，把 username, password, uuid, code 全部放进去
    for (let key in loginData) {
        params.append(key, loginData[key])
    }
    return request.post('/auth/login', params)
}

// 3. 获取验证码
export const getCaptchaService = () => {
    return request.get('/auth/captcha')
}

// 4. 获取个人信息
export const userInfoService = () => {
    return request.get('/user/me')
}

// 5. 修改个人信息
export const userInfoUpdateService = (userInfoData) => {
    return request.put('/user', userInfoData)
}

// 6. 修改头像
export const userAvatarUpdateService = (avatarUrl) => {
    return request.patch('/user/avatar', null, {
        params: {
            avatarUrl
        }
    })
}

// 7. 修改密码
export const userPasswordUpdateService = (pwdData) => {
    return request.patch('/user/password', pwdData)
}