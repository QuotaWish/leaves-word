import '@umijs/max';
import { Drawer, Tabs, type TabsProps } from 'antd';
import React from 'react';
import Word from './../../Word/index'
import BatchImporterRelative from '@/components/Word/BatchImporterRelative';

interface Props {
  visible: boolean;
  dictionary?: API.EnglishDictionary;
  onCancel: () => void;
}

/**
 * 创建弹窗
 * @param props
 * @constructor
 */
const RelativeModal: React.FC<Props> = (props) => {
  const { visible, dictionary, onCancel } = props;

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '单词列表',
      children: dictionary?.id && (<Word dictionaryId={dictionary.id} />),
    },
    {
      key: '2',
      label: '关联单词',
      children:
        dictionary?.id && (<BatchImporterRelative dictionaryId={dictionary!.id!} onDone={() => {

        }} />)
    },
  ];

  return (
    <Drawer
      destroyOnClose
      title={'单词管理 | ' + dictionary?.name}
      open={visible}
      footer={null}
      width='80%'
      onClose={() => {
        onCancel?.();
      }}
      onCancel={() => {
        onCancel?.();
      }}
    >
      <Tabs defaultActiveKey="1" items={items} />
    </Drawer>
  );
};
export default RelativeModal;
