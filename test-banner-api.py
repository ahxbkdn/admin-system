import requests
import json

# 测试获取轮播图列表
def test_get_banners():
    print("=== 测试获取轮播图列表 ===")
    response = requests.get('http://localhost:8086/api/banner/list')
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
    print()

# 测试获取轮播图详情
def test_get_banner():
    print("=== 测试获取轮播图详情 ===")
    response = requests.get('http://localhost:8086/api/banner/get/1')
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
    print()

# 测试添加轮播图
def test_add_banner():
    print("=== 测试添加轮播图 ===")
    data = {
        "title": "测试轮播图",
        "imageUrl": "https://example.com/test-banner.jpg",
        "linkUrl": "https://example.com/test",
        "sort": 4,
        "status": 1
    }
    response = requests.post('http://localhost:8086/api/banner/add', json=data)
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
    print()

# 测试更新轮播图
def test_update_banner():
    print("=== 测试更新轮播图 ===")
    data = {
        "id": "1",
        "title": "更新后的轮播图标题",
        "imageUrl": "https://example.com/updated-banner.jpg",
        "linkUrl": "https://example.com/updated",
        "sort": 1,
        "status": 1
    }
    response = requests.put('http://localhost:8086/api/banner/update', json=data)
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
    print()

# 测试删除轮播图
def test_delete_banner():
    print("=== 测试删除轮播图 ===")
    response = requests.delete('http://localhost:8086/api/banner/delete/2')
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
    print()

if __name__ == "__main__":
    test_get_banners()
    test_get_banner()
    test_add_banner()
    test_update_banner()
    test_delete_banner()
    # 再次获取列表，查看操作结果
    test_get_banners()
