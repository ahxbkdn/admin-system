import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Popconfirm,
  message,
  Tag,
  Spin,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

interface Question {
  id: number;
  categoryId: number;
  title: string;
  tags: string[];
  difficulty: number;
  content: string;
  status: number;
}

interface Category {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  sort: number;
  status: number;
}

const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 从后端获取分类列表
  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/interview/categories');
      if (response.data.code === 200) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('获取分类失败:', error);
      message.error('获取分类失败');
    }
  };

  // 从后端获取面试题列表
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/interview/questions');
      if (response.data.code === 200) {
        setQuestions(response.data.data);
      }
    } catch (error) {
      console.error('获取面试题失败:', error);
      message.error('获取面试题失败');
    } finally {
      setLoading(false);
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchCategories();
    fetchQuestions();
  }, []);

  const handleAdd = () => {
    setEditingQuestion(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    // 将标签数组转换为逗号分隔的字符串
    const formValues = {
      ...question,
      tags: question.tags.join(', ')
    };
    form.setFieldsValue(formValues);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await axios.delete(`/api/interview/questions/${id}`);
      if (response.data.code === 200) {
        message.success('删除成功');
        // 重新获取面试题列表
        fetchQuestions();
      } else {
        message.error(response.data.message || '删除失败');
      }
    } catch (error) {
      console.error('删除面试题失败:', error);
      message.error('删除面试题失败');
    }
  };

  const handleSave = async () => {
    form.validateFields().then(async (values) => {
      try {
        // 将标签字符串转换为数组
        const submitValues = {
          ...values,
          tags: typeof values.tags === 'string' ? values.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : values.tags
        };
        
        let response;
        if (editingQuestion) {
          // 更新面试题
          response = await axios.put(`/api/interview/questions/${editingQuestion.id}`, submitValues);
        } else {
          // 添加面试题
          response = await axios.post('/api/interview/questions', submitValues);
        }
        
        if (response.data.code === 200) {
          message.success(editingQuestion ? '更新成功' : '添加成功');
          setIsModalOpen(false);
          // 重新获取面试题列表
          fetchQuestions();
        } else {
          message.error(response.data.message || (editingQuestion ? '更新失败' : '添加失败'));
        }
      } catch (error) {
        console.error(editingQuestion ? '更新面试题失败:' : '添加面试题失败:', error);
        message.error(editingQuestion ? '更新面试题失败' : '添加面试题失败');
      }
    });
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : '未知分类';
  };

  const getDifficultyLevel = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return '简单';
      case 2:
        return '中等';
      case 3:
        return '困难';
      default:
        return '未知';
    }
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '分类',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (categoryId: number) => getCategoryName(categoryId),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: any) => (
        <Space size="small">
          {Array.isArray(tags) ? tags.map((tag: string) => (
            <Tag key={tag}>{tag}</Tag>
          )) : (
            <span>{typeof tags === 'string' ? tags : '无标签'}</span>
          )}
        </Space>
      ),
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (difficulty: number) => getDifficultyLevel(difficulty),
    },
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => (
        <span>{status === 1 ? '启用' : '禁用'}</span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Question) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个面试题吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>面试题管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加面试题
        </Button>
      </div>

      <Spin spinning={loading} description="加载中...">
        <Table columns={columns} dataSource={questions} rowKey="id" />
      </Spin>

      <Modal
        title={editingQuestion ? '编辑面试题' : '添加面试题'}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="categoryId"
            label="分类"
            rules={[{ required: true, message: '请选择分类' }]}
          >
            <Select placeholder="请选择分类">
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入标题" />
          </Form.Item>

          <Form.Item
            name="tags"
            label="标签"
            rules={[{ required: true, message: '请输入标签' }]}
          >
            <Input placeholder="请输入标签，用逗号分隔" />
          </Form.Item>

          <Form.Item
            name="difficulty"
            label="难度"
            rules={[{ required: true, message: '请选择难度' }]}
          >
            <Select placeholder="请选择难度">
              <Option value={1}>简单</Option>
              <Option value={2}>中等</Option>
              <Option value={3}>困难</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入内容" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="请选择状态">
              <Option value={1}>启用</Option>
              <Option value={0}>禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default QuestionsPage;