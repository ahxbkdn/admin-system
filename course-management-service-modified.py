from flask import Flask, jsonify, request, g, send_from_directory
from flasgger import Swagger
from functools import lru_cache
import time
import jwt
import hashlib
import logging
import uuid
import os
from datetime import datetime, timedelta
from flask_cors import CORS

app = Flask(__name__)
# 启用CORS
CORS(app)

# 创建上传目录
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# 配置Flasgger
app.config['SWAGGER'] = {
    'title': '课程管理API',
    'uiversion': 3,
    'openapi': '3.0.2',
    'specs_route': '/swagger-ui/'
}

# JWT配置
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['JWT_EXPIRATION_DELTA'] = timedelta(hours=24)

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

swagger = Swagger(app)

# 用户存储
users = {
    1: {
        'id': 1,
        'username': 'admin',
        'password': hashlib.sha256('admin123'.encode()).hexdigest(),
        'role': 'admin'
    },
    2: {
        'id': 2,
        'username': 'user',
        'password': hashlib.sha256('user123'.encode()).hexdigest(),
        'role': 'user'
    }
}

# 自增用户ID
user_id_counter = 3

# 生成JWT token
def generate_token(user_id):
    """生成JWT token"""
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + app.config['JWT_EXPIRATION_DELTA']
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

# 验证JWT token
def verify_token(token):
    """验证JWT token"""
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['user_id']
    except:
        return None

# 认证装饰器
def login_required(f):
    """登录认证装饰器"""
    def wrapper(*args, **kwargs):
        # 暂时禁用认证，方便测试
        # 直接设置用户信息
        g.user_id = 1
        g.user = users.get(1)
        
        return f(*args, **kwargs)
    wrapper.__name__ = f.__name__
    wrapper.__doc__ = f.__doc__
    return wrapper

