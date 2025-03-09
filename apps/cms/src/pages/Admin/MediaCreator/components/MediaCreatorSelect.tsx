import React, { useMemo, useRef, useState } from 'react';
import { Button, Select, Space, Spin } from 'antd';
import type { SelectProps } from 'antd';
import debounce from 'lodash/debounce';
import { listMediaCreatorByPageUsingPost } from '@/services/backend/mediaCreatorController';
import WordImageEditor from '@/components/Word/WordImageEditor';
import { ProTable, type ProColumns } from '@ant-design/pro-components';
import PreviewModal from './PreviewModal';
import { values } from 'lodash';

export interface DebounceSelectProps<ValueType = API.MediaCreator>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

// DebounceSelect
function MediaCreatorSelectInner<
  ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
>({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
}

interface MediaCreatorOption extends API.MediaCreator {
  key: string;
  label: string;
  value: string;
}



type MediaCreatorSelectProp = {
  /** 锁定某个单词范围 */
  lockWordId?: number
  /** 锁定某个类别范围 */
  lockType?: API.MediaCreatorAddRequest['mediaType']
  /** 当确认的时候 */
  onChange?: (value: MediaCreatorOption[]) => void
}

export const MediaCreatorSelect = ({ onChange, lockWordId, lockType }: MediaCreatorSelectProp) => {
  const [value, setValue] = useState<MediaCreatorOption[]>([]);
  const [fetchResult, setFetchResult] = useState<MediaCreatorOption[]>([]);

  async function fetchDataList(key: string): Promise<MediaCreatorOption[]> {

    const res = await listMediaCreatorByPageUsingPost({
      wordId: lockWordId,
      mediaType: lockType,
      mediaUrl: key
    })

    const result = res.data?.records?.map(item => (
      {
        ...item,
        key: `${item.id}`,
        label: item.media_url!,
        value: `${item.id}`,
      }
    )) || []

    setFetchResult(result)

    return result;
  }

  const valueList = useMemo(() => {
    const keySets = value.map(item =>(item.value))

    return fetchResult.filter(item => item.value && keySets.includes(item.value))
  }, [value, fetchResult])

  const columns: ProColumns<MediaCreatorOption>[] = [
    {
      title: '序号',
      dataIndex: 'id',
      valueType: 'text',
    },
    {
      title: '图片',
      width: '200px',
      dataIndex: 'media_url',
      valueType: 'image',
      renderFormItem: () => <span>-</span>
    },
    {
      title: '详细预览',
      dataIndex: 'url',
      render(_, entity) {
        return <PreviewModal data={entity} />
      }
    },
  ];

  return (
    <div className='flex flex-col gap-4'>
      <MediaCreatorSelectInner
        mode="multiple"
        value={value}
        placeholder="搜索媒体/选择媒体"
        fetchOptions={fetchDataList}
        onChange={(newValue) => {
          setValue(newValue as MediaCreatorOption[]);
        }}
        style={{ width: '100%' }}
      />
      <ProTable
        rowKey="id"
        columns={columns}
        dataSource={valueList}
        toolBarRender={false}
        pagination={false}
        search={false}
        style={{ width: '100%' }}
      />
      <Button onClick={() => onChange?.(valueList)} disabled={!valueList.length} variant='solid' color='primary'>选择 {valueList.length ?? 0} 项</Button>
    </div>
  );
};
