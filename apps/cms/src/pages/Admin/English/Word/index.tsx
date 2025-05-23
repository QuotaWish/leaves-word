import WordContentEditor from '@/components/Word/WordContentEditor';
import CreateModal from '@/pages/Admin/English/Word/components/CreateModal';
import UpdateModal from '@/pages/Admin/English/Word/components/UpdateModal';
import { deleteEnglishWordUsingPost, listEnglishWordByPageUsingPost, listEnglishWordByPageUsingPost1, getDuplicateWordsUsingGet, publishWordUsingGet } from '@/services/backend/englishWords';
import { DownOutlined, ExclamationCircleOutlined, ImportOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, Dropdown, message, Modal, Popconfirm, Space, Spin, Typography, type MenuProps } from 'antd';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, CloudUploadOutlined, FileOutlined, LoadingOutlined, MinusCircleOutlined, QuestionCircleOutlined, SyncOutlined } from '@ant-design/icons';
import BatchImporter from '@/components/Word/BatchImporter';
import StatusHistoryModal from '../WordStatus/components/StatusHistoryModal';
import Styles from './style.css';
import DuplicateWordsModal from './components/DuplicateWordsModal';

enum RowActionType {
  DELETE = 'DELETE',
  RE_PROCESS_SUPPLY = 'RE_PROCESS_SUPPLY',
  PROCESS_SUPPLY = 'PROCESS_SUPPLY',
  CHANGE_HISTORY = 'CHANGE_HISTORY',
  RE_EDIT = 'RE_EDIT',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED',
}

type StatusActionsType = {
  [K in RowActionType]: (props: { record: API.EnglishWord }) => JSX.Element;
};

type EnglishWordPageProps = {
  dictionaryId?: number;
}

/**
 * 英语词典管理页面
 *
 * @constructor
 */
