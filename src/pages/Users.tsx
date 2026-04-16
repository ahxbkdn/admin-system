import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, DatePicker, Space, Row, Col, Tabs, Switch, Typography, Divider, Modal, Form, message, Upload, Popconfirm, Tree } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import request from '../utils/request';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Item } = Form;
const { Dragger } = Upload;

// 部门树形数据
interface DepartmentNode {
  title: string;
  value: string;
  children?: DepartmentNode[];
}

// 完整的部门列表
const allDepartments = [
  '研发部门',
  '测试部门',
  '市场部门',
  '财务部门',
  '长沙市场部门',
  '长沙财务部门'
];

// 生成部门树形数据
const generateDepartmentTree = (): DepartmentNode[] => {
  // 构建部门树形结构
  const root: DepartmentNode = {
    title: '全部部门',
    value: '',
    children: []
  };
  
  // 添加各个部门作为子节点
  allDepartments.forEach(dept => {
    root.children?.push({
      title: dept,
      value: dept
    });
  });
  
  return [root];
};

// 默认部门树形数据
const departmentTreeData: DepartmentNode[] = generateDepartmentTree();

interface UserData {
  key: string;
  id: string;
  username: string;
  nickname: string;
  department: string;
  phone: string;
  status: boolean;
  createTime: string;
}

interface SearchParams {
  departmentName: string;
  username: string;
  phone: string;
  status: string;
  createTime: any[];
}

