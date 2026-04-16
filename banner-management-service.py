from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime
import uuid
import os

app = Flask(__name__)
CORS(app)

# 创建上传目录
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# 内存存储
banners = {}

# 初始化测试数据
initial_banners = [
    {
        "id": "1",
        "title": "Spring Boot 课程推荐",
        "imageUrl": "https://example.com/banner1.jpg",
        "linkUrl": "https://example.com/course/1",
        "sort": 1,
        "status": 1,
        "createTime": datetime.now().isoformat(),
        "updateTime": datetime.now().isoformat()
    },
    {
        "id": "2",
        "title": "React 实战课程",
        "imageUrl": "https://example.com/banner2.jpg",
        "linkUrl": "https://example.com/course/2",
        "sort": 2,
        "status": 1,
        "createTime": datetime.now().isoformat(),
        "updateTime": datetime.now().isoformat()
    },
    {
        "id": "3",
        "title": "Vue 3 入门教程",
        "imageUrl": "https://example.com/banner3.jpg",
        "linkUrl": "https://example.com/course/3",
        "sort": 3,
        "status": 1,
        "createTime": datetime.now().isoformat(),
        "updateTime": datetime.now().isoformat()
    }
]

for banner in initial_banners:
    banners[banner["id"]] = banner

@app.route('/api/banner/list', methods=['GET'])
def get_banners():
    """获取轮播图列表"""
    return jsonify({
        "code": 200,
        "data": list(banners.values()),
        "message": "success"
    })

@app.route('/api/banner/get/<id>', methods=['GET'])
def get_banner(id):
    """获取轮播图详情"""
    banner = banners.get(id)
    if not banner:
        return jsonify({
            "code": 404,
            "data": None,
            "message": "轮播图不存在"
        })
    return jsonify({
        "code": 200,
        "data": banner,
        "message": "success"
    })

@app.route('/api/banner/add', methods=['POST'])
def add_banner():
    """添加轮播图"""
    data = request.json
    new_banner = {
        "id": str(len(banners) + 1),
        "title": data.get("title"),
        "imageUrl": data.get("imageUrl"),
        "linkUrl": data.get("linkUrl"),
        "sort": data.get("sort", 0),
        "status": data.get("status", 1),
        "createTime": datetime.now().isoformat(),
        "updateTime": datetime.now().isoformat()
    }
    banners[new_banner["id"]] = new_banner
    return jsonify({
        "code": 200,
        "data": None,
        "message": "添加成功"
    })

@app.route('/api/banner/update', methods=['PUT'])
def update_banner():
    """更新轮播图"""
    data = request.json
    banner_id = data.get("id")
    if not banner_id or banner_id not in banners:
        return jsonify({
            "code": 404,
            "data": None,
            "message": "轮播图不存在"
        })
    banner = banners[banner_id]
    banner.update({
        "title": data.get("title", banner["title"]),
        "imageUrl": data.get("imageUrl", banner["imageUrl"]),
        "linkUrl": data.get("linkUrl", banner["linkUrl"]),
        "sort": data.get("sort", banner["sort"]),
        "status": data.get("status", banner["status"]),
        "updateTime": datetime.now().isoformat()
    })
    return jsonify({
        "code": 200,
        "data": None,
        "message": "更新成功"
    })

@app.route('/api/banner/delete/<id>', methods=['DELETE'])
def delete_banner(id):
    """删除轮播图"""
    if id not in banners:
        return jsonify({
            "code": 404,
            "data": None,
            "message": "轮播图不存在"
        })
    del banners[id]
    return jsonify({
        "code": 200,
        "data": None,
        "message": "删除成功"
    })

@app.route('/api/banner/upload', methods=['POST'])
def upload_image():
    """上传图片"""
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
    image_url = f'http://localhost:8086/uploads/{filename}'
    
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
    app.run(host='0.0.0.0', port=8086, debug=True)
