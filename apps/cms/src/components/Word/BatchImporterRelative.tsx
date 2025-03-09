import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Segmented, Input, Upload, Alert, type UploadProps, Modal, Button, Spin } from 'antd';
import { ExclamationCircleFilled, InboxOutlined, IssuesCloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components';
import InfoComponent from './InfoComponent';
import { getEnglishWordBatchUsingPost } from '@/services/backend/englishWords';
import { addDictionaryWordBatchUsingPost } from '@/services/backend/dictionaryWord';

type SegementOptionsRenderProp = {
  onChange: (value: API.EnglishWord[]) => void
}

const TextImport = ({ onChange }: SegementOptionsRenderProp) => {
  let value = ''
  const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    value = e.target.value;
  };

  const handleChange = () => {
    const lines = value.split('\n');
    const words = lines.map((line) => {
      if (!line?.length || line.trim() === '') return null
      if (!line.includes(":")) return {
        word_head: line.trim(),
        info: ''
      }

      const [word_head, info] = line.split(':');
      return {
        word_head,
        info,
      };
    }).filter(item => item) as API.EnglishWord[]

    onChange(words);
  }

  return (
    <div className='flex flex-col gap-3'>
      <Alert
        message="⚠️ 注意"
        description="文本导入无法导入每个单词信息"
        type="warning"
        closable
      />
      <Input.TextArea
        rows={8}
        onChange={handleValueChange}
        placeholder="请一排输入一个单词"
      />
      <Button variant='solid' color='primary' onClick={handleChange}>关联</Button>
    </div>
  );
};

const FileImport = ({ onChange }: SegementOptionsRenderProp) => {

  const props: UploadProps = {
    accept: '.txt,.json',
    name: 'file',
    maxCount: 1,
    onDrop(e) {
      const [file] = e.dataTransfer.files

      if (!file) return

      // 读取文件
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string

        const wordList = text.split(/\r\n|\r|\n/).map(item => {
          if (!item?.length) return null

          try {
            const r = JSON.parse(item)

            return {
              word_head: r.headWord,
              info: JSON.stringify({
                originData: item
              })
            } as API.EnglishWord
          } catch (e) {
            console.error({
              status: "error",
              message: "格式错误",
              item
            })
            return null
          }

        }).filter(item => item) as API.EnglishWord[]

        onChange(wordList)
      }

      reader.readAsText(file)
    },
    beforeUpload() {
      return Upload.LIST_IGNORE
    }
  };

  return (
    <Upload>
      <Upload.Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">拖拽文件到这里分析</p>
        <p className="ant-upload-hint">
          支持 .json 和 .txt 格式的文件，请严格按照 StandardLeavesWord 格式来，否则会读取失败。
        </p>
      </Upload.Dragger>
    </Upload>
  );
};

// 定义 SegmentedOptions 类型
type SegmentedOptions<T extends string> = {
  label: string;
  value: T;
  render: React.FC<SegementOptionsRenderProp>;
}[];

const importOptions: SegmentedOptions<'text' | 'file'> = [
  { label: '文本', value: 'text' as 'text', render: TextImport },
  { label: '文件', value: 'file' as 'file', render: FileImport },
];

export const BatchImportDisplayer: React.FC<{ data: API.EnglishWord[], onSubmit: () => void, onDelete: (index: number) => void }> = ({ data, onSubmit, onDelete }) => {

  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false)
  const [infoData, setInfoData] = useState('')

  const columns: ProColumns<API.EnglishWord>[] = [
    {
      title: '单词',
      dataIndex: 'word_head',
      key: 'word_head',
    },
    {
      title: '信息',
      dataIndex: 'info',
      key: 'info',
      render(_, data) {
        return data.info?.length + "长度"
      }
    },
    {
      title: '操作',
      key: 'action',
      hideInSearch: true,
      width: '100',
      render: (text: any, record: API.EnglishWord) => (
        <div className='flex flex-center gap-2'>
          <Button variant='filled' color='pink' onClick={() => { setModalVisible(true); setInfoData(record.info!); }}>
            预览
          </Button>
          <Button variant='filled' color='danger' onClick={() => {
            // 从 data 中删除 record
            const index = data.findIndex((item) => item.word_head?.includes(record.word_head || ''));

            if (index !== -1) {
              onDelete(index)

              actionRef?.current?.reload();
            }
          }}>
            删除
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    actionRef?.current?.reload();
  }, [data])

  const startImport = useCallback(() => {
    console.log(data)

    Modal.confirm({
      title: '确认关联',
      icon: <ExclamationCircleFilled />,
      content: `是否确认关联 ${data.length} 个单词到数据库.`,
      onOk() {
        return onSubmit()
      },
      onCancel() { },
    });

  }, [data, onSubmit])

  return (
    <>
      <ProTable<API.EnglishWord>
        actionRef={actionRef}
        columns={columns}
        toolbar={{
          title: '单词导入列表',
          tooltip: '这里会展示解析出来的所有单词',
        }}
        // dataSource={data}
        rowKey="word_head"
        search={{
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
            <Button
              key="out"
              variant='solid'
              color='volcano'
              onClick={startImport}
            >
              一键关联
            </Button>,
          ],
        }}
        request={async (params) => {
          const { word_head, info } = params

          // 对 data 做搜索
          const result = data.filter(item => {
            if (word_head && item.word_head?.includes(word_head)) {
              return true;
            }
            if (info && item.info?.includes(info)) {
              return true;
            }

            return !word_head && !info;
          })//.slice((current! - 1) * pageSize!, current! * pageSize!)

          return Promise.resolve({
            data: result,
            success: true
          })
        }}
        pagination={{
          pageSize: 10,
          showQuickJumper: true,
        }}
      />
      <Modal
        width="800"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
      >
        <InfoComponent data={infoData} />
      </Modal>
    </>
  );
}

