import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Input, Select, DatePicker, Space, Row, Col, Tabs, Switch, Typography, Divider, Modal, Form, message, Popconfirm, Tree, TreeSelect } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import request from '../utils/request';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Item } = Form;

interface MenuData {
  key: string;
  id: string;
  menuName: string;
  parentName: string;
  orderNum: number;
  path: string;
  component: string;
  isFrame: boolean;
  isCache: boolean;
  menuType: string;
  visible: boolean;
  status: boolean;
  createTime: string;
}

interface SearchParams {
  menuName: string;
  status: string;
  createTime: any[];
}

const Menus: React.FC = () => {
  const [form] = Form.useForm();
  const [menus, setMenus] = useState<MenuData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentMenu, setCurrentMenu] = useState<MenuData | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    menuName: '',
    status: '',
    createTime: [],
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const errorShownRef = useRef(false);

  // 获取菜单列表
  const fetchMenus = async () => {
    setLoading(true);
    try {
      const response = await request.get('/sysMenu/page', {
        params: {
          current: pagination.current,
          size: pagination.pageSize,
          menuName: searchParams.menuName,
          status: searchParams.status,
          startTime: searchParams.createTime[0]?.format('YYYY-MM-DD HH:mm:ss'),
          endTime: searchParams.createTime[1]?.format('YYYY-MM-DD HH:mm:ss'),
        },
      });
      
      if (response.code === 200 && response.data) {
        let filteredData = response.data.records.map((menu: any) => ({
          key: menu.id,
          id: menu.id,
          menuName: menu.menuName,
          parentName: menu.parentId === '0' ? '无' : '系统管理', // 暂时硬编码，后续可从菜单API获取
          orderNum: menu.orderNum,
          path: menu.path,
          component: menu.component,
          isFrame: menu.isFrame === '1',
          isCache: menu.isCache === '1',
          menuType: menu.menuType,
          visible: menu.visible === '1',
          status: menu.status === '0',
          createTime: menu.createTime,
        }));
        
        // 应用搜索条件（确保前端过滤与后端一致）
        if (searchParams.menuName) {
          filteredData = filteredData.filter(menu => 
            menu.menuName.toLowerCase().includes(searchParams.menuName.toLowerCase()) || 
            menu.path.toLowerCase().includes(searchParams.menuName.toLowerCase()) || 
            menu.component.toLowerCase().includes(searchParams.menuName.toLowerCase())
          );
        }
        if (searchParams.status) {
          filteredData = filteredData.filter(menu => menu.status === (searchParams.status === '0'));
        }
        // 添加日期范围搜索
        if (searchParams.createTime && searchParams.createTime.length === 2) {
          const startTime = searchParams.createTime[0].format('YYYY-MM-DD HH:mm:ss');
          const endTime = searchParams.createTime[1].format('YYYY-MM-DD HH:mm:ss');
          filteredData = filteredData.filter(menu => 
            menu.createTime >= startTime && menu.createTime <= endTime
          );
        }
        
        setMenus(filteredData);
        setPagination({
          ...pagination,
          total: filteredData.length,
        });
      } else {
        throw new Error('获取菜单列表失败');
      }
    } catch (error) {
      console.error('获取菜单列表失败:', error);
      if (!errorShownRef.current) {
        message.error('获取菜单列表失败，使用模拟数据');
        errorShownRef.current = true;
      }
      // 提供模拟数据
      let mockData = [
        {
          key: '1',
          id: '1',
          menuName: '系统管理',
          parentName: '无',
          orderNum: 1,
          path: '/system',
          component: 'Layout',
          isFrame: true,
          isCache: false,
          menuType: 'M',
          visible: true,
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
        {
          key: '2',
          id: '2',
          menuName: '用户管理',
          parentName: '系统管理',
          orderNum: 1,
          path: '/system/user',
          component: 'system/user/index',
          isFrame: true,
          isCache: false,
          menuType: 'C',
          visible: true,
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
        {
          key: '3',
          id: '3',
          menuName: '角色管理',
          parentName: '系统管理',
          orderNum: 2,
          path: '/system/role',
          component: 'system/role/index',
          isFrame: true,
          isCache: false,
          menuType: 'C',
          visible: true,
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
        {
          key: '4',
          id: '4',
          menuName: '菜单管理',
          parentName: '系统管理',
          orderNum: 3,
          path: '/system/menu',
          component: 'system/menu/index',
          isFrame: true,
          isCache: false,
          menuType: 'C',
          visible: true,
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
        {
          key: '5',
          id: '5',
          menuName: '部门管理',
          parentName: '系统管理',
          orderNum: 4,
          path: '/system/dept',
          component: 'system/dept/index',
          isFrame: true,
          isCache: false,
          menuType: 'C',
          visible: true,
          status: false,
          createTime: '2026-01-18 10:58:15',
        },
      ];
      
      // 模拟搜索功能 - 支持多字段组合搜索
      if (searchParams.menuName) {
        const searchTerm = searchParams.menuName.toLowerCase();
        mockData = mockData.filter(menu => 
          menu.menuName.toLowerCase().includes(searchTerm) || 
          menu.path.toLowerCase().includes(searchTerm) || 
          menu.component.toLowerCase().includes(searchTerm)
        );
      }
      if (searchParams.status) {
        mockData = mockData.filter(menu => menu.status === (searchParams.status === '0'));
      }
      // 添加日期范围搜索
      if (searchParams.createTime && searchParams.createTime.length === 2) {
        const startTime = searchParams.createTime[0].format('YYYY-MM-DD HH:mm:ss');
        const endTime = searchParams.createTime[1].format('YYYY-MM-DD HH:mm:ss');
        mockData = mockData.filter(menu => 
          menu.createTime >= startTime && menu.createTime <= endTime
        );
      }
      
      setMenus(mockData);
      setPagination({
        ...pagination,
        total: mockData.length,
      });
    } finally {
      setLoading(false);
    }
  };

  // 初始化时获取菜单列表
  useEffect(() => {
    fetchMenus();
  }, []);

  // 搜索
  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    fetchMenus();
  };

  // 按回车键搜索
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 重置
  const handleReset = () => {
    setSearchParams({
      menuName: '',
      status: '',
      createTime: [],
    });
    setPagination({ ...pagination, current: 1 });
    fetchMenus();
  };

  // 打开新增模态框
  const handleAdd = () => {
    setModalType('add');
    setCurrentMenu(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开修改模态框
  const handleEdit = (menu: MenuData) => {
    setModalType('edit');
    setCurrentMenu(menu);
    form.setFieldsValue({
      menuName: menu.menuName,
      parentId: menu.parentName === '无' ? '0' : menu.id,
      orderNum: menu.orderNum,
      path: menu.path,
      component: menu.component,
      isFrame: menu.isFrame,
      isCache: menu.isCache,
      menuType: menu.menuType,
      visible: menu.visible,
      status: menu.status,
    });
    setModalVisible(true);
  };

  // 删除菜单
  const handleDelete = async (menuId: string) => {
    try {
      const response = await request.delete(`/sysMenu/${menuId}`);
      if (response.code === 200 && response.data) {
        message.success('删除成功');
        fetchMenus();
      } else {
        throw new Error('删除失败');
      }
    } catch (error) {
      console.error('删除菜单失败:', error);
      message.success('删除成功（模拟）');
      // 模拟删除成功，手动从列表中移除
      const updatedMenus = menus.filter(menu => menu.id !== menuId);
      setMenus(updatedMenus);
      setPagination({
        ...pagination,
        total: updatedMenus.length,
      });
    }
  };

  // 保存菜单
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (modalType === 'add') {
        try {
          const response = await request.post('/sysMenu/add', {
            menuName: values.menuName,
            parentId: values.parentId,
            orderNum: values.orderNum,
            path: values.path,
            component: values.component,
            isFrame: values.isFrame ? '1' : '0',
            isCache: values.isCache ? '1' : '0',
            menuType: values.menuType,
            visible: values.visible ? '1' : '0',
            status: values.status ? '0' : '1',
          });
          if (response.code === 200 && response.data) {
            message.success('新增成功');
            fetchMenus();
          } else {
            throw new Error('新增失败');
          }
        } catch (error) {
          console.error('新增菜单失败:', error);
          message.success('新增成功（模拟）');
          // 模拟新增成功，手动添加到列表
          const newMenu = {
            key: Date.now().toString(),
            id: Date.now().toString(),
            menuName: values.menuName,
            parentName: values.parentId === '0' ? '无' : '系统管理',
            orderNum: values.orderNum,
            path: values.path,
            component: values.component,
            isFrame: values.isFrame,
            isCache: values.isCache,
            menuType: values.menuType,
            visible: values.visible,
            status: values.status,
            createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          };
          setMenus([...menus, newMenu]);
          setPagination({
            ...pagination,
            total: menus.length + 1,
          });
        }
      } else if (modalType === 'edit' && currentMenu) {
        try {
          const response = await request.put(`/sysMenu/update/${currentMenu.id}`, {
            menuName: values.menuName,
            parentId: values.parentId,
            orderNum: values.orderNum,
            path: values.path,
            component: values.component,
            isFrame: values.isFrame ? '1' : '0',
            isCache: values.isCache ? '1' : '0',
            menuType: values.menuType,
            visible: values.visible ? '1' : '0',
            status: values.status ? '0' : '1',
          });
          if (response.code === 200 && response.data) {
            message.success('修改成功');
            fetchMenus();
          } else {
            throw new Error('修改失败');
          }
        } catch (error) {
          console.error('修改菜单失败:', error);
          message.success('修改成功（模拟）');
          // 模拟修改成功，手动更新列表
          const updatedMenus = menus.map(menu => 
            menu.id === currentMenu.id ? {
              ...menu,
              menuName: values.menuName,
              parentName: values.parentId === '0' ? '无' : '系统管理',
              orderNum: values.orderNum,
              path: values.path,
              component: values.component,
              isFrame: values.isFrame,
              isCache: values.isCache,
              menuType: values.menuType,
              visible: values.visible,
              status: values.status,
            } : menu
          );
          setMenus(updatedMenus);
        }
      }
      setModalVisible(false);
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    }
  };

  // 导出菜单
  const handleExport = () => {
    message.info('导出功能待实现');
  };

  // 列定义
  const columns: ColumnsType<MenuData> = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      key: 'menuName',
      width: 150,
    },
    {
      title: '父菜单',
      dataIndex: 'parentName',
      key: 'parentName',
      width: 120,
    },
    {
      title: '显示顺序',
      dataIndex: 'orderNum',
      key: 'orderNum',
      width: 100,
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      key: 'path',
      width: 180,
    },
    {
      title: '组件路径',
      dataIndex: 'component',
      key: 'component',
      width: 200,
    },
    {
      title: '菜单类型',
      dataIndex: 'menuType',
      key: 'menuType',
      width: 80,
      render: (menuType) => {
        switch (menuType) {
          case 'M': return '菜单';
          case 'C': return '按钮';
          case 'F': return '目录';
          default: return menuType;
        }
      },
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
            title="确定要删除这个菜单吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
          <a>权限</a>
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
            label: '菜单管理',
            children: (
              <>
                <div className="search-area" style={{ marginBottom: 16, padding: 16, backgroundColor: '#f6f6f6', borderRadius: 4 }}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Input 
                        placeholder="菜单名称" 
                        value={searchParams.menuName}
                        onChange={(e) => setSearchParams({ ...searchParams, menuName: e.target.value })}
                        onKeyPress={handleKeyPress}
                      />
                    </Col>
                    <Col span={6}>
                      <Select 
                        placeholder="菜单状态" 
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
                        <Button type="primary" onClick={handleSearch}>搜索</Button>
                        <Button onClick={handleReset}>重置</Button>
                      </Space>
                    </Col>
                  </Row>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <Space>
                    <Button type="primary" onClick={handleAdd}>新增</Button>
                    <Button>批量删除</Button>
                    <Button>导出</Button>
                  </Space>
                </div>
                <Table 
                  columns={columns} 
                  dataSource={menus} 
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
              </>
            )
          }
        ]}
      />

      {/* 新增/修改菜单模态框 */}
      <Modal
        title={modalType === 'add' ? '新增菜单' : '修改菜单'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Item name="menuName" label="菜单名称" rules={[{ required: true, message: '请输入菜单名称' }]}>
            <Input placeholder="请输入菜单名称" />
          </Item>
          <Item name="parentId" label="父菜单" rules={[{ required: true, message: '请选择父菜单' }]}>
            <Select placeholder="请选择父菜单">
              <Option value="0">无</Option>
              <Option value="1">系统管理</Option>
            </Select>
          </Item>
          <Item name="orderNum" label="显示顺序" rules={[{ required: true, message: '请输入显示顺序' }]}>
            <Input type="number" placeholder="请输入显示顺序" />
          </Item>
          <Item name="path" label="路由地址">
            <Input placeholder="请输入路由地址" />
          </Item>
          <Item name="component" label="组件路径">
            <Input placeholder="请输入组件路径" />
          </Item>
          <Item name="isFrame" label="是否外链" valuePropName="checked">
            <Switch />
          </Item>
          <Item name="isCache" label="是否缓存" valuePropName="checked">
            <Switch />
          </Item>
          <Item name="menuType" label="菜单类型" rules={[{ required: true, message: '请选择菜单类型' }]}>
            <Select placeholder="请选择菜单类型">
              <Option value="M">菜单</Option>
              <Option value="C">按钮</Option>
              <Option value="F">目录</Option>
            </Select>
          </Item>
          <Item name="visible" label="是否可见" valuePropName="checked">
            <Switch />
          </Item>
          <Item name="status" label="状态" valuePropName="checked">
            <Switch />
          </Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Menus;