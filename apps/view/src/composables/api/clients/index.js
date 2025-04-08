import { createAlova } from 'alova';
import fetchAdapter from 'alova/fetch';
import { createApis, withConfigType } from './createApis';
import { $endApi } from '../index';

export const $$userConfigMap = withConfigType({});

/**
 * @type { Apis }
 */
const Apis = createApis($endApi, $$userConfigMap);

export default Apis;
