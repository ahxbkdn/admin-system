# 章节页面问题修复 - 实现计划

## [x] 任务1: 检查后端章节数据初始化
- **优先级**: P0
- **依赖**: 无
- **描述**:
  - 检查course-management-service.py中的init_data函数，确认章节数据是否正确初始化
  - 验证章节数据的course_id是否与前端创建的课程ID匹配
- **成功标准**:
  - 后端初始化至少2条章节数据
  - 章节数据包含正确的course_id字段
- **测试要求**:
  - `programmatic` TR-1.1: 调用GET /api/chapters API返回包含章节数据的响应
  - `programmatic` TR-1.2: 章节数据中包含course_id字段

## [x] 任务2: 检查前端课程创建逻辑
- **优先级**: P0
- **依赖**: 任务1
- **描述**:
  - 检查handleSaveCourse函数，确认创建课程后是否正确设置currentCourse
  - 验证currentCourse.id是否正确传递给fetchChapters函数
- **成功标准**:
  - 创建课程后currentCourse包含有效的id字段
  - 点击下一步后正确调用fetchChapters获取章节数据
- **测试要求**:
  - `programmatic` TR-2.1: 调用POST /api/courses API成功创建课程
  - `human-judgement` TR-2.2: 点击下一步后章节页面显示章节列表

## [x] 任务3: 检查前端章节获取逻辑
- **优先级**: P1
- **依赖**: 任务2
- **描述**:
  - 检查fetchChapters函数，确认是否正确过滤课程的章节
  - 验证useEffect中调用fetchChapters的条件是否正确
- **成功标准**:
  - fetchChapters函数正确过滤当前课程的章节
  - 章节列表正确显示在页面上
- **测试要求**:
  - `programmatic` TR-3.1: fetchChapters函数正确调用GET /api/chapters API
  - `human-judgement` TR-3.2: 章节列表显示正确的章节数据

## [x] 任务4: 检查添加章节功能
- **优先级**: P1
- **依赖**: 任务3
- **描述**:
  - 检查handleAddChapter和handleSaveChapter函数
  - 验证添加章节时是否正确设置course_id
- **成功标准**:
  - 点击"添加章节"按钮显示弹窗
  - 提交后成功创建章节并更新章节列表
- **测试要求**:
  - `programmatic` TR-4.1: 调用POST /api/chapters API成功创建章节
  - `human-judgement` TR-4.2: 章节列表中显示新添加的章节

## [x] 任务5: 检查添加小节功能
- **优先级**: P1
- **依赖**: 任务4
- **描述**:
  - 检查handleAddSection和handleSaveSection函数
  - 验证添加小节时是否正确设置chapter_id
- **成功标准**:
  - 点击"添加小节"按钮显示弹窗
  - 提交后成功创建小节并更新小节列表
- **测试要求**:
  - `programmatic` TR-5.1: 调用POST /api/sections API成功创建小节
  - `human-judgement` TR-5.2: 小节列表中显示新添加的小节

## [x] 任务6: 综合测试
- **优先级**: P2
- **依赖**: 任务1-5
- **描述**:
  - 完整测试章节页面的所有功能
  - 验证增删改操作是否正常工作
- **成功标准**:
  - 章节页面显示正确的章节和小节列表
  - 所有CRUD操作正常工作
- **测试要求**:
  - `human-judgement` TR-6.1: 章节页面显示与图2一致
  - `human-judgement` TR-6.2: 添加小节弹窗显示与图1一致
  - `programmatic` TR-6.3: 所有API调用返回200状态码