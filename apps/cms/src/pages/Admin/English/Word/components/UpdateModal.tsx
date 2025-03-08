import { updateEnglishWordUsingPost } from '@/services/backend/englishWords';
import { ProColumns } from '@ant-design/pro-components';
import '@umijs/max';
import React, { useMemo } from 'react';
import InnerModal from './InnerModal';

interface Props {
  oldData?: API.EnglishWord;
  visible: boolean;
  columns: ProColumns<API.EnglishWord>[];
  onSubmit: (values: API.EnglishWordUpdateRequest) => void;
  onCancel: () => void;
}

/**
 * 更新弹窗
 * @param props
 * @constructor
 */
const UpdateModal: React.FC<Props> = (props) => {
  const innerRender = useMemo(() => {
    const { oldData, visible, onSubmit, onCancel } = props;

    if (!oldData) {
      return <></>;
    }

    return (
      <InnerModal
        visible={visible}
        onCancel={() => {
          onCancel?.();
        }}
        oldData={oldData}
        onSubmit={async (values: API.EnglishWordUpdateRequest) => {
          const success = await updateEnglishWordUsingPost({
            ...values,
            id: oldData.id as any,
          });
          if (success) {
            onSubmit?.(values);

            return true;
          }

          return false;
        }}>

      </InnerModal>
      // <Drawer
      //   destroyOnClose
      //   title={'编辑'}
      //   placement="right"
      //   width="85%"
      //   onClose={() => {
      //     onCancel?.();
      //   }}
      //   open={visible}
      // >
      //   <ProTable
      //     type="form"
      //     columns={columns}
      //     form={{
      //       initialValues: oldData,
      //     }}

      //   />
      // </Drawer>
    );
  }, [props])

  return innerRender
};
export default UpdateModal;
