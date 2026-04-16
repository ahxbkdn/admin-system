from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/chapters', methods=['GET'])
def get_chapters():
    """
    获取章节列表
    """
    # 直接返回硬编码的章节数据
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

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8085, debug=False)