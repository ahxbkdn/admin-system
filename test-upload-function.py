import requests
import os

# 测试上传图片功能
def test_upload_function():
    upload_url = 'http://localhost:8084/api/upload'
    
    print("测试上传图片功能...")
    
    # 1. 测试上传有效图片
    print("\n1. 测试上传有效图片")
    # 创建一个简单的测试图片文件
    test_file_path = 'test-image.txt'
    with open(test_file_path, 'w') as f:
        f.write('This is a test image file')
    
    try:
        with open(test_file_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(upload_url, files=files)
            print(f"状态码: {response.status_code}")
            print(f"响应: {response.json()}")
            
            # 验证响应
            assert response.status_code == 200, "上传失败"
            assert 'data' in response.json(), "响应中缺少data字段"
            assert 'url' in response.json()['data'], "响应中缺少url字段"
            print("✓ 上传图片成功")
    finally:
        # 清理测试文件
        if os.path.exists(test_file_path):
            os.remove(test_file_path)
    
    # 2. 测试获取上传的文件
    print("\n2. 测试获取上传的文件")
    # 从响应中获取文件URL
    file_url = response.json()['data']['url']
    # 提取文件名
    file_name = file_url.split('/')[-1]
    # 构建本地访问路径
    local_file_url = f'http://localhost:8084/uploads/{file_name}'
    
    response = requests.get(local_file_url)
    print(f"状态码: {response.status_code}")
    assert response.status_code == 200, "获取上传文件失败"
    print("✓ 获取上传文件成功")
    
    # 3. 测试边界情况 - 空文件
    print("\n3. 测试上传空文件")
    empty_file_path = 'empty-file.txt'
    with open(empty_file_path, 'w') as f:
        pass
    
    try:
        with open(empty_file_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(upload_url, files=files)
            print(f"状态码: {response.status_code}")
            print(f"响应: {response.json()}")
            # 应该成功上传空文件
            assert response.status_code == 200, "上传空文件失败"
            print("✓ 上传空文件成功")
    finally:
        if os.path.exists(empty_file_path):
            os.remove(empty_file_path)
    
    print("\n\n所有测试通过！上传图片功能正常工作。")

if __name__ == '__main__':
    try:
        test_upload_function()
    except Exception as e:
        print(f"测试失败: {e}")
        import traceback
        traceback.print_exc()
