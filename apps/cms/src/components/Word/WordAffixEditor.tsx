import React, { useMemo, useState } from 'react';
import { EditableProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { WordAffixPart, WordAffixType, WordAffixTypeDescription } from './types/WordAffixPart';

interface WordAffixEditorProps {
  readonly?: boolean;
  initialAffixParts: WordAffixPart[];
  onSave: (affixParts: WordAffixPart[]) => void;
}

const WordAffixEditor: React.FC<WordAffixEditorProps> = ({
  readonly,
  initialAffixParts,
  onSave,
}) => {
  const [affixParts, setAffixParts] = useState(initialAffixParts);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const columns: ProColumns<WordAffixPart>[] = [
    {
      title: '类型',
      dataIndex: 'type',
      valueType: 'select',
      fieldProps: {
        options: Object.keys(WordAffixType).map((key) => ({
          label: WordAffixType[key as keyof typeof WordAffixType],
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
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
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
              console.log({ text, record, index, action });
              action?.startEditable?.(record.id!);
            }}
          >
            编辑
          </a>,
          <a
            key="delete"
            onClick={() => {
              // delete editable
              setEditableRowKeys(editableKeys.filter((key) => key !== index));

              const updatedAffixParts = affixParts.filter((_, i) => i !== index);

              setAffixParts(updatedAffixParts);

              onSave(updatedAffixParts);
            }}
          >
            删除
          </a>,
        ],
    },
  ];

  const affixPartList = useMemo(
    () => [...affixParts].map((item, index) => ({ ...item, id: index })),
    [affixParts],
  );

  const handleSave = () => {
    onSave(affixParts);
  };

  return (
    <div>
      <EditableProTable<WordAffixPart>
        rowKey="type"
        columns={columns}
        value={affixPartList}
        onChange={(value) => setAffixParts([...value])}
        recordCreatorProps={
          readonly
            ? false
            : {
                newRecordType: 'dataSource',
                record: () => {
                  return {
                    type: WordAffixType.NONE,
                    content: '',
                    data: {},
                    description: WordAffixTypeDescription[WordAffixType.NONE],
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

export default WordAffixEditor;
