import WordContentEditor from '@/components/Word/WordContentEditor';
import '@umijs/max';
import { Button, Drawer, Form, Input, message, type FormProps } from 'antd';
import React, { useEffect, useState } from 'react';

type Request = API.EnglishWordAddRequest | API.EnglishWordUpdateRequest;

interface Props {
  visible: boolean;
  oldData?: API.EnglishWord;
  onSubmit: (values: Request) => Promise<boolean>;
  onCancel: () => void;
}

/**
 * 添加节点
 * @param fields
 */
const handleSubmit = async (fields: Request, props: Props) => {
  console.log({ fields });
  const hide = message.loading('正在提交');
  try {
    await props.onSubmit(fields);
    hide();
    message.success('提交成功');
    return true;
  } catch (error: any) {
    hide();
    message.error('提交失败，' + error.message);
    return false;
  }
};

/**
 * 提交弹窗
 * @param props
 * @constructor
 */
const InnerModal: React.FC<Props> = (props) => {
  const { visible, oldData, onCancel } = props;

  const [word, setWord] = useState('');
  // const [info, setInfo] = useState("")

  const onFinish: FormProps<Request>['onFinish'] = (values) => {
    console.log('Success:', values);
    handleSubmit(values, props);
  };

  const onFinishFailed: FormProps<Request>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    setWord(oldData?.word_head || '');
  }, []);

  return (
    <Drawer // 修改: 将 Modal 替换为 Drawer
      destroyOnClose
      title={oldData ? '编辑提交' : '新增提交'}
      placement="right" // 添加: 设置 Drawer 从右侧弹出
      width="85%" // 修改: 设置 Drawer 宽度为屏幕的 85%
      onClose={() => {
        onCancel?.();
      }}
      open={visible}
    >
      <Form
        name="word"
        initialValues={oldData}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<Request>
          label="单词"
          name="word_head"
          rules={[{ required: true, message: '请输入单词' }]}
        >
          <Input value={word} onChange={(e) => setWord(e.target.value)}></Input>
        </Form.Item>

        {oldData?.id && (
          <Form.Item<Request>
            label="信息"
            name="info"
            rules={[{ required: true, message: '请输入信息' }]}
          >
            <WordContentEditor editable data={oldData} />
          </Form.Item>
        )}
        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>

      {/* 

      <Button htmlType='submit' onClick={async () => {
        const success = await handleAdd({
          word
        });
        if (success) {
          onSubmit?.(values);
        }
      }} type="primary">提交</Button> */}
      {/* <ProTable
        type="form"
        onSubmit={(request: Request) => handleSubmit(request, props)}
      >

      </ProTable> */}
    </Drawer>
  );
};
export default InnerModal;
