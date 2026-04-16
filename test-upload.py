import requests

# 测试文件上传
def test_upload():
    print("=== 测试文件上传 ===")
    url = 'http://localhost:8086/api/banner/upload'
    
    # 打开测试文件
    with open('test.jpg', 'rb') as f:
        files = {'file': ('test.jpg', f)}
        response = requests.post(url, files=files)
    
    print(f"状态码: {response.status_code}")
    print(f"响应内容: {response.json()}")

if __name__ == "__main__":
    test_upload()