const EnglishWordPage: React.FC<EnglishWordPageProps> = ({ dictionaryId }) => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  // 是否显示批量导入窗口
  const [batchImportModalVisible, setBatchImportModalVisible] = useState<boolean>(false);
  // 是否显示状态变动记录弹窗
  const [statusHistoryModalVisible, setStatusHistoryModalVisible] = useState<boolean>(false);
  // 是否显示重复单词查询结果弹窗
  const [duplicateWordsModalVisible, setDuplicateWordsModalVisible] = useState<boolean>(false);
  // 重复单词数据
  const [duplicateWordsData, setDuplicateWordsData] = useState<API.DuplicateWordDto[]>([]);
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

  /**
   * 发布单词
   */
  const handleApproved = async (record: API.EnglishWord) => {
    const hide = message.loading('正在发布');
    if (!record) return true;

    try {
      await publishWordUsingGet({
        id: record.id as any,
      });

      hide();
      message.success('发布成功');
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('发布失败，' + error.message);
    }
  }

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
    RE_EDIT({ record }) {
      return <Typography.Link
        onClick={() => {
          setCurrentRow(record);
          setUpdateModalVisible(true);
        }}
      >
        重新编辑
      </Typography.Link>
    },
    RE_PROCESS_SUPPLY({ record }) {
      if (record.status === 'PROCESSED' || record.status === 'DRAFT') {
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
      }} title="重新扩充处理将会导致单词重新进入流程">
        <Typography.Link
          type="secondary"
        >
          重新扩充处理
        </Typography.Link>
      </Popconfirm>
    },
    CHANGE_HISTORY({ record }) {
      return <Typography.Link
        type='warning'
        onClick={() => {
          setCurrentRow(record);
          setStatusHistoryModalVisible(true);
        }}
      >
        状态变动记录
      </Typography.Link>
    },
    APPROVED({ record }) {
      return <Popconfirm onConfirm={() => handleApproved(record)} title="发布后单词将进入发布状态，无法再进行编辑">
        <Typography.Link
          type="success"
        >
          发布单词
        </Typography.Link>
      </Popconfirm>
    },
    PUBLISHED({ record }) {
      return <Popconfirm onConfirm={() => {
        message.loading('无法完成下架');
      }} title="下架后单词将不可再进入学习序列，已经完成的进度不会受到影响。">
        <Typography.Link
          type="warning"
        >
          下架单词
        </Typography.Link>
      </Popconfirm>
    }
  }

  const getDropdownItems = useCallback((record: API.EnglishWord): MenuProps['items'] => {
    return [
      {
        key: 'CHANGE_HISTORY',
        label: statusActions.CHANGE_HISTORY({ record }),
      },
      {
        type: 'divider',
      },
      {
        key: 'DELETE',
        label: statusActions.DELETE({ record }),
        danger: true,
      },
    ]
  }, []);

  const getActionItems = useCallback((record: API.EnglishWord) => {
    if (record.status === 'PUBLISHED')
      return (
        <>
          {statusActions.PUBLISHED({ record })}
        </>
      )

    if (record.status === 'APPROVED')
      return (
        <>
          {statusActions.APPROVED({ record })}
        </>
      )

    if (record.status === 'UNKNOWN' || record.status === 'CREATED') {
      return (
        <>
          {statusActions.PROCESS_SUPPLY({ record })}
        </>
      )
    }

    if (record.status === 'FAILED' || record.status === 'UPLOADED') {
      return (
        <>
          {statusActions.RE_EDIT({ record })}
        </>
      )
    }

    return (
      <>
        {statusActions.RE_PROCESS_SUPPLY({ record })}
      </>
    )
  }, [statusActions])

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
          text: <Tag icon={<CheckCircleOutlined />} color="magenta">已处理（等待人工评分审核）</Tag>,
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
          text: <Tag icon={<CheckCircleOutlined />} color="#229342">已发布</Tag>,
        },
        UNPUBLISHED: {
          text: <Tag icon={<CloseCircleOutlined />} color="red">未发布</Tag>,
        },
        DRAFT: {
          text: <Tag icon={<MinusCircleOutlined />} color="#222222">草稿</Tag>,
        },
        SUPPLYING: {
          text: <Tag icon={<SyncOutlined />} color="blue">扩充中</Tag>,
        },
        SUPPLIED: {
          text: <Tag icon={<CheckCircleOutlined />} color="#519375">扩充完成</Tag>,
        },
        STRUCTURE_FIXING: {
          text: <Tag icon={<SyncOutlined />} color="blue">结构化中</Tag>,
        },
        STRUCTURED: {
          text: <Tag icon={<CheckCircleOutlined />} color="#519375">结构化完成</Tag>,
        },
        WAIT_FOR_AI_REVIEW: {
          text: <Tag icon={<SyncOutlined />} color="#A5E5E5">等待AI评分审核</Tag>,
        },
        IMAGING: {
          text: <Tag icon={<SyncOutlined />} color="#A5E5E5">图片生成中</Tag>,
        }
      },
    },
    {
      title: '修改时间',
      dataIndex: 'update_time',
      valueType: 'dateTime',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      valueType: 'dateTime',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: '信息',
      dataIndex: 'info',
      hideInSearch: true,
      render: (value, data/* , _data, _row, _action */) => {
        if (data.status === 'PUBLISHED') return <Tag icon={<CheckCircleOutlined />} color="#229342">已发布</Tag>
        if (data.status === 'DRAFT') return <Tag icon={<MinusCircleOutlined />} color="#222222">暂时以草稿模式存储</Tag>
        if (data.status === 'PROCESSING') return <Tag icon={<SyncOutlined />} color="blue">等待处理完成</Tag>

        if (data.status === 'UNKNOWN') return <Tag icon={<ExclamationCircleOutlined />} color="#DD001BE0">导入后等待扩充处理</Tag>
        if (data.status === 'CREATED') return <Tag icon={<ExclamationCircleOutlined />} color="#DD001B80">新建后等待扩充处理</Tag>
        // if (data.status === 'WAIT_FOR_AI_REVIEW') return '-'
        if (data.status === 'UPLOADED') return <WordContentEditor rate data={data} value={value as any} />;
        if (data.status === 'APPROVED') return <WordContentEditor rate data={data} value={value as any} />;
        if (data.status === 'REJECTED') return <WordContentEditor rate data={data} value={value as any} />;
        if (data.status === 'PROCESSED') return <WordContentEditor rate data={data} value={value as any} />;

        return '-' // <WordContentEditor data={data} value={value as any} />;
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
        return (
          <Space size="middle">
            {getActionItems(record)}
            {record.status !== 'PUBLISHED' && <Dropdown menu={{ items: getDropdownItems(record) }}>
              <a onClick={(e) => e.preventDefault()}>
                <Space>
                  更多
                  <DownOutlined />
                </Space>
              </a>
            </Dropdown>}
          </Space>
        )
      },
    },
  ];

  const [spinning, setSpinning] = useState(false);

  const handleMeshing = useCallback(async () => {
    setSpinning(true);

    try {
      const { data, code } = await getDuplicateWordsUsingGet();

      if (code !== 0) {
        message.error('获取失败');
        return;
      }

      setDuplicateWordsData(data || []);
      setDuplicateWordsModalVisible(true);
    } catch (error) {
      message.error('获取失败，请稍后重试');
    } finally {
      setSpinning(false);
    }
  }, []);

  const renderInner = useMemo(() => {
    return <ProTable<API.EnglishWord>
      headerTitle={'查询表格'}
      actionRef={actionRef}
      rowKey="key"
      rowClassName={(record) => {
        if (record.status === 'FAILED' || record.status === 'REJECTED' || record.status === 'DATA_FORMAT_ERROR') {
          return Styles.errorRow;
        }
        if (record.status === 'PROCESSED') {
          return Styles.mentionRow;
        }
        return '';
      }}
      search={{
        labelWidth: 120,
      }}
      toolBarRender={() => [
        <>
          <Button
            variant="dashed"
            color="geekblue"
            key="primary"
            onClick={handleMeshing}
          >
            <PlusOutlined /> 筛查
          </Button >
          <Spin key="spin" spinning={spinning} fullscreen />
        </>,
        dictionaryId ? <></> : <Button
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

        if (dictionaryId) {
          const { data, code } = await listEnglishWordByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
            dict_id: dictionaryId,
          } as API.EnglishWordQueryDictRequest);

          console.log(data?.records)

          return {
            success: code === 0,
            data: data?.records?.map(item => item.word!) || [],
            total: Number(data?.total) || 0,
          };
        }

        const { data, code } = await listEnglishWordByPageUsingPost1({
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
  }, [dictionaryId, columns, actionRef, createModalVisible, updateModalVisible, currentRow, batchImportModalVisible, statusActions, handleDelete])

  const renderModal = useMemo(() => {
    return <>
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
      <StatusHistoryModal
        visible={statusHistoryModalVisible}
        onClose={() => {
          setStatusHistoryModalVisible(false);
        }}
        wordId={currentRow?.id}
      />
      <DuplicateWordsModal
        visible={duplicateWordsModalVisible}
        onCancel={() => {
          setDuplicateWordsModalVisible(false);
        }}
        data={duplicateWordsData}
        loading={spinning}
      />
    </>
  }, [
    createModalVisible,
    updateModalVisible,
    currentRow,
    batchImportModalVisible,
    statusHistoryModalVisible,
    duplicateWordsModalVisible,
    duplicateWordsData,
    spinning
  ]);

  if (dictionaryId) {
    return (
      <>
        {renderInner}
        {renderModal}
      </>
    )
  }

  return (
    <PageContainer>
      {renderInner}
      {renderModal}
    </PageContainer>
  );
};
export default EnglishWordPage;
