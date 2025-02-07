import React, { useMemo, useState } from 'react';
import { EditableProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import WordExampleEditor from './WordExampleEditor';
import { WordExample, emptyExample } from './types/WordExample';

interface WordExampleListEditorProps {
  value?: WordExample[];
  readonly?: boolean;
  onChange: (examples: WordExample[]) => void;
}

const WordExampleListEditor: React.FC<WordExampleListEditorProps> = ({ value, readonly, onChange }) => {
  const [exampleList, setExampleList] = useState([...(value || [])].map((example, index) => ({ id: index, example })));
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const handleSave = () => {
    onChange(exampleList.map((example) => example.example));
  };

  const columns: ProColumns<{ id: number, example: WordExample }>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '示例配置',
      dataIndex: 'example',
      valueType: 'group',
      renderFormItem: () => <WordExampleEditor />,
      render: () => <WordExampleEditor readonly />,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      valueType: 'option',
      fixed: 'right',
      render: (text, record, index, action) => !readonly && [
        <a
          key="edit"
          onClick={() => {
            action?.startEditable?.(index);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setEditableRowKeys(editableKeys.filter((key) => key !== index));
            const updatedExampleList = exampleList.filter((_, i) => i !== index);
            setExampleList(updatedExampleList);

            handleSave();
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <div>
      <EditableProTable<{ id: number, example: WordExample }>
        rowKey="id"
        columns={columns}
        value={exampleList}
        onChange={(value) => setExampleList([...value])}
        recordCreatorProps={readonly ? false : {
          newRecordType: 'dataSource',
          record: () => {
            return {
              id: exampleList.length,
              example: emptyExample(),
            };
          },
        }}
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

export default WordExampleListEditor;