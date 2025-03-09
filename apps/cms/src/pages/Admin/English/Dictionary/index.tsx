import CreateModal from '@/pages/Admin/English/Dictionary/components/CreateModal';
import UpdateModal from '@/pages/Admin/English/Dictionary/components/UpdateModal';
import {
  deleteEnglishDictionaryUsingPost,
  listEnglishDictionaryByPageUsingPost,
} from '@/services/backend/englishDictionaryController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message, Space, Tooltip, Typography } from 'antd';
import React, { useRef, useState } from 'react';
import CategoryModal from './components/CategoryModal';
import RelativeModal from './components/RelativeModal';

/**
 * 英语词典管理页面
 *
 * @constructor
 */
const UserAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  // 是否显示分类管理窗口
  const [categoryModalVisible, setCategoryModalVisible] = useState<boolean>(false);
  // 是否显示单词管理窗口
  const [relativeModalVisible, setRelativeModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前用户点击的数据
  const [currentRow, setCurrentRow] = useState<API.EnglishDictionary>();

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.EnglishDictionary) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    try {
      // 假设有一个 deleteUserUsingPost 方法对应 EnglishDictionary
      await deleteEnglishDictionaryUsingPost({
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
   * 表格列配置
   */
  const columns: ProColumns<API.EnglishDictionary>[] = [
    {
      title: '词典图片',
      dataIndex: 'image_url',
      valueType: 'image',
      fieldProps: {
        width: 96,
      },
      formItemProps: {
        rules: [{ required: true, message: '请输入图片URL' }],
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
      fieldProps: {
        width: 168,
      },
      formItemProps: {
        rules: [{ required: true, message: '请输入名称' }],
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'textarea',
      formItemProps: {
        rules: [{ required: true, message: '请输入描述' }],
      },
    },
    {
      title: '已关联单词数量',
      dataIndex: 'total_words',
      hideInForm: true,
    },
    {
      title: '已发布单词数量',
      dataIndex: 'published_words',
      hideInForm: true,
    },
    {
      title: '已通过单词数量',
      dataIndex: 'approved_words',
      hideInForm: true,
    },
    {
      title: '作者',
      dataIndex: 'author',
      valueType: 'text',
      formItemProps: {
        rules: [{ required: false, message: '请输入作者' }],
      },
    },
    {
      title: '出版社',
      dataIndex: 'publisher',
      valueType: 'text',
      formItemProps: {
        rules: [{ required: false, message: '请输入出版社' }],
      },
    },
    {
      title: 'ISBN',
      dataIndex: 'isbn',
      valueType: 'text',
      formItemProps: {
        rules: [{ required: false, message: '请输入ISBN' }],
      },
    },
    {
      title: '出版日期',
      dataIndex: 'publication_date',
      valueType: 'date',
      formItemProps: {
        rules: [{ required: false, message: '请输入出版日期' }],
      },
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'option',
      valueType: 'option',
      fieldProps: {
        width: 168,
      },
      render: (_, record) => (
        <Space size="middle">
          <Typography.Link
            onClick={() => {
              setCurrentRow(record);
              setUpdateModalVisible(true);
            }}
          >
            修改
          </Typography.Link>
          <Typography.Link
            onClick={() => {
              setCurrentRow(record);
              setRelativeModalVisible(true);
            }}
          >
            单词管理
          </Typography.Link>
          <Typography.Link
            onClick={() => {
              setCurrentRow(record);
              setCategoryModalVisible(true);
            }}
          >
            分类管理
          </Typography.Link>
          {/* <Typography.Link type="danger" onClick={() => handleDelete(record)}>
            删除
          </Typography.Link> */}
        </Space>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.EnglishDictionary>
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

          const { data, code } = await listEnglishDictionaryByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.EnglishDictionaryQueryRequest);

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
      <CategoryModal
        visible={categoryModalVisible}
        dictionary={currentRow}
        onSubmit={() => {
          setCategoryModalVisible(false);
          setCurrentRow(undefined);
          actionRef.current?.reload();
        }}
        onCancel={() => {
          setCategoryModalVisible(false);
        }}
      />
      <RelativeModal
        visible={relativeModalVisible}
        dictionary={currentRow!}
        onCancel={() => {
          setRelativeModalVisible(false);
        }}
      />
    </PageContainer>
  );
};
export default UserAdminPage;
