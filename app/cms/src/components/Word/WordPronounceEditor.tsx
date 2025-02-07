import React, { useCallback, useState } from 'react';
import { Button, Modal, Input, Form, message } from 'antd';
import { emptyWordPronounce, WordPronounce } from './types/WordPronounce';
import AudioSelect from '../Audio/AudioSelect';
import { SpeechType, useRemoteAudio } from '@/composables/common';

interface WordPronounceEditorProps {
  value?: WordPronounce;
  onChange?: (pronounce: WordPronounce) => void;
  readonly?: boolean;
}

export const WordPronounceEditorInner: React.FC<WordPronounceEditorProps> = ({
  value,
  onChange,
  readonly,
}) => {
  const [pronounce, setPronounce] = useState(value ?? emptyWordPronounce());
  const [form] = Form.useForm();

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        onChange?.(values as WordPronounce);
      })
      .catch((errorInfo) => {
        console.log('Validation Failed:', errorInfo);
      });
  };

  const { generate } = useRemoteAudio();

  const handleQuickImport = () => {
    const url = form.getFieldValue('import');
    const content = form.getFieldValue('content');
    if (!content) {
      message.error('请先输入发音内容');
    } else {
      if (url) {
        message.error('已有音频地址，请先删除');
        return;
      }

      // 内容不能包含中文
      if (/[\u4e00-\u9fa5]/.test(content)) {
        message.error('发音内容不能包含中文');
        return;
      }

      const result = generate(content, SpeechType.BRITISH);

      form.setFieldValue('audio', result);

      message.success('已自动导入音频地址');
    }
  };

  const handlePreview = () => {
    const url = form.getFieldValue('audio');
    if (!url) {
      message.error('请先输入发音地址');
      return;
    }

    const audio = new Audio(url);

    audio.play();
  };

  const handleValuesChange = (changedValues: any, allValues: any) => {
    setPronounce(allValues as WordPronounce);

    handleSave();
  };

  return (
    <Form
      onValuesChange={handleValuesChange}
      form={form}
      initialValues={pronounce}
      layout="vertical"
    >
      <Form.Item
        name="content"
        label="发音内容"
        rules={[{ required: !readonly, message: '请输入发音内容!' }]}
      >
        <Input type="text" placeholder="内容" disabled={readonly} />
      </Form.Item>
      <Form.Item
        name="audio"
        label="音频地址"
        rules={[{ required: !readonly, message: '请输入音频地址!' }]}
      >
        <Input type="text" placeholder="音频地址" allowClear disabled={readonly} />
      </Form.Item>
      <Form.Item>
        <div className="flex flex-center gap-2">
          <Button variant="dashed" onClick={handleQuickImport}>
            自动从内容导入
          </Button>
          <Button variant="filled" color="primary" onClick={handlePreview}>
            预览试听
          </Button>
        </div>
      </Form.Item>
      <Form.Item
        name="description"
        label="音频描述"
        rules={[{ max: 255, message: '音频描述不能超过255个字符!' }]}
      >
        <Input.TextArea rows={4} placeholder="音频描述" disabled={readonly} />
      </Form.Item>

      <Form.Item name="import" label="选择已有音频">
        <AudioSelect />
      </Form.Item>
    </Form>
  );
};

const WordPronounceEditor: React.FC<WordPronounceEditorProps> = ({ value, onChange, readonly }) => {
  const [pronounce, setPronounce] = useState(value ?? emptyWordPronounce());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const handleSave = () => {
    form
      .validateFields()
      .then((values) => {
        onChange?.(values as WordPronounce);
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

  const { generate } = useRemoteAudio();

  const handleQuickImport = () => {
    const url = form.getFieldValue('import');
    const content = form.getFieldValue('content');
    if (!content) {
      message.error('请先输入发音内容');
    } else {
      if (url) {
        message.error('已有音频地址，请先删除');
        return;
      }

      // 内容不能包含中文
      if (/[\u4e00-\u9fa5]/.test(content)) {
        message.error('发音内容不能包含中文');
        return;
      }

      const result = generate(content, SpeechType.BRITISH);

      form.setFieldValue('audio', result);

      message.success('已自动导入音频地址');
    }
  };

  const handlePreview = () => {
    const url = form.getFieldValue('audio');
    if (!url) {
      message.error('请先输入发音地址');
      return;
    }

    const audio = new Audio(url);

    audio.play();
  };

  const handleValuesChange = (changedValues: any, allValues: any) => {
    setPronounce(allValues as WordPronounce);
  };

  return (
    <div>
      <Button size="small" type="dashed" onClick={showModal}>
        {readonly ? '预览发音' : '配置发音'}
      </Button>
      <Modal
        title="配置发音"
        visible={isModalVisible}
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
        <Form
          onValuesChange={handleValuesChange}
          form={form}
          initialValues={pronounce}
          layout="vertical"
        >
          <Form.Item
            name="content"
            label="发音内容"
            rules={[{ required: !readonly, message: '请输入发音内容!' }]}
          >
            <Input type="text" placeholder="内容" disabled={readonly} />
          </Form.Item>
          <Form.Item
            name="audio"
            label="音频地址"
            rules={[{ required: !readonly, message: '请输入音频地址!' }]}
          >
            <Input type="text" placeholder="音频地址" allowClear disabled={readonly} />
          </Form.Item>
          <Form.Item>
            <div className="flex flex-center gap-2">
              {!readonly && (
                <Button variant="dashed" onClick={handleQuickImport}>
                  自动从内容导入
                </Button>
              )}
              <Button variant="filled" color="primary" onClick={handlePreview}>
                预览试听
              </Button>
            </div>
          </Form.Item>
          <Form.Item
            name="description"
            label="音频描述"
            rules={[{ max: 255, message: '音频描述不能超过255个字符!' }]}
          >
            <Input.TextArea rows={4} placeholder="音频描述" disabled={readonly} />
          </Form.Item>

          <Form.Item name="import" label="选择已有音频">
            <AudioSelect />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default WordPronounceEditor;
