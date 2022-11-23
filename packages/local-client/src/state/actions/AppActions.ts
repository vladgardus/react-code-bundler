export enum AppActions {
  SHOW_LOADING_SPINNER = "SHOW_LOADING_SPINNER",
  HIDE_LOADING_SPINNER = "HIDE_LOADING_SPINNER",
  SET_MOBILE = "SET_MOBILE",
}

export interface ShowLoadingSpinnerAction {
  type: AppActions.SHOW_LOADING_SPINNER;
}
export interface HideLoadingSpinnerAction {
  type: AppActions.HIDE_LOADING_SPINNER;
}
export interface SetMobileAction {
  type: AppActions.SET_MOBILE;
  payload: {
    isMobile: boolean;
  };
}

export type AppActionTypes = ShowLoadingSpinnerAction | HideLoadingSpinnerAction | SetMobileAction;
