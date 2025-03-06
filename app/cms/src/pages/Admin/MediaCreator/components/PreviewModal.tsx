import { addMediaCreatorUsingPost } from '@/services/backend/mediaCreatorController';
import { CheckCircleOutlined, MoreOutlined } from '@ant-design/icons';
import { ThoughtChain, ThoughtChainItem } from '@ant-design/x';
import '@umijs/max';
import { Button, Descriptions, Modal, Typography, Image } from 'antd';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';

interface Props {
  data?: API.MediaCreator;
}

const { Paragraph } = Typography;


type WorkFlowProps = {
  data: Array<any>
}

export const WorkFlowCard = ({ data }: WorkFlowProps) => {

  const items = useMemo(() => {
    console.log("data", data)

    return data.map(item => {
      const { event, message } = item
      const isDone = message.nodeIsFinish
      const cntent = message.content

      return {
        status: !isDone ? 'pending' : 'success',
        title: `${message.nodeTitle} #${message.nodeSeqID}`,
        description: `${event}`,
        icon: <CheckCircleOutlined />,
        extra: <Button type="text" icon={<MoreOutlined />} />,
        // footer: <Button block>Thought Chain Item Footer</Button>,
        content: (
          <Typography>
            <Paragraph>
              {cntent}
            </Paragraph>
            {/* <Paragraph>
              After massive project practice and summaries, Ant Design, a design language for background
              applications, is refined by Ant UED Team, which aims to{' '}
              <Text strong>
                uniform the user interface specs for internal background projects, lower the unnecessary
                cost of design differences and implementation and liberate the resources of design and
                front-end development
              </Text>
            </Paragraph> */}
          </Typography>
        ),
      };
    }) as ThoughtChainItem[]
  }, [data])


  return <ThoughtChain items={items} collapsible />
}

// type MediaCreatorComponentProp = {
//   emitter?: Promise<API.SseEmitter>
// }

// export const MediaCreatorComponent = ({ emitter }: MediaCreatorComponentProp) => {
//   const [data, setData] = useState<any>([]);

//   const handleEmitter = async() => {
//     const res = await emitter

//     console.log(res)
//   }

//   useEffect(() => {
//     if (emitter) 
//       handleEmitter()
//   }, [emitter])

//   return (
//     <div>

//       <WorkFlowCard data={data} />
//     </div>
//   )
// }

/**
 * 预览弹窗
 * @param props
 * @constructor
 */
const PreviewModal: React.FC<Props> = (props) => {
  const { data } = props;
  const [objData, setObjData] = useState<any>({})
  // 是否显示预览
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!data?.info) return

    const content = data.info
    const obj = JSON.parse(content)

    setObjData(obj);

  }, [data])

  // 试听组件
  const Previewer = useMemo(() => {
    const result = objData['workflow']
    if (!result) {
      return <>-</>
    }

    const endNode = [...result].find(item => item.message?.nodeTitle === "End")
    if (!endNode) {
      return <>等待生成完成...</>
    }

    const { content } = endNode.message
    if (!content) {
      return <>媒体数据生成失败</>
    }

    try {
      const obj = JSON.parse(content)

      const { output } = obj
      if (!output) {
        return <>{JSON.stringify(obj, null, 2)}</>
      }

      if (data?.media_type === 'IMAGE') {
        return (
          <>
            <Image width={200} src={output}></Image>
          </>
        )
      }

      return (
        <audio
          controls
          src={`data:audio/mp3;base64,${result}`}
        >
          Your browser does not support the audio element.
        </audio>
      )
    } catch (e) {
      return <>媒体数据生成失败 {JSON.stringify(e, null, 2)}</>
    }
  }, [objData])

  return (
    <>
      <div style={{ display: 'flex', flex: '1', gap: '0.5rem', alignItems: 'center' }}>
        <Button onClick={() => setVisible(true)}>
          预览
        </Button>
      </div>

      <Modal
        destroyOnClose
        title={'媒体创作详情'}
        open={visible}
        footer={null}
        onCancel={() => setVisible(false)}
        className="preview-modal"
        width="80%"
        style={{ maxWidth: '90vw' }}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="ID">{data?.id}</Descriptions.Item>
          <Descriptions.Item label="名称">{data?.media_type}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{data?.created_at}</Descriptions.Item>
          <Descriptions.Item label="创建者ID">{data?.creator_id}</Descriptions.Item>
          <Descriptions.Item label="日志ID">{objData['log_id']}</Descriptions.Item>
          <Descriptions.Item label="状态">{objData['status']}</Descriptions.Item>
          <Descriptions.Item label="预览" span={2}>
            {Previewer}
          </Descriptions.Item>
        </Descriptions>
        <h3 className='my-4 font-medium'>思维链</h3>
        <WorkFlowCard data={objData['workflow']} />
      </Modal>
    </>
  );
};

export default PreviewModal;