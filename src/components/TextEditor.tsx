import MDEditor from "@uiw/react-md-editor";
import { useEffect, useRef, useState } from "react";
import { CellsActions, useCells } from "../hooks/useCells";
import { Cell } from "../model/Cell";
import "./TextEditor.scss";
interface TextEditorProps {
  cell: Cell;
}
const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const [editing, setEditing] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { dispatch } = useCells();
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (wrapperRef.current && event.target && wrapperRef.current.contains(event.target as Node)) return;
      setEditing(false);
    };
    document.addEventListener("click", listener, { capture: true });
    return () => {
      document.removeEventListener("click", listener, { capture: true });
    };
  }, []);

  return (
    <div ref={wrapperRef} onClick={() => setEditing(true)} className='text-editor card'>
      <div className='card-content'>
        {editing ? (
          <MDEditor value={cell.content} onChange={(val) => dispatch({ type: CellsActions.UPDATE_CELL, payload: { id: cell.id, content: val ?? "" } })} />
        ) : (
          <MDEditor.Markdown source={cell.content === "" ? "Click to edit" : cell.content} />
        )}
      </div>
    </div>
  );
};

export default TextEditor;
