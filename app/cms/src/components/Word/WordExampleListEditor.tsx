import React, { useMemo, useState } from 'react';
import { EditableProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import WordExampleEditor from './WordExampleEditor';
import { WordExample, WordExampleTypeEnum, emptyExample, useFormatExample } from './types/WordExample';
import { Button } from 'antd';

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

  const { format } = useFormatExample()

  const formatConfig = () => {
    const formattedExamples = exampleList.map((example) => {
      if (example.example.type !== WordExampleTypeEnum.PHRASE) {
        example.example.type = WordExampleTypeEnum.SENTENCE
      }

      const formattedExample = format(example.example)

      if (formattedExample) {
        return {
          ...example,
          example: formattedExample,
        }
      }

      return example
    });

    setExampleList([...formattedExamples]);
  }

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
      <div className='flex flex-col justify-center gap-2'>
        <p className='font-bold'>快速操作区域</p>
        <Button onClick={formatConfig} variant='outlined' color='gold' className='w-[120px]'>格式化配置</Button>
        <p>
          格式化配置将自动根据单词类型和翻译内容，选择合适的示例类型，自动根据单词类型和翻译内容，录入合适的音频。
          <strong>
            注意：格式化配置中，若原音频不为空，则不会重新生成音频。
          </strong>
        </p>
      </div>
    </div>
  );
};

export default WordExampleListEditor;
