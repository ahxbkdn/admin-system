import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Switch,
  Select,
  Popconfirm,
  Space,
  Typography,
  Divider,
} from 'antd';
import { UploadOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl: string;
  sort: number;
  status: number;
  createTime: string;
  updateTime: string;
}

const Banners: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [form] = Form.useForm();

  // 获取轮播图列表
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8086/api/banner/list');
      if (response.data.code === 200) {
        setBanners(response.data.data);
      }
    } catch (error) {
      message.error('获取轮播图列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // 打开添加弹窗
  const handleAdd = () => {
    setEditingBanner(null);
    form.resetFields();
    setVisible(true);
  };

  // 打开编辑弹窗
  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    form.setFieldsValue({
      title: banner.title,
      imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl,
      sort: banner.sort,
      status: banner.status,
    });
    setVisible(true);
  };

  // 保存轮播图
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const bannerData = {
        ...values,
        id: editingBanner?.id,
      };

      let response;
      if (editingBanner) {
        response = await axios.put('http://localhost:8086/api/banner/update', bannerData);
      } else {
        response = await axios.post('http://localhost:8086/api/banner/add', bannerData);
      }

      if (response.data.code === 200) {
        message.success(editingBanner ? '更新成功' : '添加成功');
        setVisible(false);
        fetchBanners();
      }
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 删除轮播图
  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`http://localhost:8086/api/banner/delete/${id}`);
      if (response.data.code === 200) {
        message.success('删除成功');
        fetchBanners();
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 预览轮播图
  const handlePreview = (banner: Banner) => {
    // 这里可以实现预览功能，比如打开一个新窗口显示图片
    window.open(banner.imageUrl, '_blank');
  };

  // 文件上传
  const handleUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post('http://localhost:8086/api/banner/upload', formData);
      
      if (response.data.code === 200) {
        onSuccess({ url: response.data.data.url });
      } else {
        onError(new Error('上传失败'));
        message.error('上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      onError(error);
      message.error('上传失败');
    }
  };

  // 上传成功处理
  const handleUploadSuccess = (info: any) => {
    console.log('上传成功:', info);
    form.setFieldsValue({ imageUrl: info.url });
    message.success('图片上传成功');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '图片',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl: string) => (
        <div style={{ width: 120, height: 60, overflow: 'hidden', borderRadius: 4 }}>
          <img src={imageUrl} alt="轮播图" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ),
    },
    {
      title: '链接',
      dataIndex: 'linkUrl',
      key: 'linkUrl',
      ellipsis: true,
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: number) => (
        <Switch checked={status === 1} disabled />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      ellipsis: true,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      render: (_: any, record: Banner) => (
        <Space size="small">
          <Button type="primary" icon={<EyeOutlined />} size="small" onClick={() => handlePreview(record)}>预览</Button>
          <Button icon={<EditOutlined />} size="small" onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm
            title="确定要删除这个轮播图吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button danger icon={<DeleteOutlined />} size="small">删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={4}>轮播图管理</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加轮播图
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={banners}
        loading={loading}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingBanner ? '编辑轮播图' : '添加轮播图'}
        open={visible}
        onOk={handleSave}
        onCancel={() => setVisible(false)}
        width={700}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入标题' }]}
          >
            <Input placeholder="请输入轮播图标题" size="large" />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="轮播图地址"
            rules={[{ required: true, message: '请上传轮播图' }]}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <Upload
                name="file"
                customRequest={handleUpload}
                onSuccess={handleUploadSuccess}
                onError={(error) => console.error('上传错误:', error)}
                showUploadList={false}
                maxCount={1}
              >
                <Button type="primary" icon={<UploadOutlined />}>上传图片</Button>
              </Upload>
              <Form.Item noStyle>
                <Input
                  placeholder="图片URL"
                  style={{ flex: 1, minWidth: 300 }}
                  size="large"
                />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item
            name="linkUrl"
            label="跳转链接"
            rules={[{ required: true, message: '请输入跳转链接' }]}
          >
            <Input placeholder="请输入跳转链接" size="large" />
          </Form.Item>

          <div style={{ display: 'flex', gap: 20 }}>
            <Form.Item
              name="sort"
              label="排序"
              rules={[{ required: true, message: '请输入排序' }]}
              style={{ flex: 1 }}
            >
              <Input type="number" placeholder="请输入排序" size="large" />
            </Form.Item>

            <Form.Item
              name="status"
              label="状态"
              rules={[{ required: true, message: '请选择状态' }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="请选择状态" size="large">
                <Option value={1}>启用</Option>
                <Option value={0}>禁用</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Banners;
