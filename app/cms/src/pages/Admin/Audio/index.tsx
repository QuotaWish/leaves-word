import CreateModal from '@/pages/Admin/Audio/components/CreateModal';
import UpdateModal from '@/pages/Admin/Audio/components/UpdateModal';
import { deleteAudioFileUsingPost, listAudioFileByPageUsingPost, synthesizeUsingPost, uploadAudioFileUsingPost } from '@/services/backend/audioFileController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message, Space, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import PreviewModal from './components/PreviewModal';
import AudioVoiceSelect from '@/components/Audio/AudioVoiceSelect';

/**
 * 音频管理页面
 *
 * @constructor
 */
const AudioAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前音频点击的数据
  const [currentRow, setCurrentRow] = useState<API.AudioFile>();

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.AudioFile) => {
    const hide = message.loading('正在归档');
    if (!row) return true;
    try {
      await deleteAudioFileUsingPost({
        id: row.id as any,
      });
      hide();
      message.success('归档成功');
      actionRef?.current?.reload();
      return true;
    } catch (error: any) {
      hide();
      message.error('归档失败，' + error.message);
      return false;
    }
  };

  /**
 * 启动合成
 * @param fields
 */
  const handleStartSynthesize = async (fields: API.AudioFile) => {
    const hide = message.loading('正在启动合成');
    try {
      await synthesizeUsingPost(fields);
      hide();
      message.success('启动成功');

      // refresh
      actionRef?.current?.reload();

      return true;
    } catch (error: any) {
      hide();
      message.error('启动失败，' + error.message);
      return false;
    }
  };

  /**
 * 上传音频
 * @param fields
 */
  const handleUpload = async (fields: API.AudioFile) => {
    const hide = message.loading('正在上传音频');
    try {
      await uploadAudioFileUsingPost(fields);
      hide();
      message.success('上传成功');

      // refresh
      actionRef?.current?.reload();

      return true;
    } catch (error: any) {
      hide();
      message.error('上传失败，' + error.message);
      return false;
    }
  };

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.AudioFile>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        rules: [{ required: true, message: '请输入名称' }],
      },
    },
    {
      title: '路径',
      dataIndex: 'path',
      valueType: 'text',
      hideInForm: true,
      render: (_, record) => {
        if ( !record.path ) return '-'

        return (
          <>
            <Typography.Link
              onClick={() => {
                window.open(record.path, '_blank');
              }}
            >
              访问
            </Typography.Link>
            &nbsp;
            <Typography.Link
              type='success'
              onClick={() => {
                navigator.clipboard.writeText(record.path || '');
                message.success('复制成功');
              }}
            >
              复制
            </Typography.Link>
          </>
        )
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      valueEnum: {
        UNKNOWN: {
          text: '未知',
        },
        UPLOADING: {
          text: '上传中',
        },
        UPLOADED: {
          text: '已上传',
        },
        PROCESSING: {
          text: '处理中',
        },
        PROCESSED: {
          text: '已处理',
        },
        FAILED: {
          text: '失败',
        },
        DELETED: {
          text: '已删除',
        },
        SYNTHESIZING: {
          text: '合成中',
        },
        IN_QUEUE: {
          text: '队列中',
        },
      },
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'create_time',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'update_time',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '音色',
      dataIndex: 'voice',
      valueType: 'select',
      formItemProps: {
        rules: [{ required: true, message: '请输入音色' }],
      },
      hideInTable: true,
      renderFormItem: () => {
        return <AudioVoiceSelect />
      },
    },
    {
      title: '内容',
      dataIndex: 'content',
      valueType: 'textarea',
      formItemProps: {
        rules: [{ required: true, message: '请输入内容' }],
      },
      render: (_, record) => {
        return <PreviewModal
          data={record}
          key={record.id}
        />
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <Space size="middle">
          {/* <Typography.Link
            onClick={() => {
              setCurrentRow(record);
              setUpdateModalVisible(true);
            }}
          >
            修改
          </Typography.Link> */}
          
          {record.status === 'IN_QUEUE' && (
            <Typography.Link
              onClick={() => handleStartSynthesize(record)}
            >
              开始合成
            </Typography.Link>
          )}

          {record.status === 'PROCESSED' && (
            <Typography.Link
              onClick={() => handleUpload(record)}
            >
              上传音频
            </Typography.Link>
          )}

          <Typography.Link type="danger" onClick={() => handleDelete(record)}>
            归档
          </Typography.Link>
        </Space>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.AudioFile>
        headerTitle={'查询表格'}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
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

          const { data, code } = await listAudioFileByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.AudioFileQueryRequest);

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
        columns={columns}
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
        columns={columns}
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
    </PageContainer>
  );
};
export default AudioAdminPage;
