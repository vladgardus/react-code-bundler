import { Cell } from "../model/Cell";
import CodeCell from "../components/CodeCell";
import TextEditor from "../components/TextEditor";
import ActionBar from "./ActionBar";
import "./CellListItem.scss";

interface CellListItemProps {
  cell: Cell;
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  return (
    <div className='cell-list-item-wrapper'>
      <ActionBar id={cell.id} />
      <div className="header-separator"></div>
      {cell.type === "code" ? <CodeCell cell={cell} /> : <TextEditor cell={cell} />}
    </div>
  );
};

export default CellListItem;
