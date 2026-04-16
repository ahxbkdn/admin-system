const http = require('http');
const url = require('url');

// 模拟课程数据
const courses = [
  {
    id: 1,
    title: 'Spring Boot 基础教程',
    description: 'Spring Boot 入门到精通',
    coverImage: 'https://example.com/cover1.jpg',
    status: 1,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    lecturer: '李刚',
    totalHours: 40,
    price: 99
  },
  {
    id: 2,
    title: 'React 实战教程',
    description: 'React 从基础到高级',
    coverImage: 'https://example.com/cover2.jpg',
    status: 1,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString(),
    lecturer: '王老师',
    totalHours: 30,
    price: 79
  }
];

// 模拟章节数据
const chapters = [
  {
    id: 1,
    courseId: 1,
    title: '第一章 环境搭建',
    sort: 1
  },
  {
    id: 2,
    courseId: 1,
    title: '第二章 Spring Boot基础',
    sort: 2
  },
  {
    id: 3,
    courseId: 2,
    title: '第一章 React基础',
    sort: 1
  }
];

// 模拟小节数据
const sections = [
  {
    id: 1,
    chapterId: 1,
    title: '第1节 DevEcoStudio安装',
    content: 'DevEcoStudio安装步骤...',
    videoUrl: 'https://example.com/video1.mp4',
    duration: 600,
    sort: 1,
    isFree: true
  },
  {
    id: 2,
    chapterId: 1,
    title: '第2节 环境变量配置',
    content: '环境变量配置步骤...',
    videoUrl: 'https://example.com/video2.mp4',
    duration: 480,
    sort: 2,
    isFree: true
  },
  {
    id: 3,
    chapterId: 2,
    title: '第1节 Spring Boot简介',
    content: 'Spring Boot简介...',
    videoUrl: 'https://example.com/video3.mp4',
    duration: 720,
    sort: 1,
    isFree: false
  }
];

