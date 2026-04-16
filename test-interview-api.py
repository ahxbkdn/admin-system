import requests

# 测试面试题分类接口
def test_category_api():
    base_url = 'http://localhost:8084/api/interview'
    
    print("测试面试题分类接口...")
    
    # 测试添加分类
    print("\n1. 测试添加分类")
    category_data = {
        "name": "前端开发",
        "description": "前端开发相关面试题",
        "iconUrl": "https://example.com/icon1.png",
        "sort": 1,
        "status": 1
    }
    response = requests.post(f'{base_url}/categories', json=category_data)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    category_id = response.json().get('data', {}).get('id')
    
    # 测试获取分类列表
    print("\n2. 测试获取分类列表")
    response = requests.get(f'{base_url}/categories')
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    
    # 测试更新分类
    print("\n3. 测试更新分类")
    update_data = {
        "name": "前端开发（更新）",
        "description": "前端开发相关面试题（更新）",
        "sort": 2
    }
    response = requests.put(f'{base_url}/categories/{category_id}', json=update_data)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    
    return category_id

# 测试面试题接口
def test_question_api(category_id):
    base_url = 'http://localhost:8084/api/interview'
    
    print("\n\n测试面试题接口...")
    
    # 测试添加面试题
    print("\n1. 测试添加面试题")
    question_data = {
        "categoryId": category_id,
        "title": "React中的生命周期有哪些？",
        "tags": ["React", "前端", "生命周期"],
        "difficulty": 2,
        "content": "请详细描述React组件的生命周期方法及其执行顺序。",
        "status": 1
    }
    response = requests.post(f'{base_url}/questions', json=question_data)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    question_id = response.json().get('data', {}).get('id')
    
    # 测试获取面试题列表
    print("\n2. 测试获取面试题列表")
    response = requests.get(f'{base_url}/questions')
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    
    # 测试按分类获取面试题
    print("\n3. 测试按分类获取面试题")
    response = requests.get(f'{base_url}/questions?categoryId={category_id}')
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    
    # 测试获取面试题详情
    print("\n4. 测试获取面试题详情")
    response = requests.get(f'{base_url}/questions/{question_id}')
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    
    # 测试更新面试题
    print("\n5. 测试更新面试题")
    update_data = {
        "title": "React中的生命周期有哪些？（更新）",
        "content": "请详细描述React组件的生命周期方法及其执行顺序。（更新）"
    }
    response = requests.put(f'{base_url}/questions/{question_id}', json=update_data)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    
    # 测试删除面试题
    print("\n6. 测试删除面试题")
    response = requests.delete(f'{base_url}/questions/{question_id}')
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    
    # 测试删除分类
    print("\n7. 测试删除分类")
    response = requests.delete(f'{base_url}/categories/{category_id}')
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")

if __name__ == '__main__':
    try:
        category_id = test_category_api()
        test_question_api(category_id)
        print("\n\n所有测试完成！")
    except Exception as e:
        print(f"测试失败: {e}")
