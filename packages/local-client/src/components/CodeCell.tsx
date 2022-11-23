import { useEffect, useMemo } from "react";
import CodeEditor from "./CodeEditor";
import CodePreview from "./CodePreview";
import Resizable from "./Resizable";
import "./CodeCell.scss";
import { Cell } from "../model/Cell";
import { useCells } from "../hooks/useCells";
import { SpinnerDotted } from "spinners-react";
import { useCumulativeCode } from "../hooks/useCumulativeCode";
import { CellsActions } from "../state/actions/CellActions";

interface CodeCellProps {
  cell: Cell;
}

const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const { state, dispatch, createBundle } = useCells();
  const bundle = useMemo(() => {
    return state.bundles[cell.id];
  }, [cell, state.bundles]);
  const cumulativeCode = useCumulativeCode(cell.id);

  useEffect(() => {
    if (!bundle) {
      createBundle(cell.id, cumulativeCode);
      return;
    }
    const timer = setTimeout(async () => {
      createBundle(cell.id, cumulativeCode);
    }, 750);
    return () => {
      clearTimeout(timer);
    };
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell, cumulativeCode, createBundle]);

  return (
    <Resizable direction='vertical'>
      <div className='resizable-wrapper'>
        <Resizable direction='horizontal'>
          <CodeEditor initialValue={cell.content} onChange={(val) => dispatch({ type: CellsActions.UPDATE_CELL, payload: { id: cell.id, content: val ?? "" } })} />
        </Resizable>
        {!bundle || bundle.loading ? (
          <div className='loading-spinner-overlay'>
            <SpinnerDotted className='loading-spinner-element' enabled={true} size={100} color={"#df691a"} />
          </div>
        ) : (
          <CodePreview code={bundle.code} err={bundle.err} />
        )}
      </div>
    </Resizable>
  );
};

export default CodeCell;
