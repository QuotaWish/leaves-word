import { MultiCategoryTreeSelect } from '@/pages/Admin/Category';
import {
  relativeDictionaryCategoryUsingPost,
  getDictionaryCategoryByDictionaryIdUsingGet,
} from '@/services/backend/dictionaryCategoryController';
import '@umijs/max';
import { Button, message, Modal } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

interface Props {
  visible: boolean;
  dictionary?: API.EnglishDictionary;
  onSubmit: (values: API.CategoryRelativeRequest) => void;
  onCancel: () => void;
}

/**
 * 关联节点
 * @param fields
 */
const handleRelative = async (fields: API.CategoryRelativeRequest) => {
  const hide = message.loading('正在关联分类');
  try {
    await relativeDictionaryCategoryUsingPost(fields);
    hide();
    message.success('关联成功');
    return true;
  } catch (error: any) {
    hide();
    message.error('关联失败，' + error.message);
    return false;
  }
};

/**
 * 获取词典关联的分类
 */
const fetchCategoryList = async (dictionary: number) => {
  const { data, code } = await getDictionaryCategoryByDictionaryIdUsingGet({
    dict_id: dictionary,
  });

  console.log({
    data,
    code,
  });

  if (code === 0) {
    return data || [];
    // setCategoryList((data || []).map((item) => `${item.id}`));
  }

  return [];
};

/**
 * 分类管理弹窗
 * @param props
 * @constructor
 */
const CreateModal: React.FC<Props> = (props) => {
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const { visible, dictionary, onSubmit, onCancel } = props;

  useEffect(() => {
    console.log('r', { dictionary });
    if (!dictionary?.id) return;

    fetchCategoryList(dictionary.id!).then((list) => {
      setCategoryList(list.map((item) => `${item.id}`));
    });
  }, [visible]);

  return (
    <Modal
      destroyOnClose
      title={'分类管理'}
      open={visible}
      onCancel={() => {
        onCancel?.();
      }}
      onOk={async () => {
        const data = {
          dict_id: dictionary?.id,
          category_ids: categoryList.map((item) => +item).filter(Boolean),
        };
        const res = await handleRelative(data);

        if (res) {
          onSubmit?.(data);
        }
      }}
    >
      <div className="flex gap-2 flex-col">
        <MultiCategoryTreeSelect value={categoryList} onChange={(list) => setCategoryList(list)} />
        {/* <Button
          onClick={}
          type="primary"
        >
          确认
        </Button> */}
      </div>
    </Modal>
  );
};
export default CreateModal;
