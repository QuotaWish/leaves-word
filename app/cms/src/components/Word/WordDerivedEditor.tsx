import React, { useMemo, useState } from 'react';
import { EditableProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { WordDerived, DerivationTypeEnum } from './types';

interface WordDerivedEditorProps {
  readonly?: boolean;
  initialDerivedWords: WordDerived[];
  onSave: (derivedWords: WordDerived[]) => void;
}

const WordDerivedEditor: React.FC<WordDerivedEditorProps> = ({
  readonly,
  initialDerivedWords,
  onSave,
}) => {
  // 修改: WordTranslationEditor 改为 WordDerivedEditor, initialTranslations 改为 initialDerivedWords
  const [derivedWords, setDerivedWords] = useState(initialDerivedWords);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  // 获取 derivedWords 中已经使用过的 typeText
  const usedTypeTexts = useMemo(
    () => derivedWords.map((derivedWord) => derivedWord.type),
    [derivedWords],
  );

  // 获取剩下的 typeText list
  const remainingTypeTexts = useMemo(
    () => Object.keys(DerivationTypeEnum).filter((key) => !usedTypeTexts.includes(key)),
    [usedTypeTexts],
  );

  const columns: ProColumns<WordDerived>[] = [
    {
      title: '类型',
      dataIndex: 'type',
      valueType: 'select',
      fieldProps: {
        options: remainingTypeTexts.map((key) => ({
          label: DerivationTypeEnum[key as keyof typeof DerivationTypeEnum],
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

              const updatedDerivedWords = derivedWords.filter((_, i) => i !== index);

              setDerivedWords(updatedDerivedWords);

              onSave(updatedDerivedWords);
            }}
          >
            删除
          </a>,
        ],
    },
  ];

  const handleSave = () => {
    onSave(derivedWords);
  };

  const derivedWordList = useMemo(
    () => [...derivedWords].map((item, index) => ({ ...item, id: index })),
    [derivedWords],
  );

  return (
    <div>
      <EditableProTable<WordDerived>
        rowKey="id"
        columns={columns}
        value={derivedWordList}
        onChange={(value) => setDerivedWords([...value])}
        recordCreatorProps={
          readonly
            ? false
            : {
                newRecordType: 'dataSource',
                record: () => {
                  const targetType = remainingTypeTexts?.[0] || DerivationTypeEnum.ANTONYM;

                  return {
                    id: derivedWords.length,
                    type: DerivationTypeEnum[targetType as keyof typeof DerivationTypeEnum],
                    content: '',
                    data: new Map<string, string>(),
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

export default WordDerivedEditor;
