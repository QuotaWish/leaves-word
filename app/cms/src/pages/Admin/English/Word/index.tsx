import WordContentEditor from '@/components/Word/WordContentEditor';
import CreateModal from '@/pages/Admin/English/Word/components/CreateModal';
import UpdateModal from '@/pages/Admin/English/Word/components/UpdateModal';
import { deleteEnglishWordUsingPost, listEnglishWordByPageUsingPost } from '@/services/backend/englishWordController';
import { ExclamationCircleOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message, Modal, Popconfirm, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import { Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, CloudUploadOutlined, FileOutlined, LoadingOutlined, MinusCircleOutlined, QuestionCircleOutlined, SyncOutlined } from '@ant-design/icons';
import BatchImporter from '@/components/Word/BatchImporter';

enum RowActionType {
  DELETE = 'DELETE',
  RE_PROCESS_SUPPLY = 'RE_PROCESS_SUPPLY',
  PROCESS_SUPPLY = 'PROCESS_SUPPLY',
}

// 3. 定义 StatusActions 的类型
type StatusActionsType = {
  [K in RowActionType]: (props: { record: API.EnglishWord }) => JSX.Element;
};

/**
 * 英语词典管理页面
 *
 * @constructor
 */
const EnglishWordPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  // 是否显示批量导入窗口
  const [batchImportModalVisible, setBatchImportModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前用户点击的数据
  const [currentRow, setCurrentRow] = useState<API.EnglishWord>();

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.EnglishWord) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      await deleteEnglishWordUsingPost({
        id: row.id as any,
      });
      hide();
      message.success('删除成功');
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('删除失败，' + error.message);
      return false;
    }
  };

  const statusActions: StatusActionsType = {
    DELETE({ record }) {
      return <Popconfirm onConfirm={() => handleDelete(record)} title="删除后单词数据需要全部重新编辑，是否确认？">
        <Typography.Link type="danger"

        >
          永久删除
        </Typography.Link>
      </Popconfirm>
    },
    PROCESS_SUPPLY({ record }) {
      return <Typography.Link
        onClick={() => {
          setCurrentRow(record);
          setUpdateModalVisible(true);
        }}
      >
        扩充处理
      </Typography.Link>
    },
    RE_PROCESS_SUPPLY({ record }) {
      if (record.status === 'PROCESSED') {
        return <Typography.Link
          onClick={() => {
            setCurrentRow(record);
            setUpdateModalVisible(true);
          }}
        >
          继续编辑
        </Typography.Link>
      }

      // if (record.status === 'UPLOADED') {
      //   return <Typography.Link
      //     onClick={() => {
      //       setCurrentRow(record);
      //       setUpdateModalVisible(true);
      //     }}
      //   >
      //     人工审核
      //   </Typography.Link>
      // }

      return <Popconfirm onConfirm={() => {
        setCurrentRow(record);
        setUpdateModalVisible(true);
      }} title="重新扩充处理将会导致状态重新变为 已处理">
        <Typography.Link

        >
          重新扩充处理
        </Typography.Link>
      </Popconfirm>
    }
  }

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.EnglishWord>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '单词',
      dataIndex: 'word_head',
      valueType: 'text',
      formItemProps: {
        rules: [{ required: true, message: '请输入单词' }],
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        UNKNOWN: {
          text: <Tag icon={<QuestionCircleOutlined />} color="default">未知</Tag>,
        },
        CREATED: {
          text: <Tag icon={<MinusCircleOutlined />} color="default">已创建</Tag>,
        },
        UPLOADING: {
          text: <Tag icon={<LoadingOutlined />} color="blue">上传中</Tag>,
        },
        UPLOADED: {
          text: <Tag icon={<CloudUploadOutlined />} color="warning">AI已上传处理</Tag>,
        },
        IMPORTING: {
          text: <Tag icon={<SyncOutlined />} color="blue">导入中</Tag>,
        },
        EXPORTING: {
          text: <Tag icon={<SyncOutlined />} color="blue">导出中</Tag>,
        },
        EXPORTED: {
          text: <Tag icon={<FileOutlined />} color="green">已导出</Tag>,
        },
        PROCESSING: {
          text: <Tag icon={<SyncOutlined />} color="blue">处理中</Tag>,
        },
        PROCESSED: {
          text: <Tag icon={<CheckCircleOutlined />} color="magenta">已处理</Tag>,
        },
        REVIEWING: {
          text: <Tag icon={<SyncOutlined />} color="blue">审核中</Tag>,
        },
        APPROVED: {
          text: <Tag icon={<CheckCircleOutlined />} color="green">已审核通过</Tag>,
        },
        REJECTED: {
          text: <Tag icon={<CloseCircleOutlined />} color="red">被驳回</Tag>,
        },
        FAILED: {
          text: <Tag icon={<CloseCircleOutlined />} color="red">失败</Tag>,
        },
        DATA_FORMAT_ERROR: {
          text: <Tag icon={<ExclamationCircleOutlined />} color="red">数据格式校验不通过</Tag>,
        },
        DELETED: {
          text: <Tag icon={<MinusCircleOutlined />} color="default">已删除</Tag>,
        },
        IN_QUEUE: {
          text: <Tag icon={<ClockCircleOutlined />} color="default">队列中</Tag>,
        },
        PUBLISHED: {
          text: <Tag icon={<CheckCircleOutlined />} color="green">已发布</Tag>,
        },
        UNPUBLISHED: {
          text: <Tag icon={<CloseCircleOutlined />} color="red">未发布</Tag>,
        },
      },
    },
    {
      title: '信息',
      dataIndex: 'info',
      hideInSearch: true,
      render: (value, data/* , _data, _row, _action */) => {
         if (data.status === 'PROCESSING') return <Tag icon={<SyncOutlined />} color="blue">等待处理完成</Tag>

        if (data.status === 'UNKNOWN') return <Tag icon={<ExclamationCircleOutlined />} color="#DD001BE0">导入后等待扩充处理</Tag>
        if (data.status === 'CREATED') return <Tag icon={<ExclamationCircleOutlined />} color="#DD001B80">新建后等待扩充处理</Tag>
        if (data.status === 'PROCESSED') return <Tag icon={<ExclamationCircleOutlined />} color="#E1BB88">等待AI评分审核</Tag>
        if (data.status === 'UPLOADED') return <WordContentEditor rate data={data} value={value as any} />;

        return <WordContentEditor data={data} value={value as any} />;
      },
      // renderFormItem: () => {
      //   return <WordContentEditor editable />;
      // },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {

        if (record.status === 'UNKNOWN' || record.status === 'CREATED') {
          return (
            <Space size="middle">
              {statusActions.PROCESS_SUPPLY({ record })}
              {statusActions.DELETE({ record })}
            </Space>
          )
        }

        return (
          <Space size="middle">
            {statusActions.RE_PROCESS_SUPPLY({ record })}
            {statusActions.DELETE({ record })}
          </Space>
        )
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.EnglishWord>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            variant="dashed"
            color="geekblue"
            key="primary"
            onClick={() => {
              setBatchImportModalVisible(true);
            }}
          >
            <ImportOutlined /> 批量导入
          </Button>,
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={async (params, sort, filter) => {
          const sortField = Object.keys(sort)?.[0];
          const sortOrder = sort?.[sortField] ?? undefined;

          const { data, code } = await listEnglishWordByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.EnglishWordQueryRequest);

          return {
            success: code === 0,
            data: data?.records || [],
            total: Number(data?.total) || 0,
          };
        }}
        columns={columns}
      />
      <CreateModal
        visible={createModalVisible}
        columns={columns.filter(column => column.dataIndex !== 'update_time' && column.dataIndex !== 'create_time')}
        onSubmit={() => {
          setCreateModalVisible(false);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setCreateModalVisible(false);
        }}
      />
      <UpdateModal
        visible={updateModalVisible}
        columns={columns.filter(column => column.dataIndex !== 'update_time' && column.dataIndex !== 'create_time')}
        oldData={currentRow}
        onSubmit={() => {
          setUpdateModalVisible(false);
          setCurrentRow(undefined);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setUpdateModalVisible(false);
        }}
      />
      <Modal
        title="批量导入"
        open={batchImportModalVisible}
        footer={null}
        onCancel={() => {
          setBatchImportModalVisible(false);
        }}
      >
        <BatchImporter onDone={() => {
          setBatchImportModalVisible(false);

          actionRef.current?.reload();
        }} />
      </Modal>
    </PageContainer>
  );
};
export default EnglishWordPage;
