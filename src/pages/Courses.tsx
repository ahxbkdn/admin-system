import React, { useState, useEffect } from 'react';
import { Input, Select, Space, Form, message, Upload, Button, Modal, Radio, Popconfirm, Table, Card } from 'antd';
import { UploadOutlined, PlusOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import request from '../utils/request';

const { Option } = Select;
const { TextArea } = Input;

const Courses: React.FC = () => {
  const [view, setView] = useState('form'); // 默认显示添加课程表单
  const [courses, setCourses] = useState<any[]>([]);
  const [currentCourse, setCurrentCourse] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1); // 默认进入添加课程步骤
  const [chapters, setChapters] = useState<any[]>([]);
  const [sections, setSections] = useState<any[]>([]);
  const [form] = Form.useForm();
  const [chapterForm] = Form.useForm();
  const [sectionForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [chapterModalVisible, setChapterModalVisible] = useState(false);
  const [sectionModalVisible, setSectionModalVisible] = useState(false);
  const [editingChapter, setEditingChapter] = useState<any>(null);
  const [editingSection, setEditingSection] = useState<any>(null);
  const [currentChapterId, setCurrentChapterId] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    minHours: '',
    maxHours: ''
  });

  // 获取课程列表
  const fetchCourses = async () => {
    setLoading(true);
    try {
      // 构建查询参数
      const params: any = {};
      if (searchKeyword) params.keyword = searchKeyword;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters.minHours) params.minHours = filters.minHours;
      if (filters.maxHours) params.maxHours = filters.maxHours;
      
      const res = await request.get('/courses', { params });
      if (res.code === 200) setCourses(res.data || []);
      else message.error(res.message || '获取课程列表失败');
    } catch (e) { message.error('网络错误'); }
    finally { setLoading(false); }
  };

  // 处理搜索
  const handleSearch = () => {
    fetchCourses();
  };

  // 处理筛选变化
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 重置筛选
  const handleResetFilters = () => {
    setSearchKeyword('');
    setFilters({
      minPrice: '',
      maxPrice: '',
      minHours: '',
      maxHours: ''
    });
    fetchCourses();
  };

  // 获取章节列表
  const fetchChapters = async (courseId: number) => {
    setLoading(true);
    try {
      const res = await request.get('/chapters');
      if (res.code === 200) {
        const courseChapters = res.data.filter((chapter: any) => chapter.course_id === courseId);
        setChapters(courseChapters);
      } else {
        message.error(res.message || '获取章节列表失败');
      }
    } catch (e) { message.error('网络错误'); }
    finally { setLoading(false); }
  };

  // 获取小节列表
  const fetchSections = async (chapterId: number) => {
    setLoading(true);
    try {
      const res = await request.get('/sections');
      if (res.code === 200) {
        const chapterSections = res.data.filter((section: any) => section.chapter_id === chapterId);
        setSections(chapterSections);
      } else {
        message.error(res.message || '获取小节列表失败');
      }
    } catch (e) { message.error('网络错误'); }
    finally { setLoading(false); }
  };

  // 初始化课程列表
  useEffect(() => {
    if (view === 'list') fetchCourses();
  }, [view]);

  // 当进入章节管理页面时获取章节列表
  useEffect(() => {
    if (currentCourse && currentStep === 2) {
      fetchChapters(currentCourse.id);
    }
  }, [currentCourse, currentStep]);

  // 当章节列表变化时，获取第一个章节的小节列表
  useEffect(() => {
    if (chapters.length > 0) {
      fetchSections(chapters[0].id);
    }
  }, [chapters]);

  // 编辑课程
  const handleEditCourse = (course: any) => {
    setCurrentCourse(course);
    form.setFieldsValue({
      title: course.title,
      lecturer: course.lecturer,
      totalHours: course.totalHours,
      description: course.description,
      price: course.price
    });
    setView('form');
    setCurrentStep(1);
  };

  // 删除课程
  const handleDeleteCourse = async (courseId: number) => {
    try {
      const response = await request.delete(`/courses/${courseId}`);
      if (response.code === 200) {
        message.success('删除成功');
        fetchCourses();
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error) {
      message.error('网络错误，删除失败');
    }
  };

  // 保存课程
  const handleSaveCourse = async () => {
    try {
      const values = await form.validateFields();
      const courseData = {
        title: values.title,
        description: values.description,
        lecturer: values.lecturer,
        totalHours: values.totalHours,
        price: values.price
      };
      
      const url = currentCourse ? `/courses/${currentCourse.id}` : '/courses';
      const method = currentCourse ? 'put' : 'post';
      const response = await request[method](url, courseData);

      if (response.code === 200) {
        message.success('课程保存成功');
        setCurrentCourse(response.data);
        // 自动为新课程添加默认章节
        const defaultChapters = [
          { course_id: response.data.id, title: '第一章 课程介绍', order: 1 },
          { course_id: response.data.id, title: '第二章 基础入门', order: 2 }
        ];
        // 批量添加默认章节
        Promise.all(
          defaultChapters.map(chapter => 
            request.post('/chapters', chapter)
          )
        ).then(() => {
          setCurrentStep(2);
        }).catch(() => {
          setCurrentStep(2);
        });
      } else {
        message.error(response.message || '保存失败');
      }
    } catch (error) {
      message.error('表单验证失败');
    }
  };

  // 直接创建课程并进入添加课程页面
  const handleCreateCourse = () => {
    setCurrentCourse(null);
    form.resetFields();
    setView('form');
    setCurrentStep(1);
  };

  // 添加章节
  const handleAddChapter = () => {
    setEditingChapter(null);
    chapterForm.resetFields();
    setChapterModalVisible(true);
  };

  // 编辑章节
  const handleEditChapter = (chapter: any) => {
    setEditingChapter(chapter);
    chapterForm.setFieldsValue({
      title: chapter.title,
      order: chapter.order
    });
    setChapterModalVisible(true);
  };

  // 删除章节
  const handleDeleteChapter = async (chapterId: number) => {
    try {
      const response = await request.delete(`/chapters/${chapterId}`);
      if (response.code === 200) {
        message.success('章节删除成功');
        fetchChapters(currentCourse.id);
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error) {
      message.error('网络错误，删除失败');
    }
  };

  // 保存章节
  const handleSaveChapter = async () => {
    try {
      const values = await chapterForm.validateFields();
      const chapterData = {
        course_id: currentCourse.id,
        title: values.title,
        order: values.order,
        id: editingChapter?.id
      };
      
      const url = editingChapter ? `/chapters/${editingChapter.id}` : '/chapters';
      const method = editingChapter ? 'put' : 'post';
      const response = await request[method](url, chapterData);
      
      if (response.code === 200) {
        message.success(editingChapter ? '章节更新成功' : '章节添加成功');
        setChapterModalVisible(false);
        fetchChapters(currentCourse.id);
      } else {
        message.error(response.message || '保存失败');
      }
    } catch (error) {
      message.error('表单验证失败');
    }
  };

  // 添加小节
  const handleAddSection = (chapterId: number) => {
    setCurrentChapterId(chapterId);
    setEditingSection(null);
    sectionForm.resetFields();
    setSectionModalVisible(true);
  };

  // 编辑小节
  const handleEditSection = (section: any) => {
    setEditingSection(section);
    const formValues: any = {
      title: section.title,
      order: section.order,
      isFree: section.isFree
    };
    // 设置视频URL
    if (section.videoUrl) {
      formValues.videoUrl = [{ url: section.videoUrl, uid: Date.now(), name: 'video.mp4', status: 'done' }];
    }
    sectionForm.setFieldsValue(formValues);
    setSectionModalVisible(true);
  };

  // 删除小节
  const handleDeleteSection = async (sectionId: number) => {
    try {
      const response = await request.delete(`/sections/${sectionId}`);
      if (response.code === 200) {
        message.success('小节删除成功');
        if (currentChapterId) {
          fetchSections(currentChapterId);
        }
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error) {
      message.error('网络错误，删除失败');
    }
  };

  // 保存小节
  const handleSaveSection = async () => {
    try {
      const values = await sectionForm.validateFields();
      const sectionData = {
        chapter_id: currentChapterId,
        title: values.title,
        content: values.content || '',
        order: values.order,
        id: editingSection?.id
      };
      
      // 处理视频上传
      if (values.videoUrl && values.videoUrl.length > 0) {
        sectionData.videoUrl = values.videoUrl[0].url;
      }
      
      const url = editingSection ? `/sections/${editingSection.id}` : '/sections';
      const method = editingSection ? 'put' : 'post';
      const response = await request[method](url, sectionData);
      
      if (response.code === 200) {
        message.success(editingSection ? '小节更新成功' : '小节添加成功');
        setSectionModalVisible(false);
        if (currentChapterId) {
          fetchSections(currentChapterId);
        }
      } else {
        message.error(response.message || '保存失败');
      }
    } catch (error) {
      message.error('表单验证失败');
    }
  };

  // 课程列表列定义
  const columns = [
    { title: '课程标题', dataIndex: 'title', key: 'title' },
    { title: '讲师', dataIndex: 'lecturer', key: 'lecturer' },
    { title: '总课时', dataIndex: 'totalHours', key: 'totalHours' },
    { title: '价格', dataIndex: 'price', key: 'price' },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => handleEditCourse(record)}>编辑</Button>
          <Button type="link" onClick={() => { setCurrentCourse(record); setView('form'); setCurrentStep(2); }}>编辑章节</Button>
          <Popconfirm title="确定删除吗？" onConfirm={() => handleDeleteCourse(record.id)}>
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card 
      title={view === 'form' ? currentStep === 1 ? "添加课程" : "添加章节" : "课程管理"}
      extra={view === 'list' && (
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateCourse}>
          创建新课程
        </Button>
      )}
    >
        {/* 课程列表页面 */}
        {view === 'list' && (
            <>
                
                <Table 
                  columns={columns} 
                  dataSource={courses} 
                  loading={loading} 
                  rowKey="id"
                  pagination={{
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50'],
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条记录`
                  }}
                  scroll={{ x: 800 }}
                />
            </>
        )}
        
        {/* 表单页面（添加课程和章节管理） */}
        {view === 'form' && (
            <>
                <Button 
                  icon={<ArrowLeftOutlined />} 
                  onClick={() => setView('list')} 
                  style={{ marginBottom: 16 }}
                >
                  返回列表
                </Button>
                
                {/* 第一步：添加课程页面 */}
                {currentStep === 1 && (
                    <Form 
                      form={form} 
                      layout="vertical"
                      onFinish={handleSaveCourse}
                      initialValues={{
                        lecturer: "李刚",
                        isFree: true
                      }}
                    >
                        <Form.Item
                            name="title"
                            label="课程标题"
                            rules={[
                              { required: true, message: '请输入课程标题' },
                              { min: 2, max: 50, message: '课程标题长度应在2-50个字符之间' }
                            ]}
                        >
                            <Input placeholder="请输入课程标题" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="lecturer"
                            label="课程主讲老师"
                            rules={[{ required: true, message: '请选择课程主讲老师' }]}
                        >
                            <Select style={{ width: 200 }} size="large">
                                <Option value="李刚">李刚</Option>
                                <Option value="王老师">王老师</Option>
                                <Option value="张老师">张老师</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="totalHours"
                            label="总课时"
                            rules={[
                              { required: true, message: '请输入总课时' },
                              { pattern: /^\d+$/, message: '请输入有效的数字' },
                              { min: 1, message: '总课时至少为1' }
                            ]}
                        >
                            <Input type="number" placeholder="请输入总课时" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="课程简介"
                            rules={[
                              { required: true, message: '请输入课程简介' },
                              { min: 10, message: '课程简介至少10个字符' }
                            ]}
                        >
                            <TextArea rows={4} placeholder="请输入课程简介" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="coverImage"
                            label="课程封面图"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => {
                                if (Array.isArray(e)) {
                                    return e;
                                }
                                if (e.file.status === 'done') {
                                    return [{ ...e.file, url: e.file.response?.data?.url }];
                                }
                                return [];
                            }}
                        >
                            <Upload action="/api/upload" listType="picture" maxCount={1}>
                                <div style={{ 
                                  width: 120, 
                                  height: 120, 
                                  border: '2px dashed #d9d9d9', 
                                  borderRadius: 8, 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  transition: 'all 0.3s'
                                }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <PlusOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                                        <div style={{ marginTop: 8, color: '#666' }}>上传封面</div>
                                    </div>
                                </div>
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            name="price"
                            label="课程价格"
                            rules={[
                              { required: true, message: '请输入课程价格' },
                              { pattern: /^\d+(\.\d{1,2})?$/, message: '请输入有效的价格' },
                              { min: 0, message: '价格不能为负数' }
                            ]}
                        >
                            <Space.Compact style={{ width: '100%' }}>
                                <span>¥</span>
                                <Input placeholder="请输入课程价格" size="large" style={{ flex: 1 }} />
                            </Space.Compact>
                        </Form.Item>

                        <Form.Item>
                            <Button 
                              type="primary" 
                              htmlType="submit" 
                              size="large"
                              loading={loading}
                              style={{ marginTop: 16, minWidth: 120 }}
                            >
                                下一步
                            </Button>
                        </Form.Item>
                    </Form>
                )}

                {/* 第二步：章节管理页面 */}
                {currentStep === 2 && (
                    <div>
                        <Button 
                          type="primary" 
                          icon={<PlusOutlined />} 
                          onClick={handleAddChapter} 
                          style={{ marginBottom: 16 }}
                        >
                            添加章节
                        </Button>

                        {chapters.length === 0 ? (
                            <div style={{ 
                              textAlign: 'center', 
                              padding: '48px 0',
                              backgroundColor: '#fafafa',
                              borderRadius: '8px',
                              border: '1px dashed #d9d9d9'
                            }}>
                                <PlusOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                                <p style={{ marginTop: 16, color: '#999' }}>暂无章节，点击上方按钮添加</p>
                            </div>
                        ) : (
                            <div style={{ 
                              border: '1px solid #e8e8e8', 
                              borderRadius: '8px', 
                              padding: '24px',
                              backgroundColor: '#fff'
                            }}>
                                {chapters.map((chapter) => (
                                    <div 
                                      key={chapter.id} 
                                      style={{ 
                                        marginBottom: '12px',
                                        border: '1px solid #e8e8e8',
                                        borderRadius: '4px',
                                        overflow: 'hidden'
                                      }}
                                    >
                                        <div style={{ 
                                          display: 'flex', 
                                          alignItems: 'center', 
                                          padding: '12px 16px',
                                          backgroundColor: '#fafafa',
                                          borderBottom: '1px solid #e8e8e8'
                                        }}>
                                            <span style={{ marginRight: '12px', cursor: 'pointer' }}>▼</span>
                                            <span style={{ 
                                              fontSize: '14px', 
                                              fontWeight: 'bold', 
                                              marginRight: '16px',
                                              flex: 1
                                            }}>
                                              {chapter.title}
                                            </span>
                                            <span style={{ marginRight: '16px', fontSize: '14px' }}>
                                              <a href="#" onClick={(e) => { e.preventDefault(); handleAddSection(chapter.id); }} style={{ color: '#1890ff', marginRight: '16px' }}>添加小节</a>
                                              <a href="#" onClick={(e) => { e.preventDefault(); handleEditChapter(chapter); }} style={{ color: 'red', marginRight: '16px' }}>修改</a>
                                              <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteChapter(chapter.id); }} style={{ color: 'red' }}>删除</a>
                                            </span>
                                        </div>

                                        <div style={{ padding: '16px', backgroundColor: '#fff' }}>
                                            {sections
                                                .filter(section => section.chapter_id === chapter.id)
                                                .length === 0 ? (
                                                <div style={{ 
                                                  color: '#999',
                                                  padding: '16px 0',
                                                  textAlign: 'center'
                                                }}>
                                                    暂无小节，点击上方按钮添加
                                                </div>
                                            ) : (
                                                sections
                                                    .filter(section => section.chapter_id === chapter.id)
                                                    .sort((a, b) => a.order - b.order)
                                                    .map((section) => (
                                                        <div 
                                                          key={section.id} 
                                                          style={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            marginBottom: '8px',
                                                            paddingLeft: '24px'
                                                          }}
                                                        >
                                                            <span style={{ marginRight: '12px', fontSize: '14px' }}>{section.videoUrl ? '🎬' : '📄'}</span>
                                                            <span style={{ marginRight: '16px', flex: 1, fontSize: '14px' }}>第{section.order}节 {section.title}{section.videoUrl && ' (视频)'}</span>
                                                            <span style={{ fontSize: '14px' }}>
                                                              <a href="#" onClick={(e) => { e.preventDefault(); handleEditSection(section); }} style={{ color: 'red', marginRight: '16px' }}>修改</a>
                                                              <a href="#" onClick={(e) => { e.preventDefault(); handleDeleteSection(section.id); }} style={{ color: 'red' }}>删除</a>
                                                            </span>
                                                        </div>
                                                    ))
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 添加/编辑章节弹窗 */}
                <Modal
                    title={editingChapter ? "编辑章节" : "添加章节"}
                    open={chapterModalVisible}
                    onOk={handleSaveChapter}
                    onCancel={() => setChapterModalVisible(false)}
                    okText="保存"
                    cancelText="取消"
                    confirmLoading={loading}
                >
                    <Form form={chapterForm} layout="vertical">
                        <Form.Item
                            name="title"
                            label="章节标题"
                            rules={[
                              { required: true, message: '请输入章节标题' },
                              { min: 2, max: 50, message: '章节标题长度应在2-50个字符之间' }
                            ]}
                        >
                            <Input placeholder="请输入章节标题" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="order"
                            label="章节排序"
                            rules={[
                              { required: true, message: '请输入章节排序' },
                              { pattern: /^\d+$/, message: '请输入有效的数字' },
                              { min: 1, message: '排序至少为1' }
                            ]}
                        >
                            <Input type="number" placeholder="请输入章节排序" size="large" />
                        </Form.Item>
                    </Form>
                </Modal>

                {/* 添加/编辑小节弹窗 */}
                <Modal
                    title={editingSection ? "编辑小节" : "添加小节"}
                    open={sectionModalVisible}
                    onOk={handleSaveSection}
                    onCancel={() => setSectionModalVisible(false)}
                    okText="保存"
                    cancelText="取消"
                    confirmLoading={loading}
                    width={500}
                >
                    <Form form={sectionForm} layout="vertical">
                        <Form.Item
                            name="title"
                            label="课时名称"
                            rules={[
                              { required: true, message: '请输入课时名称' },
                              { min: 2, max: 50, message: '课时名称长度应在2-50个字符之间' }
                            ]}
                        >
                            <Input placeholder="请输入课时名称" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="order"
                            label="课时排序"
                            rules={[
                              { required: true, message: '请输入课时排序' },
                              { pattern: /^\d+$/, message: '请输入有效的数字' },
                              { min: 1, message: '排序至少为1' }
                            ]}
                        >
                            <Input type="number" placeholder="请输入课时排序" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="isFree"
                            label="是否免费"
                        >
                            <Radio.Group size="large">
                                <Radio value={true}>免费</Radio>
                                <Radio value={false}>收费</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="content"
                            label="课时内容"
                        >
                            <TextArea rows={3} placeholder="请输入课时内容" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="videoUrl"
                            label="视频"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => {
                                if (Array.isArray(e)) {
                                    return e;
                                }
                                // 处理单个文件的情况
                                if (e.file) {
                                    // 如果上传成功，返回包含文件信息的数组
                                    if (e.file.status === 'done' && e.file.response?.code === 200) {
                                        return [{ 
                                            ...e.file, 
                                            url: e.file.response.data.url 
                                        }];
                                    }
                                    // 如果正在上传或上传失败，返回当前文件状态
                                    return [e.file];
                                }
                                return [];
                            }}
                        >
                            <Upload 
                                action="/api/upload" 
                                listType="file" 
                                maxCount={1} 
                                showUploadList={true}
                                accept="video/*,image/*"
                            >
                                <div style={{ 
                                  width: 120, 
                                  height: 120, 
                                  border: '2px dashed #d9d9d9', 
                                  borderRadius: 8, 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  justifyContent: 'center',
                                  transition: 'all 0.3s'
                                }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <PlusOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                                        <div style={{ marginTop: 8, color: '#666' }}>上传视频</div>
                                    </div>
                                </div>
                            </Upload>
                        </Form.Item>
                    </Form>
                </Modal>
            </>
        )}
    </Card>
  );
};

export default Courses;