import { SubscribeTime, SubscribeType } from '~/modules/subscribe/subscribe.dto'

export const SUBSCRIPTION_PLAN_LIST = [
  {
    name: '标准订阅计划（试用/天）',
    trial: true,
    type: 'STANDARD',
    time: 'TRIAL',
    meta: {
      fee: 99,
      average: 99,
      originPrice: 99,
      unit: 'CNY',
      range: 1,
    },
    info: [
      {
        name: 'Quota 标准订阅计划',
        price: '%total%',
      },
      {
        name: '标准订阅计划权益包',
        free: true,
        price: '0',
      },
      {
        name: '标准订阅计划工具包',
        free: true,
        price: '0',
      },
      {
        name: 'QuotaTurbo',
        free: true,
        price: '0',
      },
      {
        name: '外观自定义套装',
        free: true,
        price: '0',
      },
      {
        name: '精美使用教程',
        free: true,
        price: '0',
      },
      {
        name: '专属在线客服',
        free: true,
        price: '0',
      },
    ],
  },
  {
    name: '标准订阅计划（试用/周）',
    trial: true,
    type: 'STANDARD',
    time: 'TRIAL_WEEK',
    meta: {
      fee: 299,
      average: 43,
      originPrice: 299,
      unit: 'CNY',
      range: 7,
    },
    info: [
      {
        name: 'Quota 标准订阅计划',
        price: '%total%',
      },
      {
        name: '标准订阅计划权益包',
        free: true,
        price: '0',
      },
      {
        name: '标准订阅计划工具包',
        free: true,
        price: '0',
      },
      {
        name: 'QuotaTurbo',
        free: true,
        price: '0',
      },
      {
        name: '外观自定义套装',
        free: true,
        price: '0',
      },
      {
        name: '精美使用教程',
        free: true,
        price: '0',
      },
      {
        name: '专属在线客服',
        free: true,
        price: '0',
      },
    ],
  },
  {
    name: '标准订阅计划（试用/月）',
    trial: true,
    type: 'STANDARD',
    time: 'MONTH_TRIAL',
    meta: {
      fee: 699,
      average: 23,
      originPrice: 699,
      unit: 'CNY',
      range: 30,
    },
    info: [
      {
        name: 'Quota 标准订阅计划',
        price: '%total%',
      },
      {
        name: '标准订阅计划权益包',
        free: true,
        price: '0',
      },
      {
        name: '标准订阅计划工具包',
        free: true,
        price: '0',
      },
      {
        name: 'QuotaTurbo',
        free: true,
        price: '0',
      },
      {
        name: '外观自定义套装',
        free: true,
        price: '0',
      },
      {
        name: '精美使用教程',
        free: true,
        price: '0',
      },
      {
        name: '专属在线客服',
        free: true,
        price: '0',
      },
    ],
  },
  {
    name: '标准订阅计划（月）',
    type: 'STANDARD',
    time: 'MONTH',
    meta: {
      fee: 999,
      average: 33,
      originPrice: 1999,
      unit: 'CNY',
      range: 30,
    },
    info: [
      {
        name: 'Quota 标准订阅计划',
        price: '%total%',
      },
      {
        name: '标准订阅计划权益包',
        free: true,
        price: '0',
      },
      {
        name: '标准订阅计划工具包',
        free: true,
        price: '0',
      },
      {
        name: 'QuotaTurbo',
        free: true,
        price: '0',
      },
      {
        name: '外观自定义套装',
        free: true,
        price: '0',
      },
      {
        name: '开发者设置',
        free: true,
        price: '0',
      },
      {
        name: '精美使用教程',
        free: true,
        price: '0',
      },
      {
        name: '专属在线客服',
        free: true,
        price: '0',
      },
    ],
  },
  {
    name: '标准订阅计划（季度）',
    type: 'STANDARD',
    time: 'QUARTER',
    meta: {
      fee: 2997,
      average: 33,
      originPrice: 5997,
      unit: 'CNY',
      range: 90,
    },
    info: [
      {
        name: 'Quota 标准订阅计划',
        price: '%total%',
      },
      {
        name: '标准订阅计划权益包',
        free: true,
        price: '0',
      },
      {
        name: '标准订阅计划工具包',
        free: true,
        price: '0',
      },
      {
        name: 'QuotaTurbo',
        free: true,
        price: '0',
      },
      {
        name: '外观自定义套装',
        free: true,
        price: '0',
      },
      {
        name: '开发者设置',
        free: true,
        price: '0',
      },
      {
        name: '精美使用教程',
        free: true,
        price: '0',
      },
      {
        name: '专属在线客服',
        free: true,
        price: '0',
      },
    ],
  },
  {
    name: '标准订阅计划（年度）',
    type: 'STANDARD',
    time: 'YEAR',
    meta: {
      fee: 11988,
      average: 33,
      originPrice: 23988,
      unit: 'CNY',
      range: 365,
    },
    info: [
      {
        name: 'Quota 标准订阅计划',
        price: '%total%',
      },
      {
        name: '标准订阅计划权益包',
        free: true,
        price: '0',
      },
      {
        name: '标准订阅计划工具包',
        free: true,
        price: '0',
      },
      {
        name: 'QuotaTurbo',
        free: true,
        price: '0',
      },
      {
        name: '外观自定义套装',
        free: true,
        price: '0',
      },
      {
        name: '开发者设置',
        free: true,
        price: '0',
      },
      {
        name: '精美使用教程',
        free: true,
        price: '0',
      },
      {
        name: '专属在线客服',
        free: true,
        price: '0',
      },
    ],
  },
  {
    name: '高级订阅计划（月）',
    type: 'ULTIMATE',
    time: 'MONTH',
    meta: {
      fee: 5400,
      average: 180,
      originPrice: 5400,
      unit: 'CNY',
      range: 30,
    },
    info: [
      {
        name: 'Quota 高级订阅计划',
        price: '%total%',
      },
      {
        name: '高级订阅计划权益包',
        free: true,
        price: '0',
      },
      {
        name: '高级订阅计划工具包',
        free: true,
        price: '0',
      },
      {
        name: 'QuotaTurbo/QuotaOmni',
        free: true,
        price: '0',
      },
      {
        name: '外观自定义套装',
        free: true,
        price: '0',
      },
      {
        name: '开发者设置',
        free: true,
        price: '0',
      },
      {
        name: '精美使用教程',
        free: true,
        price: '0',
      },
      {
        name: '专属在线客服',
        free: true,
        price: '0',
      },
    ],
  },
  {
    name: '高级订阅计划（季度）',
    type: 'ULTIMATE',
    time: 'QUARTER',
    meta: {
      fee: 16200,
      average: 180,
      originPrice: 16200,
      unit: 'CNY',
      range: 90,
    },
    info: [
      {
        name: 'Quota 高级订阅计划',
        price: '%total%',
      },
      {
        name: '高级订阅计划权益包',
        free: true,
        price: '0',
      },
      {
        name: '高级订阅计划工具包',
        free: true,
        price: '0',
      },
      {
        name: 'QuotaTurbo/QuotaOmni',
        free: true,
        price: '0',
      },
      {
        name: '外观自定义套装',
        free: true,
        price: '0',
      },
      {
        name: '开发者设置',
        free: true,
        price: '0',
      },
      {
        name: '精美使用教程',
        free: true,
        price: '0',
      },
      {
        name: '专属在线客服',
        free: true,
        price: '0',
      },
    ],
  },
  {
    name: '高级订阅计划（年度）',
    type: 'ULTIMATE',
    time: 'YEAR',
    meta: {
      fee: 65700,
      average: 180,
      originPrice: 65700,
      unit: 'CNY',
      range: 365,
    },
    info: [
      {
        name: 'Quota 高级订阅计划',
        price: '%total%',
      },
      {
        name: '高级订阅计划权益包',
        free: true,
        price: '0',
      },
      {
        name: '高级订阅计划工具包',
        free: true,
        price: '0',
      },
      {
        name: 'QuotaTurbo/QuotaOmni',
        free: true,
        price: '0',
      },
      {
        name: '外观自定义套装',
        free: true,
        price: '0',
      },
      {
        name: '开发者设置',
        free: true,
        price: '0',
      },
      {
        name: '精美使用教程',
        free: true,
        price: '0',
      },
      {
        name: '专属在线客服',
        free: true,
        price: '0',
      },
    ],
  },
]

export function getSubscription(time: SubscribeTime, type: SubscribeType) {
  return SUBSCRIPTION_PLAN_LIST.find(item => item.time === time && item.type === type)
}
