import { CellsActions, useCells } from "../hooks/useCells";
import "./ActionBar.scss";

interface ActionBarProps {
  id: string;
}
const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const { dispatch } = useCells();
  return (
    <div className='action-bar-wrapper'>
      <button onClick={() => dispatch({ type: CellsActions.MOVE_CELL, payload: { id, direction: "up" } })}>
        <i className='pi pi-arrow-up'></i>
      </button>
      <button onClick={() => dispatch({ type: CellsActions.MOVE_CELL, payload: { id, direction: "down" } })}>
        <i className='pi pi-arrow-down'></i>
      </button>
      <button onClick={() => dispatch({ type: CellsActions.DELETE_CELL, payload: { id } })}>
        <i className='pi pi-trash'></i>
      </button>
    </div>
  );
};

export default ActionBar;
