import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Input, Select, DatePicker, Space, Row, Col, Tabs, Switch, Typography, Divider, Modal, Form, message, Popconfirm, Tree, TreeSelect } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import request from '../utils/request';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Item } = Form;

interface DepartmentData {
  key: string;
  id: string;
  deptName: string;
  parentName: string;
  orderNum: number;
  leader: string;
  phone: string;
  email: string;
  status: boolean;
  createTime: string;
}

interface SearchParams {
  deptName: string;
  status: string;
  createTime: any[];
}

const Departments: React.FC = () => {
  const [form] = Form.useForm();
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentDepartment, setCurrentDepartment] = useState<DepartmentData | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    deptName: '',
    status: '',
    createTime: [],
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const errorShownRef = useRef(false);

  // 获取部门列表
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      // 由于后端API中没有部门相关的接口，暂时使用模拟数据
      throw new Error('后端API中没有部门相关接口');
    } catch (error) {
      console.error('获取部门列表失败:', error);
      if (!errorShownRef.current) {
        message.error('获取部门列表失败，使用模拟数据');
        errorShownRef.current = true;
      }
      // 提供模拟数据
      let mockData = [
        {
          key: '1',
          id: '1',
          deptName: '研发部门',
          parentName: '无',
          orderNum: 1,
          leader: '张三',
          phone: '13800138001',
          email: 'zhangsan@example.com',
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
        {
          key: '2',
          id: '2',
          deptName: '测试部门',
          parentName: '无',
          orderNum: 2,
          leader: '李四',
          phone: '13900139002',
          email: 'lisi@example.com',
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
        {
          key: '3',
          id: '3',
          deptName: '市场部门',
          parentName: '无',
          orderNum: 3,
          leader: '王五',
          phone: '13700137003',
          email: 'wangwu@example.com',
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
      ];
      
      // 模拟搜索功能 - 支持多字段搜索
      if (searchParams.deptName) {
        mockData = mockData.filter(dept => 
          dept.deptName.includes(searchParams.deptName) || 
          dept.leader.includes(searchParams.deptName) || 
          dept.phone.includes(searchParams.deptName) || 
          dept.email.includes(searchParams.deptName)
        );
      }
      if (searchParams.status) {
        mockData = mockData.filter(dept => dept.status === (searchParams.status === '0'));
      }
      // 添加日期范围搜索
      if (searchParams.createTime && searchParams.createTime.length === 2) {
        const startTime = searchParams.createTime[0].format('YYYY-MM-DD HH:mm:ss');
        const endTime = searchParams.createTime[1].format('YYYY-MM-DD HH:mm:ss');
        mockData = mockData.filter(dept => 
          dept.createTime >= startTime && dept.createTime <= endTime
        );
      }
      
      setDepartments(mockData);
      setPagination({
        ...pagination,
        total: mockData.length,
      });
    } finally {
      setLoading(false);
    }
  };

  // 初始化时获取部门列表
  useEffect(() => {
    fetchDepartments();
  }, []);

  // 搜索
  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    fetchDepartments();
  };

  // 重置
  const handleReset = () => {
    setSearchParams({
      deptName: '',
      status: '',
      createTime: [],
    });
    setPagination({ ...pagination, current: 1 });
  };

  // 打开新增模态框
  const handleAdd = () => {
    setModalType('add');
    setCurrentDepartment(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开修改模态框
  const handleEdit = (department: DepartmentData) => {
    setModalType('edit');
    setCurrentDepartment(department);
    form.setFieldsValue({
      deptName: department.deptName,
      parentId: department.parentName === '无' ? '0' : department.id,
      orderNum: department.orderNum,
      leader: department.leader,
      phone: department.phone,
      email: department.email,
      status: department.status,
    });
    setModalVisible(true);
  };

  // 删除部门
  const handleDelete = async (deptId: string) => {
    try {
      // 由于后端API中没有部门相关的接口，暂时使用模拟删除
      throw new Error('后端API中没有部门相关接口');
    } catch (error) {
      console.error('删除部门失败:', error);
      message.success('删除成功（模拟）');
      // 模拟删除成功，手动从列表中移除
      const updatedDepartments = departments.filter(dept => dept.id !== deptId);
      setDepartments(updatedDepartments);
      setPagination({
        ...pagination,
        total: updatedDepartments.length,
      });
    }
  };

  // 保存部门
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (modalType === 'add') {
        try {
          // 由于后端API中没有部门相关的接口，暂时使用模拟新增
          throw new Error('后端API中没有部门相关接口');
        } catch (error) {
          console.error('新增部门失败:', error);
          message.success('新增成功（模拟）');
          // 模拟新增成功，手动添加到列表
          const newDepartment = {
            key: Date.now().toString(),
            id: Date.now().toString(),
            deptName: values.deptName,
            parentName: values.parentId === '0' ? '无' : '研发部门',
            orderNum: values.orderNum,
            leader: values.leader,
            phone: values.phone,
            email: values.email,
            status: values.status,
            createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          };
          setDepartments([...departments, newDepartment]);
          setPagination({
            ...pagination,
            total: departments.length + 1,
          });
        }
      } else if (modalType === 'edit' && currentDepartment) {
        try {
          // 由于后端API中没有部门相关的接口，暂时使用模拟修改
          throw new Error('后端API中没有部门相关接口');
        } catch (error) {
          console.error('修改部门失败:', error);
          message.success('修改成功（模拟）');
          // 模拟修改成功，手动更新列表
          const updatedDepartments = departments.map(dept => 
            dept.id === currentDepartment.id ? {
              ...dept,
              deptName: values.deptName,
              parentName: values.parentId === '0' ? '无' : '研发部门',
              orderNum: values.orderNum,
              leader: values.leader,
              phone: values.phone,
              email: values.email,
              status: values.status,
            } : dept
          );
          setDepartments(updatedDepartments);
        }
      }
      setModalVisible(false);
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    }
  };

  // 导出部门
  const handleExport = () => {
    message.info('导出功能待实现');
  };

  // 列定义
  const columns: ColumnsType<DepartmentData> = [
    {
      title: '部门名称',
      dataIndex: 'deptName',
      key: 'deptName',
    },
    {
      title: '父部门',
      dataIndex: 'parentName',
      key: 'parentName',
    },
    {
      title: '显示顺序',
      dataIndex: 'orderNum',
      key: 'orderNum',
    },
    {
      title: '负责人',
      dataIndex: 'leader',
      key: 'leader',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
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
            title="确定要删除这个部门吗？"
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
            label: '部门管理',
            children: (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Input 
                        placeholder="请输入部门名称" 
                        value={searchParams.deptName}
                        onChange={(e) => setSearchParams({ ...searchParams, deptName: e.target.value })}
                      />
                    </Col>
                    <Col span={6}>
                      <Select 
                        placeholder="部门状态" 
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
                  dataSource={departments} 
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

      {/* 新增/修改部门模态框 */}
      <Modal
        title={modalType === 'add' ? '新增部门' : '修改部门'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Item name="deptName" label="部门名称" rules={[{ required: true, message: '请输入部门名称' }]}>
            <Input placeholder="请输入部门名称" />
          </Item>
          <Item name="parentId" label="父部门" rules={[{ required: true, message: '请选择父部门' }]}>
            <Select placeholder="请选择父部门">
              <Option value="0">无</Option>
              <Option value="1">研发部门</Option>
            </Select>
          </Item>
          <Item name="orderNum" label="显示顺序" rules={[{ required: true, message: '请输入显示顺序' }]}>
            <Input type="number" placeholder="请输入显示顺序" />
          </Item>
          <Item name="leader" label="负责人">
            <Input placeholder="请输入负责人" />
          </Item>
          <Item name="phone" label="联系电话">
            <Input placeholder="请输入联系电话" />
          </Item>
          <Item name="email" label="邮箱">
            <Input placeholder="请输入邮箱" />
          </Item>
          <Item name="status" label="状态" valuePropName="checked">
            <Switch />
          </Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Departments;