import { Injectable } from '@nestjs/common'

import { ConfigService } from '@nestjs/config'
import { ElasticsearchService } from '@nestjs/elasticsearch'

import { CreateSearchDto } from './dto/create-search.dto'
import { UpdateSearchDto } from './dto/update-search.dto'

@Injectable()
export class SearchService {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) {}

  // async createIndex() {
  //   const isIndexExist = await this.esService.indices.exists({
  //     index: this.configService.get('ELASTICSEARCH_INDEX'),
  //   })

  //   if (!isIndexExist) {
  //     this.esService.indices.create({
  //       index: this.configService.get('ELASTICSEARCH_INDEX'),
  //       body: {
  //         mappings: {
  //           properties: {
  //             '@timestamp': {
  //               type: 'date',
  //             },
  //             'budget': {
  //               type: 'long',
  //             },
  //             'genres': {
  //               type: 'text',
  //             },
  //             'homepage': {
  //               type: 'keyword',
  //             },
  //             'id': {
  //               type: 'long',
  //             },
  //             'keywords': {
  //               type: 'text',
  //             },
  //             'original_language': {
  //               type: 'keyword',
  //             },
  //             'original_title': {
  //               type: 'text',
  //             },
  //             'overview': {
  //               type: 'text',
  //             },
  //             'popularity': {
  //               type: 'double',
  //             },
  //             'production_companies': {
  //               type: 'text',
  //             },
  //             'production_countries': {
  //               type: 'text',
  //             },
  //             'release_date': {
  //               type: 'date',
  //               format: 'iso8601',
  //             },
  //             'revenue': {
  //               type: 'long',
  //             },
  //             'runtime': {
  //               type: 'long',
  //             },
  //             'spoken_languages': {
  //               type: 'text',
  //             },
  //             'status': {
  //               type: 'keyword',
  //             },
  //             'tagline': {
  //               type: 'text',
  //             },
  //             'title': {
  //               type: 'text',
  //             },
  //             'vote_average': {
  //               type: 'double',
  //             },
  //             'vote_count': {
  //               type: 'long',
  //             },
  //           },
  //         },
  //       },
  //     })
  //   }
  // }

  create(createSearchDto: CreateSearchDto) {
    return `This action adds a new search`
  }

  findAll() {
    return `This action returns all search`
  }

  findOne(id: number) {
    return `This action returns a #${id} search`
  }

  update(id: number, updateSearchDto: UpdateSearchDto) {
    return `This action updates a #${id} search`
  }

  remove(id: number) {
    return `This action removes a #${id} search`
  }
}
