import {
  Form,
  Input,
  Button,
  Drawer,
  message,
  Checkbox,
  Tabs,
  Modal,
  Spin,
  Alert,
  Progress,
  Descriptions,
  Badge,
  type DescriptionsProps,
  Typography,
  Popconfirm,
  InputNumber,
  Tooltip,
} from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';

import InfoComponent from './InfoComponent';
import WordPronounceEditor from './WordPronounceEditor';
import WordTranslationEditor from './WordTranslationEditor';
import { emptyWordContent, parseWordContent } from './types/WordContent';
import {
  isValidPronounce,
  isValidTranslationList,
  isValidWordAffixPartList,
  isValidWordDerivedList,
  isValidWordTransformList,
  WordExampleTypeEnum,
} from './types';
import WordDerivedEditor from './WordDerivedEditor';
import WordImageEditor, { WordImageCreator } from './WordImageEditor';
import WordAffixEditor from './WordAffixEditor';
import WordTransformEditor from './WordTransformEditor';
import WordExampleListEditor from './WordExampleListEditor';
import { AIButton } from '../common/AIButton';
import { useLeavesWordAI } from '@/composables/aigc';
import { ChatEventType } from '@coze/api';
import { ExclamationCircleFilled, InfoCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { getScoreEnglishWordUsingGet, scoreEnglishWordUsingPost } from '@/services/backend/englishWords';

export type Prop = {
  data: API.EnglishWord;
  value?: string | null;
  editable?: boolean;
  rate?: boolean; // 评分模式 会自动获取单词评分数据
  onChange?: (wordContent: string) => void;
};

enum ParseStatus {
  UNKNOWN = -1,
  NORMAL = 0,
  ERROR = 1,
  SYNCHORNISED = 2,
}

const RateScoreView = ({ score, maxScore }: { score: number; maxScore: number }) => {
  const [status, setStatue] = useState<'success' | 'normal' | 'exception' | 'active' | undefined>();
  const [percent, setPercent] = useState<number>(0);

  useEffect(() => {
    const passScore = maxScore * 0.6;
    const validatedScore = maxScore * 0.85;

    if (score < passScore) {
      setStatue('exception');
    } else if (score < validatedScore) {
      setStatue('normal');
    } else {
      setStatue('success');
    }

    // 把分数映射到0-100
    const rate = score / maxScore;
    const mappedRate = rate * 100;

    setPercent(Math.max(mappedRate, maxScore));
  }, [score, maxScore]);

  return (
    <Progress
      type="circle"
      format={() => `${percent.toFixed(1)}%`}
      status={status}
      percent={percent}
      size={80}
    />
  );
};

const WordContentEditor: React.FC<Prop> = ({ data, value, rate, editable, onChange }) => {
  const [form] = Form.useForm();
  const [currentContent, setCurrentContent] = useState(emptyWordContent());
  const [isDrawerVisible, setDrawerVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAdvancedFeaturesEnabled, setAdvancedFeaturesEnabled] = useState(false);
  const [infoData, setInfoData] = useState('');
  const [supplymentData, setSupplymentData] = useState('');
  const [parseStatus, setParseStatus] = useState<ParseStatus>(ParseStatus.NORMAL);
  const [tipMsg, setTipMsg] = useState('');
  const [seconds, setSeconds] = useState(-1);

  const [aiSupplying, setAISupplying] = useState(false);
  const [validateInfo, setValidateInfo] = useState('');
  const [scoreInfo, setScoreInfo] = useState<number>(60);

  const autoGetScore = useCallback(async () => {
    setAISupplying(true)
    const res = await getScoreEnglishWordUsingGet({
      id: data.id!,
    })
    setAISupplying(false)

    if (res.code !== 0) {
      message.error(`获取评分失败：${res.message}`)
      return
    }

    const infoData = res.data

    try {
      const json = JSON.parse(infoData?.info || '{}')

      setValidateInfo(json['info'])
    } catch (e) {
      console.error(e)
      message.error('获取评分失败：评分数据格式错误')
    }

  }, [data, scoreInfo, setSupplymentData, setScoreInfo])

  // 获取AI评分数据
  useEffect(() => {
    if (rate && isDrawerVisible) {
      autoGetScore()
    }
  }, [rate, isDrawerVisible])

  function tryParseInfo(info: string) {
    const [parsedInfo, parseStatus, msg] = parseWordContent(info);

    if (parsedInfo) {
      setInfoData(JSON.stringify(parsedInfo, null, 2));
      setCurrentContent(parsedInfo);
      setParseStatus(ParseStatus.SYNCHORNISED);

      onChange?.(JSON.stringify(parsedInfo, null, 2));

      form.setFieldsValue(currentContent);

      return;
    }

    setTipMsg('');
    if (parsedInfo && !parseStatus) {
      setTipMsg(msg!);
      setParseStatus(ParseStatus.ERROR);

      console.warn('解析失败，请检查输入格式！');
    } else {
      console.warn(parsedInfo);

      setParseStatus(ParseStatus.UNKNOWN);
    }
  }

  useEffect(() => {
    setInfoData(value || '');
  }, [value, isDrawerVisible]);

  const validateForms = useCallback(() => {
    return new Promise<[boolean, any, string | null]>((resolve) => {
      form.validateFields().then((values) => {
        if (!isValidPronounce(values.britishPronounce)) {
          resolve([false, values, '英式发音未通过检验']);
          return;
        }

        if (!isValidPronounce(values.americanPronounce)) {
          resolve([false, values, '美式发音未通过检验']);
          return;
        }

        if (!values.img.length) {
          resolve([false, values, '图片列表未通过检验']);
          return;
        }

        if (isValidTranslationList(values.translation)) {
          resolve([false, values, '翻译列表未通过检验']);
          return;
        }

        if (!values.examplePhrases.length) {
          resolve([false, values, '短语列表未通过检验：列表为空！']);
          return;
        }

        console.log('currentContent.examplePhrases', values.examplePhrases)

        for (let i = 0; i < values.examplePhrases.length; i++) {
          const example = values.examplePhrases[i];
          if (example.type !== WordExampleTypeEnum.PHRASE) {
            resolve([false, values, `短语列表未通过检验：第${i + 1}个短语类型错误！`]);
            return;
          }
          if (!example.translation) {
            resolve([false, values, `短语列表未通过检验：第${i + 1}个短语缺少翻译！`]);
            return;
          }
        }

        if (!isValidWordDerivedList(values.derived)) {
          resolve([false, values, '单词网络列表未通过检验！']);
          return;
        }

        if (!isValidWordTransformList(values.transform)) {
          resolve([false, values, '词形变化列表未通过检验！']);
          return;
        }

        if (!isValidWordAffixPartList(values.parts)) {
          resolve([false, values, '单词组成列表未通过检验！']);
          return;
        }

        resolve([true, values, null]);
      });
    })
  }, [form])

  const handleSave = async () => {
    message.loading('正在检验配置...');
    const [success, values, errMsg] = await validateForms()

    function save() {
      message.success('检验通过！');
      setCurrentContent(values);
      setInfoData(JSON.stringify(currentContent, null, 2));
      setDrawerVisible(false);

      onChange?.(JSON.stringify(currentContent));
    }

    if (!success) {
      Modal.confirm({
        title: '检验失败',
        content: errMsg + ', 是否强行保存？',
        onOk: save,
      })
    } else {
      save()
    }
  };

  const handleInfoChange = (newInfo: string) => {
    setInfoData(newInfo);
  };

  useEffect(() => {
    tryParseInfo(infoData || '');
  }, [infoData]);

  const { callWordSupplymentAI } = useLeavesWordAI();

  const handleAISupply = useCallback(async () => {
    if (aiSupplying) return;

    if (!data.word_head) {
      message.error('当前单词数据未知，无法进行AI扩充。');
      return;
    }

    setAISupplying(true);

    const wordSupplymentAI = await callWordSupplymentAI(data.word_head, infoData);

    setModalVisible(true);

    let content = '';

    for await (const part of wordSupplymentAI) {
      if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
        content += part.data?.content ?? '';
      } else if (part.event === 'conversation.message.completed') {
        if (part.data.type !== 'answer') continue;
        const value = part.data.content ?? '';

        if (!value) {
          Modal.confirm({
            title: 'AI补全出现内容错误',
            icon: <ExclamationCircleFilled />,
            content: '是否强行填充内容？这可能会引发未知风险。您也可以选择取消后重新生成。',
            okText: '强行填充',
            okType: 'danger',
            cancelText: '取消本次生成',
            onOk() {
              return;
            },
            onCancel() {
              setAISupplying(false);
            },
          });

          return;
        }

        setInfoData(value);
      } else if (part.event === 'done') {
        message.info('补全已完成');

        setSeconds(15);
      }

      setSupplymentData(content);
    }

    setAISupplying(false);
  }, [infoData]);

  const handleScore = async () => {
    if (scoreInfo < 60) {
      message.error('人工评分不得低于60分！');
      return;
    }

    message.loading('正在检验配置...');
    const [success, _values, errMsg] = await validateForms()

    async function save() {
      message.success('检验通过！');
      message.loading('正在提交分数...');

      const res = await scoreEnglishWordUsingPost({
        score: scoreInfo,
        id: data.id,
      });

      if (res.code !== 0) {
        message.error(`提交分数失败：${res.message}`);
        return;
      }

      message.success('提交分数成功！');

      setDrawerVisible(false);
    }

    if (!success) {
      Modal.confirm({
        title: '检验失败',
        content: errMsg + ', 是否强行保存？',
        onOk: save,
      })
    } else {
      save()
    }

  };

  const renderValidateReview = useMemo(() => {
    try {
      const { code, msg, score, summary, data } = JSON.parse(validateInfo);

      // 转换结构 把data转换统一格式
      const details = data['单词细节'] || data['wordDetails'];
      const innovation = data['单词创新'] || data['wordInnovation'];
      const structure = data['单词结构'] || data['wordStructure'];

      const items: DescriptionsProps['items'] = [
        {
          key: '1',
          label: '总体评分',
          children: (
            <>
              {score >= 60 ? (
                <Progress
                  percent={score}
                  success={{ percent: 60, strokeColor: '#FFD35C' }}
                  type="dashboard"
                  format={() => `${score}分`}
                />
              ) : (
                <Progress
                  format={() => `${score}分`}
                  status="exception"
                  percent={60}
                  success={{ percent: score, strokeColor: '#9DC0CE' }}
                  type="dashboard"
                />
              )}
            </>
          ),
          span: 1,
        },
        {
          key: '2',
          label: '评价总结',
          children: summary,
          span: 4,
        },
        {
          key: '3',
          span: 4,
          label: '单词细节',
          children: (
            <div className="flex items-center gap-4">
              <RateScoreView maxScore={40} score={details.score}></RateScoreView>
              <div>
                <Typography.Paragraph>{`${details.summary}`}</Typography.Paragraph>

                <Typography.Paragraph>
                  <Typography.Text strong>{`${details.enhanced}`}</Typography.Text>
                </Typography.Paragraph>
              </div>
            </div>
          ),
        },
        {
          key: '4',
          span: 4,
          label: '单词创新',
          children: (
            <div className="flex items-center gap-4">
              <RateScoreView maxScore={30} score={innovation.score}></RateScoreView>
              <div>
                <Typography.Paragraph>{`${innovation.summary}`}</Typography.Paragraph>

                <Typography.Paragraph>
                  <Typography.Text strong>{`${innovation.enhanced}`}</Typography.Text>
                </Typography.Paragraph>
              </div>
            </div>
          ),
        },
        {
          key: '5',
          span: 4,
          label: '单词结构',
          children: (
            <div className="flex items-center gap-4">
              <RateScoreView maxScore={20} score={structure.score}></RateScoreView>
              <div>
                <Typography.Paragraph>{`${structure.summary}`}</Typography.Paragraph>

                <Typography.Paragraph>
                  <Typography.Text strong>{`${structure.enhanced}`}</Typography.Text>
                </Typography.Paragraph>
              </div>
            </div>
          ),
        },
        {
          key: '6',
          label: '状态',
          children: <Badge status="processing" text={`对单词 ${msg} 已验证(${code})`} />,
          span: 3,
        },
      ];

      return (
        <>
          <Descriptions bordered items={items} />
        </>
      );
    } catch (e) {
      return <InfoComponent data={validateInfo} />;
    }
  }, [validateInfo]);

  const renderStatusTip = useMemo(() => {
    if (parseStatus === ParseStatus.NORMAL) return null;

    if (parseStatus === ParseStatus.SYNCHORNISED) {
      return <span>已同步至单词编辑器</span>;
    }

    if (parseStatus === ParseStatus.ERROR) {
      return (
        <span>
          结构不一致，
          <Button
            color="primary"
            variant="text"
            onClick={() => {
              const [parsedInfo] = parseWordContent(infoData!);
              if (!parsedInfo) {
                message.error('解析失败，请检查输入格式！');
                return;
              }

              setInfoData(JSON.stringify(parsedInfo, null, 2));
              setCurrentContent(parsedInfo!);
              setParseStatus(ParseStatus.SYNCHORNISED);
            }}
          >
            点击这里强行转换
          </Button>
          <span>{tipMsg}</span>
        </span>
      );
    }

    if (parseStatus === ParseStatus.UNKNOWN) {
      return <span>未知的格式，无法完成解析</span>;
    }
  }, [parseStatus]);

  const renderEditorRateAction = useMemo(() => {
    if (data.status === 'APPROVED') return null;
    if (data.ai_score !== -1) return <>
      <Form.Item label="操作">
        <div className="flex items-center gap-2">
          <InputNumber
            min={60}
            max={100}
            onChange={(value) => {
              setScoreInfo(+(value ?? 0));
            }}
          />
          <div className="flex items-center gap-2">
            <Button
              variant="filled"
              color="volcano"
              onClick={handleScore}
            >
              重新提交人工评分
            </Button>
            <span>
              上轮人工评分：{data.manual_score} - 当前单词已被AI审阅，您可以重新提交人工评分。
            </span>
          </div>
        </div>
      </Form.Item>
    </>

    return <>
      <Form.Item label="操作">
        <div className="flex items-center gap-2">
          <InputNumber
            min={60}
            max={100}
            onChange={(value) => {
              setScoreInfo(+(value ?? 0));
            }}
          />
          <div className="flex items-center gap-2">
            <Button
              variant="filled"
              color="volcano"
              onClick={handleScore}
            >
              提交人工评分
            </Button>
            <span className="text-sm text-gray-500">
              当前单词未被AI审阅，您可以提交人工评分。
            </span>
          </div>
        </div>
      </Form.Item>
    </>
  }, [data, handleScore])

  const renderWordEditor = useMemo(
    () => (
      <>
        <Tabs
          className="h-full"
          defaultActiveKey={editable ? '1' : '0'}
          tabPosition="left"
          items={[
            ...(editable
              ? []
              : [
                {
                  label: '综合审阅',
                  key: '0',
                  children: (
                    <>
                      <Form.Item label="审阅评价">
                        {validateInfo ? renderValidateReview : '请先完成人工审阅评分.'}
                      </Form.Item>
                      <Form.Item label="JSON数据">
                        <InfoComponent readonly onChange={handleInfoChange} data={infoData} />
                      </Form.Item>
                      {renderEditorRateAction}
                      <div className='h-4' />
                    </>
                  ),
                },
              ]),
            {
              label: '发音配置',
              key: '1',
              children: (
                <>
                  <Form.Item
                    name="britishPronounce"
                    label="英式发音"
                    rules={[{ required: true, message: '请输入英式发音!' }]}
                  >
                    <WordPronounceEditor
                      readonly={!editable}
                      value={currentContent.britishPronounce}
                      onChange={(pronounce) =>
                        setCurrentContent({ ...currentContent, britishPronounce: pronounce })
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    name="americanPronounce"
                    label="美式发音"
                    rules={[{ required: true, message: '请输入美式发音!' }]}
                  >
                    <WordPronounceEditor
                      readonly={!editable}
                      value={currentContent.americanPronounce}
                      onChange={(pronounce) =>
                        setCurrentContent({ ...currentContent, americanPronounce: pronounce })
                      }
                    />
                  </Form.Item>
                </>
              ),
            },
            {
              label: '图片列表',
              key: '2',
              children: (
                <>
                  <Form.Item name="img" label="图片列表">
                    <span className="hidden">{JSON.stringify(currentContent.img)}</span>
                    <WordImageEditor
                      readonly={!editable}
                      value={currentContent.img}
                      onChange={(img) => setCurrentContent({ ...currentContent, img: img })}
                    />
                  </Form.Item>
                  {data?.id && editable && (
                    <WordImageCreator
                      wordId={data.id!}
                      onSubmit={(img) =>
                        setCurrentContent({
                          ...currentContent,
                          img: [...(currentContent.img || []), ...(img || [])],
                        })
                      }
                    />
                  )}
                </>
              ),
            },
            {
              label: '翻译',
              key: '3',
              children: (
                <Form.Item name="translation" label="翻译">
                  <WordTranslationEditor
                    readonly={!editable}
                    initialTranslations={currentContent.translation}
                    onSave={(updatedTranslations) =>
                      setCurrentContent({ ...currentContent, translation: updatedTranslations })
                    }
                  />
                </Form.Item>
              ),
            },
            {
              label: '短语',
              key: '4',
              children: (
                <Form.Item
                  name="examplePhrases"
                  label="短语"
                  rules={[{ required: true, message: '请编辑短语!' }]}
                >
                  <WordExampleListEditor
                    readonly={!editable}
                    value={currentContent.examplePhrases}
                    onChange={(updatedExamplePhrased) =>
                      setCurrentContent({
                        ...currentContent,
                        examplePhrases: updatedExamplePhrased,
                      })
                    }
                  />
                </Form.Item>
              ),
            },
            {
              label: '词形变化',
              key: '5',
              children: (
                <Form.Item
                  name="transform"
                  label="词形变化"
                  rules={[{ required: true, message: '请编辑词形变化!' }]}
                >
                  <WordTransformEditor
                    readonly={!editable}
                    initialTransforms={currentContent.transform}
                    onSave={(updatedTransforms) =>
                      setCurrentContent({ ...currentContent, transform: updatedTransforms })
                    }
                  />
                </Form.Item>
              ),
            },
            {
              label: '单词网络',
              key: '6',
              children: (
                <Form.Item
                  name="derived"
                  label="单词网络"
                  rules={[{ required: true, message: '请编辑单词网络!' }]}
                >
                  <WordDerivedEditor
                    readonly={!editable}
                    initialDerivedWords={currentContent.derived}
                    onSave={(updatedDerivedWords) =>
                      setCurrentContent({ ...currentContent, derived: updatedDerivedWords })
                    }
                  />
                </Form.Item>
              ),
            },
            {
              label: '单词组成',
              key: '7',
              children: (
                <Form.Item
                  name="parts"
                  label="单词组成"
                  rules={[{ required: true, message: '请编辑单词组成!' }]}
                >
                  <WordAffixEditor
                    readonly={!editable}
                    initialAffixParts={currentContent.parts}
                    onSave={(updatedAffixParts) =>
                      setCurrentContent({ ...currentContent, parts: updatedAffixParts })
                    }
                  />
                </Form.Item>
              ),
            },
            {
              label: '拓展功能',
              key: '8',
              children: (
                <>
                  <Form.Item name="advancedFeatures" valuePropName="checked">
                    <Checkbox
                      disabled={!editable}
                      onChange={(e) => setAdvancedFeaturesEnabled(e.target.checked)}
                    >
                      启用拓展功能
                    </Checkbox>
                  </Form.Item>
                  {isAdvancedFeaturesEnabled && (
                    <>
                      <Form.Item name="remember" label="记忆方法">
                        <Input.TextArea rows={4} />
                      </Form.Item>
                      <Form.Item name="story" label="故事">
                        <Input.TextArea rows={4} />
                      </Form.Item>
                      <Form.Item name="backgroundStory" label="背景故事">
                        <Input.TextArea rows={4} />
                      </Form.Item>
                    </>
                  )}
                </>
              ),
            },
          ]}
        />
        <div className="z-5 flex justify-end sticky bottom-0">
          {data.status === 'APPROVED' ? <>已通过审阅</> : (
            <>
              {editable ? (
                <Button type="primary" onClick={handleSave}>
                  校验并提交
                </Button>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      </>
    ),
    [
      currentContent,
      isAdvancedFeaturesEnabled,
      infoData,
      handleSave,
      handleInfoChange,
      setAdvancedFeaturesEnabled,
      setCurrentContent,
      setInfoData,
      setDrawerVisible,
      setParseStatus,
      setTipMsg,
      tipMsg,
      parseStatus,
      parseWordContent,
      parseStatus,
    ],
  );

  const renderSupplymentAnalyser = useMemo(() => {
    try {
      const obj = JSON.parse(supplymentData);

      const { code, msg, data } = obj;
      if (code === 400) {
        return (
          <>
            <Alert message="生成失败" description={msg} type="warning" showIcon closable />
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </>
        );
      }

      const handleReplace = () => {
        // setCurrentContent(data)
        setInfoData(JSON.stringify(data, null, 2));

        setModalVisible(false);
      };

      if (seconds > 0) {
        setTimeout(() => {
          setSeconds(seconds - 1);
        }, 1000);
      } else if (seconds === 0) {
        setSeconds(-1);
        handleReplace();
      }

      return (
        <>
          <Alert
            message={
              '已成功生成补全 ' +
              msg +
              (seconds > 0 ? ' | 将在 ' + seconds + ' 秒后自动插入替换' : '')
            }
            type="success"
            showIcon
            action={
              <Button variant="outlined" color="green" onClick={handleReplace}>
                直接插入
              </Button>
            }
          />
        </>
      );
    } catch (e: any) {
      return (
        <>
          <div className="flex items-center gap-2">
            <Spin indicator={<LoadingOutlined spin />} size="small" />
            正在分析扩充内容...
          </div>
          <Alert
            message="生成内容正在校验中"
            description={e?.message ?? e ?? 'UNKNOWN ERROR'}
            type="warning"
            showIcon
          />
        </>
      );
    }
  }, [supplymentData, seconds]);

  const renderTableAction = useMemo(() => {
    if (data.status === 'UPLOADED') {
      return <div className="flex op-80 text-[#351A37] font-bold items-center gap-2">
        <Tooltip title="该单词为已处理状态，属于AI审阅流程，但目前未进入人工审阅流程。您可以重新进入流程。">
          <InfoCircleOutlined />
        </Tooltip>
        等待重新进入流程
      </div>
      // return <Button variant="outlined" color="gold" onClick={() => setDrawerVisible(true)}>
      //   等待重新进入流程
      // </Button>

      // <Typography.Link
      //   onClick={() => setDrawerVisible(true)}
      // >
      //   等待人工审阅
      // </Typography.Link>
    }

    if (data.status === 'PROCESSED') {
      return <Button variant="outlined" color="gold" onClick={() => setDrawerVisible(true)}>
        等待人工审阅
      </Button>
    }

    return <Button variant="outlined" color="volcano" onClick={() => setDrawerVisible(true)}>
      进入单词审阅器
    </Button>
  }, [data])

  return (
    <Form form={form} layout="vertical">
      {editable ? (
        <>
          <InfoComponent
            readonly={aiSupplying}
            scrollWithUpdate={aiSupplying}
            onChange={handleInfoChange}
            data={infoData}
          />

          <div style={{ marginTop: '0.5rem', opacity: '0.5' }}>{renderStatusTip}</div>

          <div className="flex items-center justify-between w-[800px] gap-16">
            {data.status !== 'UNKNOWN' && data.status !== 'CREATED' && (
              <Button size="large" type="dashed" onClick={() => setDrawerVisible(true)}>
                进入单词编辑器
              </Button>
            )}

            <AIButton loading={aiSupplying} onClick={handleAISupply}>
              AI扩充
            </AIButton>
          </div>
        </>
      ) : (renderTableAction)}

      <Modal
        open={isModalVisible}
        destroyOnClose
        width="858px"
        title="LeavesAI 扩充"
        onCancel={() => setModalVisible(false)}
        onClose={() => setModalVisible(false)}
        footer={null}
      >
        <div className="flex flex-col justify-center gap-2">
          {renderSupplymentAnalyser}
          <InfoComponent scrollWithUpdate readonly data={supplymentData} />
        </div>
      </Modal>
      <Drawer
        title={editable ? '单词编辑器' : `单词审阅器 (${data.word_head})`}
        placement="right"
        width="85%"
        destroyOnClose
        onClose={() => setDrawerVisible(false)}
        open={isDrawerVisible}
      >
        {renderWordEditor}
      </Drawer>
    </Form>
  );
};

export default WordContentEditor;