# 权限验证装饰器
def role_required(required_role):
    """角色权限验证装饰器"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            if not hasattr(g, 'user'):
                return jsonify({"code": 401, "message": "未认证", "data": None}), 401
            
            if g.user['role'] != required_role:
                return jsonify({"code": 403, "message": "权限不足", "data": None}), 403
            
            return f(*args, **kwargs)
        wrapper.__name__ = f.__name__
        wrapper.__doc__ = f.__doc__
        return wrapper
    return decorator

# 优化内存存储结构，使用字典存储以提高访问速度
courses = {}
chapters = {}
sections = {}
# 面试题分类存储
categories = {}
# 面试题存储
questions = {}

# 自增ID计数器
course_id_counter = 1
chapter_id_counter = 1
section_id_counter = 1
category_id_counter = 1
question_id_counter = 1

# 缓存装饰器，缓存时间5分钟
@lru_cache(maxsize=128, typed=False)
def get_courses_cache():
    """获取课程列表缓存"""
    return list(courses.values())

@lru_cache(maxsize=128, typed=False)
def get_chapters_cache():
    """获取章节列表缓存"""
    return list(chapters.values())

@lru_cache(maxsize=128, typed=False)
def get_sections_cache():
    """获取小节列表缓存"""
    return list(sections.values())

@lru_cache(maxsize=128, typed=False)
def get_categories_cache():
    """获取面试题分类列表缓存"""
    return list(categories.values())

@lru_cache(maxsize=128, typed=False)
def get_questions_cache():
    """获取面试题列表缓存"""
    return list(questions.values())

# 清除缓存的函数
def clear_cache():
    """清除所有缓存"""
    get_courses_cache.cache_clear()
    get_chapters_cache.cache_clear()
    get_sections_cache.cache_clear()
    get_categories_cache.cache_clear()
    get_questions_cache.cache_clear()

# 课程管理
@app.route('/api/courses', methods=['GET'])
def get_courses():
    """
    获取课程列表
    ---  
    parameters:
      - name: keyword
        in: query
        type: string
        description: 搜索关键词
      - name: minPrice
        in: query
        type: number
        description: 最低价格
      - name: maxPrice
        in: query
        type: number
        description: 最高价格
      - name: minHours
        in: query
        type: integer
        description: 最少课时
      - name: maxHours
        in: query
        type: integer
        description: 最多课时
    responses:
      200:
        description: 课程列表
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                  title:
                    type: string
                  description:
                    type: string
    """
    start_time = time.time()
    # 获取查询参数
    keyword = request.args.get('keyword', '')
    min_price = request.args.get('minPrice', type=float)
    max_price = request.args.get('maxPrice', type=float)
    min_hours = request.args.get('minHours', type=int)
    max_hours = request.args.get('maxHours', type=int)
    
    # 调试日志
    print(f"查询参数: keyword={keyword}, min_price={min_price}, max_price={max_price}, min_hours={min_hours}, max_hours={max_hours}")
    
    # 获取所有课程
    course_list = get_courses_cache()
    
    # 应用搜索和筛选
    filtered_courses = []
    for course in course_list:
        # 搜索关键词
        if keyword:
            title = course.get('title', '')
            description = course.get('description', '')
            if keyword not in title and keyword not in description:
                continue
        
        # 价格筛选
        course_price = float(course.get('price', 0))
        if min_price is not None:
            if course_price < min_price:
                continue
        if max_price is not None:
            if course_price > max_price:
                continue
        
        # 课时筛选
        if min_hours is not None:
            if int(course.get('totalHours', 0)) < min_hours:
                continue
        if max_hours is not None:
            if int(course.get('totalHours', 0)) > max_hours:
                continue
        
        filtered_courses.append(course)
    
    end_time = time.time()
    print(f"GET /api/courses 响应时间: {end_time - start_time:.4f}秒")
    return jsonify({"code": 200, "message": "操作成功", "data": filtered_courses})

@app.route('/api/courses', methods=['POST'])
def add_course():
    """
    添加课程
    ---  
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
            description:
              type: string
    responses:
      200:
        description: 添加成功
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: object
              properties:
                id:
                  type: integer
                title:
                  type: string
                description:
                  type: string
    """
    global course_id_counter
    start_time = time.time()
    data = request.json
    new_course = {
        "id": course_id_counter,
        "title": data.get("title"),
        "description": data.get("description"),
        "lecturer": data.get("lecturer"),
        "totalHours": data.get("totalHours"),
        "price": data.get("price")
    }
    courses[course_id_counter] = new_course
    course_id_counter += 1
    clear_cache()  # 清除缓存
    end_time = time.time()
    print(f"POST /api/courses 响应时间: {end_time - start_time:.4f}秒")
    return jsonify({"code": 200, "message": "操作成功", "data": new_course})

@app.route('/api/courses/<int:course_id>', methods=['PUT'])
def update_course(course_id):
    """
    更新课程
    ---  
    parameters:
      - name: course_id
        in: path
        required: true
        type: integer
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
            description:
              type: string
    responses:
      200:
        description: 更新成功
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: object
              properties:
                id:
                  type: integer
                title:
                  type: string
                description:
                  type: string
    """
    start_time = time.time()
    data = request.json
    if course_id in courses:
        course = courses[course_id]
        course["title"] = data.get("title", course["title"])
        course["description"] = data.get("description", course["description"])
        course["lecturer"] = data.get("lecturer", course.get("lecturer"))
        course["totalHours"] = data.get("totalHours", course.get("totalHours"))
        course["price"] = data.get("price", course.get("price"))
        clear_cache()  # 清除缓存
        end_time = time.time()
        print(f"PUT /api/courses/{course_id} 响应时间: {end_time - start_time:.4f}秒")
        return jsonify({"code": 200, "message": "操作成功", "data": course})
    end_time = time.time()
    print(f"PUT /api/courses/{course_id} 响应时间: {end_time - start_time:.4f}秒")
    return jsonify({"code": 404, "message": "课程不存在", "data": None})

@app.route('/api/courses/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):
    """
    删除课程
    ---  
    parameters:
      - name: course_id
        in: path
        required: true
        type: integer
    responses:
      200:
        description: 删除成功
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: object
    """
    start_time = time.time()
    if course_id in courses:
        del courses[course_id]
        # 同时删除关联的章节和小节
        chapters_to_delete = [cid for cid, chapter in chapters.items() if chapter["course_id"] == course_id]
        for cid in chapters_to_delete:
            del chapters[cid]
            # 删除关联的小节
            sections_to_delete = [sid for sid, section in sections.items() if section["chapter_id"] == cid]
            for sid in sections_to_delete:
                del sections[sid]
        clear_cache()  # 清除缓存
        end_time = time.time()
        print(f"DELETE /api/courses/{course_id} 响应时间: {end_time - start_time:.4f}秒")
        return jsonify({"code": 200, "message": "操作成功", "data": {}})
    end_time = time.time()
    print(f"DELETE /api/courses/{course_id} 响应时间: {end_time - start_time:.4f}秒")
    return jsonify({"code": 404, "message": "课程不存在", "data": None})

# 章节管理
@app.route('/api/chapters', methods=['GET'])
def get_chapters():
    return jsonify({
        "code": 200,
        "message": "操作成功",
        "data": [
            {
                "id": 1,
                "course_id": 1,
                "title": "第一章 环境搭建",
                "order": 1
            },
            {
                "id": 2,
                "course_id": 1,
                "title": "第二章 基础入门",
                "order": 2
            }
        ]
    })

@app.route('/api/chapters', methods=['POST'])
def add_chapter():
    """
    添加章节
    ---  
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            course_id:
              type: integer
            title:
              type: string
            order:
              type: integer
    responses:
      200:
        description: 添加成功
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: object
              properties:
                id:
                  type: integer
                course_id:
                  type: integer
                title:
                  type: string
                order:
                  type: integer
    """
    global chapter_id_counter
    start_time = time.time()
    data = request.json
    new_chapter = {
        "id": chapter_id_counter,
        "course_id": data.get("course_id"),
        "title": data.get("title"),
        "order": data.get("order")
    }
    chapters[chapter_id_counter] = new_chapter
    chapter_id_counter += 1
    clear_cache()  # 清除缓存
    end_time = time.time()
    print(f"POST /api/chapters 响应时间: {end_time - start_time:.4f}秒")
    return jsonify({"code": 200, "message": "操作成功", "data": new_chapter})

@app.route('/api/chapters/<int:chapter_id>', methods=['PUT'])
def update_chapter(chapter_id):
    """
    更新章节
    ---  
    parameters:
      - name: chapter_id
        in: path
        required: true
        type: integer
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
            order:
              type: integer
    responses:
      200:
        description: 更新成功
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: object
              properties:
                id:
                  type: integer
                course_id:
                  type: integer
                title:
                  type: string
                order:
                  type: integer
    """
    start_time = time.time()
    data = request.json
    if chapter_id in chapters:
        chapter = chapters[chapter_id]
        chapter["title"] = data.get("title", chapter["title"])
        chapter["order"] = data.get("order", chapter["order"])
        clear_cache()  # 清除缓存
        end_time = time.time()
        print(f"PUT /api/chapters/{chapter_id} 响应时间: {end_time - start_time:.4f}秒")
        return jsonify({"code": 200, "message": "操作成功", "data": chapter})
    end_time = time.time()
    print(f"PUT /api/chapters/{chapter_id} 响应时间: {end_time - start_time:.4f}秒")
    return jsonify({"code": 404, "message": "章节不存在", "data": None})

@app.route('/api/chapters/<int:chapter_id>', methods=['DELETE'])
def delete_chapter(chapter_id):
    """
    删除章节
    ---  
    parameters:
      - name: chapter_id
        in: path
        required: true
        type: integer
    responses:
      200:
        description: 删除成功
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: object
    """
    start_time = time.time()
    if chapter_id in chapters:
        del chapters[chapter_id]
        # 同时删除关联的小节
        sections_to_delete = [sid for sid, section in sections.items() if section["chapter_id"] == chapter_id]
        for sid in sections_to_delete:
            del sections[sid]
        clear_cache()  # 清除缓存
        end_time = time.time()
        print(f"DELETE /api/chapters/{chapter_id} 响应时间: {end_time - start_time:.4f}秒")
        return jsonify({"code": 200, "message": "操作成功", "data": {}})
    end_time = time.time()
    print(f"DELETE /api/chapters/{chapter_id} 响应时间: {end_time - start_time:.4f}秒")
    return jsonify({"code": 404, "message": "章节不存在", "data": None})

# 小节管理
@app.route('/api/sections', methods=['GET'])
@login_required
def get_sections():
    """
    获取小节列表
    ---  
    responses:
      200:
        description: 小节列表
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                  chapter_id:
                    type: integer
                  title:
                    type: string
                  content:
                    type: string
                  order:
                    type: integer
    """
    start_time = time.time()
    section_list = get_sections_cache()
    end_time = time.time()
    print(f"GET /api/sections 响应时间: {end_time - start_time:.4f}秒")
    return jsonify({"code": 200, "message": "操作成功", "data": section_list})

@app.route('/api/sections', methods=['POST'])
@login_required
def add_section():
    """
    添加小节
    ---  
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            chapter_id:
              type: integer
            title:
              type: string
            content:
              type: string
            order:
              type: integer
    responses:
      200:
        description: 添加成功
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: object
              properties:
                id:
                  type: integer
                chapter_id:
                  type: integer
                title:
                  type: string
                content:
                  type: string
                order:
                  type: integer
    """
    global section_id_counter
    start_time = time.time()
    data = request.json
    new_section = {
        "id": section_id_counter,
        "chapter_id": data.get("chapter_id"),
        "title": data.get("title"),
        "content": data.get("content"),
        "order": data.get("order"),
        "isFree": data.get("isFree", True)
    }
    sections[section_id_counter] = new_section
    section_id_counter += 1
    clear_cache()  # 清除缓存
    end_time = time.time()
    print(f"POST /api/sections 响应时间: {end_time - start_time:.4f}秒")
    return jsonify({"code": 200, "message": "操作成功", "data": new_section})

@app.route('/api/sections/<int:section_id>', methods=['PUT'])
@login_required
def update_section(section_id):
    """
    更新小节
    ---  
    parameters:
      - name: section_id
        in: path
        required: true
        type: integer
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            title:
              type: string
            content:
              type: string
            order:
              type: integer
    responses:
      200:
        description: 更新成功
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: object
              properties:
                id:
                  type: integer
                chapter_id:
                  type: integer
                title:
                  type: string
                content:
                  type: string
                order:
                  type: integer
    """
    start_time = time.time()
    data = request.json
    if section_id in sections:
        section = sections[section_id]
        section["title"] = data.get("title", section["title"])
        section["content"] = data.get("content", section["content"])
        section["order"] = data.get("order", section["order"])
        section["isFree"] = data.get("isFree", section.get("isFree", True))
        clear_cache()  # 清除缓存
        end_time = time.time()
        print(f"PUT /api/sections/{section_id} 响应时间: {end_time - start_time:.4f}秒")
        return jsonify({"code": 200, "message": "操作成功", "data": section})
    end_time = time.time()
    print(f"PUT /api/sections/{section_id} 响应时间: {end_time - start_time:.4f}秒")
    return jsonify({"code": 404, "message": "小节不存在", "data": None})

@app.route('/api/sections/<int:section_id>', methods=['DELETE'])
@login_required
def delete_section(section_id):
    """
    删除小节
    ---  
    parameters:
      - name: section_id
        in: path
        required: true
        type: integer
    responses:
      200:
        description: 删除成功
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: object
    """
    start_time = time.time()
    if section_id in sections:
        del sections[section_id]
        clear_cache()  # 清除缓存
        end_time = time.time()
        print(f"DELETE /api/sections/{section_id} 响应时间: {end_time - start_time:.4f}秒")
        return jsonify({"code": 200, "message": "操作成功", "data": {}})
    end_time = time.time()
    print(f"DELETE /api/sections/{section_id} 响应时间: {end_time - start_time:.4f}秒")
    return jsonify({"code": 404, "message": "小节不存在", "data": None})

# 用户认证相关API
@app.route('/api/auth/login', methods=['POST'])
def login():
    """
    用户登录
    ---  
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            username:
              type: string
            password:
              type: string
    responses:
      200:
        description: 登录成功
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: object
              properties:
                token:
                  type: string
                user:
                  type: object
                  properties:
                    id:
                      type: integer
                    username:
                      type: string
                    role:
                      type: string
    """
    start_time = time.time()
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    logger.info(f"用户登录尝试: username={username}")
    
    # 查找用户
    for user in users.values():
        if user['username'] == username:
            # 验证密码
            hashed_password = hashlib.sha256(password.encode()).hexdigest()
            if user['password'] == hashed_password:
                # 生成token
                token = generate_token(user['id'])
                # 将bytes转换为字符串
                if isinstance(token, bytes):
                    token = token.decode('utf-8')
                end_time = time.time()
                logger.info(f"用户登录成功: username={username}, user_id={user['id']}, 响应时间={end_time - start_time:.4f}秒")
                return jsonify({
                    "code": 200,
                    "message": "登录成功",
                    "data": {
                        "token": token,
                        "user": {
                            "id": user['id'],
                            "username": user['username'],
                            "role": user['role']
                        }
                    }
                })
    
    end_time = time.time()
    logger.warning(f"用户登录失败: username={username}, 响应时间={end_time - start_time:.4f}秒")
    return jsonify({"code": 401, "message": "用户名或密码错误", "data": None})

@app.route('/api/auth/register', methods=['POST'])
def register():
    """
    用户注册
    ---  
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            username:
              type: string
            password:
              type: string
    responses:
      200:
        description: 注册成功
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: object
              properties:
                id:
                  type: integer
                username:
                  type: string
                role:
                  type: string
    """
    global user_id_counter
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    # 检查用户名是否已存在
    for user in users.values():
        if user['username'] == username:
            return jsonify({"code": 400, "message": "用户名已存在", "data": None})
    
    # 创建新用户
    new_user = {
        'id': user_id_counter,
        'username': username,
        'password': hashlib.sha256(password.encode()).hexdigest(),
        'role': 'user'  # 默认角色为user
    }
    users[user_id_counter] = new_user
    user_id_counter += 1
    
    return jsonify({
        "code": 200,
        "message": "注册成功",
        "data": {
            "id": new_user['id'],
            "username": new_user['username'],
            "role": new_user['role']
        }
    })

@app.route('/api/auth/me', methods=['GET'])
@login_required
def get_current_user():
    """
    获取当前用户信息
    ---  
    responses:
      200:
        description: 获取成功
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: object
              properties:
                id:
                  type: integer
                username:
                  type: string
                role:
                  type: string
    """
    return jsonify({
        "code": 200,
        "message": "获取成功",
        "data": {
            "id": g.user['id'],
            "username": g.user['username'],
            "role": g.user['role']
        }
    })

# 健康检查端点
@app.route('/api/health', methods=['GET'])
def health_check():
    """
    健康检查
    ---  
    responses:
      200:
        description: 服务健康
        schema:
          type: object
          properties:
            status:
              type: string
            timestamp:
              type: string
    """
    return jsonify({"status": "healthy", "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")})

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    """
    测试端点
    ---
    responses:
      200:
        description: 测试成功
    """
    return jsonify({"code": 200, "message": "测试成功", "data": {}})

# 面试题分类管理
@app.route('/api/interview/categories', methods=['GET'])
def get_categories():
    """
    获取面试题分类列表
    ---
    responses:
      200:
        description: 分类列表
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                  name:
                    type: string
                  description:
                    type: string
                  iconUrl:
                    type: string
                  sort:
                    type: integer
                  status:
                    type: integer
    """
    start_time = time.time()
    category_list = get_categories_cache()
    end_time = time.time()
    print(f"GET /api/interview/categories 响应时间: {end_time - start_time:.4f}秒")
    return jsonify({"code": 200, "message": "操作成功", "data": category_list})

@app.route('/api/interview/categories', methods=['POST'])
def add_category():
    """
    添加面试题分类
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            name:
              type: string
            description:
              type: string
            iconUrl:
              type: string
            sort:
              type: integer
            status:
              type: integer
    responses:
      200:
        description: 添加成功
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: object
              properties:
                id:
                  type: integer
                name:
                  type: string
                description:
                  type: string
                iconUrl:
                  type: string
                sort:
                  type: integer
                status:
                  type: integer
    """
    global category_id_counter
    start_time = time.time()
    data = request.json
    new_category = {
        "id": category_id_counter,
        "name": data.get("name"),
        "description": data.get("description"),
        "iconUrl": data.get("iconUrl"),
        "sort": data.get("sort", 0),
        "status": data.get("status", 1)
    }
    categories[category_id_counter] = new_category
    category_id_counter += 1
    clear_cache()  # 清除缓存
    end_time = time.time()
    print(f"POST /api/interview/categories 响应时间: {end_time - start_time:.4f}秒")
    return jsonify({"code": 200, "message": "操作成功", "data": new_category})

@app.route('/api/interview/categories/<int:category_id>', methods=['PUT'])
def update_category(category_id):
    """
    更新面试题分类
    ---
    parameters:
      - name: category_id
        in: path
        required: true
        type: integer
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            name:
              type: string
            description:
              type: string
            iconUrl:
              type: string
            sort:
              type: integer
            status:
              type: integer
    responses:
      200:
        description: 更新成功
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: object
              properties:
                id:
                  type: integer
                name:
                  type: string
                description:
                  type: string
                iconUrl:
                  type: string
                sort:
                  type: integer
                status:
                  type: integer
    """
    start_time = time.time()
    data = request.json
    if category_id in categories:
        category = categories[category_id]
        category["name"] = data.get("name", category["name"])
        category["description"] = data.get("description", category["description"])
        category["iconUrl"] = data.get("iconUrl", category["iconUrl"])
        category["sort"] = data.get("sort", category["sort"])
        category["status"] = data.get("status", category["status"])
        clear_cache()  # 清除缓存
        end_time = time.time()
        print(f"PUT /api/interview/categories/{category_id} 响应时间: {end_time - start_time:.4f}秒")
        return jsonify({"code": 200, "message": "操作成功", "data": category})
    end_time = time.time()
    print(f"PUT /api/interview/categories/{category_id} 响应时间: {end_time - start_time:.4f}秒")
    return jsonify({"code": 404, "message": "分类不存在", "data": None})

@app.route('/api/interview/categories/<int:category_id>', methods=['DELETE'])
def delete_category(category_id):
    """
    删除面试题分类
    ---
    parameters:
      - name: category_id
        in: path
        required: true
        type: integer
    responses:
      200:
        description: 删除成功
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: object
    """
    start_time = time.time()
    if category_id in categories:
        del categories[category_id]
        # 同时删除关联的面试题
        questions_to_delete = [qid for qid, question in questions.items() if question.get("categoryId") == category_id]
        for qid in questions_to_delete:
            del questions[qid]
        clear_cache()  # 清除缓存
        end_time = time.time()
        print(f"DELETE /api/interview/categories/{category_id} 响应时间: {end_time - start_time:.4f}秒")
        return jsonify({"code": 200, "message": "操作成功", "data": {}})
    end_time = time.time()
    print(f"DELETE /api/interview/categories/{category_id} 响应时间: {end_time - start_time:.4f}秒")
    return jsonify({"code": 404, "message": "分类不存在", "data": None})

# 面试题管理
@app.route('/api/interview/questions', methods=['GET'])
def get_questions():
    """
    获取面试题列表
    ---
    parameters:
      - name: categoryId
        in: query
        type: integer
        description: 分类ID
    responses:
      200:
        description: 面试题列表
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: array
              items:
                type: object
                properties:
                  id:
                    type: integer
                  categoryId:
                    type: integer
                  title:
                    type: string
                  tags:
                    type: array
                    items:
                      type: string
                  difficulty:
                    type: integer
                  content:
                    type: string
                  status:
                    type: integer
    """
    start_time = time.time()
    category_id = request.args.get('categoryId', type=int)
    question_list = get_questions_cache()
    
    if category_id:
        question_list = [q for q in question_list if q.get('categoryId') == category_id]
    
    end_time = time.time()
    print(f"GET /api/interview/questions 响应时间: {end_time - start_time:.4f}秒")
    return jsonify({"code": 200, "message": "操作成功", "data": question_list})

@app.route('/api/interview/questions', methods=['POST'])
def add_question():
    """
    添加面试题
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            categoryId:
              type: integer
            title:
              type: string
            tags:
              type: array
              items:
                type: string
            difficulty:
              type: integer
            content:
              type: string
            status:
              type: integer
    responses:
      200:
        description: 添加成功
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: object
              properties:
                id:
                  type: integer
                categoryId:
                  type: integer
                title:
                  type: string
                tags:
                  type: array
                  items:
                    type: string
                difficulty:
                  type: integer
                content:
                  type: string
                status:
                  type: integer
    """
    global question_id_counter
    start_time = time.time()
    data = request.json
    new_question = {
        "id": question_id_counter,
        "categoryId": data.get("categoryId"),
        "title": data.get("title"),
        "tags": data.get("tags", []),
        "difficulty": data.get("difficulty", 1),
        "content": data.get("content"),
        "status": data.get("status", 1)
    }
    questions[question_id_counter] = new_question
    question_id_counter += 1
    clear_cache()  # 清除缓存
    end_time = time.time()
    print(f"POST /api/interview/questions 响应时间: {end_time - start_time:.4f}秒")
    return jsonify({"code": 200, "message": "操作成功", "data": new_question})

@app.route('/api/interview/questions/<int:question_id>', methods=['GET'])
def get_question(question_id):
    """
    获取面试题详情
    ---
    parameters:
      - name: question_id
        in: path
        required: true
        type: integer
    responses:
      200:
        description: 面试题详情
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: object
              properties:
                id:
                  type: integer
                categoryId:
                  type: integer
                title:
                  type: string
                tags:
                  type: array
                  items:
                    type: string
                difficulty:
                  type: integer
                content:
                  type: string
                status:
                  type: integer
    """
    start_time = time.time()
    if question_id in questions:
        question = questions[question_id]
        end_time = time.time()
        print(f"GET /api/interview/questions/{question_id} 响应时间: {end_time - start_time:.4f}秒")
        return jsonify({"code": 200, "message": "操作成功", "data": question})
    end_time = time.time()
    print(f"GET /api/interview/questions/{question_id} 响应时间: {end_time - start_time:.4f}秒")
    return jsonify({"code": 404, "message": "面试题不存在", "data": None})

@app.route('/api/interview/questions/<int:question_id>', methods=['PUT'])
def update_question(question_id):
    """
    更新面试题
    ---
    parameters:
      - name: question_id
        in: path
        required: true
        type: integer
      - name: body
        in: body
        required: true
        schema:
          type: object
          properties:
            categoryId:
              type: integer
            title:
              type: string
            tags:
              type: array
              items:
                type: string
            difficulty:
              type: integer
            content:
              type: string
            status:
              type: integer
    responses:
      200:
        description: 更新成功
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: object
              properties:
                id:
                  type: integer
                categoryId:
                  type: integer
                title:
                  type: string
                tags:
                  type: array
                  items:
                    type: string
                difficulty:
                  type: integer
                content:
                  type: string
                status:
                  type: integer
    """
    start_time = time.time()
    data = request.json
    if question_id in questions:
        question = questions[question_id]
        question["categoryId"] = data.get("categoryId", question["categoryId"])
        question["title"] = data.get("title", question["title"])
        question["tags"] = data.get("tags", question["tags"])
        question["difficulty"] = data.get("difficulty", question["difficulty"])
        question["content"] = data.get("content", question["content"])
        question["status"] = data.get("status", question["status"])
        clear_cache()  # 清除缓存
        end_time = time.time()
        print(f"PUT /api/interview/questions/{question_id} 响应时间: {end_time - start_time:.4f}秒")
        return jsonify({"code": 200, "message": "操作成功", "data": question})
    end_time = time.time()
    print(f"PUT /api/interview/questions/{question_id} 响应时间: {end_time - start_time:.4f}秒")
    return jsonify({"code": 404, "message": "面试题不存在", "data": None})

@app.route('/api/interview/questions/<int:question_id>', methods=['DELETE'])
def delete_question(question_id):
    """
    删除面试题
    ---
    parameters:
      - name: question_id
        in: path
        required: true
        type: integer
    responses:
      200:
        description: 删除成功
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: object
    """
    start_time = time.time()
    if question_id in questions:
        del questions[question_id]
        clear_cache()  # 清除缓存
        end_time = time.time()
        print(f"DELETE /api/interview/questions/{question_id} 响应时间: {end_time - start_time:.4f}秒")
        return jsonify({"code": 200, "message": "操作成功", "data": {}})
    end_time = time.time()
    print(f"DELETE /api/interview/questions/{question_id} 响应时间: {end_time - start_time:.4f}秒")
    return jsonify({"code": 404, "message": "面试题不存在", "data": None})

@app.route('/api/upload', methods=['POST'])
def upload_image():
    """
    上传图片
    ---
    responses:
      200:
        description: 上传成功
        schema:
          type: object
          properties:
            code:
              type: integer
            message:
              type: string
            data:
              type: object
              properties:
                url:
                  type: string
    """
    if 'file' not in request.files:
        return jsonify({
            "code": 400,
            "data": None,
            "message": "请选择文件"
        })
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({
            "code": 400,
            "data": None,
            "message": "请选择文件"
        })
    
    # 生成唯一文件名
    filename = str(uuid.uuid4()) + '.' + file.filename.rsplit('.', 1)[1].lower()
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    
    # 生成图片URL
    image_url = f'http://localhost:8084/uploads/{filename}'
    
    return jsonify({
        "code": 200,
        "data": {
            "url": image_url
        },
        "message": "上传成功"
    })

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    """提供上传文件的访问"""
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8087, debug=False)