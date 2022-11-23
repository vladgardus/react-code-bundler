import axios, { AxiosResponse } from "axios";
import { CellsInitialState } from "../../hooks/useCells";
import { CellActionTypes, CellsActions, DeleteCellAction, InsertCellAfterAction, InsertCellBeforeAction, MoveCellAction, UpdateCellAction } from "../actions/CellActions";
import _debounce from "lodash/debounce";
import { Cell } from "../../model/Cell";
import { DebouncedFunc } from "lodash";

type AcceptedTypes = MoveCellAction | UpdateCellAction | InsertCellAfterAction | InsertCellBeforeAction | DeleteCellAction;

function isInAcceptedTypes(action: CellActionTypes): action is AcceptedTypes {
  return [CellsActions.MOVE_CELL, CellsActions.UPDATE_CELL, CellsActions.INSERT_CELL_AFTER, CellsActions.INSERT_CELL_BEFORE, CellsActions.DELETE_CELL].includes(action.type);
}

const postCells = (cells: Cell[]) => {
  return _debounce(() => axios.post("/cells", { cells }), 350);
};

let lastCall: DebouncedFunc<() => Promise<AxiosResponse<any, any>>>;

export const persistMiddleware = async (state: CellsInitialState) => {
  const action = state.lastAction;
  if (action && isInAcceptedTypes(action)) {
    try {
      const { data, order } = state;
      const cells = order.map((id) => data[id]);
      if (lastCall) lastCall.cancel();
      lastCall = postCells(cells);
      lastCall();
    } catch (err) {
      if (err instanceof Error) {
        // dispatch({ type: CellsActions.SAVE_CELLS_ERROR, payload: err.message });
      }
    }
  }
};