// 处理请求
function handleRequest(req, res) {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  const method = req.method;

  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 处理OPTIONS请求
  if (method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // 解析请求体
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    let parsedBody = {};
    if (body) {
      try {
        parsedBody = JSON.parse(body);
      } catch (e) {
        // 忽略解析错误
      }
    }

    // 路由处理
    if (method === 'GET' && path === '/courses') {
      // 获取课程列表
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        code: 200,
        data: courses,
        message: '获取课程列表成功'
      }));
    } else if (method === 'POST' && path === '/courses') {
      // 创建课程
      const course = parsedBody;
      course.id = courses.length + 1;
      course.createTime = new Date().toISOString();
      course.updateTime = new Date().toISOString();
      courses.push(course);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        code: 200,
        data: course,
        message: '创建课程成功'
      }));
    } else if (method === 'GET' && path.match(/^\/courses\/\d+$/)) {
      // 获取课程详情
      const id = parseInt(path.split('/')[2]);
      const course = courses.find(c => c.id === id);
      if (course) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          code: 200,
          data: course,
          message: '获取课程成功'
        }));
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          code: 404,
          message: '课程不存在'
        }));
      }
    } else if (method === 'PUT' && path.match(/^\/courses\/\d+$/)) {
      // 更新课程
      const id = parseInt(path.split('/')[2]);
      const courseIndex = courses.findIndex(c => c.id === id);
      if (courseIndex !== -1) {
        courses[courseIndex] = { ...courses[courseIndex], ...parsedBody, updateTime: new Date().toISOString() };
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          code: 200,
          data: courses[courseIndex],
          message: '更新课程成功'
        }));
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          code: 404,
          message: '课程不存在'
        }));
      }
    } else if (method === 'DELETE' && path.match(/^\/courses\/\d+$/)) {
      // 删除课程
      const id = parseInt(path.split('/')[2]);
      const courseIndex = courses.findIndex(c => c.id === id);
      if (courseIndex !== -1) {
        courses.splice(courseIndex, 1);
        // 同时删除相关的章节和小节
        const chapterIndices = chapters.reduce((indices, chapter, index) => {
          if (chapter.courseId === id) indices.push(index);
          return indices;
        }, []);
        chapterIndices.reverse().forEach(index => {
          const chapterId = chapters[index].id;
          chapters.splice(index, 1);
          // 删除相关的小节
          const sectionIndices = sections.reduce((indices, section, index) => {
            if (section.chapterId === chapterId) indices.push(index);
            return indices;
          }, []);
          sectionIndices.reverse().forEach(index => sections.splice(index, 1));
        });
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          code: 200,
          message: '删除课程成功'
        }));
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          code: 404,
          message: '课程不存在'
        }));
      }
    } else if (method === 'GET' && path.match(/^\/chapters\/course\/\d+$/)) {
      // 获取章节列表
      const courseId = parseInt(path.split('/')[3]);
      const courseChapters = chapters.filter(chapter => chapter.courseId === courseId);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        code: 200,
        data: courseChapters,
        message: '获取章节列表成功'
      }));
    } else if (method === 'POST' && path === '/chapters') {
      // 创建章节
      const chapter = parsedBody;
      chapter.id = chapters.length + 1;
      chapters.push(chapter);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        code: 200,
        data: chapter,
        message: '创建章节成功'
      }));
    } else if (method === 'PUT' && path.match(/^\/chapters\/\d+$/)) {
      // 更新章节
      const id = parseInt(path.split('/')[2]);
      const chapterIndex = chapters.findIndex(chapter => chapter.id === id);
      if (chapterIndex !== -1) {
        chapters[chapterIndex] = { ...chapters[chapterIndex], ...parsedBody };
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          code: 200,
          data: chapters[chapterIndex],
          message: '更新章节成功'
        }));
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          code: 404,
          message: '章节不存在'
        }));
      }
    } else if (method === 'DELETE' && path.match(/^\/chapters\/\d+$/)) {
      // 删除章节
      const id = parseInt(path.split('/')[2]);
      const chapterIndex = chapters.findIndex(chapter => chapter.id === id);
      if (chapterIndex !== -1) {
        chapters.splice(chapterIndex, 1);
        // 同时删除相关的小节
        const sectionIndices = sections.reduce((indices, section, index) => {
          if (section.chapterId === id) indices.push(index);
          return indices;
        }, []);
        sectionIndices.reverse().forEach(index => sections.splice(index, 1));
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          code: 200,
          message: '删除章节成功'
        }));
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          code: 404,
          message: '章节不存在'
        }));
      }
    } else if (method === 'GET' && path.match(/^\/sections\/chapter\/\d+$/)) {
      // 获取小节列表
      const chapterId = parseInt(path.split('/')[3]);
      const chapterSections = sections.filter(section => section.chapterId === chapterId);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        code: 200,
        data: chapterSections,
        message: '获取小节列表成功'
      }));
    } else if (method === 'POST' && path === '/sections') {
      // 创建小节
      const section = parsedBody;
      section.id = sections.length + 1;
      sections.push(section);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        code: 200,
        data: section,
        message: '创建小节成功'
      }));
    } else if (method === 'PUT' && path.match(/^\/sections\/\d+$/)) {
      // 更新小节
      const id = parseInt(path.split('/')[2]);
      const sectionIndex = sections.findIndex(section => section.id === id);
      if (sectionIndex !== -1) {
        sections[sectionIndex] = { ...sections[sectionIndex], ...parsedBody };
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          code: 200,
          data: sections[sectionIndex],
          message: '更新小节成功'
        }));
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          code: 404,
          message: '小节不存在'
        }));
      }
    } else if (method === 'DELETE' && path.match(/^\/sections\/\d+$/)) {
      // 删除小节
      const id = parseInt(path.split('/')[2]);
      const sectionIndex = sections.findIndex(section => section.id === id);
      if (sectionIndex !== -1) {
        sections.splice(sectionIndex, 1);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          code: 200,
          message: '删除小节成功'
        }));
      } else {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          code: 404,
          message: '小节不存在'
        }));
      }
    } else if (method === 'GET' && path === '/sysUser/page') {
      // 获取用户列表
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        code: 200,
        data: {
          rows: [],
          total: 0
        },
        message: '获取用户列表成功'
      }));
    } else if (method === 'GET' && path === '/sysRole/page') {
      // 获取角色列表
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        code: 200,
        data: {
          rows: [],
          total: 0
        },
        message: '获取角色列表成功'
      }));
    } else if (method === 'POST' && path === '/ai/generate-content') {
      // 生成AI内容
      const { prompt, type } = parsedBody;
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        code: 200,
        data: {
          content: `这是AI生成的${type}内容，基于提示：${prompt}`,
          type: type
        },
        message: '生成内容成功'
      }));
    } else if (method === 'POST' && path === '/ai/analyze-course') {
      // 分析课程
      const { courseId, courseName } = parsedBody;
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        code: 200,
        data: {
          courseId: courseId,
          courseName: courseName,
          analysis: `课程分析结果：这是一门关于${courseName}的课程，内容丰富，结构清晰。`,
          suggestions: '建议添加更多实践案例和互动环节。'
        },
        message: '分析课程成功'
      }));
    } else if (method === 'POST' && path === '/upload') {
      // 模拟文件上传
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        code: 200,
        data: {
          url: 'https://example.com/uploaded-file.jpg'
        },
        message: '上传成功'
      }));
    } else {
      // 未找到接口
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        code: 404,
        message: '接口不存在'
      }));
    }
  });
}

// 创建服务器
const server = http.createServer(handleRequest);

// 启动服务器
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Mock backend server running on port ${PORT}`);
  console.log('API endpoints:');
  console.log('- GET /courses - 获取课程列表');
  console.log('- POST /courses - 创建课程');
  console.log('- GET /courses/:id - 获取课程详情');
  console.log('- PUT /courses/:id - 更新课程');
  console.log('- DELETE /courses/:id - 删除课程');
  console.log('- GET /chapters/course/:courseId - 获取章节列表');
  console.log('- POST /chapters - 创建章节');
  console.log('- PUT /chapters/:id - 更新章节');
  console.log('- DELETE /chapters/:id - 删除章节');
  console.log('- GET /sections/chapter/:chapterId - 获取小节列表');
  console.log('- POST /sections - 创建小节');
  console.log('- PUT /sections/:id - 更新小节');
  console.log('- DELETE /sections/:id - 删除小节');
  console.log('- GET /sysUser/page - 获取用户列表');
  console.log('- GET /sysRole/page - 获取角色列表');
  console.log('- POST /ai/generate-content - 生成AI内容');
  console.log('- POST /ai/analyze-course - 分析课程');
  console.log('- POST /upload - 上传文件');
});
