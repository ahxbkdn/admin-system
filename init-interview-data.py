import requests

# 初始化面试题数据
def init_interview_data():
    base_url = 'http://localhost:8084/api/interview'
    
    print("初始化面试题数据...")
    
    # 1. 添加分类
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
    
    category_ids = []
    for category in categories:
        response = requests.post(f'{base_url}/categories', json=category)
        if response.status_code == 200:
            category_id = response.json().get('data', {}).get('id')
            category_ids.append(category_id)
            print(f"添加分类成功: {category['name']} (ID: {category_id})")
        else:
            print(f"添加分类失败: {category['name']}")
    
    # 2. 添加面试题
    questions = [
        # 前端开发面试题
        {
            "categoryId": category_ids[0],
            "title": "React中的生命周期有哪些？",
            "tags": ["React", "前端", "生命周期"],
            "difficulty": 2,
            "content": "请详细描述React组件的生命周期方法及其执行顺序。",
            "status": 1
        },
        {
            "categoryId": category_ids[0],
            "title": "什么是虚拟DOM？",
            "tags": ["前端", "DOM", "性能优化"],
            "difficulty": 1,
            "content": "请解释虚拟DOM的概念及其在前端框架中的作用。",
            "status": 1
        },
        {
            "categoryId": category_ids[0],
            "title": "CSS盒模型是什么？",
            "tags": ["CSS", "前端"],
            "difficulty": 1,
            "content": "请详细解释CSS盒模型的组成部分及其工作原理。",
            "status": 1
        },
        # 后端开发面试题
        {
            "categoryId": category_ids[1],
            "title": "什么是RESTful API？",
            "tags": ["后端", "API", "REST"],
            "difficulty": 1,
            "content": "请解释RESTful API的设计原则和特点。",
            "status": 1
        },
        {
            "categoryId": category_ids[1],
            "title": "数据库索引的作用是什么？",
            "tags": ["数据库", "后端", "性能优化"],
            "difficulty": 2,
            "content": "请详细解释数据库索引的工作原理及其优化策略。",
            "status": 1
        },
        {
            "categoryId": category_ids[1],
            "title": "什么是微服务架构？",
            "tags": ["后端", "架构", "微服务"],
            "difficulty": 3,
            "content": "请解释微服务架构的概念、优势和挑战。",
            "status": 1
        },
        # 移动端开发面试题
        {
            "categoryId": category_ids[2],
            "title": "iOS中的内存管理机制是什么？",
            "tags": ["iOS", "移动端", "内存管理"],
            "difficulty": 3,
            "content": "请详细说明iOS中的ARC机制及其工作原理。",
            "status": 1
        },
        {
            "categoryId": category_ids[2],
            "title": "Android中的Activity生命周期是什么？",
            "tags": ["Android", "移动端", "生命周期"],
            "difficulty": 2,
            "content": "请详细描述Android中Activity的生命周期方法及其执行顺序。",
            "status": 1
        }
    ]
    
    for question in questions:
        response = requests.post(f'{base_url}/questions', json=question)
        if response.status_code == 200:
            question_id = response.json().get('data', {}).get('id')
            print(f"添加面试题成功: {question['title']} (ID: {question_id})")
        else:
            print(f"添加面试题失败: {question['title']}")
    
    # 3. 验证数据
    print("\n验证数据...")
    response = requests.get(f'{base_url}/categories')
    categories_count = len(response.json().get('data', []))
    print(f"分类数量: {categories_count}")
    
    response = requests.get(f'{base_url}/questions')
    questions_count = len(response.json().get('data', []))
    print(f"面试题数量: {questions_count}")
    
    print("\n数据初始化完成！")

if __name__ == '__main__':
    try:
        init_interview_data()
    except Exception as e:
        print(f"初始化失败: {e}")
