import { listRecordUsingGet } from '@/services/backend/wordStatusChangeController';
import '@umijs/max';
import { Button, Modal, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useCallback, useEffect, useState } from 'react';
import dayjs from 'dayjs';

interface Props {
  wordId?: number;
  visible: boolean;
  onClose: () => void;
}

/**
 * 状态变动记录弹窗
 * @param props
 * @constructor
 */
const StatusHistoryModal: React.FC<Props> = (props) => {
  const { visible, onClose, wordId } = props;
  const [records, setRecords] = useState<API.WordStatusChange[]>([]);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<string>('');

  const fetchData = useCallback(async () => {
    if (!wordId || !visible) {
      return;
    }

    const { data, code } = await listRecordUsingGet({
      wordId,
    });
    if (code === 0) {
      setRecords(data);
    }
  }, [wordId, visible]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const columns: ColumnsType<API.WordStatusChange> = [
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'APPROVED' ? 'green' : 'blue'}>{status}</Tag>
      ),
    },
    {
      title: '备注',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '详情',
      dataIndex: 'info',
      key: 'info',
      render: (info: string) => (
        <Button
          type="link"
          onClick={() => {
            setSelectedInfo(info);
            setInfoModalVisible(true);
          }}
        >
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <>
      <Modal
        destroyOnClose
        title={'状态变动记录'}
        open={visible}
        footer={null}
        onCancel={() => {
          onClose?.();
        }}
        width={800}
      >
        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          pagination={false}
        />
      </Modal>

      <Modal
        title="详细信息"
        open={infoModalVisible}
        footer={null}
        onCancel={() => setInfoModalVisible(false)}
      >
        <div>{selectedInfo || '暂无详细信息'}</div>
      </Modal>
    </>
  );
};

export default StatusHistoryModal;
