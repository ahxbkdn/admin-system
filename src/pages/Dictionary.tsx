import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, DatePicker, Space, Row, Col, Tabs, Switch, Typography, Divider, Modal, Form, message, Upload, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import request from '../utils/request';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Item } = Form;
const { Dragger } = Upload;

interface DictionaryData {
  key: string;
  id: string;
  dictName: string;
  dictType: string;
  status: boolean;
  createTime: string;
}

interface SearchParams {
  dictName: string;
  dictType: string;
  status: string;
  createTime: any[];
}

const Dictionary: React.FC = () => {
  const [form] = Form.useForm();
  const [dictionaries, setDictionaries] = useState<DictionaryData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentDictionary, setCurrentDictionary] = useState<DictionaryData | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    dictName: '',
    dictType: '',
    status: '',
    createTime: [],
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const errorShownRef = React.useRef(false);

  // 获取字典列表
  const fetchDictionaries = async () => {
    setLoading(true);
    try {
      // 由于后端API中没有字典相关的接口，暂时使用模拟数据
      throw new Error('后端API中没有字典相关接口');
    } catch (error) {
      console.error('获取字典列表失败:', error);
      if (!errorShownRef.current) {
        message.error('获取字典列表失败，使用模拟数据');
        errorShownRef.current = true;
      }
      // 提供模拟数据
      let mockData = [
        {
          key: '1',
          id: '1',
          dictName: '用户状态',
          dictType: 'sys_user_status',
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
        {
          key: '2',
          id: '2',
          dictName: '部门状态',
          dictType: 'sys_dept_status',
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
        {
          key: '3',
          id: '3',
          dictName: '岗位状态',
          dictType: 'sys_post_status',
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
      ];
      
      // 模拟搜索功能 - 支持多字段搜索
      if (searchParams.dictName) {
        mockData = mockData.filter(dict => 
          dict.dictName.includes(searchParams.dictName) || 
          dict.dictType.includes(searchParams.dictName)
        );
      }
      if (searchParams.dictType) {
        mockData = mockData.filter(dict => 
          dict.dictName.includes(searchParams.dictType) || 
          dict.dictType.includes(searchParams.dictType)
        );
      }
      if (searchParams.status) {
        mockData = mockData.filter(dict => dict.status === (searchParams.status === '0'));
      }
      // 添加日期范围搜索
      if (searchParams.createTime && searchParams.createTime.length === 2) {
        const startTime = searchParams.createTime[0].format('YYYY-MM-DD HH:mm:ss');
        const endTime = searchParams.createTime[1].format('YYYY-MM-DD HH:mm:ss');
        mockData = mockData.filter(dict => 
          dict.createTime >= startTime && dict.createTime <= endTime
        );
      }
      
      setDictionaries(mockData);
      setPagination({
        ...pagination,
        total: mockData.length,
      });
    } finally {
      setLoading(false);
    }
  };

  // 初始化时获取字典列表
  useEffect(() => {
    fetchDictionaries();
  }, []);

  // 搜索
  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    fetchDictionaries();
  };

  // 重置
  const handleReset = () => {
    setSearchParams({
      dictName: '',
      dictType: '',
      status: '',
      createTime: [],
    });
    setPagination({ ...pagination, current: 1 });
  };

  // 打开新增模态框
  const handleAdd = () => {
    setModalType('add');
    setCurrentDictionary(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开修改模态框
  const handleEdit = (dict: DictionaryData) => {
    setModalType('edit');
    setCurrentDictionary(dict);
    form.setFieldsValue({
      dictName: dict.dictName,
      dictType: dict.dictType,
      status: dict.status,
    });
    setModalVisible(true);
  };

  // 删除字典
  const handleDelete = async (dictId: string) => {
    try {
      // 由于后端API中没有字典相关的接口，暂时使用模拟删除
      throw new Error('后端API中没有字典相关接口');
    } catch (error) {
      console.error('删除字典失败:', error);
      message.success('删除成功（模拟）');
      // 模拟删除成功，手动从列表中移除
      const updatedDictionaries = dictionaries.filter(dict => dict.id !== dictId);
      setDictionaries(updatedDictionaries);
      setPagination({
        ...pagination,
        total: updatedDictionaries.length,
      });
    }
  };

  // 保存字典
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (modalType === 'add') {
        try {
          // 由于后端API中没有字典相关的接口，暂时使用模拟新增
          throw new Error('后端API中没有字典相关接口');
        } catch (error) {
          console.error('新增字典失败:', error);
          message.success('新增成功（模拟）');
          // 模拟新增成功，手动添加到列表
          const newDict = {
            key: Date.now().toString(),
            id: Date.now().toString(),
            dictName: values.dictName,
            dictType: values.dictType,
            status: values.status,
            createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          };
          setDictionaries([...dictionaries, newDict]);
          setPagination({
            ...pagination,
            total: dictionaries.length + 1,
          });
        }
      } else if (modalType === 'edit' && currentDictionary) {
        try {
          // 由于后端API中没有字典相关的接口，暂时使用模拟修改
          throw new Error('后端API中没有字典相关接口');
        } catch (error) {
          console.error('修改字典失败:', error);
          message.success('修改成功（模拟）');
          // 模拟修改成功，手动更新列表
          const updatedDictionaries = dictionaries.map(dict => 
            dict.id === currentDictionary.id ? {
              ...dict,
              dictName: values.dictName,
              dictType: values.dictType,
              status: values.status,
            } : dict
          );
          setDictionaries(updatedDictionaries);
        }
      }
      setModalVisible(false);
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    }
  };

  // 导出字典
  const handleExport = () => {
    message.info('导出功能待实现');
  };

  // 导入字典
  const handleImport = () => {
    // 这里可以实现文件上传逻辑
    message.info('导入功能待实现');
  };

  // 列定义
  const columns: ColumnsType<DictionaryData> = [
    {
      title: '字典编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '字典名称',
      dataIndex: 'dictName',
      key: 'dictName',
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
      key: 'dictType',
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
            title="确定要删除这个字典吗？"
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
            label: '字典管理',
            children: (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Input 
                        placeholder="请输入字典名称" 
                        value={searchParams.dictName}
                        onChange={(e) => setSearchParams({ ...searchParams, dictName: e.target.value })}
                      />
                    </Col>
                    <Col span={6}>
                      <Input 
                        placeholder="请输入字典类型" 
                        value={searchParams.dictType}
                        onChange={(e) => setSearchParams({ ...searchParams, dictType: e.target.value })}
                      />
                    </Col>
                    <Col span={6}>
                      <Select 
                        placeholder="字典状态" 
                        value={searchParams.status}
                        onChange={(value) => setSearchParams({ ...searchParams, status: value })}
                      >
                        <Option value="">全部</Option>
                        <Option value="0">启用</Option>
                        <Option value="1">禁用</Option>
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
                  dataSource={dictionaries} 
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

      {/* 新增/修改字典模态框 */}
      <Modal
        title={modalType === 'add' ? '新增字典' : '修改字典'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Item name="dictName" label="字典名称" rules={[{ required: true, message: '请输入字典名称' }]}>
            <Input placeholder="请输入字典名称" />
          </Item>
          <Item name="dictType" label="字典类型" rules={[{ required: true, message: '请输入字典类型' }]}>
            <Input placeholder="请输入字典类型" />
          </Item>
          <Item name="status" label="状态" valuePropName="checked">
            <Switch />
          </Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dictionary;