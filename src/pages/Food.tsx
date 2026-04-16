import request from '../utils/request'

// 示例：获取用户列表
const fetchUserList = async () => {
  try {
    const res = await request.get('/api/users')
    console.log('用户列表：', res)
  } catch (err) {
    console.error('获取用户列表失败：', err)
  }
}

// 在组件中调用
const UserPage = () => {
  return <button onClick={fetchUserList}>获取用户</button>
}

export default UserPage