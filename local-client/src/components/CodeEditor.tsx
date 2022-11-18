import MonacoEditor, { EditorProps, Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import { useRef, useCallback } from "react";
import "./CodeEditor.scss";
import { MonacoJsxSyntaxHighlight, getWorker } from "monaco-jsx-syntax-highlight";

interface CodeEditorProps {
  initialValue: string;
  onChange: (value: string | undefined, ev: monaco.editor.IModelContentChangedEvent) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const onMount: EditorProps["onMount"] = useCallback(async (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.Preserve,
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      esModuleInterop: true,
    });

    const monacoJsxSyntaxHighlight = new MonacoJsxSyntaxHighlight(getWorker(), monaco);
    const { highlighter, dispose } = monacoJsxSyntaxHighlight.highlighterBuilder({
      editor,
    });
    highlighter();
    editor.onDidChangeModelContent(() => {
      highlighter();
    });

    return dispose;
  }, []);

  const onFormatClick = () => {
    const unformatted = editorRef?.current?.getModel()?.getValue() ?? "";
    const formatted = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        useTabs: false,
        semi: true,
        singleQuote: true,
      })
      .replace(/\n$/g, "");
    editorRef?.current?.setValue(formatted);
  };
  return (
    <div className='editor-wrapper'>
      <button className='button button-format is-primary is-small' onClick={onFormatClick}>
        Format
      </button>
      <MonacoEditor
        value={initialValue}
        className='editor'
        height='100%'
        language={"javascript"}
        theme='vs-dark'
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
        onMount={onMount}
        onChange={onChange}
      />
    </div>
  );
};

export default CodeEditor;
