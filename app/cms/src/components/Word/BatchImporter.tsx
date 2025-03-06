import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Segmented, Input, Upload, Alert, type UploadProps, Modal, Button, Spin } from 'antd';
import { ExclamationCircleFilled, InboxOutlined, IssuesCloseOutlined, LoadingOutlined } from '@ant-design/icons';
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components';
import InfoComponent from './InfoComponent';
import { addEnglishWordBatchUsingPost } from '@/services/backend/englishWords';

type SegementOptionsRenderProp = {
  onChange: (value: API.EnglishWord[]) => void
}

const TextImport = ({ onChange }: SegementOptionsRenderProp) => {
  const handleChange = (value: string) => {
    const lines = value.split('\n');
    const words = lines.map((line) => {
      const [word_head, info] = line.split(':');
      return {
        word_head,
        info,
      };
    });

    onChange(words as API.EnglishWord[]);
  }

  return (
    <>
      <Alert
        message="⚠️ 注意"
        description="文本导入无法导入每个单词信息"
        type="warning"
        closable
      />
      <Input.TextArea
        rows={8}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="请一排输入一个单词"
      />
    </>
  );
};

const FileImport = ({ onChange }: SegementOptionsRenderProp) => {

  const props: UploadProps = {
    accept: '.txt,.json',
    name: 'file',
    maxCount: 1,
    // // action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    // onChange(info) {
    //   const { status } = info.file;
    //   if (status !== 'uploading') {
    //     console.log(info.file, info.fileList);
    //   }
    //   if (status === 'done') {
    //     message.success(`${info.file.name} file uploaded successfully.`);
    //   } else if (status === 'error') {
    //     message.error(`${info.file.name} file upload failed.`);
    //   }
    // },
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

  const startImport = () => {
    Modal.confirm({
      title: '确认上传',
      icon: <ExclamationCircleFilled />,
      content: `是否确认上传 ${data.length} 个单词到数据库.`,
      onOk() {
        return onSubmit()
      },
      onCancel() { },
    });

  };

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
              一键上传
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
  onDone: () => void
}

const BatchImporter = ({ onDone }: BatchImporterProps) => {
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
    setModalVisible(false)

    setTimeout(async () => {
      const res = await addEnglishWordBatchUsingPost({
        words: importedData
      })

      setPercent('')
      setSpinning(false);

      if (res.code === 0) {
        const [successAmo, repeatAmo, failedAmo] = res.data || [-1, -1, -1]

        Modal.info({
          title: '上传完毕',
          icon: <ExclamationCircleFilled />,
          content: `成功上传 ${successAmo} 个单词,有 ${repeatAmo} 个单词因为重复上传而被忽略, ${failedAmo} 个单词上传失败!`,
          onOk() {
            onDone?.()
          }
        });
      } else {
        Modal.error({
          title: '上传失败',
          icon: <IssuesCloseOutlined />,
          content: "未知原因无法完成上传,请稍候重试!"
        })
      }
    })

    setPercent('auto')
    setSpinning(true);
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

      <Spin indicator={<LoadingOutlined spin />} spinning={spinning} size="large" percent={percent} fullscreen />
    </div>
  );
};

export default BatchImporter;
