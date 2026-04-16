import requests

# 添加分类数据
def add_categories():
    base_url = 'http://localhost:8084/api/interview'
    
    print("添加分类数据...")
    
    categories = [
        {
            "name": "前端开发",
            "description": "前端开发相关面试题",
            "iconUrl": "https://example.com/frontend.png",
            "sort": 1,
            "status": 1
        },
        {
            "name": "后端开发",
            "description": "后端开发相关面试题",
            "iconUrl": "https://example.com/backend.png",
            "sort": 2,
            "status": 1
        },
        {
            "name": "移动端开发",
            "description": "移动端开发相关面试题",
            "iconUrl": "https://example.com/mobile.png",
            "sort": 3,
            "status": 1
        }
    ]
    
    for category in categories:
        response = requests.post(f'{base_url}/categories', json=category)
        if response.status_code == 200:
            print(f"添加分类成功: {category['name']}")
        else:
            print(f"添加分类失败: {category['name']}")
    
    # 验证分类是否添加成功
    response = requests.get(f'{base_url}/categories')
    categories_count = len(response.json().get('data', []))
    print(f"\n分类添加完成，当前分类数量: {categories_count}")

if __name__ == '__main__':
    add_categories()
