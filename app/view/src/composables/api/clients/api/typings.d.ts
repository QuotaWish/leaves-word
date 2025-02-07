declare namespace API {
  type AudioFile = {
    content?: string;
    create_time?: string;
    creator_id?: number;
    id?: number;
    is_delete?: number;
    name?: string;
    path?: string;
    status?:
      | "UNKNOWN"
      | "UPLOADING"
      | "UPLOADED"
      | "PROCESSING"
      | "PROCESSED"
      | "FAILED"
      | "DELETED"
      | "SYNTHESIZING"
      | "IN_QUEUE";
    update_time?: string;
  };

  type AudioFileAddRequest = {
    content?: string;
    name?: string;
    voice?: string;
  };

  type AudioFileQueryRequest = {
    content?: string;
    current?: number;
    id?: number;
    name?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
  };

  type AudioFileSynthesizeRequest = {
    id?: number;
  };

  type AudioFileVO = {
    content?: string;
    createTime?: string;
    creatorId?: number;
    id?: number;
    name?: string;
    status?:
      | "UNKNOWN"
      | "UPLOADING"
      | "UPLOADED"
      | "PROCESSING"
      | "PROCESSED"
      | "FAILED"
      | "DELETED"
      | "SYNTHESIZING"
      | "IN_QUEUE";
    updateTime?: string;
    userId?: number;
  };

  type BaseResponseArrayInt_ = {
    code?: number;
    data?: number[];
    message?: string;
  };

  type BaseResponseAudioFileVO_ = {
    code?: number;
    data?: AudioFileVO;
    message?: string;
  };

  type BaseResponseBoolean_ = {
    code?: number;
    data?: boolean;
    message?: string;
  };

  type BaseResponseDictionaryWordVO_ = {
    code?: number;
    data?: DictionaryWordVO;
    message?: string;
  };

  type BaseResponseEnglishDictionaryVO_ = {
    code?: number;
    data?: EnglishDictionaryVO;
    message?: string;
  };

  type BaseResponseEnglishWordChangeLogVO_ = {
    code?: number;
    data?: EnglishWordChangeLogVO;
    message?: string;
  };

  type BaseResponseEnglishWordVO_ = {
    code?: number;
    data?: EnglishWordVO;
    message?: string;
  };

  type BaseResponseInt_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseListCategory_ = {
    code?: number;
    data?: Category[];
    message?: string;
  };

  type BaseResponseListEnglishDictionaryWithCategoryVO_ = {
    code?: number;
    data?: EnglishDictionaryWithCategoryVO[];
    message?: string;
  };

  type BaseResponseLoginUserVO_ = {
    code?: number;
    data?: LoginUserVO;
    message?: string;
  };

  type BaseResponseLong_ = {
    code?: number;
    data?: number;
    message?: string;
  };

  type BaseResponseMediaCreatorVO_ = {
    code?: number;
    data?: MediaCreatorVO;
    message?: string;
  };

  type BaseResponsePageAudioFile_ = {
    code?: number;
    data?: PageAudioFile_;
    message?: string;
  };

  type BaseResponsePageAudioFileVO_ = {
    code?: number;
    data?: PageAudioFileVO_;
    message?: string;
  };

  type BaseResponsePageCategory_ = {
    code?: number;
    data?: PageCategory_;
    message?: string;
  };

  type BaseResponsePageDictionaryWord_ = {
    code?: number;
    data?: PageDictionaryWord_;
    message?: string;
  };

  type BaseResponsePageDictionaryWordVO_ = {
    code?: number;
    data?: PageDictionaryWordVO_;
    message?: string;
  };

  type BaseResponsePageEnglishDictionary_ = {
    code?: number;
    data?: PageEnglishDictionary_;
    message?: string;
  };

  type BaseResponsePageEnglishDictionaryVO_ = {
    code?: number;
    data?: PageEnglishDictionaryVO_;
    message?: string;
  };

  type BaseResponsePageEnglishWord_ = {
    code?: number;
    data?: PageEnglishWord_;
    message?: string;
  };

  type BaseResponsePageEnglishWordChangeLog_ = {
    code?: number;
    data?: PageEnglishWordChangeLog_;
    message?: string;
  };

  type BaseResponsePageEnglishWordChangeLogVO_ = {
    code?: number;
    data?: PageEnglishWordChangeLogVO_;
    message?: string;
  };

  type BaseResponsePageEnglishWordVO_ = {
    code?: number;
    data?: PageEnglishWordVO_;
    message?: string;
  };

  type BaseResponsePageMediaCreator_ = {
    code?: number;
    data?: PageMediaCreator_;
    message?: string;
  };

  type BaseResponsePageMediaCreatorVO_ = {
    code?: number;
    data?: PageMediaCreatorVO_;
    message?: string;
  };

  type BaseResponsePagePost_ = {
    code?: number;
    data?: PagePost_;
    message?: string;
  };

  type BaseResponsePagePostVO_ = {
    code?: number;
    data?: PagePostVO_;
    message?: string;
  };

  type BaseResponsePageUser_ = {
    code?: number;
    data?: PageUser_;
    message?: string;
  };

  type BaseResponsePageUserVO_ = {
    code?: number;
    data?: PageUserVO_;
    message?: string;
  };

  type BaseResponsePostVO_ = {
    code?: number;
    data?: PostVO;
    message?: string;
  };

  type BaseResponseString_ = {
    code?: number;
    data?: string;
    message?: string;
  };

  type BaseResponseUser_ = {
    code?: number;
    data?: User;
    message?: string;
  };

  type BaseResponseUserVO_ = {
    code?: number;
    data?: UserVO;
    message?: string;
  };

  type Category = {
    createdAt?: string;
    description?: string;
    id?: number;
    isRoot?: boolean;
    name?: string;
    parentId?: number;
    sortOrder?: number;
    updatedAt?: string;
  };

  type CategoryQueryRequest = {
    current?: number;
    description?: string;
    id?: number;
    name?: string;
    notId?: number;
    pageSize?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
  };

  type CategoryRelativeRequest = {
    category_ids?: number[];
    dict_id?: number;
  };

  type checkUsingGETParams = {
    /** echostr */
    echostr?: string;
    /** nonce */
    nonce?: string;
    /** signature */
    signature?: string;
    /** timestamp */
    timestamp?: string;
  };

  type DeleteRequest = {
    id?: number;
  };

  type DictionaryWord = {
    created_at?: string;
    dictionary_id?: number;
    id?: number;
    word_id?: number;
  };

  type DictionaryWordAddRequest = {
    dictionary_id?: number;
    word_id?: number;
  };

  type DictionaryWordQueryRequest = {
    current?: number;
    dictionary_id?: number;
    id?: number;
    notId?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    word_id?: number;
  };

  type DictionaryWordVO = {
    create_at?: string;
    dictionary_id?: number;
    id?: number;
    word_id?: number;
  };

  type EnglishDictionary = {
    author?: string;
    create_time?: string;
    description?: string;
    id?: number;
    image_url?: string;
    is_delete?: number;
    isbn?: string;
    name?: string;
    publication_date?: string;
    publisher?: string;
    update_time?: string;
  };

  type EnglishDictionaryAddRequest = {
    author?: string;
    description?: string;
    image_url?: string;
    isbn?: string;
    name?: string;
    publication_date?: string;
    publisher?: string;
  };

  type EnglishDictionaryImportRequest = {
    description?: string[];
    id?: number;
  };

  type EnglishDictionaryQueryRequest = {
    author?: string;
    content?: string;
    current?: number;
    description?: string;
    id?: number;
    image_url?: string;
    isbn?: string;
    name?: string;
    notId?: number;
    pageSize?: number;
    publication_date?: string;
    publisher?: string;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    tags?: string[];
    title?: string;
    userId?: number;
  };

  type EnglishDictionaryUpdateRequest = {
    author?: string;
    description?: string;
    id?: number;
    image_url?: string;
    isbn?: string;
    name?: string;
    publication_date?: string;
    publisher?: string;
  };

  type EnglishDictionaryVO = {
    author?: string;
    create_time?: string;
    description?: string;
    id?: number;
    image_url?: string;
    isbn?: string;
    name?: string;
    publication_date?: string;
    publisher?: string;
    update_time?: string;
  };

  type EnglishDictionaryWithCategoryVO = {
    author?: string;
    categoryList?: Category[];
    create_time?: string;
    description?: string;
    id?: number;
    image_url?: string;
    isbn?: string;
    name?: string;
    publication_date?: string;
    publisher?: string;
    update_time?: string;
  };

  type EnglishWord = {
    create_time?: string;
    id?: number;
    info?: string;
    is_delete?: number;
    status?: string;
    update_time?: string;
    word_head?: string;
  };

  type EnglishWordAddBatchRequest = {
    words?: EnglishWordAddRequest[];
  };

  type EnglishWordAddRequest = {
    info?: string;
    word_head?: string;
  };

  type EnglishWordChangeLog = {
    change_time?: string;
    changed_by?: number;
    english_word_id?: number;
    field_name?: string;
    id?: number;
    new_value?: string;
    old_value?: string;
  };

  type EnglishWordChangeLogQueryRequest = {
    content?: string;
    current?: number;
    id?: number;
    notId?: number;
    pageSize?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    tags?: string[];
    title?: string;
    userId?: number;
  };

  type EnglishWordChangeLogVO = {
    content?: string;
    createTime?: string;
    id?: number;
    tagList?: string[];
    title?: string;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type EnglishWordQueryRequest = {
    current?: number;
    id?: number;
    notId?: number;
    pageSize?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    status?: string;
    userId?: number;
  };

  type EnglishWordScoreRequest = {
    aiContent?: string;
    aiScore?: number;
    id?: number;
    score?: number;
  };

  type EnglishWordUpdateRequest = {
    id?: number;
    info?: string;
    word_head?: string;
  };

  type EnglishWordVO = {
    content?: string;
    createTime?: string;
    id?: number;
    status?: string;
    title?: string;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type getAudioFileVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getDictionaryCategoryByDictionaryIdUsingGETParams = {
    /** dict_id */
    dict_id: number;
  };

  type getDictionaryWordVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getEnglishDictionaryVOByIdUsingGETParams = {
    /** id */
    id: string;
  };

  type getEnglishWordChangeLogVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getEnglishWordVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getMediaCreatorVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getPostVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number;
  };

  type LoginUserVO = {
    createTime?: string;
    id?: number;
    updateTime?: string;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type MediaCreator = {
    created_at?: string;
    creator_id?: number;
    id?: number;
    info?: string;
    media_type?: string;
    media_url?: string;
    word_id?: number;
  };

  type MediaCreatorAddRequest = {
    mediaType?: "LIVE" | "IMAGE" | "VIDEO" | "AUDIO" | "STATIC_VIDEO";
    wordId?: number;
  };

  type MediaCreatorQueryRequest = {
    current?: number;
    id?: number;
    mediaType?: string;
    mediaUrl?: string;
    notId?: number;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
    wordId?: number;
  };

  type MediaCreatorVO = {
    createdAt?: string;
    creatorId?: number;
    id?: number;
    info?: string;
    mediaType?: string;
    mediaUrl?: string;
    user?: UserVO;
    wordId?: number;
  };

  type OrderItem = {
    asc?: boolean;
    column?: string;
  };

  type PageAudioFile_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: AudioFile[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageAudioFileVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: AudioFileVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageCategory_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Category[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageDictionaryWord_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: DictionaryWord[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageDictionaryWordVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: DictionaryWordVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageEnglishDictionary_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: EnglishDictionary[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageEnglishDictionaryVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: EnglishDictionaryVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageEnglishWord_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: EnglishWord[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageEnglishWordChangeLog_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: EnglishWordChangeLog[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageEnglishWordChangeLogVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: EnglishWordChangeLogVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageEnglishWordVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: EnglishWordVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageMediaCreator_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: MediaCreator[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageMediaCreatorVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: MediaCreatorVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PagePost_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: Post[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PagePostVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: PostVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUser_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: User[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type PageUserVO_ = {
    countId?: string;
    current?: number;
    maxLimit?: number;
    optimizeCountSql?: boolean;
    orders?: OrderItem[];
    pages?: number;
    records?: UserVO[];
    searchCount?: boolean;
    size?: number;
    total?: number;
  };

  type Post = {
    content?: string;
    createTime?: string;
    favourNum?: number;
    id?: number;
    isDelete?: number;
    tags?: string;
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    userId?: number;
  };

  type PostAddRequest = {
    content?: string;
    tags?: string[];
    title?: string;
  };

  type PostEditRequest = {
    content?: string;
    id?: number;
    tags?: string[];
    title?: string;
  };

  type PostFavourAddRequest = {
    postId?: number;
  };

  type PostFavourQueryRequest = {
    current?: number;
    pageSize?: number;
    postQueryRequest?: PostQueryRequest;
    sortField?: string;
    sortOrder?: string;
    userId?: number;
  };

  type PostQueryRequest = {
    content?: string;
    current?: number;
    favourUserId?: number;
    id?: number;
    notId?: number;
    orTags?: string[];
    pageSize?: number;
    searchText?: string;
    sortField?: string;
    sortOrder?: string;
    tags?: string[];
    title?: string;
    userId?: number;
  };

  type PostThumbAddRequest = {
    postId?: number;
  };

  type PostUpdateRequest = {
    content?: string;
    id?: number;
    tags?: string[];
    title?: string;
  };

  type PostVO = {
    content?: string;
    createTime?: string;
    favourNum?: number;
    hasFavour?: boolean;
    hasThumb?: boolean;
    id?: number;
    tagList?: string[];
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    user?: UserVO;
    userId?: number;
  };

  type selectOneUsingGETParams = {
    /** id */
    id?: number;
  };

  type SseEmitter = {
    timeout?: number;
  };

  type uploadFileUsingPOSTParams = {
    biz?: string;
  };

  type User = {
    createTime?: string;
    id?: number;
    isDelete?: number;
    mpOpenId?: string;
    unionId?: string;
    updateTime?: string;
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userPassword?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserAddRequest = {
    userAccount?: string;
    userAvatar?: string;
    userName?: string;
    userRole?: string;
  };

  type userLoginByWxOpenUsingGETParams = {
    /** code */
    code: string;
  };

  type UserLoginRequest = {
    userAccount?: string;
    userPassword?: string;
  };

  type UserQueryRequest = {
    current?: number;
    id?: number;
    mpOpenId?: string;
    pageSize?: number;
    sortField?: string;
    sortOrder?: string;
    unionId?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserRegisterRequest = {
    checkPassword?: string;
    userAccount?: string;
    userPassword?: string;
  };

  type UserUpdateMyRequest = {
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
  };

  type UserUpdateRequest = {
    id?: number;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };

  type UserVO = {
    createTime?: string;
    id?: number;
    userAvatar?: string;
    userName?: string;
    userProfile?: string;
    userRole?: string;
  };
}
