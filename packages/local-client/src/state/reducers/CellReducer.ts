import { CellsInitialState } from "../../hooks/useCells";
import { Cell } from "../../model/Cell";
import { CellActionTypes, CellsActions } from "../actions/CellActions";
import { v4 as uuid } from "uuid";

export function cellsReducer(state: CellsInitialState, action: CellActionTypes) {
  state = { ...state, lastAction: action };
  switch (action.type) {
    case CellsActions.MOVE_CELL: {
      const { id, direction } = action.payload;
      const index = state.order.findIndex((item) => item === id);
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex > state.order.length - 1) return state;
      const newOrder = [...state.order];
      newOrder[index] = newOrder[targetIndex];
      newOrder[targetIndex] = id;
      return { ...state, order: newOrder };
    }
    case CellsActions.DELETE_CELL: {
      const { id } = action.payload;
      let newData = { ...state.data };
      delete newData[id];
      return { ...state, data: newData, order: [...state.order.filter((item) => item !== id)] };
    }
    case CellsActions.UPDATE_CELL: {
      const { id, content } = action.payload;
      return { ...state, data: { ...state.data, [id]: { ...state.data[id], content } } };
    }
    case CellsActions.INSERT_CELL_BEFORE: {
      const { id, type } = action.payload;
      const cell: Cell = {
        content: "",
        type: type,
        id: uuid(),
      };
      let index = state.order.findIndex((item) => item === id);
      let newOrder = [...state.order];
      if (index < 0) {
        newOrder.push(cell.id);
      } else {
        newOrder.splice(index, 0, cell.id);
      }
      return { ...state, data: { ...state.data, [cell.id]: cell }, order: [...newOrder] };
    }
    case CellsActions.INSERT_CELL_AFTER: {
      const { id, type } = action.payload;
      const cell: Cell = {
        content: "",
        type: type,
        id: uuid(),
      };
      let index = state.order.findIndex((item) => item === id);
      let newOrder = [...state.order];
      if (index < 0) {
        newOrder.unshift(cell.id);
      } else {
        newOrder.splice(index + 1, 0, cell.id);
      }
      return { ...state, data: { ...state.data, [cell.id]: cell }, order: [...newOrder] };
    }
    case CellsActions.BUNDLE_START: {
      const { id } = action.payload;
      return { ...state, bundles: { ...state.bundles, [id]: { loading: true, code: "", err: "" } } };
    }
    case CellsActions.BUNDLE_COMPLETE: {
      const {
        id,
        bundle: { code, err },
      } = action.payload;
      return { ...state, bundles: { ...state.bundles, [id]: { loading: false, code, err } } };
    }
    case CellsActions.FETCH_CELLS: {
      return { ...state, error: "" };
    }
    case CellsActions.FETCH_CELLS_ERROR: {
      return { ...state, error: action.payload };
    }
    case CellsActions.FETCH_CELLS_COMPLETE: {
      const cells = action.payload;
      return {
        ...state,
        error: "",
        order: cells.map((item) => item.id),
        data: cells.reduce<typeof state.data>((acc, item) => {
          acc[item.id] = item;
          return acc;
        }, {}),
        lastAction: action,
      };
    }
    case CellsActions.SAVE_CELLS_ERROR: {
      return { ...state, error: action.payload };
    }
    default: {
      return state;
    }
  }
}
