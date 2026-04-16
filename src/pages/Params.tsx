import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, DatePicker, Space, Row, Col, Tabs, Switch, Typography, Divider, Modal, Form, message, Upload, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import request from '../utils/request';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;
const { Item } = Form;
const { Dragger } = Upload;

interface ParamData {
  key: string;
  id: string;
  configKey: string;
  configValue: string;
  configName: string;
  configType: string;
  status: boolean;
  createTime: string;
}

interface SearchParams {
  configKey: string;
  configName: string;
  configType: string;
  status: string;
  createTime: any[];
}

const Params: React.FC = () => {
  const [form] = Form.useForm();
  const [params, setParams] = useState<ParamData[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentParam, setCurrentParam] = useState<ParamData | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    configKey: '',
    configName: '',
    configType: '',
    status: '',
    createTime: [],
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const errorShownRef = React.useRef(false);

  // 获取参数列表
  const fetchParams = async () => {
    setLoading(true);
    try {
      // 由于后端API中没有参数相关的接口，暂时使用模拟数据
      throw new Error('后端API中没有参数相关接口');
    } catch (error) {
      console.error('获取参数列表失败:', error);
      if (!errorShownRef.current) {
        message.error('获取参数列表失败，使用模拟数据');
        errorShownRef.current = true;
      }
      // 提供模拟数据
      let mockData = [
        {
          key: '1',
          id: '1',
          configKey: 'site.name',
          configValue: '若依管理系统',
          configName: '网站名称',
          configType: 'system',
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
        {
          key: '2',
          id: '2',
          configKey: 'site.title',
          configValue: '若依管理系统',
          configName: '网站标题',
          configType: 'system',
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
        {
          key: '3',
          id: '3',
          configKey: 'upload.maxSize',
          configValue: '10',
          configName: '上传文件大小限制',
          configType: 'upload',
          status: true,
          createTime: '2026-01-18 10:58:15',
        },
      ];
      
      // 模拟搜索功能 - 支持多字段搜索
      if (searchParams.configKey) {
        mockData = mockData.filter(param => 
          param.configKey.includes(searchParams.configKey) || 
          param.configName.includes(searchParams.configKey) || 
          param.configType.includes(searchParams.configKey) ||
          param.configValue.includes(searchParams.configKey)
        );
      }
      if (searchParams.configName) {
        mockData = mockData.filter(param => 
          param.configKey.includes(searchParams.configName) || 
          param.configName.includes(searchParams.configName) || 
          param.configType.includes(searchParams.configName) ||
          param.configValue.includes(searchParams.configName)
        );
      }
      if (searchParams.configType) {
        mockData = mockData.filter(param => 
          param.configKey.includes(searchParams.configType) || 
          param.configName.includes(searchParams.configType) || 
          param.configType.includes(searchParams.configType) ||
          param.configValue.includes(searchParams.configType)
        );
      }
      if (searchParams.status) {
        mockData = mockData.filter(param => param.status === (searchParams.status === '0'));
      }
      // 添加日期范围搜索
      if (searchParams.createTime && searchParams.createTime.length === 2) {
        const startTime = searchParams.createTime[0].format('YYYY-MM-DD HH:mm:ss');
        const endTime = searchParams.createTime[1].format('YYYY-MM-DD HH:mm:ss');
        mockData = mockData.filter(param => 
          param.createTime >= startTime && param.createTime <= endTime
        );
      }
      
      setParams(mockData);
      setPagination({
        ...pagination,
        total: mockData.length,
      });
    } finally {
      setLoading(false);
    }
  };

  // 初始化时获取参数列表
  useEffect(() => {
    fetchParams();
  }, []);

  // 搜索
  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    fetchParams();
  };

  // 重置
  const handleReset = () => {
    setSearchParams({
      configKey: '',
      configName: '',
      configType: '',
      status: '',
      createTime: [],
    });
    setPagination({ ...pagination, current: 1 });
  };

  // 打开新增模态框
  const handleAdd = () => {
    setModalType('add');
    setCurrentParam(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开修改模态框
  const handleEdit = (param: ParamData) => {
    setModalType('edit');
    setCurrentParam(param);
    form.setFieldsValue({
      configKey: param.configKey,
      configValue: param.configValue,
      configName: param.configName,
      configType: param.configType,
      status: param.status,
    });
    setModalVisible(true);
  };

  // 删除参数
  const handleDelete = async (configId: string) => {
    try {
      // 由于后端API中没有参数相关的接口，暂时使用模拟删除
      throw new Error('后端API中没有参数相关接口');
    } catch (error) {
      console.error('删除参数失败:', error);
      message.success('删除成功（模拟）');
      // 模拟删除成功，手动从列表中移除
      const updatedParams = params.filter(param => param.id !== configId);
      setParams(updatedParams);
      setPagination({
        ...pagination,
        total: updatedParams.length,
      });
    }
  };

  // 保存参数
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (modalType === 'add') {
        try {
          // 由于后端API中没有参数相关的接口，暂时使用模拟新增
          throw new Error('后端API中没有参数相关接口');
        } catch (error) {
          console.error('新增参数失败:', error);
          message.success('新增成功（模拟）');
          // 模拟新增成功，手动添加到列表
          const newParam = {
            key: Date.now().toString(),
            id: Date.now().toString(),
            configKey: values.configKey,
            configValue: values.configValue,
            configName: values.configName,
            configType: values.configType,
            status: values.status,
            createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          };
          setParams([...params, newParam]);
          setPagination({
            ...pagination,
            total: params.length + 1,
          });
        }
      } else if (modalType === 'edit' && currentParam) {
        try {
          // 由于后端API中没有参数相关的接口，暂时使用模拟修改
          throw new Error('后端API中没有参数相关接口');
        } catch (error) {
          console.error('修改参数失败:', error);
          message.success('修改成功（模拟）');
          // 模拟修改成功，手动更新列表
          const updatedParams = params.map(param => 
            param.id === currentParam.id ? {
              ...param,
              configKey: values.configKey,
              configValue: values.configValue,
              configName: values.configName,
              configType: values.configType,
              status: values.status,
            } : param
          );
          setParams(updatedParams);
        }
      }
      setModalVisible(false);
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败');
    }
  };

  // 导出参数
  const handleExport = () => {
    message.info('导出功能待实现');
  };

  // 导入参数
  const handleImport = () => {
    // 这里可以实现文件上传逻辑
    message.info('导入功能待实现');
  };

  // 列定义
  const columns: ColumnsType<ParamData> = [
    {
      title: '参数编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '参数键名',
      dataIndex: 'configKey',
      key: 'configKey',
    },
    {
      title: '参数值',
      dataIndex: 'configValue',
      key: 'configValue',
    },
    {
      title: '参数名称',
      dataIndex: 'configName',
      key: 'configName',
    },
    {
      title: '参数类型',
      dataIndex: 'configType',
      key: 'configType',
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
            title="确定要删除这个参数吗？"
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
            label: '参数设置',
            children: (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Input 
                        placeholder="请输入参数键名" 
                        value={searchParams.configKey}
                        onChange={(e) => setSearchParams({ ...searchParams, configKey: e.target.value })}
                      />
                    </Col>
                    <Col span={6}>
                      <Input 
                        placeholder="请输入参数名称" 
                        value={searchParams.configName}
                        onChange={(e) => setSearchParams({ ...searchParams, configName: e.target.value })}
                      />
                    </Col>
                    <Col span={6}>
                      <Input 
                        placeholder="请输入参数类型" 
                        value={searchParams.configType}
                        onChange={(e) => setSearchParams({ ...searchParams, configType: e.target.value })}
                      />
                    </Col>
                    <Col span={6}>
                      <Select 
                        placeholder="参数状态" 
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
                  dataSource={params} 
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

      {/* 新增/修改参数模态框 */}
      <Modal
        title={modalType === 'add' ? '新增参数' : '修改参数'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Item name="configKey" label="参数键名" rules={[{ required: true, message: '请输入参数键名' }]}>
            <Input placeholder="请输入参数键名" />
          </Item>
          <Item name="configValue" label="参数值" rules={[{ required: true, message: '请输入参数值' }]}>
            <Input placeholder="请输入参数值" />
          </Item>
          <Item name="configName" label="参数名称" rules={[{ required: true, message: '请输入参数名称' }]}>
            <Input placeholder="请输入参数名称" />
          </Item>
          <Item name="configType" label="参数类型" rules={[{ required: true, message: '请输入参数类型' }]}>
            <Input placeholder="请输入参数类型" />
          </Item>
          <Item name="status" label="状态" valuePropName="checked">
            <Switch />
          </Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Params;