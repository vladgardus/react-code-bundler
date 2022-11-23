import { AppActions, AppActionTypes } from "../actions/AppActions";

export function appReducer(state: any, action: AppActionTypes) {
  switch (action.type) {
    case AppActions.SHOW_LOADING_SPINNER: {
      return { ...state, loadingSpinnerEnabled: true };
    }
    case AppActions.HIDE_LOADING_SPINNER: {
      return { ...state, loadingSpinnerEnabled: false };
    }
    case AppActions.SET_MOBILE: {
      const { isMobile } = action.payload;
      return { ...state, isMobile };
    }
    default: {
      throw new Error(`Unhandled action type: ${action}`);
    }
  }
}
