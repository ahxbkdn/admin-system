import axios from 'axios';

const baseURL = 'http://localhost:8082';

// 创建axios实例，禁用重定向
const apiClient = axios.create({
  baseURL,
  maxRedirects: 0
});

// 测试课程管理API
async function testCourseAPI() {
  console.log('开始测试课程管理API...');
  
  try {
    // 1. 测试获取课程列表
    console.log('\n1. 测试获取课程列表:');
    const coursesResponse = await apiClient.get('/courses');
    console.log('获取课程列表成功:', coursesResponse.data);
    
    // 2. 测试创建课程
    console.log('\n2. 测试创建课程:');
    const newCourse = {
      title: '测试课程',
      description: '这是一个测试课程',
      instructor: '测试讲师',
      price: 99.99,
      duration: '4周',
      level: '初级',
      category: '编程'
    };
    const createResponse = await apiClient.post('/courses', newCourse);
    console.log('创建课程成功:', createResponse.data);
    const courseId = createResponse.data.data.id;
    
    // 3. 测试获取单个课程
    console.log('\n3. 测试获取单个课程:');
    const getCourseResponse = await apiClient.get(`/courses/${courseId}`);
    console.log('获取单个课程成功:', getCourseResponse.data);
    
    // 4. 测试更新课程
    console.log('\n4. 测试更新课程:');
    const updateCourse = {
      title: '更新后的测试课程',
      description: '这是一个更新后的测试课程',
      instructor: '测试讲师',
      price: 199.99,
      duration: '6周',
      level: '中级',
      category: '编程'
    };
    const updateResponse = await apiClient.put(`/courses/${courseId}`, updateCourse);
    console.log('更新课程成功:', updateResponse.data);
    
    // 5. 测试创建章节
    console.log('\n5. 测试创建章节:');
    const newChapter = {
      courseId: courseId,
      title: '第一章 课程介绍',
      orderNum: 1
    };
    const createChapterResponse = await apiClient.post('/chapters', newChapter);
    console.log('创建章节成功:', createChapterResponse.data);
    const chapterId = createChapterResponse.data.data.id;
    
    // 6. 测试获取课程章节
    console.log('\n6. 测试获取课程章节:');
    const chaptersResponse = await apiClient.get(`/chapters/course/${courseId}`);
    console.log('获取课程章节成功:', chaptersResponse.data);
    
    // 7. 测试创建小节
    console.log('\n7. 测试创建小节:');
    const newSection = {
      chapterId: chapterId,
      title: '1.1 课程概述',
      content: '这是课程概述内容',
      orderNum: 1
    };
    const createSectionResponse = await apiClient.post('/sections', newSection);
    console.log('创建小节成功:', createSectionResponse.data);
    const sectionId = createSectionResponse.data.data.id;
    
    // 8. 测试获取章节小节
    console.log('\n8. 测试获取章节小节:');
    const sectionsResponse = await apiClient.get(`/sections/chapter/${chapterId}`);
    console.log('获取章节小节成功:', sectionsResponse.data);
    
    // 9. 测试删除小节
    console.log('\n9. 测试删除小节:');
    const deleteSectionResponse = await apiClient.delete(`/sections/${sectionId}`);
    console.log('删除小节成功:', deleteSectionResponse.data);
    
    // 10. 测试删除章节
    console.log('\n10. 测试删除章节:');
    const deleteChapterResponse = await apiClient.delete(`/chapters/${chapterId}`);
    console.log('删除章节成功:', deleteChapterResponse.data);
    
    // 11. 测试删除课程
    console.log('\n11. 测试删除课程:');
    const deleteCourseResponse = await apiClient.delete(`/courses/${courseId}`);
    console.log('删除课程成功:', deleteCourseResponse.data);
    
    console.log('\n🎉 所有API测试成功完成！');
  } catch (error) {
    console.error('测试过程中出现错误:', error.message);
    if (error.response) {
      console.error('错误响应:', error.response.data);
    }
  }
}

testCourseAPI();