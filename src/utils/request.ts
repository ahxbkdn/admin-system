import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
    baseURL: '/api', // 使用相对路径，通过Vite代理转发
    timeout: 10000, // 统一超时时间
    withCredentials: true, // 允许携带凭证
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        // 统一添加请求头，比如 token
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    (response) => {
        // 直接返回响应数据
        return response.data
    },
    (error) => {
        // 统一错误处理，不重复输出错误信息
        // 错误信息由各个页面的fetch函数处理
        return Promise.reject(error)
    }
)

export default request