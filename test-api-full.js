import fetch from 'node-fetch';

// API基础URL
const BASE_URL = 'http://120.55.194.16:8080';

async function testApi() {
  console.log('=== 课程管理API测试 ===\n');
  
  let testResults = [];
  
  // 测试1：获取课程列表
  console.log('1. 测试获取课程列表 (GET /courses)');
  try {
    const response = await fetch(`${BASE_URL}/courses`);
    const data = await response.json();
    console.log('响应状态:', response.status);
    console.log('响应数据:', JSON.stringify(data, null, 2));
    testResults.push({ test: 'GET /courses', status: response.status, success: response.status === 200 });
  } catch (error) {
    console.error('错误:', error.message);
    testResults.push({ test: 'GET /courses', status: 'error', success: false, error: error.message });
  }
  console.log('');
  
  // 测试2：创建课程
  console.log('2. 测试创建课程 (POST /courses)');
  try {
    const response = await fetch(`${BASE_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: '测试课程',
        lecturer: '李刚',
        totalHours: 40,
        description: '这是一门测试课程',
        coverImage: 'https://example.com/cover.jpg',
        price: 99.0,
        status: 1
      })
    });
    const data = await response.json();
    console.log('响应状态:', response.status);
    console.log('响应数据:', JSON.stringify(data, null, 2));
    testResults.push({ test: 'POST /courses', status: response.status, success: response.status === 200 });
  } catch (error) {
    console.error('错误:', error.message);
    testResults.push({ test: 'POST /courses', status: 'error', success: false, error: error.message });
  }
  console.log('');
  
  // 测试3：获取课程详情
  console.log('3. 测试获取课程详情 (GET /courses/1)');
  try {
    const response = await fetch(`${BASE_URL}/courses/1`);
    const data = await response.json();
    console.log('响应状态:', response.status);
    console.log('响应数据:', JSON.stringify(data, null, 2));
    testResults.push({ test: 'GET /courses/1', status: response.status, success: response.status === 200 });
  } catch (error) {
    console.error('错误:', error.message);
    testResults.push({ test: 'GET /courses/1', status: 'error', success: false, error: error.message });
  }
  console.log('');
  
  // 测试4：更新课程
  console.log('4. 测试更新课程 (PUT /courses/1)');
  try {
    const response = await fetch(`${BASE_URL}/courses/1`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: '更新后的课程标题',
        lecturer: '王老师',
        totalHours: 45,
        description: '更新后的课程描述',
        coverImage: 'https://example.com/cover-updated.jpg',
        price: 129.0,
        status: 1
      })
    });
    const data = await response.json();
    console.log('响应状态:', response.status);
    console.log('响应数据:', JSON.stringify(data, null, 2));
    testResults.push({ test: 'PUT /courses/1', status: response.status, success: response.status === 200 });
  } catch (error) {
    console.error('错误:', error.message);
    testResults.push({ test: 'PUT /courses/1', status: 'error', success: false, error: error.message });
  }
  console.log('');
  
  // 测试5：获取章节列表
  console.log('5. 测试获取章节列表 (GET /chapters/course/1)');
  try {
    const response = await fetch(`${BASE_URL}/chapters/course/1`);
    const data = await response.json();
    console.log('响应状态:', response.status);
    console.log('响应数据:', JSON.stringify(data, null, 2));
    testResults.push({ test: 'GET /chapters/course/1', status: response.status, success: response.status === 200 });
  } catch (error) {
    console.error('错误:', error.message);
    testResults.push({ test: 'GET /chapters/course/1', status: 'error', success: false, error: error.message });
  }
  console.log('');
  
  // 测试6：创建章节
  console.log('6. 测试创建章节 (POST /chapters)');
  try {
    const response = await fetch(`${BASE_URL}/chapters`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        courseId: 1,
        title: '测试章节',
        sort: 3
      })
    });
    const data = await response.json();
    console.log('响应状态:', response.status);
    console.log('响应数据:', JSON.stringify(data, null, 2));
    testResults.push({ test: 'POST /chapters', status: response.status, success: response.status === 200 });
  } catch (error) {
    console.error('错误:', error.message);
    testResults.push({ test: 'POST /chapters', status: 'error', success: false, error: error.message });
  }
  console.log('');
  
  // 测试7：获取小节列表
  console.log('7. 测试获取小节列表 (GET /sections/chapter/1)');
  try {
    const response = await fetch(`${BASE_URL}/sections/chapter/1`);
    const data = await response.json();
    console.log('响应状态:', response.status);
    console.log('响应数据:', JSON.stringify(data, null, 2));
    testResults.push({ test: 'GET /sections/chapter/1', status: response.status, success: response.status === 200 });
  } catch (error) {
    console.error('错误:', error.message);
    testResults.push({ test: 'GET /sections/chapter/1', status: 'error', success: false, error: error.message });
  }
  console.log('');
  
  // 测试8：创建小节
  console.log('8. 测试创建小节 (POST /sections)');
  try {
    const response = await fetch(`${BASE_URL}/sections`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chapterId: 1,
        title: '测试小节',
        content: '测试小节内容',
        videoUrl: 'https://example.com/video.mp4',
        duration: 600,
        sort: 3,
        isFree: true
      })
    });
    const data = await response.json();
    console.log('响应状态:', response.status);
    console.log('响应数据:', JSON.stringify(data, null, 2));
    testResults.push({ test: 'POST /sections', status: response.status, success: response.status === 200 });
  } catch (error) {
    console.error('错误:', error.message);
    testResults.push({ test: 'POST /sections', status: 'error', success: false, error: error.message });
  }
  console.log('');
  
  // 测试9：删除课程
  console.log('9. 测试删除课程 (DELETE /courses/3)');
  try {
    const response = await fetch(`${BASE_URL}/courses/3`, {
      method: 'DELETE'
    });
    const data = await response.json();
    console.log('响应状态:', response.status);
    console.log('响应数据:', JSON.stringify(data, null, 2));
    testResults.push({ test: 'DELETE /courses/3', status: response.status, success: response.status === 200 });
  } catch (error) {
    console.error('错误:', error.message);
    testResults.push({ test: 'DELETE /courses/3', status: 'error', success: false, error: error.message });
  }
  console.log('');
  
  // 输出测试结果总结
  console.log('=== 测试结果总结 ===');
  console.log('');
  
  let totalTests = testResults.length;
  let passedTests = testResults.filter(result => result.success).length;
  let failedTests = totalTests - passedTests;
  
  console.log(`总测试数: ${totalTests}`);
  console.log(`通过测试: ${passedTests}`);
  console.log(`失败测试: ${failedTests}`);
  console.log('');
  
  if (failedTests > 0) {
    console.log('失败的测试:');
    testResults.forEach(result => {
      if (!result.success) {
        console.log(`- ${result.test}: ${result.status}${result.error ? ` (${result.error})` : ''}`);
      }
    });
  } else {
    console.log('所有测试都通过了！');
  }
  
  console.log('');
  console.log('=== 测试完成 ===');
}

testApi();
