import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// 模拟课程数据
const courses = [
  {
    id: 1,
    title: 'Spring Boot 基础教程',
    description: 'Spring Boot 入门到精通',
    coverImage: 'https://example.com/cover1.jpg',
    status: 1,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  },
  {
    id: 2,
    title: 'React 实战教程',
    description: 'React 从基础到高级',
    coverImage: 'https://example.com/cover2.jpg',
    status: 1,
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  }
];

// 模拟用户数据
const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    nickname: '管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    status: 1
  },
  {
    id: 2,
    username: 'user',
    password: 'user123',
    nickname: '普通用户',
    email: 'user@example.com',
    phone: '13900139000',
    status: 1
  }
];

// 模拟角色数据
const roles = [
  {
    id: 1,
    roleName: '管理员',
    roleCode: 'ADMIN',
    description: '系统管理员',
    status: 1
  },
  {
    id: 2,
    roleName: '普通用户',
    roleCode: 'USER',
    description: '普通用户',
    status: 1
  }
];

// 课程相关接口
app.get('/courses', (req, res) => {
  res.json({
    code: 200,
    data: courses,
    message: '获取课程列表成功'
  });
});

app.post('/courses', (req, res) => {
  const course = req.body;
  course.id = courses.length + 1;
  course.createTime = new Date().toISOString();
  course.updateTime = new Date().toISOString();
  courses.push(course);
  res.json({
    code: 200,
    data: course,
    message: '创建课程成功'
  });
});

app.get('/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const course = courses.find(c => c.id === id);
  if (course) {
    res.json({
      code: 200,
      data: course,
      message: '获取课程成功'
    });
  } else {
    res.json({
      code: 404,
      message: '课程不存在'
    });
  }
});

app.put('/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const courseIndex = courses.findIndex(c => c.id === id);
  if (courseIndex !== -1) {
    courses[courseIndex] = { ...courses[courseIndex], ...req.body, updateTime: new Date().toISOString() };
    res.json({
      code: 200,
      data: courses[courseIndex],
      message: '更新课程成功'
    });
  } else {
    res.json({
      code: 404,
      message: '课程不存在'
    });
  }
});

app.delete('/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const courseIndex = courses.findIndex(c => c.id === id);
  if (courseIndex !== -1) {
    courses.splice(courseIndex, 1);
    res.json({
      code: 200,
      message: '删除课程成功'
    });
  } else {
    res.json({
      code: 404,
      message: '课程不存在'
    });
  }
});

// 章节相关接口
app.get('/chapters/course/:courseId', (req, res) => {
  const courseId = parseInt(req.params.courseId);
  res.json({
    code: 200,
    data: [
      {
        id: 1,
        courseId: courseId,
        title: '第一章 简介',
        sort: 1
      },
      {
        id: 2,
        courseId: courseId,
        title: '第二章 基础',
        sort: 2
      }
    ],
    message: '获取章节列表成功'
  });
});

// 小节相关接口
app.get('/sections/chapter/:chapterId', (req, res) => {
  const chapterId = parseInt(req.params.chapterId);
  res.json({
    code: 200,
    data: [
      {
        id: 1,
        chapterId: chapterId,
        title: '1.1 什么是课程',
        content: '课程是...',
        videoUrl: 'https://example.com/video1.mp4',
        duration: 600,
        sort: 1
      },
      {
        id: 2,
        chapterId: chapterId,
        title: '1.2 课程的重要性',
        content: '课程很重要...',
        videoUrl: 'https://example.com/video2.mp4',
        duration: 480,
        sort: 2
      }
    ],
    message: '获取小节列表成功'
  });
});

// 用户相关接口
app.get('/sysUser/page', (req, res) => {
  res.json({
    code: 200,
    data: {
      rows: users,
      total: users.length
    },
    message: '获取用户列表成功'
  });
});

// 角色相关接口
app.get('/sysRole/page', (req, res) => {
  res.json({
    code: 200,
    data: {
      rows: roles,
      total: roles.length
    },
    message: '获取角色列表成功'
  });
});

// AI服务接口
app.post('/ai/generate-content', (req, res) => {
  const { prompt, type } = req.body;
  res.json({
    code: 200,
    data: {
      content: `这是AI生成的${type}内容，基于提示：${prompt}`,
      type: type
    },
    message: '生成内容成功'
  });
});

app.post('/ai/analyze-course', (req, res) => {
  const { courseId, courseName } = req.body;
  res.json({
    code: 200,
    data: {
      courseId: courseId,
      courseName: courseName,
      analysis: `课程分析结果：这是一门关于${courseName}的课程，内容丰富，结构清晰。`,
      suggestions: '建议添加更多实践案例和互动环节。'
    },
    message: '分析课程成功'
  });
});

// 启动服务器
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Mock backend server running on port ${PORT}`);
  console.log('API endpoints:');
  console.log('- GET /courses - 获取课程列表');
  console.log('- POST /courses - 创建课程');
  console.log('- GET /courses/:id - 获取课程详情');
  console.log('- PUT /courses/:id - 更新课程');
  console.log('- DELETE /courses/:id - 删除课程');
  console.log('- GET /chapters/course/:courseId - 获取章节列表');
  console.log('- GET /sections/chapter/:chapterId - 获取小节列表');
  console.log('- GET /sysUser/page - 获取用户列表');
  console.log('- GET /sysRole/page - 获取角色列表');
  console.log('- POST /ai/generate-content - 生成AI内容');
  console.log('- POST /ai/analyze-course - 分析课程');
});