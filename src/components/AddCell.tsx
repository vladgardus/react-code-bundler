import { CellsActions, useCells } from "../hooks/useCells";
import "./AddCell.scss";

interface AddCellProps {
  previousCellId: string | null;
}

const AddCell: React.FC<AddCellProps> = ({ previousCellId }) => {
  const { dispatch } = useCells();
  return (
    <div className='add-cell-wrapper'>
      <div className='add-buttons'>
        <button className='button is-rounded is-primary is-small' onClick={() => dispatch({ type: CellsActions.INSERT_CELL_AFTER, payload: { id: previousCellId, type: "code" } })}>
          <i className='pi pi-plus' />
          Code
        </button>
        <button className='button is-rounded is-primary is-small' onClick={() => dispatch({ type: CellsActions.INSERT_CELL_AFTER, payload: { id: previousCellId, type: "text" } })}>
          <i className='pi pi-plus' />
          Text
        </button>
      </div>

      <div className='divider'></div>
    </div>
  );
};

export default AddCell;
