import requests
import os

# 测试文件上传
def test_upload():
    url = 'http://localhost:8084/api/upload'
    
    # 选择一个测试文件
    test_file = 'package.json'
    
    if not os.path.exists(test_file):
        print(f"测试文件 {test_file} 不存在")
        return
    
    try:
        with open(test_file, 'rb') as f:
            files = {'file': f}
            response = requests.post(url, files=files)
            
        print(f"响应状态码: {response.status_code}")
        print(f"响应内容: {response.json()}")
        
        if response.status_code == 200:
            print("文件上传成功!")
        else:
            print("文件上传失败!")
    except Exception as e:
        print(f"测试失败: {e}")

if __name__ == '__main__':
    test_upload()
