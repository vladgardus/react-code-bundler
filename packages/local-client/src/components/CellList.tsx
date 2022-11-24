import { useCells } from "../hooks/useCells";
import { Fragment, useEffect, useMemo } from "react";
import CellListItem from "./CellListitem";
import "./CellList.scss";
import AddCell from "./AddCell";
interface CellListProps {
  children?: React.ReactNode;
}

const CellList: React.FC<CellListProps> = () => {
  const { state, fetchCells } = useCells();
  const cells = useMemo(() => {
    return state.order.map((id) => state.data[id]);
  }, [state.data, state.order]);

  useEffect(() => {
    fetchCells();
  }, [fetchCells]);

  return (
    <div className='cell-list-wrapper'>
      <AddCell previousCellId={null} />
      {cells.map((cell) => (
        <Fragment key={cell.id}>
          <CellListItem cell={cell} />
          <AddCell previousCellId={cell.id} />
        </Fragment>
      ))}
    </div>
  );
};

export default CellList;
