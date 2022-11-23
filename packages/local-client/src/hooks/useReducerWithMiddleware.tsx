import { useCallback, useEffect, useReducer } from "react";
import { BaseInitialState } from "../state/BaseInitialState";

export const useReducerWithMiddleware = <TInitialState extends BaseInitialState<TAction>, TAction>(
  reducer: React.Reducer<TInitialState, TAction>,
  initialState: TInitialState,
  middlewares?: ((state: TInitialState) => void)[],
  afterDispatchMiddleWares?: ((state: TInitialState) => void)[]
) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    afterDispatchMiddleWares?.map((middleware) => middleware(state));
  }, [afterDispatchMiddleWares, state]);

  const dispatchUsingMiddleware = useCallback(
    (action: TAction) => {
      middlewares?.map((middleware) => middleware(state));
      dispatch(action);
    },
    [middlewares, state]
  );
  return { state, dispatch: dispatchUsingMiddleware };
};
