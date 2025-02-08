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
import { ExclamationCircleFilled, LoadingOutlined } from '@ant-design/icons';
import { getScoreEnglishWordUsingGet, scoreEnglishWordUsingPost } from '@/services/backend/englishWordController';

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
  const [aiValidating, setAIValidating] = useState(false);
  const [validateInfo, setValidateInfo] = useState('');
  const [scoreInfo, setScoreInfo] = useState<{ ai: number; manual: number }>({
    ai: 0,
    manual: 0,
  });

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
      setScoreInfo({
        ...scoreInfo,
        ai: json.score ?? 0,
      })
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

  const handleSave = () => {
    form.validateFields().then((values) => {
      message.loading('正在检验配置...');

      if (!isValidPronounce(currentContent.britishPronounce)) {
        message.error('英式发音未通过检验！');
        return;
      }

      if (!isValidPronounce(currentContent.americanPronounce)) {
        message.error('美式发音未通过检验！');
        return;
      }

      if (!currentContent.img.length) {
        message.error('图片列表未通过检验！');
        return;
      }

      if (isValidTranslationList(currentContent.translation)) {
        message.error('翻译列表未通过检验！');
        return;
      }

      if (!currentContent.examplePhrases.length) {
        message.error('短语列表未通过检验：列表为空！');
        return;
      }

      for (let i = 0; i < currentContent.examplePhrases.length; i++) {
        const example = currentContent.examplePhrases[i];
        if (example.type !== WordExampleTypeEnum.PHRASE) {
          message.error(`短语列表未通过检验：第${i + 1}个短语类型错误！`);
          return;
        }
        if (!example.translation) {
          message.error(`短语列表未通过检验：第${i + 1}个短语缺少翻译！`);
          return;
        }
      }

      if (!isValidWordDerivedList(currentContent.derived)) {
        message.error('单词网络列表未通过检验！');
        return;
      }

      if (!isValidWordTransformList(currentContent.transform)) {
        message.error('词形变化列表未通过检验！');
        return;
      }

      if (!isValidWordAffixPartList(currentContent.parts)) {
        message.error('单词组成列表未通过检验！');
        return;
      }

      message.success('检验通过！');
      setCurrentContent(values);
      setInfoData(JSON.stringify(currentContent, null, 2));
      setDrawerVisible(false);

      onChange?.(JSON.stringify(currentContent));
    });
  };

  const handleInfoChange = (newInfo: string) => {
    setInfoData(newInfo);
  };

  useEffect(() => {
    tryParseInfo(infoData || '');
  }, [infoData]);

  const { callWordSupplymentAI, callWordValidateAI } = useLeavesWordAI();

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

  const handleScore = () => {
    if (scoreInfo.manual < 60) {
      message.error('人工评分不得低于60分！');
      return;
    }

    form.validateFields().then(async () => {
      message.loading('正在检验配置...');

      if (!isValidPronounce(currentContent.britishPronounce)) {
        message.error('英式发音未通过检验！');
        return;
      }

      if (!isValidPronounce(currentContent.americanPronounce)) {
        message.error('美式发音未通过检验！');
        return;
      }

      if (!currentContent.img.length) {
        message.error('图片列表未通过检验！');
        return;
      }

      if (isValidTranslationList(currentContent.translation)) {
        message.error('翻译列表未通过检验！');
        return;
      }

      if (!currentContent.examplePhrases.length) {
        message.error('短语列表未通过检验：列表为空！');
        return;
      }

      for (let i = 0; i < currentContent.examplePhrases.length; i++) {
        const example = currentContent.examplePhrases[i];
        if (example.type !== WordExampleTypeEnum.PHRASE) {
          message.error(`短语列表未通过检验：第${i + 1}个短语类型错误！`);
          return;
        }
        if (!example.translation) {
          message.error(`短语列表未通过检验：第${i + 1}个短语缺少翻译！`);
          return;
        }
      }

      if (!isValidWordDerivedList(currentContent.derived)) {
        message.error('单词网络列表未通过检验！');
        return;
      }

      if (!isValidWordTransformList(currentContent.transform)) {
        message.error('词形变化列表未通过检验！');
        return;
      }

      if (!isValidWordAffixPartList(currentContent.parts)) {
        message.error('单词组成列表未通过检验！');
        return;
      }

      message.success('检验通过！');
      message.loading('正在提交分数...');

      const res = await scoreEnglishWordUsingPost({
        aiContent: validateInfo,
        aiScore: scoreInfo.ai,
        score: scoreInfo.manual,
        id: data.id,
      });

      if (res.code !== 0) {
        message.error(`提交分数失败：${res.message}`);
        return;
      }

      message.success('提交分数成功！');

      setDrawerVisible(false);
    });
  };

  const handleAIValidate = useCallback(async () => {
    if (aiValidating) return;

    if (!infoData) {
      message.error('当前单词数据未知，无法进行AI验证。');
      return;
    }

    setValidateInfo('');
    setAIValidating(true);

    const wordValidateAI = await callWordValidateAI(infoData);

    let content = '';

    for await (const part of wordValidateAI) {
      if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
        content += part.data?.content ?? '';
      } else if (part.event === 'conversation.message.completed') {
        if (part.data.type !== 'answer') continue;
        const value = part.data.content ?? '';

        setValidateInfo(value);
      } else if (part.event === 'done') {
        message.info('审阅已完成');
      }

      setValidateInfo(content);
    }

    setAIValidating(false);
  }, [infoData]);

  const renderValidateReview = useMemo(() => {
    try {
      const { code, msg, score, summary, data } = JSON.parse(validateInfo);

      setScoreInfo({
        ...scoreInfo,
        ai: score,
      });

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
              <RateScoreView maxScore={40} score={data['单词细节'].score}></RateScoreView>
              <div>
                <Typography.Paragraph>{`${data['单词细节'].summary}`}</Typography.Paragraph>

                <Typography.Paragraph>
                  <Typography.Text strong>{`${data['单词细节'].enhanced}`}</Typography.Text>
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
              <RateScoreView maxScore={30} score={data['单词创新'].score}></RateScoreView>
              <div>
                <Typography.Paragraph>{`${data['单词创新'].summary}`}</Typography.Paragraph>

                <Typography.Paragraph>
                  <Typography.Text strong>{`${data['单词创新'].enhanced}`}</Typography.Text>
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
              <RateScoreView maxScore={20} score={data['单词结构'].score}></RateScoreView>
              <div>
                <Typography.Paragraph>{`${data['单词结构'].summary}`}</Typography.Paragraph>

                <Typography.Paragraph>
                  <Typography.Text strong>{`${data['单词结构'].enhanced}`}</Typography.Text>
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
                        {validateInfo ? renderValidateReview : '当前暂无任何评价.'}
                      </Form.Item>
                      <Form.Item label="JSON数据">
                        <InfoComponent readonly onChange={handleInfoChange} data={infoData} />
                      </Form.Item>
                      {data.status === 'APPROVED' ? <></> : <>
                        <Form.Item label="操作">
                          <div className="flex mb-2 items-center gap-2">
                            <Button
                              loading={aiValidating}
                              variant="outlined"
                              color="volcano"
                              onClick={handleAIValidate}
                            >
                              AI评分
                            </Button>
                            <Popconfirm
                              title="人工评分"
                              description={
                                <>
                                  <p>请输入你对单词的整体打分</p>
                                  <InputNumber
                                    className="w-full"
                                    min={0}
                                    max={100}
                                    onChange={(value) => {
                                      setScoreInfo({
                                        ...scoreInfo,
                                        manual: +(value ?? 0),
                                      });
                                    }}
                                  />
                                </>
                              }
                              showCancel={false}
                            >
                              <Button
                                className="mx-2"
                                disabled={aiValidating}
                                variant="outlined"
                                color="geekblue"
                              >
                                人工评分
                              </Button>
                            </Popconfirm>
                            <div className="flex items-center gap-2">
                              <Button
                                disabled={scoreInfo.ai < 75}
                                variant="filled"
                                color="volcano"
                                onClick={handleScore}
                              >
                                提交审阅
                              </Button>
                              {scoreInfo.ai < 75 && `还差 ${75 - scoreInfo.ai} 分达到标准线`}
                            </div>
                          </div>
                        </Form.Item>
                      </>}
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
      ) : (
        <Button variant="outlined" color="volcano" onClick={() => setDrawerVisible(true)}>
          进入单词审阅器
        </Button>
      )}

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
