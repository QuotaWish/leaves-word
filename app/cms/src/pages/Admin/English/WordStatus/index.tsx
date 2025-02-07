// import PreviewModal from './components/PreviewModal';
import {
  listStatusChangeByPageUsingPost,
} from '@/services/backend/wordStatusChangeController';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';

/**
 * 英语单词状态变更统计页面
 */
const WordStatusPage: React.FC = () => {
  const actionRef = useRef<ActionType>();
  // 当前选中的状态记录
  // const [currentRow, setCurrentRow] = useState<API.WordStatusChange>();
  // 预览弹窗显示状态
  // const [previewModalVisible, setPreviewModalVisible] = useState<boolean>(false);

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.WordStatusChange>[] = [
    {
      title: '单词',
      dataIndex: 'word_head',
      valueType: 'text',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'text',
    },
    {
      title: '变更理由',
      dataIndex: 'comment',
      valueType: 'text',
    },
    {
      title: '变更时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link
            onClick={() => {
              // setCurrentRow(record);
              // setPreviewModalVisible(true);
            }}
          >
            查看详情
          </Typography.Link>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.WordStatusChange>
        headerTitle={'单词状态变更记录'}
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;

          const { data, code } = await listStatusChangeByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          });

          return {
            success: code === 0,
            data: data?.records || [],
            total: Number(data?.total) || 0,
          };
        }}
        columns={columns}
      />
      {/* <PreviewModal
        visible={previewModalVisible}
        data={currentRow}
        onCancel={() => {
          setPreviewModalVisible(false);
          setCurrentRow(undefined);
        }}
      /> */}
    </PageContainer>
  );
};
export default WordStatusPage;
