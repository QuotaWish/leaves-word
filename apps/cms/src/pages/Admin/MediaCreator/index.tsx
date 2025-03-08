import CreateModal from '@/pages/Admin/MediaCreator/components/CreateModal';
import UpdateModal from '@/pages/Admin/MediaCreator/components/UpdateModal';
import { deleteMediaCreatorUsingPost, listMediaCreatorByPageUsingPost } from '@/services/backend/mediaCreatorController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message, Select, Space, Tag, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import PreviewModal from './components/PreviewModal';

/**
 * 媒体类型选择器
 */
export const MediaTypeSelect = () => {
  // using select

  const options = [
    {
      label: '实况图',
      value: 'LIVE',
    },
    {
      label: '静态视频',
      value: 'STATIC_VIDEO',
    },
    {
      label: '音频',
      value: 'AUDIO',
    },
    {
      label: '视频',
      value: 'VIDEO',
    },
    {
      label: '静态图片',
      value: 'IMAGE',
    }
  ]

  return (
    <>
      <Select options={options} />
    </>
  );

  // return (
  //   <>
  //     <Tag color="default">实况图</Tag>
  //     <Tag color="default">静态视频</Tag>
  //     <Tag color="default">音频</Tag>
  //     <Tag color="default">视频</Tag>
  //     <Tag color="default">静态图片</Tag>
  //   </>
  // );
};


/**
 * 媒体管理页面
 *
 * @constructor
 */
const MediaCreatorAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前音频点击的数据
  const [currentRow, setCurrentRow] = useState<API.MediaCreator>();

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.MediaCreator) => {
    const hide = message.loading('正在归档');
    if (!row) return true;
    try {
      await deleteMediaCreatorUsingPost({
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

  //   /**
  //  * 启动合成
  //  * @param fields
  //  */
  //   const handleStartSynthesize = async (fields: API.MediaCreatorFile) => {
  //     const hide = message.loading('正在启动合成');
  //     try {
  //       await synthesizeUsingPost(fields);
  //       hide();
  //       message.success('启动成功');

  //       // refresh
  //       actionRef?.current?.reload();

  //       return true;
  //     } catch (error: any) {
  //       hide();
  //       message.error('启动失败，' + error.message);
  //       return false;
  //     }
  //   };

  //   /**
  //  * 启动合成
  //  * @param fields
  //  */
  //   const handleUpload = async (fields: API.MediaCreatorFile) => {
  //     const hide = message.loading('正在上传音频');
  //     try {
  //       await uploadMediaCreatorFileUsingPost(fields);
  //       hide();
  //       message.success('上传成功');

  //       // refresh
  //       actionRef?.current?.reload();

  //       return true;
  //     } catch (error: any) {
  //       hide();
  //       message.error('上传失败，' + error.message);
  //       return false;
  //     }
  //   };

  /**
   * 表格列配置
   */
  const columns: ProColumns<API.MediaCreator>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '类型',
      dataIndex: 'media_type',
      valueType: 'select',
      formItemProps: {
        rules: [{ required: true, message: '请选择类型' }],
      },
      renderFormItem: () => {
        return <MediaTypeSelect />
      },
      render: (_, record) => {
        const value: any = record['media_type']
        if (!value) return <>ERROR</>

        if (value === 'LIVE') {
          return <Tag color="default">实况图</Tag>
        } else if (value === 'STATIC_VIDEO') {
          return <Tag color="default">静态视频</Tag>
        } else if (value === 'AUDIO') {
          return <Tag color="default">音频</Tag>
        } else if (value === 'VIDEO') {
          return <Tag color="default">视频</Tag>
        } else if (value === 'IMAGE') {
          return <Tag color="default">静态图片</Tag>
        }

        return <>UNKNOWN</>
      }
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
      title: '创建时间',
      sorter: true,
      dataIndex: 'created_at',
      valueType: 'dateTime',
      hideInSearch: true,
      hideInForm: true,
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

          {/* {record.status === 'IN_QUEUE' && (
            <Typography.Link
              onClick={() => handleStartSynthesize(record)}
            >
              开始合成
            </Typography.Link>
          )} */}

          {/* {record.status === 'PROCESSED' && (
            <Typography.Link
              onClick={() => handleUpload(record)}
            >
              上传音频
            </Typography.Link>
          )} */}

          <Typography.Link type="danger" onClick={() => handleDelete(record)}>
            归档
          </Typography.Link>
        </Space>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.MediaCreator>
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

          const { data, code } = await listMediaCreatorByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.MediaCreatorQueryRequest);

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
export default MediaCreatorAdminPage;
