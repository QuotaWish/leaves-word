import React, { useMemo, useState } from 'react';
import { EditableProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { emptyWordPronounce } from './types/WordPronounce';
import { WordCodeType, WordTranslation, WordType } from './types/WordTranslation';
import { emptyExample, useFormatExample } from './types';
import WordExampleEditor from './WordExampleEditor';
import { Button } from 'antd';

interface WordTranslationEditorProps {
  readonly?: boolean;
  initialTranslations: WordTranslation[];
  onSave: (translations: WordTranslation[]) => void;
}

const WordTranslationEditor: React.FC<WordTranslationEditorProps> = ({
  readonly,
  initialTranslations,
  onSave,
}) => {
  const [translations, setTranslations] = useState(initialTranslations);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  // 获取 translations 中已经使用过的 typeText
  const usedTypeTexts = useMemo(
    () => translations.map((translation) => translation.typeText),
    [translations],
  );

  // 获取剩下的 typeText list
  const remainingTypeTexts = useMemo(
    () => Object.keys(WordType).filter((key) => !usedTypeTexts.includes(key)),
    [usedTypeTexts],
  );

  const columns: ProColumns<WordTranslation>[] = [
    {
      title: '类型',
      dataIndex: 'type',
      valueType: 'select',
      fieldProps: {
        options: remainingTypeTexts.map((key) => ({
          label: WordType[key as keyof typeof WordType],
          value: WordType[key as keyof typeof WordType],
        })),
      },
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '类型文本',
      width: '100px',
      dataIndex: 'typeText',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '音标',
      dataIndex: 'phonetic',
      width: '150px',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '翻译',
      dataIndex: 'translation',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '定义',
      dataIndex: 'definition',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '示例',
      dataIndex: 'example',
      renderFormItem: () => <WordExampleEditor />,
      render: (_, record) => <WordExampleEditor readonly value={record.example} />,
    },
    // {
    //   title: '音频',
    //   dataIndex: 'audio',
    //   valueType: 'text',
    //   render: () => <WordPronounceEditor readonly />,
    //   renderFormItem: () => <WordPronounceEditor />,
    // },
    {
      title: '频率',
      dataIndex: 'frequency',
      valueType: 'digit',
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

              const updatedTranslations = translations.filter((_, i) => i !== index);

              setTranslations(updatedTranslations);

              onSave(updatedTranslations);
            }}
          >
            删除
          </a>,
        ],
    },
  ];

  const handleSave = () => {
    onSave(translations);
  };

  const translationList = useMemo(
    () => [...translations].map((item, index) => ({ ...item, id: index })),
    [translations],
  );

  const { format } = useFormatExample()

  const formatConfig = () => {
    const formattedTranslations = translations.map((translation) => {
      if (!translation.type) {
        translation.type = (WordCodeType[translation.typeText as keyof typeof WordCodeType] || WordType.NOUN) as unknown as WordType
      }

      if (translation.example && !translation.example.audio?.content) {
        translation.example.audio.content = translation.example.sentence
      }

      const formattedExample = format(translation.example)

      if (formattedExample) {
        return {
          ...translation,
          example: formattedExample,
        }
      }

      return translation
    });

    setTranslations(formattedTranslations);
  }

  return (
    <div>
      <EditableProTable<WordTranslation>
        rowKey="id"
        columns={columns}
        value={translationList}
        onChange={(value) => setTranslations([...value])}
        recordCreatorProps={
          readonly
            ? false
            : {
              newRecordType: 'dataSource',
              record: () => {
                const targetType = remainingTypeTexts?.[0] || WordType.NOUN;

                return {
                  id: translations.length,
                  type: WordType[targetType as keyof typeof WordType],
                  typeText: `${targetType}`,
                  translation: '',
                  definition: '',
                  example: emptyExample(),
                  phonetic: '',
                  audio: emptyWordPronounce(),
                  frequency: 0,
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

export default WordTranslationEditor;
