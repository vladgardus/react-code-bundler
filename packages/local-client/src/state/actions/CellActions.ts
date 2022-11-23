import { Cell } from "../../model/Cell";

export enum CellsActions {
  MOVE_CELL = "MOVE_CELL",
  DELETE_CELL = "DELETE_CELL",
  INSERT_CELL_BEFORE = "INSERT_CELL_BEFORE",
  INSERT_CELL_AFTER = "INSERT_CELL_AFTER",
  UPDATE_CELL = "UPDATE_CELL",
  BUNDLE_START = "BUNDLE_START",
  BUNDLE_COMPLETE = "BUNDLE_COMPLETE",
  FETCH_CELLS = "FETCH_CELLS",
  FETCH_CELLS_COMPLETE = "FETCH_CELLS_COMPLETE",
  FETCH_CELLS_ERROR = "FETCH_CELLS_ERROR",
  SAVE_CELLS_ERROR = "SAVE_CELLS_ERROR",
}

export interface BaseAction {
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
export interface FetchCellsAction {
  type: CellsActions.FETCH_CELLS;
}
export interface FetchCellsCompleteAction {
  type: CellsActions.FETCH_CELLS_COMPLETE;
  payload: Cell[];
}
export interface FetchCellsErrorAction {
  type: CellsActions.FETCH_CELLS_ERROR;
  payload: string;
}

export interface SaveCellsErrorAction {
  type: CellsActions.SAVE_CELLS_ERROR;
  payload: string;
}

export type CellActionTypes =
  | MoveCellAction
  | DeleteCellAction
  | InsertCellBeforeAction
  | InsertCellAfterAction
  | UpdateCellAction
  | BundleStartAction
  | BundleCompleteAction
  | FetchCellsAction
  | FetchCellsCompleteAction
  | FetchCellsErrorAction
  | SaveCellsErrorAction;