const Users: React.FC = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState<UserData[]>([]);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    departmentName: '',
    username: '',
    phone: '',
    status: '',
    createTime: [],
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [departmentTree, setDepartmentTree] = useState<DepartmentNode[]>(departmentTreeData);
  const errorShownRef = React.useRef(false);

  // 处理部门选择
  const handleDepartmentSelect = (selectedKeys: string[]) => {
    let departmentName = '';
    if (selectedKeys.length > 0) {
      departmentName = selectedKeys[0];
      setSelectedDepartment(departmentName);
      setSearchParams({ ...searchParams, departmentName });
    } else {
      setSelectedDepartment('');
      setSearchParams({ ...searchParams, departmentName: '' });
    }
    setPagination({ ...pagination, current: 1 });
    
    // 重新获取用户数据，确保筛选正确
    fetchUsers();
  };

  // 获取用户列表
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await request.get('/sysUser/page', {
        params: {
          current: pagination.current,
          size: pagination.pageSize,
          username: searchParams.username,
          phone: searchParams.phone,
          status: searchParams.status,
          departmentName: searchParams.departmentName,
          startTime: searchParams.createTime[0]?.format('YYYY-MM-DD HH:mm:ss'),
          endTime: searchParams.createTime[1]?.format('YYYY-MM-DD HH:mm:ss'),
        },
      });
      
      if (response.code === 200 && response.data) {
        let filteredData = response.data.records.map((user: any) => ({
          key: user.id,
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          department: '研发部门', // 暂时硬编码，后续可从部门API获取
          phone: user.phone,
          status: user.status === 0,
          createTime: user.createTime,
        }));
        
        // 应用搜索条件
        if (searchParams.username) {
          filteredData = filteredData.filter(user => 
            user.username.includes(searchParams.username) || 
            user.nickname.includes(searchParams.username)
          );
        }
        if (searchParams.phone) {
          filteredData = filteredData.filter(user => user.phone.includes(searchParams.phone));
        }
        if (searchParams.departmentName) {
          filteredData = filteredData.filter(user => user.department.includes(searchParams.departmentName));
        }
        if (searchParams.status) {
          filteredData = filteredData.filter(user => user.status === (searchParams.status === '0'));
        }
        // 添加日期范围搜索
        if (searchParams.createTime && searchParams.createTime.length === 2) {
          const startTime = searchParams.createTime[0].format('YYYY-MM-DD HH:mm:ss');
          const endTime = searchParams.createTime[1].format('YYYY-MM-DD HH:mm:ss');
          filteredData = filteredData.filter(user => 
            user.createTime >= startTime && user.createTime <= endTime
          );
        }
        
        // 保存所有用户数据
        setAllUsers(filteredData);
        // 应用部门筛选
        let finalData = filteredData;
        if (searchParams.departmentName) {
          finalData = finalData.filter(user => user.department.includes(searchParams.departmentName));
        }
        setUsers(finalData);
        setPagination({
          ...pagination,
          total: finalData.length,
        });
        // 始终使用完整的部门树
        setDepartmentTree(generateDepartmentTree());
      } else {
        throw new Error('获取用户列表失败');
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      if (!errorShownRef.current) {
        message.error('获取用户列表失败，使用模拟数据');
        errorShownRef.current = true;
      }
      // 提供模拟数据
      let mockData = [
        {
          key: '1',
          id: '1',
          username: 'admin',
          nickname: '若依',
          department: '研发部门',
          phone: '15888888888',
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
        {
          key: '2',
          id: '2',
          username: 'ry',
          nickname: '若依',
          department: '测试部门',
          phone: '15666666666',
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
        {
          key: '3',
          id: '3',
          username: 'asuki',
          nickname: '啊啊啊',
          department: '研发部门',
          phone: '18888888888',
          status: true,
          createTime: '2026-03-21 10:37:52',
        },
        {
          key: '4',
          id: '4',
          username: 'liubei',
          nickname: '大耳贼',
          department: '研发部门',
          phone: '13623121231',
          status: true,
          createTime: '2026-03-21 10:36:12',
        },
        {
          key: '5',
          id: '5',
          username: 'shize',
          nickname: '大帅逼1',
          department: '研发部门',
          phone: '12311231231',
          status: true,
          createTime: '2026-03-21 10:48:40',
        },
        {
          key: '6',
          id: '6',
          username: 'tangwuji',
          nickname: '无敌胖哥哥',
          department: '研发部门',
          phone: '15833067388',
          status: true,
          createTime: '2026-03-21 10:48:05',
        },
      ];
      
      // 模拟搜索功能 - 支持多字段组合搜索
      if (searchParams.username) {
        mockData = mockData.filter(user => 
          user.username.includes(searchParams.username) || 
          user.nickname.includes(searchParams.username)
        );
      }
      if (searchParams.phone) {
        mockData = mockData.filter(user => user.phone.includes(searchParams.phone));
      }
      if (searchParams.departmentName) {
        mockData = mockData.filter(user => user.department.includes(searchParams.departmentName));
      }
      if (searchParams.status) {
        mockData = mockData.filter(user => user.status === (searchParams.status === '0'));
      }
      // 添加日期范围搜索
      if (searchParams.createTime && searchParams.createTime.length === 2) {
        const startTime = searchParams.createTime[0].format('YYYY-MM-DD HH:mm:ss');
        const endTime = searchParams.createTime[1].format('YYYY-MM-DD HH:mm:ss');
        mockData = mockData.filter(user => 
          user.createTime >= startTime && user.createTime <= endTime
        );
      }
      
      // 保存所有用户数据
      setAllUsers(mockData);
      // 应用部门筛选
      let finalData = mockData;
      if (searchParams.departmentName) {
        finalData = finalData.filter(user => user.department.includes(searchParams.departmentName));
      }
      setUsers(finalData);
      setPagination({
        ...pagination,
        total: finalData.length,
      });
      // 始终使用完整的部门树
      setDepartmentTree(generateDepartmentTree());
    } finally {
      setLoading(false);
    }
  };

  // 初始化时获取用户列表
  useEffect(() => {
    fetchUsers();
  }, []);

  // 搜索
  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    fetchUsers();
  };

  // 重置
  const handleReset = () => {
    setSearchParams({
      departmentName: '',
      username: '',
      phone: '',
      status: '',
      createTime: [],
    });
    setSelectedDepartment('');
    setPagination({ ...pagination, current: 1 });
    // 重置后显示所有用户
    setUsers(allUsers);
    setPagination({
      ...pagination,
      total: allUsers.length,
    });
  };

  // 打开新增模态框
  const handleAdd = () => {
    setModalType('add');
    setCurrentUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开修改模态框
  const handleEdit = (user: UserData) => {
    setModalType('edit');
    setCurrentUser(user);
    form.setFieldsValue({
      username: user.username,
      nickname: user.nickname,
      department: user.department,
      phone: user.phone,
      status: user.status,
    });
    setModalVisible(true);
  };

  // 删除用户
  const handleDelete = async (userId: string) => {
    try {
      const response = await request.delete(`/sysUser/${userId}`);
      if (response.code === 200 && response.data) {
        message.success('删除成功');
        fetchUsers();
      } else {
        throw new Error('删除失败');
      }
    } catch (error) {
      console.error('删除用户失败:', error);
      message.success('删除成功（模拟）');
      // 模拟删除成功，手动从列表中移除
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      setPagination({
        ...pagination,
        total: updatedUsers.length,
      });
    }
  };

  // 保存用户
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (modalType === 'add') {
        try {
          const response = await request.post('/sysUser/add', {
            username: values.username,
            nickname: values.nickname,
            phone: values.phone,
            status: values.status ? 0 : 1,
            roleIds: [], // 暂时为空，后续可从角色选择中获取
          });
          if (response.code === 200 && response.data) {
            message.success('新增成功');
            fetchUsers();
          } else {
            throw new Error('新增失败');
          }
        } catch (error) {
          console.error('新增用户失败:', error);
          message.success('新增成功（模拟）');
          // 模拟新增成功，手动添加到列表
          const newUser = {
            key: Date.now().toString(),
            id: Date.now().toString(),
            username: values.username,
            nickname: values.nickname,
            department: values.department,
            phone: values.phone,
            status: values.status,
            createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          };
          setUsers([...users, newUser]);
          setPagination({
            ...pagination,
            total: users.length + 1,
          });
        }
      } else if (modalType === 'edit' && currentUser) {
        try {
          const response = await request.put(`/sysUser/update/${currentUser.id}`, {
            username: values.username,
            nickname: values.nickname,
            phone: values.phone,
            status: values.status ? 0 : 1,
            roleIds: [], // 暂时为空，后续可从角色选择中获取
          });
          if (response.code === 200 && response.data) {
            message.success('修改成功');
            fetchUsers();
          } else {
            throw new Error('修改失败');
          }
        } catch (error) {
          console.error('修改用户失败:', error);
          message.success('修改成功（模拟）');
          // 模拟修改成功，手动更新列表
          const updatedUsers = users.map(user => 
            user.id === currentUser.id ? {
              ...user,
              username: values.username,
              nickname: values.nickname,
              department: values.department,
              phone: values.phone,
              status: values.status,
            } : user
          );
          setUsers(updatedUsers);
        }
      }
      setModalVisible(false);
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    }
  };

  // 导出用户
  const handleExport = () => {
    message.info('导出功能待实现');
  };

  // 导入用户
  const handleImport = () => {
    // 这里可以实现文件上传逻辑
    message.info('导入功能待实现');
  };

  // 列定义
  const columns: ColumnsType<UserData> = [
    {
      title: '用户编号',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '用户名称',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      width: 120,
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
      width: 120,
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status) => (
        <Switch checked={status} disabled />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleEdit(record)}>修改</a>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
          <a>重置密码</a>
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
            label: '用户管理',
            children: (
              <Row gutter={16}>
                {/* 左侧部门树形结构 */}
                <Col span={5}>
                  <div style={{ padding: 16, backgroundColor: '#f6f6f6', borderRadius: 4, height: 'calc(100vh - 200px)' }}>
                    <div style={{ marginBottom: 16, fontWeight: 'bold' }}>部门列表</div>
                    <Tree
                      treeData={departmentTree}
                      defaultExpandAll
                      selectedKeys={selectedDepartment ? [selectedDepartment] : []}
                      onSelect={handleDepartmentSelect}
                      style={{ width: '100%' }}
                    />
                  </div>
                </Col>
                
                {/* 右侧搜索和用户列表 */}
                <Col span={19}>
                  <div className="search-area" style={{ marginBottom: 16, padding: 16, backgroundColor: '#f6f6f6', borderRadius: 4 }}>
                    <Row gutter={16}>
                      <Col span={6}>
                        <Input 
                          placeholder="用户名称" 
                          value={searchParams.username}
                          onChange={(e) => setSearchParams({ ...searchParams, username: e.target.value })}
                        />
                      </Col>
                      <Col span={6}>
                        <Input 
                          placeholder="手机号码" 
                          value={searchParams.phone}
                          onChange={(e) => setSearchParams({ ...searchParams, phone: e.target.value })}
                        />
                      </Col>
                      <Col span={6}>
                        <Select 
                          placeholder="用户状态" 
                          value={searchParams.status}
                          onChange={(value) => setSearchParams({ ...searchParams, status: value })}
                        >
                          <Option value="">全部</Option>
                          <Option value="0">启用</Option>
                          <Option value="1">禁用</Option>
                        </Select>
                      </Col>
                      <Col span={6}>
                        <Input 
                          placeholder="部门名称" 
                          value={searchParams.departmentName}
                          onChange={(e) => setSearchParams({ ...searchParams, departmentName: e.target.value })}
                        />
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
                          <Button type="primary" onClick={handleSearch}>搜索</Button>
                          <Button onClick={handleReset}>重置</Button>
                        </Space>
                      </Col>
                    </Row>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Space>
                      <Button type="primary" onClick={handleAdd}>新增</Button>
                      <Button danger>批量删除</Button>
                      <Button>导入</Button>
                      <Button>导出</Button>
                    </Space>
                  </div>
                  <Table 
                    columns={columns} 
                    dataSource={users} 
                    loading={loading}
                    rowKey="id"
                    bordered
                    pagination={{
                      total: pagination.total,
                      pageSize: pagination.pageSize,
                      current: pagination.current,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      showTotal: (total) => `共 ${total} 条数据`,
                      onChange: (page, pageSize) => setPagination({ ...pagination, current: page, pageSize }),
                      style: { textAlign: 'right' }
                    }}
                  />
                </Col>
              </Row>
            )
          }
        ]}
      />

      {/* 新增/修改用户模态框 */}
      <Modal
        title={modalType === 'add' ? '新增用户' : '修改用户'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Item name="username" label="用户名称" rules={[{ required: true, message: '请输入用户名称' }]}>
            <Input placeholder="请输入用户名称" />
          </Item>
          <Item name="nickname" label="用户昵称" rules={[{ required: true, message: '请输入用户昵称' }]}>
            <Input placeholder="请输入用户昵称" />
          </Item>
          <Item name="department" label="部门" rules={[{ required: true, message: '请选择部门' }]}>
            <Select placeholder="请选择部门">
              <Option value="研发部门">研发部门</Option>
              <Option value="测试部门">测试部门</Option>
              <Option value="市场部门">市场部门</Option>
              <Option value="财务部门">财务部门</Option>
              <Option value="长沙市场部门">长沙市场部门</Option>
              <Option value="长沙财务部门">长沙财务部门</Option>
            </Select>
          </Item>
          <Item name="phone" label="手机号码" rules={[{ required: true, message: '请输入手机号码' }]}>
            <Input placeholder="请输入手机号码" />
          </Item>
          <Item name="status" label="状态" valuePropName="checked">
            <Switch />
          </Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Users;
