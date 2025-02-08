import { addEnglishWordUsingPost } from '@/services/backend/englishWords';
import { ProColumns } from '@ant-design/pro-components';
import '@umijs/max';
import React from 'react';
import InnerModal from './InnerModal';
import '@umijs/max';

interface Props {
  visible: boolean;
  columns: ProColumns<API.EnglishWord>[];
  onSubmit: (values: API.EnglishWordAddRequest) => void;
  onCancel: () => void;
}

/**
 * 创建弹窗
 * @param props
 * @constructor
 */
const CreateModal: React.FC<Props> = (props) => {
  const { visible, onSubmit, onCancel } = props;

  return (
    <InnerModal
      visible={visible}
      onCancel={() => {
        onCancel?.();
      }}
      onSubmit={async (values) => {
        const success = await addEnglishWordUsingPost(values);
        if (success) {
          onSubmit?.(values);
          return true;
        }

        return false;
      }}
    ></InnerModal>
  );
};

export default CreateModal;
