from flask import Flask, jsonify, request, g
from flasgger import Swagger
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

# 配置Flasgger
app.config['SWAGGER'] = {
    'title': '章节管理API',
    'uiversion': 3,
    'openapi': '3.0.2',
    'specs_route': '/swagger-ui/'
}

# JWT配置
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['JWT_EXPIRATION_DELTA'] = timedelta(hours=24)

swagger = Swagger(app)

# 章节存储
chapters = {}
sections = {}

# 自增ID计数器
chapter_id_counter = 1
section_id_counter = 1

# 章节管理
@app.route('/api/chapters', methods=['GET'])
def get_chapters():
    """
    获取章节列表
    ---  
    responses:
      200:
        description: 章节列表
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
                  course_id:
                    type: integer
                  title:
                    type: string
                  order:
                    type: integer
    """
    # 直接返回硬编码的章节数据
    result = {
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
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8086, debug=False)