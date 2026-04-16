import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Select,
  Space,
  Popconfirm,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { UploadFile } from 'antd/es/upload/interface';

const { Option } = Select;

interface Category {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  sort: number;
  status: number;
}

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  // 模拟数据
  useEffect(() => {
    const mockData: Category[] = [
      {
        id: '1',
        name: '前端开发',
        description: '前端开发相关面试题',
        iconUrl: 'https://example.com/icon1.png',
        sort: 1,
        status: 1,
      },
      {
        id: '2',
        name: '后端开发',
        description: '后端开发相关面试题',
        iconUrl: 'https://example.com/icon2.png',
        sort: 2,
        status: 1,
      },
      {
        id: '3',
        name: '移动端开发',
        description: '移动端开发相关面试题',
        iconUrl: 'https://example.com/icon3.png',
        sort: 3,
        status: 0,
      },
    ];
    setCategories(mockData);
  }, []);

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id));
    message.success('删除成功');
  };

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingCategory) {
        // 更新分类
        setCategories(
          categories.map((category) =>
            category.id === editingCategory.id ? { ...category, ...values } : category
          )
        );
        message.success('更新成功');
      } else {
        // 添加分类
        const newCategory: Category = {
          id: String(categories.length + 1),
          ...values,
        };
        setCategories([...categories, newCategory]);
        message.success('添加成功');
      }
      setIsModalOpen(false);
    });
  };

  const uploadProps: UploadProps = {
    name: 'file',
    // 使用相对路径，避免跨域问题
    action: '/api/upload',
    // 限制文件类型为图片
    accept: 'image/*',
    // 限制文件大小为2MB
    maxCount: 1,
    // 允许跨越上传
    withCredentials: false,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
      if (!isJpgOrPng) {
        message.error('只能上传JPG、PNG或GIF格式的图片！');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过2MB！');
        return false;
      }
      return true;
    },
    onChange(info) {
      if (info.file.status === 'uploading') {
        // 可以添加上传进度显示
        console.log('上传中...', info.file.percent);
      } else if (info.file.status === 'done') {
        message.success(`${info.file.name} 上传成功`);
        // 确保响应格式正确
        if (info.file.response && info.file.response.data && info.file.response.data.url) {
          form.setFieldsValue({ iconUrl: info.file.response.data.url });
        } else {
          message.error('上传成功但返回格式错误');
          console.error('响应格式错误:', info.file.response);
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 上传失败`);
        console.error('上传错误:', info.file.error);
      }
    },
  };

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '图标',
      dataIndex: 'iconUrl',
      key: 'iconUrl',
      render: (iconUrl: string) => (
        <img src={iconUrl} alt="icon" style={{ width: 40, height: 40 }} />
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
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
      render: (_: any, record: Category) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定删除这个分类吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button danger icon={<DeleteOutlined />}>
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
        <h1>面试题分类管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加分类
        </Button>
      </div>

      <Table columns={columns} dataSource={categories} rowKey="id" />

      <Modal
        title={editingCategory ? '编辑分类' : '添加分类'}
        open={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="分类描述"
            rules={[{ required: true, message: '请输入分类描述' }]}
          >
            <Input.TextArea placeholder="请输入分类描述" />
          </Form.Item>

          <Form.Item name="iconUrl" label="图标地址">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Form.Item
                name="iconUrl"
                noStyle
                rules={[{ required: true, message: '请上传图标' }]}
              >
                <Input style={{ flex: 1, marginRight: 8 }} placeholder="图标URL" />
              </Form.Item>
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>上传</Button>
              </Upload>
            </div>
          </Form.Item>

          <Form.Item
            name="sort"
            label="排序"
            rules={[{ required: true, message: '请输入排序' }]}
          >
            <Input type="number" placeholder="请输入排序" />
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

export default CategoriesPage;