import React, { useState } from 'react';
import { Button, Modal, Input, Form, message } from 'antd';
import Segmented from 'antd/es/segmented'; // 添加 Segmented 组件的导入
import { emptyExample, WordExample, WordExampleTypeEnum } from './types/WordExample';
import WordPronounceEditor from './WordPronounceEditor';

interface WordExampleEditorProps {
  value?: WordExample;
  onChange?: (example: WordExample) => void;
  readonly?: boolean; // 添加 readonly 属性
}

const WordExampleEditor: React.FC<WordExampleEditorProps> = ({ value, onChange, readonly }) => {
  const [example, setExample] = useState(value ?? emptyExample());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        onChange?.(values as WordExample);
        setIsModalVisible(false);
      })
      .catch((errorInfo) => {
        console.log('Validation Failed:', errorInfo);
      });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Button size="small" type="dashed" onClick={showModal}>
        配置示例
      </Button>
      <Modal
        title="配置示例"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            关闭
          </Button>,
          !readonly && (
            <Button key="submit" type="primary" onClick={handleSave}>
              保存
            </Button>
          ),
        ]}
      >
        <Form form={form} initialValues={example} layout="vertical">
          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: !readonly, message: '请选择类型!' }]}
          >
            <Segmented
              options={[
                { label: '句子', value: WordExampleTypeEnum.SENTENCE },
                { label: '短语', value: WordExampleTypeEnum.PHRASE },
              ]}
              disabled={readonly}
            />
          </Form.Item>
          <Form.Item name="addon" label="附加信息">
            <Input type="text" placeholder="附加信息" disabled={readonly} />
          </Form.Item>
          <Form.Item
            name="highlight"
            label="高亮部分"
            rules={[{ required: !readonly, message: '请输入高亮部分!' }]}
          >
            <Input type="text" placeholder="高亮部分" disabled={readonly} />
          </Form.Item>
          <Form.Item
            name="sentence"
            label="句子"
            rules={[{ required: !readonly, message: '请输入句子!' }]}
          >
            <Input type="text" placeholder="句子" disabled={readonly} />
          </Form.Item>
          <Form.Item
            name="translation"
            label="翻译"
            rules={[{ required: !readonly, message: '请输入翻译!' }]}
          >
            <Input type="text" placeholder="翻译" disabled={readonly} />
          </Form.Item>
          <Form.Item
            name={['audio', 'content']}
            label="音频"
            rules={[{ required: !readonly, message: '请配置音频!' }]}
          >
            <WordPronounceEditor
              value={example.audio}
              onChange={(audio) => setExample({ ...example, audio })}
              readonly={readonly}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WordExampleEditor;