type BatchImporterProps = {
  dictionaryId: number
  onDone: () => void
}

const BatchImporter = ({ dictionaryId, onDone }: BatchImporterProps) => {
  const [spinning, setSpinning] = React.useState(false);
  const [percent, setPercent] = React.useState<number | string>(0);

  const [modalVisible, setModalVisible] = useState(false)
  const [importType, setImportType] = useState<'text' | 'file'>('text');
  const [importedData, setImportedData] = useState<API.EnglishWord[]>([]);

  const handleImportTypeChange = (value: 'text' | 'file') => {
    setImportType(value);
  };

  const handleChange = useCallback((data: API.EnglishWord[]) => {
    if (data) {
      setModalVisible(true);
      setImportedData(data);
    }
  }, [])

  const targetComp = useMemo(() => {
    return importOptions.find(option => option.value === importType)?.render({
      onChange: handleChange
    })
  }, [importType])

  const handleSubmit = () => {

    const words = importedData.map(item => item.word_head!)

    setTimeout(async () => {
      const preRes = await getEnglishWordBatchUsingPost({
        words
      })

      if (preRes.code !== 0) {
        Modal.error({
          title: '获取单词失败',
          icon: <IssuesCloseOutlined />,
          content: "未知原因无法完成关联,请稍候重试!"
        })
        return
      }

      if (preRes.data?.length !== words.length) {
        Modal.error({
          title: '获取单词数据失败',
          icon: <IssuesCloseOutlined />,
          content: "部分单词不在单词列表，请先导入单词后重试。"
        })
        return
      }

      setPercent('auto')
      setSpinning(true);

      setModalVisible(false)

      const wordIdList = preRes.data || []

      const res = await addDictionaryWordBatchUsingPost({
        dictionary_id: dictionaryId,
        words: wordIdList
      })

      setPercent('')
      setSpinning(false);

      if (res.code === 0) {
        const [successAmo, repeatAmo, failedAmo] = res.data || [-1, -1, -1]

        Modal.info({
          title: '关联完毕',
          icon: <ExclamationCircleFilled />,
          content: `成功关联 ${successAmo} 个单词,有 ${repeatAmo} 个单词因为重复关联而被忽略, ${failedAmo} 个单词关联失败!`,
          onOk() {
            onDone?.()
          }
        });
      } else {
        Modal.error({
          title: '关联失败',
          icon: <IssuesCloseOutlined />,
          content: "未知原因无法完成关联,请稍候重试!"
        })
      }
    })

  }

  return (
    <div className='flex flex-center flex-col gap-2'>
      <Segmented
        options={importOptions}
        value={importType}
        onChange={handleImportTypeChange}
        block
      />
      {targetComp && targetComp}
      {/* <div className='flex justify-end'>
        <Button variant='solid' color='primary'>导入</Button>
      </div> */}
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width="80%"
      >
        <BatchImportDisplayer onSubmit={handleSubmit} onDelete={(index) => {
          setImportedData(importedData.filter((_, i) => i !== index))
        }} data={importedData} />
      </Modal>

      <Spin
        indicator={<LoadingOutlined spin />}
        spinning={spinning}
        size="large"
        fullscreen
      />
      <Alert
        message="⚠️ 注意"
        description="单词无论任何状态都可以关联词典，但是只有 已发布 的单词才会纳入词典训练，只有 已审核 的单词才会纳入词典单词列表。"
        type="error"
        closable
      />
    </div>
  );
};

export default BatchImporter;
