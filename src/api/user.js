import request from '@/utils/request'

// 注册 (注意：之前测试说你注册用的是 x-www-form-urlencoded)
export const userRegisterService = (registerData) => {
    // 使用 URLSearchParams 模拟 x-www-form-urlencoded
    const params = new URLSearchParams();
    for(let key in registerData){
        params.append(key, registerData[key]);
    }
    return request.post('/auth/register', params);
}

// 登录 (也是 x-www-form-urlencoded，根据你之前的截图)
export const userLoginService = (loginData) => {
    const params = new URLSearchParams();
    for(let key in loginData){
        params.append(key, loginData[key]);
    }
    return request.post('/auth/login', params);
}