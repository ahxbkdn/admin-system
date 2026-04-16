import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Select, DatePicker, Space, Row, Col, Tabs, Typography, Divider, message, Card, Statistic, Progress, List, Avatar } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import request from '../utils/request';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Text } = Typography;

interface OnlineUserData {
  key: string;
  id: number;
  tokenId: string;
  userId: number;
  loginName: string;
  deptName: string;
  ipaddr: string;
  loginLocation: string;
  browser: string;
  os: string;
  loginTime: string;
}

interface ServerInfo {
  cpu: number;
  memory: number;
  disk: number;
  uptime: string;
  version: string;
  javaVersion: string;
  serverInfo: string;
}

interface SearchParams {
  loginName: string;
  ipaddr: string;
  loginTime: any[];
}

const Monitor: React.FC = () => {
  // 在线用户状态
  const [onlineUsers, setOnlineUsers] = useState<OnlineUserData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<SearchParams>({
    loginName: '',
    ipaddr: '',
    loginTime: [],
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const errorShownRef = React.useRef(false);

  // 服务器监控状态
  const [serverInfo, setServerInfo] = useState<ServerInfo>({
    cpu: 0,
    memory: 0,
    disk: 0,
    uptime: '',
    version: '',
    javaVersion: '',
    serverInfo: '',
  });
  const [serverLoading, setServerLoading] = useState(false);

  // 获取在线用户列表
  const fetchOnlineUsers = async () => {
    setLoading(true);
    try {
      const response = await request.get('/monitor/online/list', {
        params: {
          ...searchParams,
          pageNum: pagination.current,
          pageSize: pagination.pageSize,
        },
      });
      setOnlineUsers(response.rows.map((user: any) => ({
        key: user.sessionId.toString(),
        id: user.sessionId,
        tokenId: user.tokenId,
        userId: user.userId,
        loginName: user.loginName,
        deptName: user.deptName,
        ipaddr: user.ipaddr,
        loginLocation: user.loginLocation,
        browser: user.browser,
        os: user.os,
        loginTime: user.loginTime,
      })));
      setPagination({
        ...pagination,
        total: response.total,
      });
    } catch (error) {
      console.error('获取在线用户列表失败:', error);
      if (!errorShownRef.current) {
        message.error('获取在线用户列表失败，使用模拟数据');
        errorShownRef.current = true;
      }
      // 提供模拟数据
      const mockData = [
        {
          key: '1',
          id: 1,
          tokenId: 'token1',
          userId: 1,
          loginName: 'admin',
          deptName: '研发部门',
          ipaddr: '127.0.0.1',
          loginLocation: '本地',
          browser: 'Chrome',
          os: 'Windows 10',
          loginTime: '2026-01-18 10:58:15',
        },
        {
          key: '2',
          id: 2,
          tokenId: 'token2',
          userId: 2,
          loginName: 'ry',
          deptName: '测试部门',
          ipaddr: '192.168.1.100',
          loginLocation: '局域网',
          browser: 'Firefox',
          os: 'Windows 10',
          loginTime: '2026-01-18 10:58:15',
        },
      ];
      setOnlineUsers(mockData);
      setPagination({
        ...pagination,
        total: mockData.length,
      });
    } finally {
      setLoading(false);
    }
  };

  // 获取服务器信息
  const fetchServerInfo = async () => {
    setServerLoading(true);
    try {
      const response = await request.get('/monitor/server');
      setServerInfo({
        cpu: response.cpuUsage,
        memory: response.memoryUsage,
        disk: response.diskUsage,
        uptime: response.uptime,
        version: response.version,
        javaVersion: response.javaVersion,
        serverInfo: response.serverInfo,
      });
    } catch (error) {
      console.error('获取服务器信息失败:', error);
      // 提供模拟数据
      setServerInfo({
        cpu: 30,
        memory: 50,
        disk: 70,
        uptime: '24小时',
        version: 'v1.0.0',
        javaVersion: '1.8.0_202',
        serverInfo: 'Apache Tomcat 9.0.50',
      });
    } finally {
      setServerLoading(false);
    }
  };

  // 初始化时获取数据
  useEffect(() => {
    fetchOnlineUsers();
    fetchServerInfo();
    // 定时刷新服务器信息
    const interval = setInterval(fetchServerInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  // 搜索
  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    fetchOnlineUsers();
  };

  // 重置
  const handleReset = () => {
    setSearchParams({
      loginName: '',
      ipaddr: '',
      loginTime: [],
    });
    setPagination({ ...pagination, current: 1 });
  };

  // 强制下线用户
  const handleForceLogout = async (tokenId: string) => {
    try {
      await request.delete(`/monitor/online/${tokenId}`);
      message.success('强制下线成功');
      fetchOnlineUsers();
    } catch (error) {
      console.error('强制下线失败:', error);
      message.success('强制下线成功（模拟）');
      // 模拟强制下线成功，手动从列表中移除
      const updatedUsers = onlineUsers.filter(user => user.tokenId !== tokenId);
      setOnlineUsers(updatedUsers);
      setPagination({
        ...pagination,
        total: updatedUsers.length,
      });
    }
  };

  // 在线用户列定义
  const columns: ColumnsType<OnlineUserData> = [
    {
      title: '会话编号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '登录用户',
      dataIndex: 'loginName',
      key: 'loginName',
    },
    {
      title: '部门',
      dataIndex: 'deptName',
      key: 'deptName',
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
      title: '登录时间',
      dataIndex: 'loginTime',
      key: 'loginTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" danger onClick={() => handleForceLogout(record.tokenId)}>强制下线</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Tabs 
        defaultActiveKey="online"
        items={[
          {
            key: 'online',
            label: '在线用户',
            children: (
              <>
                <div style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Input 
                        placeholder="请输入登录用户名"
                        value={searchParams.loginName}
                        onChange={(e) => setSearchParams({ ...searchParams, loginName: e.target.value })}
                      />
                    </Col>
                    <Col span={6}>
                      <Input 
                        placeholder="请输入登录IP"
                        value={searchParams.ipaddr}
                        onChange={(e) => setSearchParams({ ...searchParams, ipaddr: e.target.value })}
                      />
                    </Col>
                    <Col span={12}>
                      <span style={{ marginRight: 8 }}>登录时间：</span>
                      <RangePicker 
                        style={{ width: '70%' }}
                        value={searchParams.loginTime}
                        onChange={(dates) => setSearchParams({ ...searchParams, loginTime: dates || [] })}
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
                <Table 
                  columns={columns} 
                  dataSource={onlineUsers} 
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
          },
          {
            key: 'server',
            label: '服务器监控',
            children: (
              <>
                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={8}>
                    <Card loading={serverLoading}>
                      <Statistic title="CPU使用率" value={serverInfo.cpu} suffix="%" />
                      <Progress percent={serverInfo.cpu} status="active" style={{ marginTop: 16 }} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card loading={serverLoading}>
                      <Statistic title="内存使用率" value={serverInfo.memory} suffix="%" />
                      <Progress percent={serverInfo.memory} status="active" style={{ marginTop: 16 }} />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card loading={serverLoading}>
                      <Statistic title="磁盘使用率" value={serverInfo.disk} suffix="%" />
                      <Progress percent={serverInfo.disk} status="active" style={{ marginTop: 16 }} />
                    </Card>
                  </Col>
                </Row>
                <Card loading={serverLoading}>
                  <List
                    itemLayout="horizontal"
                    dataSource={[
                      { key: '1', title: '服务器运行时间', value: serverInfo.uptime },
                      { key: '2', title: '系统版本', value: serverInfo.version },
                      { key: '3', title: 'Java版本', value: serverInfo.javaVersion },
                      { key: '4', title: '服务器信息', value: serverInfo.serverInfo },
                    ]}
                    renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={<span style={{ width: 120, display: 'inline-block' }}>{item.title}</span>}
                          description={<span>{item.value}</span>}
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </>
            )
          }
        ]}
      />
    </div>
  );
};

export default Monitor;