import requests
import json

# 测试获取轮播图列表
def test_get_banners():
    print("=== 测试获取轮播图列表 ===")
    response = requests.get('http://localhost:8086/api/banner/list')
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
    print()
    return response.json()

# 测试获取轮播图详情
def test_get_banner(id):
    print(f"=== 测试获取轮播图详情 (ID: {id}) ===")
    response = requests.get(f'http://localhost:8086/api/banner/get/{id}')
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
        "sort": 99,
        "status": 1
    }
    response = requests.post('http://localhost:8086/api/banner/add', json=data)
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
    print()

# 测试更新轮播图
def test_update_banner(id):
    print(f"=== 测试更新轮播图 (ID: {id}) ===")
    data = {
        "id": id,
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
def test_delete_banner(id):
    print(f"=== 测试删除轮播图 (ID: {id}) ===")
    response = requests.delete(f'http://localhost:8086/api/banner/delete/{id}')
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
    print()

# 测试文件上传
def test_upload_image():
    print("=== 测试文件上传 ===")
    url = 'http://localhost:8086/api/banner/upload'
    
    # 打开测试文件
    with open('test.jpg', 'rb') as f:
        files = {'file': ('test.jpg', f)}
        response = requests.post(url, files=files)
    
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {json.dumps(response.json(), ensure_ascii=False, indent=2)}")
    print()
    return response.json()

if __name__ == "__main__":
    # 测试文件上传
    upload_result = test_upload_image()
    
    # 测试获取轮播图列表
    banners = test_get_banners()
    
    # 测试获取轮播图详情（使用第一个轮播图的ID）
    if banners['data']:
        first_banner_id = banners['data'][0]['id']
        test_get_banner(first_banner_id)
        
        # 测试更新轮播图
        test_update_banner(first_banner_id)
    
    # 测试添加轮播图
    test_add_banner()
    
    # 测试删除轮播图（使用最后一个轮播图的ID）
    banners_after_add = test_get_banners()
    if banners_after_add['data']:
        last_banner_id = banners_after_add['data'][-1]['id']
        test_delete_banner(last_banner_id)
    
    # 最后再次获取轮播图列表，查看操作结果
    test_get_banners()
