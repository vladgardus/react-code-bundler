import React, { createContext, Dispatch, useCallback } from "react";
import { Cell } from "../model/Cell";
import { v4 as uuid } from "uuid";
import bundler from "../bundler";

export enum CellsActions {
  MOVE_CELL = "MOVE_CELL",
  DELETE_CELL = "DELETE_CELL",
  INSERT_CELL_BEFORE = "INSERT_CELL_BEFORE",
  INSERT_CELL_AFTER = "INSERT_CELL_AFTER",
  UPDATE_CELL = "UPDATE_CELL",
  BUNDLE_START = "BUNDLE_START",
  BUNDLE_COMPLETE = "BUNDLE_COMPLETE",
}

let cellsInitialState: {
  data: { [key: string]: Cell };
  order: string[];
  bundles: { [key: string]: { loading: boolean; code: string; err: string } | undefined };
} = {
  data: {},
  order: [],
  bundles: {},
};
interface CellsContextState {
  state: typeof cellsInitialState;
  dispatch: Dispatch<ActionTypes>;
  createBundle: (id: string, input: string) => void;
}
interface BaseAction {
  type: CellsActions;
  payload: { id: Cell["id"] };
}
export interface MoveCellAction extends BaseAction {
  type: CellsActions.MOVE_CELL;
  payload: BaseAction["payload"] & { direction: "up" | "down" };
}
export interface DeleteCellAction extends BaseAction {
  type: CellsActions.DELETE_CELL;
}
export interface InsertCellBeforeAction {
  type: CellsActions.INSERT_CELL_BEFORE;
  payload: { id: string | null; type: Cell["type"] };
}
export interface InsertCellAfterAction {
  type: CellsActions.INSERT_CELL_AFTER;
  payload: { id: string | null; type: Cell["type"] };
}
export interface UpdateCellAction extends BaseAction {
  type: CellsActions.UPDATE_CELL;
  payload: BaseAction["payload"] & {
    content: Cell["content"];
  };
}
export interface BundleStartAction extends BaseAction {
  type: CellsActions.BUNDLE_START;
}
export interface BundleCompleteAction extends BaseAction {
  type: CellsActions.BUNDLE_COMPLETE;
  payload: BaseAction["payload"] & {
    bundle: { code: string; err: string };
  };
}

export type ActionTypes = MoveCellAction | DeleteCellAction | InsertCellBeforeAction | InsertCellAfterAction | UpdateCellAction | BundleStartAction | BundleCompleteAction;

const CellsContext = createContext({} as CellsContextState);

function cellsReducer(state: typeof cellsInitialState, action: ActionTypes) {
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
    default: {
      return state;
    }
  }
}

function CellsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(cellsReducer, cellsInitialState);

  const createBundle = useCallback(
    async (id: string, input: string) => {
      dispatch({ type: CellsActions.BUNDLE_START, payload: { id } });
      let bundle = await bundler(input);
      dispatch({ type: CellsActions.BUNDLE_COMPLETE, payload: { id, bundle } });
    },
    [dispatch]
  );

  const value = { state, dispatch, createBundle };

  return <CellsContext.Provider value={value}>{children}</CellsContext.Provider>;
}

function useCells() {
  const context = React.useContext(CellsContext);
  if (context === undefined) {
    throw new Error("useCells must be used within a CellsProvider");
  }
  return context;
}

export { CellsProvider, useCells };
