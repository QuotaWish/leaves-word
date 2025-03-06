import '@umijs/max';
import { Button, Descriptions, Modal, Typography } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Base64 } from 'js-base64';

interface Props {
  data?: API.AudioFile;
}

/**
 * 更新弹窗
 * @param props
 * @constructor
 */
const PreviewModal: React.FC<Props> = (props) => {
  const { data } = props;
  const [objData, setObjData] = useState<any>({})
  // 是否显示预览
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    if (!data?.content) return

    const content = Base64.decode(data.content as string)
    const obj = JSON.parse(content)

    setObjData(obj);

  }, [data])

  // 试听组件
  const AudioPlayer = useMemo(() => {
    const result = objData['audio']
    if (!result) {
      return <>暂无音频</>
    }

    return (
      <audio
        controls
        src={`data:audio/mp3;base64,${result}`}
      >
        Your browser does not support the audio element.
      </audio>
    )
  }, [objData])

  const handlePlayAudio = useCallback(() => {
    const audio = new Audio(`data:audio/mp3;base64,${objData['audio']}`);
    audio.play();
  }, [objData])

  if (!data) {
    return <>无法预览，遇到未知错误。</>;
  }

  return (
    <>
      <div style={{ display: 'flex', flex: '1', gap: '0.5rem', alignItems: 'center' }}>
        <Button onClick={() => setVisible(true)}>
          预览
        </Button>
        {(data.status === 'PROCESSED' || data.status === 'UPLOADED') && (
          <Typography.Link type="secondary" onClick={handlePlayAudio}>
            快速试听
          </Typography.Link>
        )}
      </div>

      <Modal
        destroyOnClose
        title={'音频文件详情'}
        open={visible}
        footer={null}
        onCancel={() => setVisible(false)}
        className="preview-modal"
        width="80%"
        style={{ maxWidth: '90vw' }}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="名称">{data?.name}</Descriptions.Item>
          <Descriptions.Item label="状态">{data?.status}</Descriptions.Item>
          <Descriptions.Item label="路径">{data?.path}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{data?.create_time}</Descriptions.Item>
          <Descriptions.Item label="创建者ID">{data?.creator_id}</Descriptions.Item>
          <Descriptions.Item label="更新时间">{data?.update_time}</Descriptions.Item>
          <Descriptions.Item label="内容">{objData['value']}</Descriptions.Item>
          <Descriptions.Item label="语音">{objData['voice']}</Descriptions.Item>
          <Descriptions.Item label="音频" span={2}>
            {AudioPlayer}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    </>
  );
};
export default PreviewModal;