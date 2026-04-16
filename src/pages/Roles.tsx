import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Input, Select, DatePicker, Space, Row, Col, Tabs, Switch, Typography, Divider, Modal, Form, message, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import request from '../utils/request';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Item } = Form;

interface RoleData {
  key: string;
  id: string;
  roleName: string;
  roleKey: string;
  roleSort: number;
  status: boolean;
  createTime: string;
}

interface SearchParams {
  roleName: string;
  roleKey: string;
  status: string;
  createTime: any[];
}

const Roles: React.FC = () => {
  const [form] = Form.useForm();
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentRole, setCurrentRole] = useState<RoleData | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    roleName: '',
    roleKey: '',
    status: '',
    createTime: [],
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const errorShownRef = useRef(false);

  // 获取角色列表
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await request.get('/sysRole/page', {
        params: {
          current: pagination.current,
          size: pagination.pageSize,
          roleName: searchParams.roleName,
          roleKey: searchParams.roleKey,
          status: searchParams.status,
          startTime: searchParams.createTime[0]?.format('YYYY-MM-DD HH:mm:ss'),
          endTime: searchParams.createTime[1]?.format('YYYY-MM-DD HH:mm:ss'),
        },
      });
      
      if (response.code === 200 && response.data) {
        let filteredData = response.data.records.map((role: any) => ({
          key: role.id,
          id: role.id,
          roleName: role.roleName,
          roleKey: role.roleKey,
          roleSort: role.roleSort,
          status: role.status === 0,
          createTime: role.createTime,
        }));
        
        // 应用搜索条件
        if (searchParams.roleName) {
          filteredData = filteredData.filter(role => role.roleName.includes(searchParams.roleName));
        }
        if (searchParams.roleKey) {
          filteredData = filteredData.filter(role => role.roleKey.includes(searchParams.roleKey));
        }
        if (searchParams.status) {
          filteredData = filteredData.filter(role => role.status === (searchParams.status === '0'));
        }
        // 添加日期范围搜索
        if (searchParams.createTime && searchParams.createTime.length === 2) {
          const startTime = searchParams.createTime[0].format('YYYY-MM-DD HH:mm:ss');
          const endTime = searchParams.createTime[1].format('YYYY-MM-DD HH:mm:ss');
          filteredData = filteredData.filter(role => 
            role.createTime >= startTime && role.createTime <= endTime
          );
        }
        
        setRoles(filteredData);
        setPagination({
          ...pagination,
          total: filteredData.length,
        });
      } else {
        throw new Error('获取角色列表失败');
      }
    } catch (error) {
      console.error('获取角色列表失败:', error);
      if (!errorShownRef.current) {
        message.error('获取角色列表失败，使用模拟数据');
        errorShownRef.current = true;
      }
      // 提供模拟数据
      let mockData = [
        {
          key: '1',
          id: '1',
          roleName: '超级管理员',
          roleKey: 'admin',
          roleSort: 1,
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
        {
          key: '2',
          id: '2',
          roleName: '普通角色',
          roleKey: 'common',
          roleSort: 2,
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
        {
          key: '3',
          id: '3',
          roleName: '测试角色',
          roleKey: 'test',
          roleSort: 3,
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
        {
          key: '4',
          id: '4',
          roleName: '只读角色',
          roleKey: 'readonly',
          roleSort: 4,
          status: false,
          createTime: '2026-01-18 10:58:15',
        },
      ];
      
      // 模拟搜索功能 - 支持多字段组合搜索
      if (searchParams.roleName) {
        mockData = mockData.filter(role => role.roleName.includes(searchParams.roleName));
      }
      if (searchParams.roleKey) {
        mockData = mockData.filter(role => role.roleKey.includes(searchParams.roleKey));
      }
      if (searchParams.status) {
        mockData = mockData.filter(role => role.status === (searchParams.status === '0'));
      }
      // 添加日期范围搜索
      if (searchParams.createTime && searchParams.createTime.length === 2) {
        const startTime = searchParams.createTime[0].format('YYYY-MM-DD HH:mm:ss');
        const endTime = searchParams.createTime[1].format('YYYY-MM-DD HH:mm:ss');
        mockData = mockData.filter(role => 
          role.createTime >= startTime && role.createTime <= endTime
        );
      }
      
      setRoles(mockData);
      setPagination({
        ...pagination,
        total: mockData.length,
      });
    } finally {
      setLoading(false);
    }
  };

  // 初始化时获取角色列表
  useEffect(() => {
    fetchRoles();
  }, []);

  // 搜索
  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    fetchRoles();
  };

  // 重置
  const handleReset = () => {
    setSearchParams({
      roleName: '',
      roleKey: '',
      status: '',
      createTime: [],
    });
    setPagination({ ...pagination, current: 1 });
  };

  // 打开新增模态框
  const handleAdd = () => {
    setModalType('add');
    setCurrentRole(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开修改模态框
  const handleEdit = (role: RoleData) => {
    setModalType('edit');
    setCurrentRole(role);
    form.setFieldsValue({
      roleName: role.roleName,
      roleKey: role.roleKey,
      roleSort: role.roleSort,
      status: role.status,
    });
    setModalVisible(true);
  };

  // 删除角色
  const handleDelete = async (roleId: string) => {
    try {
      const response = await request.delete(`/sysRole/${roleId}`);
      if (response.code === 200 && response.data) {
        message.success('删除成功');
        fetchRoles();
      } else {
        throw new Error('删除失败');
      }
    } catch (error) {
      console.error('删除角色失败:', error);
      message.success('删除成功（模拟）');
      // 模拟删除成功，手动从列表中移除
      const updatedRoles = roles.filter(role => role.id !== roleId);
      setRoles(updatedRoles);
      setPagination({
        ...pagination,
        total: updatedRoles.length,
      });
    }
  };

  // 保存角色
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (modalType === 'add') {
        try {
          const response = await request.post('/sysRole/add', {
            roleName: values.roleName,
            roleKey: values.roleKey,
            roleSort: values.roleSort,
            status: values.status ? 0 : 1,
          });
          if (response.code === 200 && response.data) {
            message.success('新增成功');
            fetchRoles();
          } else {
            throw new Error('新增失败');
          }
        } catch (error) {
          console.error('新增角色失败:', error);
          message.success('新增成功（模拟）');
          // 模拟新增成功，手动添加到列表
          const newRole = {
            key: Date.now().toString(),
            id: Date.now().toString(),
            roleName: values.roleName,
            roleKey: values.roleKey,
            roleSort: values.roleSort,
            status: values.status,
            createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          };
          setRoles([...roles, newRole]);
          setPagination({
            ...pagination,
            total: roles.length + 1,
          });
        }
      } else if (modalType === 'edit' && currentRole) {
        try {
          const response = await request.put(`/sysRole/update/${currentRole.id}`, {
            roleName: values.roleName,
            roleKey: values.roleKey,
            roleSort: values.roleSort,
            status: values.status ? 0 : 1,
          });
          if (response.code === 200 && response.data) {
            message.success('修改成功');
            fetchRoles();
          } else {
            throw new Error('修改失败');
          }
        } catch (error) {
          console.error('修改角色失败:', error);
          message.success('修改成功（模拟）');
          // 模拟修改成功，手动更新列表
          const updatedRoles = roles.map(role => 
            role.id === currentRole.id ? {
              ...role,
              roleName: values.roleName,
              roleKey: values.roleKey,
              roleSort: values.roleSort,
              status: values.status,
            } : role
          );
          setRoles(updatedRoles);
        }
      }
      setModalVisible(false);
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    }
  };

  // 导出角色
  const handleExport = () => {
    message.info('导出功能待实现');
  };

  // 列定义
  const columns: ColumnsType<RoleData> = [
    {
      title: '角色编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
    },
    {
      title: '权限字符',
      dataIndex: 'roleKey',
      key: 'roleKey',
    },
    {
      title: '显示顺序',
      dataIndex: 'roleSort',
      key: 'roleSort',
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
            title="确定要删除这个角色吗？"
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
            label: '角色管理',
            children: (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Input 
                        placeholder="请输入角色名称" 
                        value={searchParams.roleName}
                        onChange={(e) => setSearchParams({ ...searchParams, roleName: e.target.value })}
                      />
                    </Col>
                    <Col span={6}>
                      <Input 
                        placeholder="请输入权限字符" 
                        value={searchParams.roleKey}
                        onChange={(e) => setSearchParams({ ...searchParams, roleKey: e.target.value })}
                      />
                    </Col>
                    <Col span={6}>
                      <Select 
                        placeholder="角色状态" 
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
                  dataSource={roles} 
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

      {/* 新增/修改角色模态框 */}
      <Modal
        title={modalType === 'add' ? '新增角色' : '修改角色'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Item name="roleName" label="角色名称" rules={[{ required: true, message: '请输入角色名称' }]}>
            <Input placeholder="请输入角色名称" />
          </Item>
          <Item name="roleKey" label="权限字符" rules={[{ required: true, message: '请输入权限字符' }]}>
            <Input placeholder="请输入权限字符" />
          </Item>
          <Item name="roleSort" label="显示顺序" rules={[{ required: true, message: '请输入显示顺序' }]}>
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

export default Roles;