import CreateModal from '@/pages/Admin/Category/components/CreateModal';
import UpdateModal from '@/pages/Admin/Category/components/UpdateModal';
import {
  deleteCategoryUsingPost,
  listCategoryByPageUsingPost,
} from '@/services/backend/categoryController';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import '@umijs/max';
import { Button, message, Space, TreeSelect, Typography } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface CategoryTree extends API.Category {
  children?: CategoryTree[];
}

export type CategoryTreeSelectProps = {
  data: API.Category[];
  value?: string;
  onChange?: (value: string) => void;
};

function buildTree(categories: CategoryTree[]): CategoryTree[] {
  const map = new Map<number, CategoryTree>();
  const roots: CategoryTree[] = [];

  // 创建所有节点的映射并初始化children
  categories.forEach((item) => {
    map.set(item.id!, { ...item, children: [] });
  });

  // 构建父子关系
  categories.forEach((item) => {
    const node = map.get(item.id!)!;
    const parentId = item.parentId || 0;

    // if (item.id === +value) return;

    if (parentId === 0 || !map.has(parentId)) {
      roots.push(node);
    } else {
      map.get(parentId)!.children!.push(node);
    }
  });

  return roots;
}

/**
 * 分类选择下拉框
 */
export const CategoryTreeSelect = ({ data, value, onChange }: CategoryTreeSelectProps) => {
  const [selectValue, setSelectValue] = useState<string>();
  const treeData = useMemo(() => buildTree(data), [value, data]);

  useEffect(() => {
    setSelectValue(value);
  }, [value]);

  useEffect(() => {
    onChange?.(selectValue || '');
  }, [selectValue]);

  return (
    <TreeSelect
      showSearch
      style={{ width: '100%' }}
      value={selectValue}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择分类"
      allowClear
      treeDefaultExpandAll
      onChange={(value) => setSelectValue(value)}
      treeData={treeData}
      fieldNames={{
        label: 'name',
        value: 'id',
        children: 'children',
      }}
      // onPopupScroll={onPopupScroll}
    />
  );
};

export type MultiCategoryTreeSelectProps = {
  // data: API.Category[];
  /** default: 5 */
  maxCount?: number;
  value?: string[];
  onChange?: (value: string[]) => void;
};

export const MultiCategoryTreeSelect = ({
  value,
  maxCount,
  onChange,
}: MultiCategoryTreeSelectProps) => {
  const fetchData = useCallback(async () => {
    const { data, code } = await listCategoryByPageUsingPost({} as API.CategoryQueryRequest);

    if (code === 0) {
      return data?.records ?? [];
    } else {
      console.warn(`获取分类列表失败，${code}`);

      return [];
    }
  }, []);
  const [data, setData] = useState<API.Category[]>([]);

  useEffect(() => {
    fetchData().then((data) => {
      setData(data);
    });
  }, []);

  const treeData = useMemo(() => buildTree(data), [value, data]);

  return (
    <TreeSelect
      maxCount={maxCount ?? 5}
      multiple
      showSearch
      style={{ width: '100%' }}
      value={value}
      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
      placeholder="请选择分类"
      allowClear
      treeDefaultExpandAll
      onChange={onChange}
      treeData={treeData}
      fieldNames={{
        label: 'name',
        value: 'id',
        children: 'children',
      }}
      // onPopupScroll={onPopupScroll}
    />
  );
};

/**
 * 分类管理页面
 *
 * @constructor
 */
const CategoryAdminPage: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  // 当前分类点击的数据
  const [currentRow, setCurrentRow] = useState<API.Category>();
  const [data, setData] = useState<API.Category[]>([]);

  /**
   * 删除节点
   *
   * @param row
   */
  const handleDelete = async (row: API.Category) => {
    const hide = message.loading('正在归档');
    if (!row) return true;
    try {
      await deleteCategoryUsingPost({
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
   * 表格列配置
   */
  const columns: ProColumns<API.Category>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      valueType: 'text',
      hideInForm: true,
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        rules: [{ required: true, message: '请输入分类名称' }],
      },
    },
    {
      title: '根级分类',
      dataIndex: 'isRoot',
      valueType: 'switch',
    },
    {
      title: '分类排序',
      dataIndex: 'sortOrder',
      valueType: 'text',
      formItemProps: {
        rules: [{ required: true, message: '请输入分类排序' }],
      },
    },
    {
      title: '父级分类',
      dataIndex: 'parentId',
      valueType: 'select',
      renderFormItem() {
        return <CategoryTreeSelect data={data} />;
      },
    },
    {
      title: '分类介绍',
      dataIndex: 'description',
      valueType: 'textarea',
      formItemProps: {
        rules: [{ required: true, message: '请输入分类介绍' }],
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
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
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

          <Typography.Link type="danger" onClick={() => handleDelete(record)}>
            归档
          </Typography.Link>
        </Space>
      ),
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.Category>
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

          const { data, code } = await listCategoryByPageUsingPost({
            ...params,
            sortField,
            sortOrder,
            ...filter,
          } as API.CategoryQueryRequest);

          setData(data?.records || []);

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

export default CategoryAdminPage;
