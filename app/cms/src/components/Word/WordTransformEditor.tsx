import React, { useMemo, useState } from 'react';
import { EditableProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { WordTransform, TransformType } from './types/WordTransform';
import WordExampleEditor from './WordExampleEditor';

interface WordTransformEditorProps {
  readonly?: boolean;
  initialTransforms: WordTransform[];
  onSave: (transforms: WordTransform[]) => void;
}

const WordTransformEditor: React.FC<WordTransformEditorProps> = ({
  readonly,
  initialTransforms,
  onSave,
}) => {
  const [transforms, setTransforms] = useState(initialTransforms);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const columns: ProColumns<WordTransform>[] = [
    {
      title: '类型',
      dataIndex: 'type',
      valueType: 'select',
      fieldProps: {
        options: Object.keys(TransformType).map((key) => ({
          label: TransformType[key as keyof typeof TransformType],
          value: key,
        })),
      },
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '内容',
      dataIndex: 'content',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      // formItemProps: () => {
      //   return {
      //     rules: [{ required: true, message: '此项为必填项' }],
      //   };
      // },
    },
    {
      title: '示例',
      dataIndex: 'example',
      valueType: 'text',
      render: () => <WordExampleEditor readonly />,
      renderFormItem: () => <WordExampleEditor />,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      valueType: 'option',
      fixed: 'right',
      render: (text, record, index, action) =>
        !readonly && [
          <a
            key="edit"
            onClick={() => {
              // 编辑操作逻辑
              action?.startEditable?.(index);
            }}
          >
            编辑
          </a>,
          <a
            key="delete"
            onClick={() => {
              // delete editable
              setEditableRowKeys(editableKeys.filter((key) => key !== index));

              const updatedTransforms = transforms.filter((_, i) => i !== index);

              setTransforms(updatedTransforms);

              onSave(updatedTransforms);
            }}
          >
            删除
          </a>,
        ],
    },
  ];

  const transformList = useMemo(
    () => [...transforms].map((item, index) => ({ ...item, id: index })),
    [transforms],
  );

  const handleSave = () => {
    onSave(transforms);
  };

  return (
    <div>
      <EditableProTable<WordTransform>
        rowKey="id"
        columns={columns}
        value={transformList}
        onChange={(value) => setTransforms([...value])}
        recordCreatorProps={
          readonly
            ? false
            : {
              newRecordType: 'dataSource',
              record: () => {
                return {
                  id: Date.now(), // 假设使用当前时间戳作为唯一标识
                  type: TransformType.NONE,
                  content: '',
                  data: {},
                  example: {
                    // 假设 example 是一个对象，需要根据实际情况定义
                    id: 0,
                    content: '',
                  },
                };
              },
            }
        }
        toolBarRender={false}
        pagination={false}
        editable={{
          type: 'single',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);

            handleSave();
          },
          onChange: setEditableRowKeys,
        }}
      />
    </div>
  );
};

export default WordTransformEditor;
