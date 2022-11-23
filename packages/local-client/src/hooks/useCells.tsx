import React, { createContext, Dispatch, useCallback } from "react";
import { Cell } from "../model/Cell";
import bundler from "../bundler";
import { CellActionTypes, CellsActions } from "../state/actions/CellActions";
import { cellsReducer } from "../state/reducers/CellReducer";
import axios from "axios";
import { useApp } from "./useApp";
import { AppActions } from "../state/actions/AppActions";
import { beforeStateChangeMiddlewares, afterStateChangeMiddlewares } from "../state/middlewares";
import { useReducerWithMiddleware } from "./useReducerWithMiddleware";
import { BaseInitialState } from "../state/BaseInitialState";

export interface CellsInitialState extends BaseInitialState<CellActionTypes> {
  data: { [key: string]: Cell };
  error: string;
  order: string[];
  bundles: { [key: string]: { loading: boolean; code: string; err: string } | undefined };
}

export let cellsInitialState: CellsInitialState = {
  data: {},
  error: "",
  order: [],
  bundles: {},
};
export interface CellsContextState {
  state: CellsInitialState;
  dispatch: Dispatch<CellActionTypes>;
  createBundle: (id: string, input: string) => void;
  fetchCells: () => void;
  saveCells: () => void;
}

const CellsContext = createContext({} as CellsContextState);

function CellsProvider({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useReducerWithMiddleware<CellsInitialState, CellActionTypes>(cellsReducer, cellsInitialState, beforeStateChangeMiddlewares, afterStateChangeMiddlewares);
  const appContext = useApp();
  const createBundle = useCallback(async (id: string, input: string) => {
    dispatch({ type: CellsActions.BUNDLE_START, payload: { id } });
    let bundle = await bundler(input);
    dispatch({ type: CellsActions.BUNDLE_COMPLETE, payload: { id, bundle } });
  }, []);

  const fetchCells = useCallback(async () => {
    dispatch({ type: CellsActions.FETCH_CELLS });
    appContext.dispatch({ type: AppActions.SHOW_LOADING_SPINNER });
    try {
      const { data } = await axios.get<Cell[]>("/cells");
      dispatch({ type: CellsActions.FETCH_CELLS_COMPLETE, payload: data });
      appContext.dispatch({ type: AppActions.HIDE_LOADING_SPINNER });
    } catch (err) {
      if (err instanceof Error) {
        dispatch({ type: CellsActions.FETCH_CELLS_ERROR, payload: err.message });
      }
      appContext.dispatch({ type: AppActions.HIDE_LOADING_SPINNER });
    }
  }, [appContext]);

  const saveCells = useCallback(async () => {
    try {
      const { data, order } = state;
      const cells = order.map((id) => data[id]);
      await axios.post("/cells", { cells });
    } catch (err) {
      if (err instanceof Error) {
        dispatch({ type: CellsActions.SAVE_CELLS_ERROR, payload: err.message });
      }
    }
  }, [state]);

  const value = { state, dispatch, createBundle, fetchCells, saveCells };

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
