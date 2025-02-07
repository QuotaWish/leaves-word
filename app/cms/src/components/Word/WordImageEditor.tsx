import React, { useCallback, useEffect, useState } from 'react';
import { EditableProTable } from '@ant-design/pro-components';
import type { ProColumns } from '@ant-design/pro-components';
import { Button, Image, message, Modal, Typography } from 'antd';
import { addMediaCreatorUsingPost } from '@/services/backend/mediaCreatorController';
import { parseSSEData } from '@/composables/stream-analyser';
import { MediaCreatorSelect } from '@/pages/Admin/MediaCreator/components/MediaCreatorSelect';

interface WordImageEditorProps {
  value: string[];
  readonly?: boolean;
  onChange?: (translations: string[]) => void;
}

type ImageType = {
  id: number;
  url: string;
}

const WordImageEditor: React.FC<WordImageEditorProps> = ({ value, readonly, onChange }) => {
  const [imageList, setImageList] = useState<ImageType[]>([]);
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    if (!value) return
    setImageList([...value].map((url, index) => ({ id: index, url })));
  }, [value])

  const columns: ProColumns<{ id: number; url: string }>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '图片',
      dataIndex: 'url',
      valueType: 'image',
      renderFormItem: () => <span>-</span>
    },
    {
      title: '图片URL地址',
      dataIndex: 'url',
      formItemProps: () => {
        return {
          rules:
            [{ required: true, message: '此项为必填项' }],
        };
      },
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
            const updatedImageList = imageList.filter((_, i) => i !== index);
            setImageList(updatedImageList);
            onChange(updatedImageList.map(item => item.url));
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  const handleSave = () => {
    onChange(imageList.map(item => item.url));
  };

  return (
    <div>
      <EditableProTable
        rowKey="id"
        columns={columns}
        value={imageList}
        onChange={setImageList}
        recordCreatorProps={readonly ? false : {
          newRecordType: 'dataSource',
          record: () => {
            return {
              id: imageList.length,
              url: '',
            }
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

type WordImageCreatorProp = {
  wordId: number
  onSubmit: (url: string[]) => void
}

const { Paragraph } = Typography;

export const WordImageCreator = ({ wordId, onSubmit }: WordImageCreatorProp) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState('')

  const handleCreate = useCallback(async () => {
    setLoading(true)
    const res = await addMediaCreatorUsingPost({
      wordId,
      mediaType: 'IMAGE'
    }) as string

    // 解析sse event data的数据
    const result = parseSSEData(res)

    const resultNode = result.find(item => item.data?.node_title === 'End')

    setLoading(false)

    try {
      const obj = JSON.parse(`${resultNode.data.content}`)

      setData(obj?.output || '')
    } catch (_e) {
      message.error('解析sse数据失败')
    }

  }, []);


  const [modalVisible, setModalVisible] = useState(false)
  const handleSelect = useCallback(async (url: string[]) => {
    console.log("select", url)

    onSubmit(url)

    setModalVisible(false)

    message.info("成功插入 " + url.length + " 张图片")
  }, [onSubmit])

  const handleInsert = useCallback(async () => {
    handleSelect([data])
  }, [data])

  return (
    <div>
      <p>为单词 <strong>#{wordId}</strong> 一键创作</p>
      <div className='flex flex-center gap-2'>
        <Button disabled={loading} onClick={() => setModalVisible(true)}>从媒体中心选择</Button>
        <Button loading={loading} onClick={handleCreate}>AI一键创作</Button>
        <Button disabled={loading || !data} onClick={handleInsert}>插入图片</Button>
      </div>

      <Paragraph className='my-2'>
        {data && (
          <Image
            width={200}
            src={data}
          />
        )}
      </Paragraph>

      <Modal
        title="从媒体中心选择"
        width='60%'
        open={modalVisible}
        destroyOnClose={true}
        footer={false}
        onCancel={() => setModalVisible(false)}
      >
        <MediaCreatorSelect
          lockType='IMAGE'
          lockWordId={wordId}
          onChange={(values) => {
            console.log(values)

            handleSelect(values.map(item =>item.media_url!))
          }}
        />
      </Modal>
    </div>
  )
}

export default WordImageEditor;