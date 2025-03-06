import WordContentEditor from '@/components/Word/WordContentEditor';
import '@umijs/max';
import { Button, Checkbox, Drawer, Form, Input, message, Typography, type FormProps } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

const { Title, Paragraph, Text, Link } = Typography;

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
  const [draft, setDraft] = useState(true);
  // const [info, setInfo] = useState("")

  const onFinish = useCallback((values: FormProps<Request>['onFinish']) => {
    const newValues = { ...values, draft }
    console.log('Success:', draft, newValues);
    handleSubmit(newValues, props);
  }, [draft]);

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
        <Form.Item<Request>
          label="草稿模式"
          name="draft"
        >
          <Checkbox checked={draft} onChange={(e) => setDraft(e.target.checked)}>是否保存为草稿</Checkbox>
          <Typography>
            <Paragraph>
              使用草稿模式有助于你快速保存数据的同时节省服务器资源。
              <Text strong>
                当且仅当你非常确定已经完成编辑需要提交评审时再取消草稿模式！
              </Text>
              放心，草稿模式提交的数据你可以随时查看，随时继续编辑，它们不会丢失。
            </Paragraph>
          </Typography>
        </Form.Item>
        <Form.Item label={null}>
          <Button htmlType='submit' variant='dashed' >
            提交
          </Button>
          {/* <div className='flex items-center gap-2'>
            <Button onClick={handleSaveDraft} type="primary" >
              保存为草稿（推荐）
            </Button>

          </div> */}
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
