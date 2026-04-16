import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, DatePicker, Space, Row, Col, Tabs, Switch, Typography, Divider, Modal, Form, message, Upload, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import request from '../utils/request';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Item } = Form;
const { Dragger } = Upload;

interface NotificationData {
  key: string;
  id: number;
  noticeTitle: string;
  noticeType: string;
  status: boolean;
  createTime: string;
}

interface SearchParams {
  noticeTitle: string;
  noticeType: string;
  status: string;
  createTime: any[];
}

const Notifications: React.FC = () => {
  const [form] = Form.useForm();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentNotification, setCurrentNotification] = useState<NotificationData | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    noticeTitle: '',
    noticeType: '',
    status: '',
    createTime: [],
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const errorShownRef = React.useRef(false);

  // 获取通知公告列表
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await request.get('/system/notice/list', {
        params: {
          ...searchParams,
          pageNum: pagination.current,
          pageSize: pagination.pageSize,
        },
      });
      let filteredData = response.rows.map((notice: any) => ({
        key: notice.noticeId.toString(),
        id: notice.noticeId,
        noticeTitle: notice.noticeTitle,
        noticeType: notice.noticeType === '1' ? '通知' : '公告',
        status: notice.status === 1,
        createTime: notice.createTime,
      }));
      
      // 应用搜索条件
      if (searchParams.noticeTitle) {
        filteredData = filteredData.filter(notice => 
          notice.noticeTitle.includes(searchParams.noticeTitle)
        );
      }
      if (searchParams.noticeType) {
        filteredData = filteredData.filter(notice => {
          const type = notice.noticeType === '通知' ? '1' : '2';
          return type === searchParams.noticeType;
        });
      }
      if (searchParams.status) {
        filteredData = filteredData.filter(notice => notice.status === (searchParams.status === '1'));
      }
      // 添加日期范围搜索
      if (searchParams.createTime && searchParams.createTime.length === 2) {
        const startTime = searchParams.createTime[0].format('YYYY-MM-DD HH:mm:ss');
        const endTime = searchParams.createTime[1].format('YYYY-MM-DD HH:mm:ss');
        filteredData = filteredData.filter(notice => 
          notice.createTime >= startTime && notice.createTime <= endTime
        );
      }
      
      setNotifications(filteredData);
      setPagination({
        ...pagination,
        total: filteredData.length,
      });
    } catch (error) {
      console.error('获取通知公告列表失败:', error);
      if (!errorShownRef.current) {
        message.error('获取通知公告列表失败，使用模拟数据');
        errorShownRef.current = true;
      }
      // 提供模拟数据
      let mockData = [
        {
          key: '1',
          id: 1,
          noticeTitle: '系统更新通知',
          noticeType: '通知',
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
        {
          key: '2',
          id: 2,
          noticeTitle: '春节放假安排',
          noticeType: '公告',
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
        {
          key: '3',
          id: 3,
          noticeTitle: '系统维护通知',
          noticeType: '通知',
          status: false,
          createTime: '2026-01-18 10:58:15',
        },
      ];
      
      // 模拟搜索功能 - 支持多字段搜索
      if (searchParams.noticeTitle) {
        mockData = mockData.filter(notice => 
          notice.noticeTitle.includes(searchParams.noticeTitle)
        );
      }
      if (searchParams.noticeType) {
        mockData = mockData.filter(notice => {
          const type = notice.noticeType === '通知' ? '1' : '2';
          return type === searchParams.noticeType;
        });
      }
      if (searchParams.status) {
        mockData = mockData.filter(notice => notice.status === (searchParams.status === '1'));
      }
      // 添加日期范围搜索
      if (searchParams.createTime && searchParams.createTime.length === 2) {
        const startTime = searchParams.createTime[0].format('YYYY-MM-DD HH:mm:ss');
        const endTime = searchParams.createTime[1].format('YYYY-MM-DD HH:mm:ss');
        mockData = mockData.filter(notice => 
          notice.createTime >= startTime && notice.createTime <= endTime
        );
      }
      
      setNotifications(mockData);
      setPagination({
        ...pagination,
        total: mockData.length,
      });
    } finally {
      setLoading(false);
    }
  };

  // 初始化时获取通知公告列表
  useEffect(() => {
    fetchNotifications();
  }, []);

  // 搜索
  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    fetchNotifications();
  };

  // 重置
  const handleReset = () => {
    setSearchParams({
      noticeTitle: '',
      noticeType: '',
      status: '',
      createTime: [],
    });
    setPagination({ ...pagination, current: 1 });
  };

  // 打开新增模态框
  const handleAdd = () => {
    setModalType('add');
    setCurrentNotification(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开修改模态框
  const handleEdit = (notice: NotificationData) => {
    setModalType('edit');
    setCurrentNotification(notice);
    form.setFieldsValue({
      noticeTitle: notice.noticeTitle,
      noticeType: notice.noticeType === '通知' ? '1' : '2',
      status: notice.status,
    });
    setModalVisible(true);
  };

  // 删除通知公告
  const handleDelete = async (noticeId: number) => {
    try {
      await request.delete(`/system/notice/${noticeId}`);
      message.success('删除成功');
      fetchNotifications();
    } catch (error) {
      console.error('删除通知公告失败:', error);
      message.success('删除成功（模拟）');
      // 模拟删除成功，手动从列表中移除
      const updatedNotifications = notifications.filter(notice => notice.id !== noticeId);
      setNotifications(updatedNotifications);
      setPagination({
        ...pagination,
        total: updatedNotifications.length,
      });
    }
  };

  // 保存通知公告
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (modalType === 'add') {
        try {
          await request.post('/system/notice', {
            noticeTitle: values.noticeTitle,
            noticeType: values.noticeType,
            noticeContent: '通知内容', // 简化处理，实际应该从表单中获取
            status: values.status ? 1 : 0,
          });
          message.success('新增成功');
        } catch (error) {
          console.error('新增通知公告失败:', error);
          message.success('新增成功（模拟）');
          // 模拟新增成功，手动添加到列表
          const newNotice = {
            key: Date.now().toString(),
            id: notifications.length + 1,
            noticeTitle: values.noticeTitle,
            noticeType: values.noticeType === '1' ? '通知' : '公告',
            status: values.status,
            createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          };
          setNotifications([...notifications, newNotice]);
          setPagination({
            ...pagination,
            total: notifications.length + 1,
          });
        }
      } else if (modalType === 'edit' && currentNotification) {
        try {
          await request.put('/system/notice', {
            noticeId: currentNotification.id,
            noticeTitle: values.noticeTitle,
            noticeType: values.noticeType,
            noticeContent: '通知内容', // 简化处理，实际应该从表单中获取
            status: values.status ? 1 : 0,
          });
          message.success('修改成功');
        } catch (error) {
          console.error('修改通知公告失败:', error);
          message.success('修改成功（模拟）');
          // 模拟修改成功，手动更新列表
          const updatedNotifications = notifications.map(notice => 
            notice.id === currentNotification.id ? {
              ...notice,
              noticeTitle: values.noticeTitle,
              noticeType: values.noticeType === '1' ? '通知' : '公告',
              status: values.status,
            } : notice
          );
          setNotifications(updatedNotifications);
        }
      }
      setModalVisible(false);
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    }
  };

  // 导出通知公告
  const handleExport = () => {
    request.get('/system/notice/export', {
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '通知公告列表.xlsx');
      document.body.appendChild(link);
      link.click();
    }).catch(() => {
      message.error('导出失败');
    });
  };

  // 导入通知公告
  const handleImport = () => {
    // 这里可以实现文件上传逻辑
    message.info('导入功能待实现');
  };

  // 列定义
  const columns: ColumnsType<NotificationData> = [
    {
      title: '通知编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '通知标题',
      dataIndex: 'noticeTitle',
      key: 'noticeTitle',
    },
    {
      title: '通知类型',
      dataIndex: 'noticeType',
      key: 'noticeType',
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
            title="确定要删除这个通知公告吗？"
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
            label: '通知公告',
            children: (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Input 
                        placeholder="请输入通知标题" 
                        value={searchParams.noticeTitle}
                        onChange={(e) => setSearchParams({ ...searchParams, noticeTitle: e.target.value })}
                      />
                    </Col>
                    <Col span={6}>
                      <Select 
                        placeholder="通知类型" 
                        value={searchParams.noticeType}
                        onChange={(value) => setSearchParams({ ...searchParams, noticeType: value })}
                      >
                        <Option value="">全部</Option>
                        <Option value="1">通知</Option>
                        <Option value="2">公告</Option>
                      </Select>
                    </Col>
                    <Col span={6}>
                      <Select 
                        placeholder="通知状态" 
                        value={searchParams.status}
                        onChange={(value) => setSearchParams({ ...searchParams, status: value })}
                      >
                        <Option value="">全部</Option>
                        <Option value="1">启用</Option>
                        <Option value="0">禁用</Option>
                      </Select>
                    </Col>
                    <Col span={6}>
                      <span style={{ marginRight: 8 }}>创建时间：</span>
                      <RangePicker 
                        style={{ width: '70%' }} 
                        value={searchParams.createTime}
                        onChange={(dates) => setSearchParams({ ...searchParams, createTime: dates || [] })}
                      />
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={24} style={{ textAlign: 'right' }}>
                      <Space>
                        <Button type="primary" style={{ backgroundColor: '#52c41a' }} onClick={handleSearch}>搜索</Button>
                        <Button onClick={handleReset}>重置</Button>
                      </Space>
                    </Col>
                  </Row>
                </div>
                <Divider />
                <div style={{ marginBottom: 16 }}>
                  <Space>
                    <Button type="primary" style={{ backgroundColor: '#52c41a' }} onClick={handleAdd}>+ 新增</Button>
                    <Button danger>批量删除</Button>
                    <Button onClick={handleImport}>导入</Button>
                    <Button onClick={handleExport}>导出</Button>
                  </Space>
                </div>
                <Table 
                  columns={columns} 
                  dataSource={notifications} 
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

      {/* 新增/修改通知公告模态框 */}
      <Modal
        title={modalType === 'add' ? '新增通知公告' : '修改通知公告'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Item name="noticeTitle" label="通知标题" rules={[{ required: true, message: '请输入通知标题' }]}>
            <Input placeholder="请输入通知标题" />
          </Item>
          <Item name="noticeType" label="通知类型" rules={[{ required: true, message: '请选择通知类型' }]}>
            <Select placeholder="请选择通知类型">
              <Option value="1">通知</Option>
              <Option value="2">公告</Option>
            </Select>
          </Item>
          <Item name="status" label="状态" valuePropName="checked">
            <Switch />
          </Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Notifications;