import { Client } from '@elastic/elasticsearch'

import { env } from '~/global/env'

const ElasticSearchOptions = {
  node: env('ELASTICSEARCH_NODE'),
  auth: {
    username: env('ELASTICSEARCH_USERNAME'),
    password: env('ELASTICSEARCH_PASSWORD'),
  },
  tls: {
    rejectUnauthorized: false,
  },
  maxRetries: (+env('ELASTICSEARCH_MAX_RETRIES') || 5),
  requestTimeout: (+env('ELASTICSEARCH_REQ_TIMEOUT') || 10000), // 10s
}

export const $esClient = new Client(ElasticSearchOptions)

export { ElasticSearchOptions,
}
