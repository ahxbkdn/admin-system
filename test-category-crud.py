import requests

# 测试面试题分类的增删改功能
def test_category_crud():
    base_url = 'http://localhost:8084/api/interview'
    
    print("测试面试题分类管理的增删改功能...")
    
    # 1. 测试添加分类
    print("\n1. 测试添加分类")
    new_category = {
        "name": "测试分类",
        "description": "测试分类描述",
        "iconUrl": "https://example.com/test.png",
        "sort": 99,
        "status": 1
    }
    response = requests.post(f'{base_url}/categories', json=new_category)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    category_id = response.json().get('data', {}).get('id')
    assert response.status_code == 200, "添加分类失败"
    assert category_id is not None, "添加分类返回的ID为None"
    print("✓ 添加分类成功")
    
    # 2. 测试获取分类列表，验证新分类是否存在
    print("\n2. 测试获取分类列表")
    response = requests.get(f'{base_url}/categories')
    print(f"状态码: {response.status_code}")
    categories = response.json().get('data', [])
    print(f"分类数量: {len(categories)}")
    test_category = next((c for c in categories if c['id'] == category_id), None)
    assert test_category is not None, "新添加的分类不在列表中"
    assert test_category['name'] == new_category['name'], "分类名称不匹配"
    print("✓ 分类列表获取成功，新分类存在")
    
    # 3. 测试更新分类
    print("\n3. 测试更新分类")
    update_data = {
        "name": "测试分类（更新）",
        "description": "测试分类描述（更新）",
        "sort": 100,
        "status": 0
    }
    response = requests.put(f'{base_url}/categories/{category_id}', json=update_data)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    assert response.status_code == 200, "更新分类失败"
    updated_category = response.json().get('data', {})
    assert updated_category['name'] == update_data['name'], "分类名称更新失败"
    assert updated_category['description'] == update_data['description'], "分类描述更新失败"
    assert updated_category['sort'] == update_data['sort'], "分类排序更新失败"
    assert updated_category['status'] == update_data['status'], "分类状态更新失败"
    print("✓ 更新分类成功")
    
    # 4. 再次获取分类列表，验证更新是否生效
    print("\n4. 验证分类更新是否生效")
    response = requests.get(f'{base_url}/categories')
    categories = response.json().get('data', [])
    updated_test_category = next((c for c in categories if c['id'] == category_id), None)
    assert updated_test_category is not None, "更新后的分类不在列表中"
    assert updated_test_category['name'] == update_data['name'], "分类名称更新未生效"
    assert updated_test_category['status'] == update_data['status'], "分类状态更新未生效"
    print("✓ 分类更新已生效")
    
    # 5. 测试删除分类
    print("\n5. 测试删除分类")
    response = requests.delete(f'{base_url}/categories/{category_id}')
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    assert response.status_code == 200, "删除分类失败"
    print("✓ 删除分类成功")
    
    # 6. 验证分类是否已删除
    print("\n6. 验证分类是否已删除")
    response = requests.get(f'{base_url}/categories')
    categories = response.json().get('data', [])
    deleted_category = next((c for c in categories if c['id'] == category_id), None)
    assert deleted_category is None, "分类未被删除"
    print("✓ 分类已成功删除")
    
    # 7. 测试删除不存在的分类（边界测试）
    print("\n7. 测试删除不存在的分类")
    response = requests.delete(f'{base_url}/categories/9999')
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    assert response.status_code == 200, "删除不存在分类时状态码错误"
    assert response.json().get('message') == "分类不存在", "删除不存在分类时消息错误"
    print("✓ 删除不存在分类测试通过")
    
    # 8. 测试更新不存在的分类（边界测试）
    print("\n8. 测试更新不存在的分类")
    response = requests.put(f'{base_url}/categories/9999', json=update_data)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    assert response.status_code == 200, "更新不存在分类时状态码错误"
    assert response.json().get('message') == "分类不存在", "更新不存在分类时消息错误"
    print("✓ 更新不存在分类测试通过")
    
    print("\n\n所有测试通过！面试题分类管理的增删改功能正常工作。")

if __name__ == '__main__':
    try:
        test_category_crud()
    except Exception as e:
        print(f"测试失败: {e}")
        import traceback
        traceback.print_exc()
