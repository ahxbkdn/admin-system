import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Input, Select, DatePicker, Space, Row, Col, Tabs, Switch, Typography, Divider, Modal, Form, message, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import request from '../utils/request';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Item } = Form;

interface PositionData {
  key: string;
  id: string;
  postName: string;
  postCode: string;
  postSort: number;
  status: boolean;
  createTime: string;
}

interface SearchParams {
  postName: string;
  postCode: string;
  status: string;
  createTime: any[];
}

const Positions: React.FC = () => {
  const [form] = Form.useForm();
  const [positions, setPositions] = useState<PositionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentPosition, setCurrentPosition] = useState<PositionData | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    postName: '',
    postCode: '',
    status: '',
    createTime: [],
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const errorShownRef = useRef(false);

  // 获取岗位列表
  const fetchPositions = async () => {
    setLoading(true);
    try {
      // 由于后端API中没有岗位相关的接口，暂时使用模拟数据
      throw new Error('后端API中没有岗位相关接口');
    } catch (error) {
      console.error('获取岗位列表失败:', error);
      if (!errorShownRef.current) {
        message.error('获取岗位列表失败，使用模拟数据');
        errorShownRef.current = true;
      }
      // 提供模拟数据
      let mockData = [
        {
          key: '1',
          id: '1',
          postName: '产品经理',
          postCode: 'PM',
          postSort: 1,
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
        {
          key: '2',
          id: '2',
          postName: '前端开发',
          postCode: 'FE',
          postSort: 2,
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
        {
          key: '3',
          id: '3',
          postName: '后端开发',
          postCode: 'BE',
          postSort: 3,
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
      ];
      
      // 模拟搜索功能 - 支持多字段搜索
      if (searchParams.postName) {
        mockData = mockData.filter(post => 
          post.postName.includes(searchParams.postName) || 
          post.postCode.includes(searchParams.postName)
        );
      }
      if (searchParams.postCode) {
        mockData = mockData.filter(post => 
          post.postName.includes(searchParams.postCode) || 
          post.postCode.includes(searchParams.postCode)
        );
      }
      if (searchParams.status) {
        mockData = mockData.filter(post => post.status === (searchParams.status === '0'));
      }
      // 添加日期范围搜索
      if (searchParams.createTime && searchParams.createTime.length === 2) {
        const startTime = searchParams.createTime[0].format('YYYY-MM-DD HH:mm:ss');
        const endTime = searchParams.createTime[1].format('YYYY-MM-DD HH:mm:ss');
        mockData = mockData.filter(post => 
          post.createTime >= startTime && post.createTime <= endTime
        );
      }
      
      setPositions(mockData);
      setPagination({
        ...pagination,
        total: mockData.length,
      });
    } finally {
      setLoading(false);
    }
  };

  // 初始化时获取岗位列表
  useEffect(() => {
    fetchPositions();
  }, []);

  // 搜索
  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    fetchPositions();
  };

  // 重置
  const handleReset = () => {
    setSearchParams({
      postName: '',
      postCode: '',
      status: '',
      createTime: [],
    });
    setPagination({ ...pagination, current: 1 });
  };

  // 打开新增模态框
  const handleAdd = () => {
    setModalType('add');
    setCurrentPosition(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开修改模态框
  const handleEdit = (position: PositionData) => {
    setModalType('edit');
    setCurrentPosition(position);
    form.setFieldsValue({
      postName: position.postName,
      postCode: position.postCode,
      postSort: position.postSort,
      status: position.status,
    });
    setModalVisible(true);
  };

  // 删除岗位
  const handleDelete = async (postId: string) => {
    try {
      // 由于后端API中没有岗位相关的接口，暂时使用模拟删除
      throw new Error('后端API中没有岗位相关接口');
    } catch (error) {
      console.error('删除岗位失败:', error);
      message.success('删除成功（模拟）');
      // 模拟删除成功，手动从列表中移除
      const updatedPositions = positions.filter(post => post.id !== postId);
      setPositions(updatedPositions);
      setPagination({
        ...pagination,
        total: updatedPositions.length,
      });
    }
  };

  // 保存岗位
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (modalType === 'add') {
        try {
          // 由于后端API中没有岗位相关的接口，暂时使用模拟新增
          throw new Error('后端API中没有岗位相关接口');
        } catch (error) {
          console.error('新增岗位失败:', error);
          message.success('新增成功（模拟）');
          // 模拟新增成功，手动添加到列表
          const newPosition = {
            key: Date.now().toString(),
            id: Date.now().toString(),
            postName: values.postName,
            postCode: values.postCode,
            postSort: values.postSort,
            status: values.status,
            createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          };
          setPositions([...positions, newPosition]);
          setPagination({
            ...pagination,
            total: positions.length + 1,
          });
        }
      } else if (modalType === 'edit' && currentPosition) {
        try {
          // 由于后端API中没有岗位相关的接口，暂时使用模拟修改
          throw new Error('后端API中没有岗位相关接口');
        } catch (error) {
          console.error('修改岗位失败:', error);
          message.success('修改成功（模拟）');
          // 模拟修改成功，手动更新列表
          const updatedPositions = positions.map(post => 
            post.id === currentPosition.id ? {
              ...post,
              postName: values.postName,
              postCode: values.postCode,
              postSort: values.postSort,
              status: values.status,
            } : post
          );
          setPositions(updatedPositions);
        }
      }
      setModalVisible(false);
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    }
  };

  // 导出岗位
  const handleExport = () => {
    message.info('导出功能待实现');
  };

  // 列定义
  const columns: ColumnsType<PositionData> = [
    {
      title: '岗位名称',
      dataIndex: 'postName',
      key: 'postName',
    },
    {
      title: '岗位编码',
      dataIndex: 'postCode',
      key: 'postCode',
    },
    {
      title: '显示顺序',
      dataIndex: 'postSort',
      key: 'postSort',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Switch checked={status} disabled />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>修改</a>
          <Popconfirm
            title="确定要删除这个岗位吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
          <a>更多</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Tabs 
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: '岗位管理',
            children: (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Input 
                        placeholder="请输入岗位名称" 
                        value={searchParams.postName}
                        onChange={(e) => setSearchParams({ ...searchParams, postName: e.target.value })}
                      />
                    </Col>
                    <Col span={6}>
                      <Input 
                        placeholder="请输入岗位编码" 
                        value={searchParams.postCode}
                        onChange={(e) => setSearchParams({ ...searchParams, postCode: e.target.value })}
                      />
                    </Col>
                    <Col span={6}>
                      <Select 
                        placeholder="岗位状态" 
                        value={searchParams.status}
                        onChange={(value) => setSearchParams({ ...searchParams, status: value })}
                      >
                        <Option value="">全部</Option>
                        <Option value="0">启用</Option>
                        <Option value="1">禁用</Option>
                      </Select>
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={12}>
                      <span style={{ marginRight: 8 }}>创建时间：</span>
                      <RangePicker 
                        style={{ width: '80%' }} 
                        value={searchParams.createTime}
                        onChange={(dates) => setSearchParams({ ...searchParams, createTime: dates || [] })}
                      />
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                      <Space>
                        <Button type="primary" style={{ backgroundColor: '#1890ff' }} onClick={handleSearch}>搜索</Button>
                        <Button onClick={handleReset}>重置</Button>
                      </Space>
                    </Col>
                  </Row>
                </div>
                <Divider />
                <div style={{ marginBottom: 16 }}>
                  <Space>
                    <Button type="primary" style={{ backgroundColor: '#52c41a' }} onClick={handleAdd}>+ 新增</Button>
                    <Button>修改</Button>
                    <Button danger>删除</Button>
                    <Button onClick={handleExport}>导出</Button>
                  </Space>
                </div>
                <Table 
                  columns={columns} 
                  dataSource={positions} 
                  loading={loading}
                  pagination={{
                    total: pagination.total,
                    pageSize: pagination.pageSize,
                    current: pagination.current,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条`,
                    onChange: (page, pageSize) => setPagination({ ...pagination, current: page, pageSize }),
                  }}
                />
              </>
            )
          }
        ]}
      />

      {/* 新增/修改岗位模态框 */}
      <Modal
        title={modalType === 'add' ? '新增岗位' : '修改岗位'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Item name="postName" label="岗位名称" rules={[{ required: true, message: '请输入岗位名称' }]}>
            <Input placeholder="请输入岗位名称" />
          </Item>
          <Item name="postCode" label="岗位编码" rules={[{ required: true, message: '请输入岗位编码' }]}>
            <Input placeholder="请输入岗位编码" />
          </Item>
          <Item name="postSort" label="显示顺序" rules={[{ required: true, message: '请输入显示顺序' }]}>
            <Input type="number" placeholder="请输入显示顺序" />
          </Item>
          <Item name="status" label="状态" valuePropName="checked">
            <Switch />
          </Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Positions;