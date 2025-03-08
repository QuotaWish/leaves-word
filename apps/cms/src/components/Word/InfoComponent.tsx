import React, { useEffect, useState } from 'react';
import MonacoEditor, { monaco, type ChangeHandler, type EditorDidMount } from 'react-monaco-editor';
import './info-style.css'

interface InfoComponentProps {
  data: string;
  readonly?: boolean;
  onChange?: (newValue: string) => void;
  /** 内容更新时是否滚动到最新行 */
  scrollWithUpdate?: boolean;
}

const InfoComponent: React.FC<InfoComponentProps> = ({ data, readonly, scrollWithUpdate, onChange }) => {
  const [code, setCode] = useState('');
  const [editor, setEditor] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (data === null || data === undefined) return

    const value = `${data || ''}`

    setCode(value);

    setTimeout(() => {
      if (scrollWithUpdate) {
        editor?.setScrollTop(editor.getScrollHeight() - 950);
      }
    }, 100)
  }, [data])

  const editorDidMount: EditorDidMount = (editor) => {
    editor.focus();
    setEditor(editor)
  };

  const onInnerChange: ChangeHandler = (newValue) => {
    setCode(newValue);
    onChange?.(newValue);
  };

  const options = {
    readOnly: readonly ?? false,
    formatOnPaste: true,
    formatOnType: true,
    selectOnLineNumbers: true
  };

  return (
    <div className="WordInfoComponent">
      <MonacoEditor
        width="800"
        height="500"
        language="json"
        theme="vs-light"
        value={code}
        options={options}
        onChange={onInnerChange}
        editorDidMount={editorDidMount}
      />
    </div >
  );
};

export default InfoComponent;