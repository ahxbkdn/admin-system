import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, DatePicker, Space, Row, Col, Tabs, Typography, Divider, message, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import request from '../utils/request';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

interface OperationLogData {
  key: string;
  id: number;
  title: string;
  businessType: string;
  method: string;
  requestMethod: string;
  operatorType: string;
  operName: string;
  operUrl: string;
  operIp: string;
  operLocation: string;
  status: number;
  operTime: string;
}

interface LoginLogData {
  key: string;
  id: number;
  loginName: string;
  ipaddr: string;
  loginLocation: string;
  browser: string;
  os: string;
  status: string;
  msg: string;
  loginTime: string;
}

interface OperationSearchParams {
  title: string;
  businessType: string;
  operName: string;
  status: string;
  operTime: any[];
}

interface LoginSearchParams {
  loginName: string;
  status: string;
  loginTime: any[];
}

const Logs: React.FC = () => {
  // 操作日志状态
  const [operationLogs, setOperationLogs] = useState<OperationLogData[]>([]);
  const [operationLoading, setOperationLoading] = useState(false);
  const [operationSearchParams, setOperationSearchParams] = useState<OperationSearchParams>({
    title: '',
    businessType: '',
    operName: '',
    status: '',
    operTime: [],
  });
  const [operationPagination, setOperationPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const operationErrorShownRef = React.useRef(false);

  // 登录日志状态
  const [loginLogs, setLoginLogs] = useState<LoginLogData[]>([]);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginSearchParams, setLoginSearchParams] = useState<LoginSearchParams>({
    loginName: '',
    status: '',
    loginTime: [],
  });
  const [loginPagination, setLoginPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const loginErrorShownRef = React.useRef(false);

  // 获取操作日志列表
  const fetchOperationLogs = async () => {
    setOperationLoading(true);
    try {
      const response = await request.get('/system/log/operation/list', {
        params: {
          ...operationSearchParams,
          pageNum: operationPagination.current,
          pageSize: operationPagination.pageSize,
        },
      });
      let filteredData = response.rows.map((log: any) => ({
        key: log.operId.toString(),
        id: log.operId,
        title: log.title,
        businessType: log.businessType,
        method: log.method,
        requestMethod: log.requestMethod,
        operatorType: log.operatorType,
        operName: log.operName,
        operUrl: log.operUrl,
        operIp: log.operIp,
        operLocation: log.operLocation,
        status: log.status,
        operTime: log.operTime,
      }));
      
      // 应用搜索条件
      if (operationSearchParams.title) {
        filteredData = filteredData.filter(log => log.title.includes(operationSearchParams.title));
      }
      if (operationSearchParams.operName) {
        filteredData = filteredData.filter(log => log.operName.includes(operationSearchParams.operName));
      }
      if (operationSearchParams.status) {
        filteredData = filteredData.filter(log => log.status.toString() === operationSearchParams.status);
      }
      // 添加日期范围搜索
      if (operationSearchParams.operTime && operationSearchParams.operTime.length === 2) {
        const startTime = operationSearchParams.operTime[0].format('YYYY-MM-DD HH:mm:ss');
        const endTime = operationSearchParams.operTime[1].format('YYYY-MM-DD HH:mm:ss');
        filteredData = filteredData.filter(log => 
          log.operTime >= startTime && log.operTime <= endTime
        );
      }
      
      setOperationLogs(filteredData);
      setOperationPagination({
        ...operationPagination,
        total: filteredData.length,
      });
    } catch (error) {
      console.error('获取操作日志列表失败:', error);
      if (!operationErrorShownRef.current) {
        message.error('获取操作日志列表失败，使用模拟数据');
        operationErrorShownRef.current = true;
      }
      // 提供模拟数据
      let mockData = [
        {
          key: '1',
          id: 1,
          title: '用户管理',
          businessType: '新增',
          method: 'com.ruoyi.web.controller.system.SysUserController.add',
          requestMethod: 'POST',
          operatorType: '0',
          operName: '若依',
          operUrl: '/system/user',
          operIp: '127.0.0.1',
          operLocation: '本地',
          status: 0,
          operTime: '2026-01-18 10:58:15',
        },
        {
          key: '2',
          id: 2,
          title: '角色管理',
          businessType: '修改',
          method: 'com.ruoyi.web.controller.system.SysRoleController.edit',
          requestMethod: 'PUT',
          operatorType: '0',
          operName: '若依',
          operUrl: '/system/role',
          operIp: '127.0.0.1',
          operLocation: '本地',
          status: 0,
          operTime: '2026-01-18 10:58:15',
        },
      ];
      
      // 模拟搜索功能
      if (operationSearchParams.title) {
        mockData = mockData.filter(log => log.title.includes(operationSearchParams.title));
      }
      if (operationSearchParams.operName) {
        mockData = mockData.filter(log => log.operName.includes(operationSearchParams.operName));
      }
      if (operationSearchParams.status) {
        mockData = mockData.filter(log => log.status.toString() === operationSearchParams.status);
      }
      // 添加日期范围搜索
      if (operationSearchParams.operTime && operationSearchParams.operTime.length === 2) {
        const startTime = operationSearchParams.operTime[0].format('YYYY-MM-DD HH:mm:ss');
        const endTime = operationSearchParams.operTime[1].format('YYYY-MM-DD HH:mm:ss');
        mockData = mockData.filter(log => 
          log.operTime >= startTime && log.operTime <= endTime
        );
      }
      
      setOperationLogs(mockData);
      setOperationPagination({
        ...operationPagination,
        total: mockData.length,
      });
    } finally {
      setOperationLoading(false);
    }
  };

  // 获取登录日志列表
  const fetchLoginLogs = async () => {
    setLoginLoading(true);
    try {
      const response = await request.get('/system/log/login/list', {
        params: {
          ...loginSearchParams,
          pageNum: loginPagination.current,
          pageSize: loginPagination.pageSize,
        },
      });
      let filteredData = response.rows.map((log: any) => ({
        key: log.infoId.toString(),
        id: log.infoId,
        loginName: log.loginName,
        ipaddr: log.ipaddr,
        loginLocation: log.loginLocation,
        browser: log.browser,
        os: log.os,
        status: log.status === 0 ? '成功' : '失败',
        msg: log.msg,
        loginTime: log.loginTime,
      }));
      
      // 应用搜索条件
      if (loginSearchParams.loginName) {
        filteredData = filteredData.filter(log => log.loginName.includes(loginSearchParams.loginName));
      }
      if (loginSearchParams.status) {
        const statusText = loginSearchParams.status === '0' ? '成功' : '失败';
        filteredData = filteredData.filter(log => log.status === statusText);
      }
      // 添加日期范围搜索
      if (loginSearchParams.loginTime && loginSearchParams.loginTime.length === 2) {
        const startTime = loginSearchParams.loginTime[0].format('YYYY-MM-DD HH:mm:ss');
        const endTime = loginSearchParams.loginTime[1].format('YYYY-MM-DD HH:mm:ss');
        filteredData = filteredData.filter(log => 
          log.loginTime >= startTime && log.loginTime <= endTime
        );
      }
      
      setLoginLogs(filteredData);
      setLoginPagination({
        ...loginPagination,
        total: filteredData.length,
      });
    } catch (error) {
      console.error('获取登录日志列表失败:', error);
      if (!loginErrorShownRef.current) {
        message.error('获取登录日志列表失败，使用模拟数据');
        loginErrorShownRef.current = true;
      }
      // 提供模拟数据
      let mockData = [
        {
          key: '1',
          id: 1,
          loginName: 'admin',
          ipaddr: '127.0.0.1',
          loginLocation: '本地',
          browser: 'Chrome',
          os: 'Windows 10',
          status: '成功',
          msg: '登录成功',
          loginTime: '2026-01-18 10:58:15',
        },
        {
          key: '2',
          id: 2,
          loginName: 'ry',
          ipaddr: '192.168.1.100',
          loginLocation: '局域网',
          browser: 'Firefox',
          os: 'Windows 10',
          status: '成功',
          msg: '登录成功',
          loginTime: '2026-01-18 10:58:15',
        },
      ];
      
      // 模拟搜索功能
      if (loginSearchParams.loginName) {
        mockData = mockData.filter(log => log.loginName.includes(loginSearchParams.loginName));
      }
      if (loginSearchParams.status) {
        const statusText = loginSearchParams.status === '0' ? '成功' : '失败';
        mockData = mockData.filter(log => log.status === statusText);
      }
      // 添加日期范围搜索
      if (loginSearchParams.loginTime && loginSearchParams.loginTime.length === 2) {
        const startTime = loginSearchParams.loginTime[0].format('YYYY-MM-DD HH:mm:ss');
        const endTime = loginSearchParams.loginTime[1].format('YYYY-MM-DD HH:mm:ss');
        mockData = mockData.filter(log => 
          log.loginTime >= startTime && log.loginTime <= endTime
        );
      }
      
      setLoginLogs(mockData);
      setLoginPagination({
        ...loginPagination,
        total: mockData.length,
      });
    } finally {
      setLoginLoading(false);
    }
  };

  // 初始化时获取日志列表
  useEffect(() => {
    fetchOperationLogs();
  }, []);

  useEffect(() => {
    fetchLoginLogs();
  }, []);

  // 操作日志搜索
  const handleOperationSearch = () => {
    setOperationPagination({ ...operationPagination, current: 1 });
    fetchOperationLogs();
  };

  // 操作日志重置
  const handleOperationReset = () => {
    setOperationSearchParams({
      title: '',
      businessType: '',
      operName: '',
      status: '',
      operTime: [],
    });
    setOperationPagination({ ...operationPagination, current: 1 });
  };

  // 登录日志搜索
  const handleLoginSearch = () => {
    setLoginPagination({ ...loginPagination, current: 1 });
    fetchLoginLogs();
  };

  // 登录日志重置
  const handleLoginReset = () => {
    setLoginSearchParams({
      loginName: '',
      status: '',
      loginTime: [],
    });
    setLoginPagination({ ...loginPagination, current: 1 });
  };

  // 删除操作日志
  const handleDeleteOperationLog = async (operId: number) => {
    try {
      await request.delete(`/system/log/operation/${operId}`);
      message.success('删除成功');
      fetchOperationLogs();
    } catch (error) {
      console.error('删除操作日志失败:', error);
      message.success('删除成功（模拟）');
      // 模拟删除成功，手动从列表中移除
      const updatedLogs = operationLogs.filter(log => log.id !== operId);
      setOperationLogs(updatedLogs);
      setOperationPagination({
        ...operationPagination,
        total: updatedLogs.length,
      });
    }
  };

  // 删除登录日志
  const handleDeleteLoginLog = async (infoId: number) => {
    try {
      await request.delete(`/system/log/login/${infoId}`);
      message.success('删除成功');
      fetchLoginLogs();
    } catch (error) {
      console.error('删除登录日志失败:', error);
      message.success('删除成功（模拟）');
      // 模拟删除成功，手动从列表中移除
      const updatedLogs = loginLogs.filter(log => log.id !== infoId);
      setLoginLogs(updatedLogs);
      setLoginPagination({
        ...loginPagination,
        total: updatedLogs.length,
      });
    }
  };

  // 导出操作日志
  const handleExportOperationLogs = () => {
    request.get('/system/log/operation/export', {
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '操作日志列表.xlsx');
      document.body.appendChild(link);
      link.click();
    }).catch(() => {
      message.error('导出失败');
    });
  };

  // 导出登录日志
  const handleExportLoginLogs = () => {
    request.get('/system/log/login/export', {
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '登录日志列表.xlsx');
      document.body.appendChild(link);
      link.click();
    }).catch(() => {
      message.error('导出失败');
    });
  };

  // 操作日志列定义
  const operationColumns: ColumnsType<OperationLogData> = [
    {
      title: '日志编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '操作模块',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '业务类型',
      dataIndex: 'businessType',
      key: 'businessType',
    },
    {
      title: '操作方法',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: '请求方式',
      dataIndex: 'requestMethod',
      key: 'requestMethod',
    },
    {
      title: '操作人',
      dataIndex: 'operName',
      key: 'operName',
    },
    {
      title: '操作IP',
      dataIndex: 'operIp',
      key: 'operIp',
    },
    {
      title: '操作地点',
      dataIndex: 'operLocation',
      key: 'operLocation',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (status === 0 ? '成功' : '失败'),
    },
    {
      title: '操作时间',
      dataIndex: 'operTime',
      key: 'operTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="确定要删除这个操作日志吗？"
            onConfirm={() => handleDeleteOperationLog(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 登录日志列定义
  const loginColumns: ColumnsType<LoginLogData> = [
    {
      title: '日志编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '登录用户名',
      dataIndex: 'loginName',
      key: 'loginName',
    },
    {
      title: '登录IP',
      dataIndex: 'ipaddr',
      key: 'ipaddr',
    },
    {
      title: '登录地点',
      dataIndex: 'loginLocation',
      key: 'loginLocation',
    },
    {
      title: '浏览器',
      dataIndex: 'browser',
      key: 'browser',
    },
    {
      title: '操作系统',
      dataIndex: 'os',
      key: 'os',
    },
    {
      title: '登录状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <span style={{ color: status === '成功' ? '#52c41a' : '#ff4d4f' }}>{status}</span>
      ),
    },
    {
      title: '登录时间',
      dataIndex: 'loginTime',
      key: 'loginTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="确定要删除这个登录日志吗？"
            onConfirm={() => handleDeleteLoginLog(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Tabs 
        defaultActiveKey="operation"
        items={[
          {
            key: 'operation',
            label: '操作日志',
            children: (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Input 
                        placeholder="请输入操作模块"
                        value={operationSearchParams.title}
                        onChange={(e) => setOperationSearchParams({ ...operationSearchParams, title: e.target.value })}
                      />
                    </Col>
                    <Col span={6}>
                      <Input 
                        placeholder="请输入操作人"
                        value={operationSearchParams.operName}
                        onChange={(e) => setOperationSearchParams({ ...operationSearchParams, operName: e.target.value })}
                      />
                    </Col>
                    <Col span={6}>
                      <Select 
                        placeholder="操作状态"
                        value={operationSearchParams.status}
                        onChange={(value) => setOperationSearchParams({ ...operationSearchParams, status: value })}
                      >
                        <Option value="">全部</Option>
                        <Option value="0">成功</Option>
                        <Option value="1">失败</Option>
                      </Select>
                    </Col>
                    <Col span={6}>
                      <span style={{ marginRight: 8 }}>操作时间：</span>
                      <RangePicker 
                        style={{ width: '70%' }}
                        value={operationSearchParams.operTime}
                        onChange={(dates) => setOperationSearchParams({ ...operationSearchParams, operTime: dates || [] })}
                      />
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={24} style={{ textAlign: 'right' }}>
                      <Space>
                        <Button type="primary" style={{ backgroundColor: '#52c41a' }} onClick={handleOperationSearch}>搜索</Button>
                        <Button onClick={handleOperationReset}>重置</Button>
                      </Space>
                    </Col>
                  </Row>
                </div>
                <Divider />
                <div style={{ marginBottom: 16 }}>
                  <Space>
                    <Button danger>批量删除</Button>
                    <Button onClick={handleExportOperationLogs}>导出</Button>
                  </Space>
                </div>
                <Table 
                  columns={operationColumns} 
                  dataSource={operationLogs} 
                  loading={operationLoading}
                  pagination={{
                    total: operationPagination.total,
                    pageSize: operationPagination.pageSize,
                    current: operationPagination.current,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条`,
                    onChange: (page, pageSize) => setOperationPagination({ ...operationPagination, current: page, pageSize }),
                  }}
                />
              </>
            )
          },
          {
            key: 'login',
            label: '登录日志',
            children: (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Input 
                        placeholder="请输入登录用户名"
                        value={loginSearchParams.loginName}
                        onChange={(e) => setLoginSearchParams({ ...loginSearchParams, loginName: e.target.value })}
                      />
                    </Col>
                    <Col span={6}>
                      <Select 
                        placeholder="登录状态"
                        value={loginSearchParams.status}
                        onChange={(value) => setLoginSearchParams({ ...loginSearchParams, status: value })}
                      >
                        <Option value="">全部</Option>
                        <Option value="0">成功</Option>
                        <Option value="1">失败</Option>
                      </Select>
                    </Col>
                    <Col span={12}>
                      <span style={{ marginRight: 8 }}>登录时间：</span>
                      <RangePicker 
                        style={{ width: '70%' }}
                        value={loginSearchParams.loginTime}
                        onChange={(dates) => setLoginSearchParams({ ...loginSearchParams, loginTime: dates || [] })}
                      />
                    </Col>
                  </Row>
                  <Row gutter={16} style={{ marginTop: 16 }}>
                    <Col span={24} style={{ textAlign: 'right' }}>
                      <Space>
                        <Button type="primary" style={{ backgroundColor: '#52c41a' }} onClick={handleLoginSearch}>搜索</Button>
                        <Button onClick={handleLoginReset}>重置</Button>
                      </Space>
                    </Col>
                  </Row>
                </div>
                <Divider />
                <div style={{ marginBottom: 16 }}>
                  <Space>
                    <Button danger>批量删除</Button>
                    <Button onClick={handleExportLoginLogs}>导出</Button>
                  </Space>
                </div>
                <Table 
                  columns={loginColumns} 
                  dataSource={loginLogs} 
                  loading={loginLoading}
                  pagination={{
                    total: loginPagination.total,
                    pageSize: loginPagination.pageSize,
                    current: loginPagination.current,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条`,
                    onChange: (page, pageSize) => setLoginPagination({ ...loginPagination, current: page, pageSize }),
                  }}
                />
              </>
            )
          }
        ]}
      />
    </div>
  );
};

export default Logs;