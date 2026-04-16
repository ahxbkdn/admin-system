from flask import Flask, jsonify, request
from flasgger import Swagger

app = Flask(__name__)

# 配置Swagger
app.config['SWAGGER'] = {
    'title': '课程管理 API Documentation',
    'description': '课程管理相关接口文档',
    'version': '1.0.0',
    'uiversion': 3,
    'specs_route': '/swagger-ui/'
}

swagger = Swagger(app)

courses = []
chapters = []
course_id = 1
chapter_id = 1

@app.route('/courses', methods=['GET', 'POST'])
def courses_api():
    """
    课程管理接口
    ---
    get:
      summary: 获取课程列表
      description: 获取所有课程的列表
      responses:
        200:
          description: 成功返回课程列表
          content:
            application/json:
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
                        lecturer:
                          type: string
                        totalHours:
                          type: integer
                        description:
                          type: string
                        coverImage:
                          type: string
                        price:
                          type: number
                        status:
                          type: integer
    post:
      summary: 创建课程
      description: 创建一个新的课程
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                title:
                  type: string
                  description: 课程标题
                lecturer:
                  type: string
                  description: 讲师名称
                totalHours:
                  type: integer
                  description: 总课时
                description:
                  type: string
                  description: 课程简介
                coverImage:
                  type: string
                  description: 封面图片URL
                price:
                  type: number
                  description: 课程价格
                status:
                  type: integer
                  description: 课程状态
      responses:
        200:
          description: 课程创建成功
    """
    global course_id
    if request.method == 'GET':
        return jsonify({"code": 200, "message": "操作成功", "data": courses})
    else:
        data = request.get_json() or {}
        course = {
            "id": course_id,
            "title": data.get("title", "新课程"),
            "lecturer": data.get("lecturer", "讲师"),
            "totalHours": data.get("totalHours", 40),
            "description": data.get("description", ""),
            "coverImage": data.get("coverImage", ""),
            "price": data.get("price", 0),
            "status": data.get("status", 1)
        }
        courses.append(course)
        course_id += 1
        return jsonify({"code": 200, "message": "操作成功", "data": course})

@app.route('/courses/<int:id>', methods=['PUT', 'DELETE'])
def course_detail(id):
    """
    课程详情接口
    ---
    put:
      summary: 更新课程
      description: 更新指定ID的课程信息
      parameters:
        - name: id
          in: path
          type: integer
          required: true
          description: 课程ID
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                title:
                  type: string
                lecturer:
                  type: string
                totalHours:
                  type: integer
                description:
                  type: string
                coverImage:
                  type: string
                price:
                  type: number
                status:
                  type: integer
      responses:
        200:
          description: 课程更新成功
    delete:
      summary: 删除课程
      description: 删除指定ID的课程
      parameters:
        - name: id
          in: path
          type: integer
          required: true
          description: 课程ID
      responses:
        200:
          description: 课程删除成功
    """
    if request.method == 'DELETE':
        global courses
        courses = [c for c in courses if c["id"] != id]
        return jsonify({"code": 200, "message": "操作成功", "data": None})
    else:
        data = request.get_json() or {}
        for c in courses:
            if c["id"] == id:
                c.update(data)
                return jsonify({"code": 200, "message": "操作成功", "data": c})
        return jsonify({"code": 404, "message": "课程不存在", "data": None})

@app.route('/chapters/course/<int:course_id>', methods=['GET'])
def chapters_by_course(course_id):
    """
    根据课程ID获取章节列表
    ---
    get:
      summary: 获取章节列表
      description: 根据课程ID获取该课程下的所有章节
      parameters:
        - name: course_id
          in: path
          type: integer
          required: true
          description: 课程ID
      responses:
        200:
          description: 成功返回章节列表
    """
    data = [ch for ch in chapters if ch["courseId"] == course_id]
    return jsonify({"code": 200, "message": "操作成功", "data": data})

@app.route('/chapters', methods=['POST'])
def create_chapter():
    """
    创建章节
    ---
    post:
      summary: 创建章节
      description: 创建一个新的章节
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                courseId:
                  type: integer
                  description: 课程ID
                title:
                  type: string
                  description: 章节标题
                sort:
                  type: integer
                  description: 章节排序
      responses:
        200:
          description: 章节创建成功
    """
    global chapter_id
    data = request.get_json() or {}
    chapter = {
        "id": chapter_id,
        "courseId": data.get("courseId", 1),
        "title": data.get("title", "新章节"),
        "sort": data.get("sort", 1)
    }
    chapters.append(chapter)
    chapter_id += 1
    return jsonify({"code": 200, "message": "操作成功", "data": chapter})

@app.route('/chapters/<int:id>', methods=['PUT', 'DELETE'])
def chapter_detail(id):
    """
    章节详情接口
    ---
    put:
      summary: 更新章节
      description: 更新指定ID的章节信息
      parameters:
        - name: id
          in: path
          type: integer
          required: true
          description: 章节ID
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                courseId:
                  type: integer
                title:
                  type: string
                sort:
                  type: integer
      responses:
        200:
          description: 章节更新成功
    delete:
      summary: 删除章节
      description: 删除指定ID的章节
      parameters:
        - name: id
          in: path
          type: integer
          required: true
          description: 章节ID
      responses:
        200:
          description: 章节删除成功
    """
    global chapters
    if request.method == 'DELETE':
        chapters = [ch for ch in chapters if ch["id"] != id]
        return jsonify({"code": 200, "message": "操作成功", "data": None})
    else:
        data = request.get_json() or {}
        for ch in chapters:
            if ch["id"] == id:
                ch.update(data)
                return jsonify({"code": 200, "message": "操作成功", "data": ch})
        return jsonify({"code": 404, "message": "章节不存在", "data": None})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8083)
