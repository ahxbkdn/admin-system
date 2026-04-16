import requests

# 测试面试题的增删改功能
def test_question_crud():
    base_url = 'http://localhost:8084/api/interview'
    
    print("测试面试题管理的增删改功能...")
    
    # 1. 首先获取分类列表，确保有分类可用
    print("\n1. 获取分类列表")
    response = requests.get(f'{base_url}/categories')
    print(f"状态码: {response.status_code}")
    categories = response.json().get('data', [])
    print(f"分类数量: {len(categories)}")
    assert len(categories) > 0, "没有可用的分类"
    category_id = categories[0]['id']
    print(f"使用分类ID: {category_id}")
    
    # 2. 测试添加面试题
    print("\n2. 测试添加面试题")
    new_question = {
        "categoryId": category_id,
        "title": "测试面试题",
        "tags": ["测试", "面试题"],
        "difficulty": 1,
        "content": "这是一个测试面试题",
        "status": 1
    }
    response = requests.post(f'{base_url}/questions', json=new_question)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    question_id = response.json().get('data', {}).get('id')
    assert response.status_code == 200, "添加面试题失败"
    assert question_id is not None, "添加面试题返回的ID为None"
    print("✓ 添加面试题成功")
    
    # 3. 测试获取面试题列表，验证新面试题是否存在
    print("\n3. 测试获取面试题列表")
    response = requests.get(f'{base_url}/questions')
    print(f"状态码: {response.status_code}")
    questions = response.json().get('data', [])
    print(f"面试题数量: {len(questions)}")
    test_question = next((q for q in questions if q['id'] == question_id), None)
    assert test_question is not None, "新添加的面试题不在列表中"
    assert test_question['title'] == new_question['title'], "面试题标题不匹配"
    print("✓ 面试题列表获取成功，新面试题存在")
    
    # 4. 测试按分类获取面试题
    print("\n4. 测试按分类获取面试题")
    response = requests.get(f'{base_url}/questions?categoryId={category_id}')
    print(f"状态码: {response.status_code}")
    category_questions = response.json().get('data', [])
    print(f"分类面试题数量: {len(category_questions)}")
    assert len(category_questions) > 0, "按分类获取面试题失败"
    print("✓ 按分类获取面试题成功")
    
    # 5. 测试获取面试题详情
    print("\n5. 测试获取面试题详情")
    response = requests.get(f'{base_url}/questions/{question_id}')
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    assert response.status_code == 200, "获取面试题详情失败"
    assert response.json().get('data', {}).get('id') == question_id, "面试题详情ID不匹配"
    print("✓ 获取面试题详情成功")
    
    # 6. 测试更新面试题
    print("\n6. 测试更新面试题")
    update_data = {
        "title": "测试面试题（更新）",
        "content": "这是一个测试面试题（更新）",
        "difficulty": 2
    }
    response = requests.put(f'{base_url}/questions/{question_id}', json=update_data)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    assert response.status_code == 200, "更新面试题失败"
    updated_question = response.json().get('data', {})
    assert updated_question['title'] == update_data['title'], "面试题标题更新失败"
    assert updated_question['content'] == update_data['content'], "面试题内容更新失败"
    assert updated_question['difficulty'] == update_data['difficulty'], "面试题难度更新失败"
    print("✓ 更新面试题成功")
    
    # 7. 再次获取面试题列表，验证更新是否生效
    print("\n7. 验证面试题更新是否生效")
    response = requests.get(f'{base_url}/questions')
    questions = response.json().get('data', [])
    updated_test_question = next((q for q in questions if q['id'] == question_id), None)
    assert updated_test_question is not None, "更新后的面试题不在列表中"
    assert updated_test_question['title'] == update_data['title'], "面试题标题更新未生效"
    assert updated_test_question['difficulty'] == update_data['difficulty'], "面试题难度更新未生效"
    print("✓ 面试题更新已生效")
    
    # 8. 测试删除面试题
    print("\n8. 测试删除面试题")
    response = requests.delete(f'{base_url}/questions/{question_id}')
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    assert response.status_code == 200, "删除面试题失败"
    print("✓ 删除面试题成功")
    
    # 9. 验证面试题是否已删除
    print("\n9. 验证面试题是否已删除")
    response = requests.get(f'{base_url}/questions')
    questions = response.json().get('data', [])
    deleted_question = next((q for q in questions if q['id'] == question_id), None)
    assert deleted_question is None, "面试题未被删除"
    print("✓ 面试题已成功删除")
    
    # 10. 测试删除不存在的面试题（边界测试）
    print("\n10. 测试删除不存在的面试题")
    response = requests.delete(f'{base_url}/questions/9999')
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    assert response.status_code == 200, "删除不存在面试题时状态码错误"
    assert response.json().get('message') == "面试题不存在", "删除不存在面试题时消息错误"
    print("✓ 删除不存在面试题测试通过")
    
    # 11. 测试更新不存在的面试题（边界测试）
    print("\n11. 测试更新不存在的面试题")
    response = requests.put(f'{base_url}/questions/9999', json=update_data)
    print(f"状态码: {response.status_code}")
    print(f"响应: {response.json()}")
    assert response.status_code == 200, "更新不存在面试题时状态码错误"
    assert response.json().get('message') == "面试题不存在", "更新不存在面试题时消息错误"
    print("✓ 更新不存在面试题测试通过")
    
    print("\n\n所有测试通过！面试题管理的增删改功能正常工作。")

if __name__ == '__main__':
    try:
        test_question_crud()
    except Exception as e:
        print(f"测试失败: {e}")
        import traceback
        traceback.print_exc()
