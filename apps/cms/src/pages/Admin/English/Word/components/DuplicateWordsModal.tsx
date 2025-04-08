import type React from 'react';
import { Modal, Table, Typography, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

interface DuplicateWordsModalProps {
  visible: boolean;
  onCancel: () => void;
  data: API.DuplicateWordDto[];
  loading: boolean;
}

/**
 * 重复单词查询结果展示组件
 */
const DuplicateWordsModal: React.FC<DuplicateWordsModalProps> = ({
  visible,
  onCancel,
  data,
  loading,
}) => {
  const columns = [
    {
      title: '单词',
      dataIndex: 'wordHead',
      key: 'wordHead',
    },
    {
      title: '重复次数',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: API.DuplicateWordDto, b: API.DuplicateWordDto) => (a.count || 0) - (b.count || 0),
      render: (count: number) => (
        <Typography.Text
          type={count > 2 ? 'danger' : 'warning'}
          strong={count > 2}
        >
          {count}
        </Typography.Text>
      ),
    },
  ];

  return (
    <Modal
      title="重复单词查询结果"
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="close" onClick={onCancel}>
          关闭
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <Typography.Paragraph>
          <InfoCircleOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          以下是系统中检测到的重复单词，建议进行处理以避免数据冗余。
        </Typography.Paragraph>
      </div>
      <Table
        dataSource={data}
        columns={columns}
        rowKey="wordHead"
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          defaultPageSize: 20,
        }}
      />
    </Modal>
  );
};

export default DuplicateWordsModal;
