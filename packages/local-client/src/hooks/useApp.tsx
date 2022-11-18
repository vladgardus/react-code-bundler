import { SpinnerDotted } from "spinners-react";
import React, { createContext, Dispatch, useEffect, useRef } from "react";
import { Toast, ToastMessageType } from "primereact/toast";

enum AppActions {
  SHOW_LOADING_SPINNER = "SHOW_LOADING_SPINNER",
  HIDE_LOADING_SPINNER = "HIDE_LOADING_SPINNER",
  SET_MOBILE = "SET_MOBILE",
}

interface AppContextState {
  state: typeof appInitialState;
  dispatch: Dispatch<{ type: AppActions; payload: any }>;
  showToastMessage: (message: ToastMessageType) => void;
}
const AppContext = createContext({} as AppContextState);

let appInitialState = {
  loadingSpinnerEnabled: false,
  isMobile: false,
};

function appReducer(state: any, action: { type: AppActions; payload: any }) {
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
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(appReducer, appInitialState);
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const handleWindowSizeChange = () => {
      dispatch({ type: AppActions.SET_MOBILE, payload: { isMobile: window.innerWidth < 768 } });
    };
    handleWindowSizeChange();
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const showToastMessage = (message: ToastMessageType) => {
    toast.current?.show(message);
  };

  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const value = { state, dispatch, showToastMessage };
  return (
    <AppContext.Provider value={value}>
      <Toast ref={toast} />
      {state.loadingSpinnerEnabled ? (
        <div
          className='loading-spinner-loverlay'
          style={{
            backgroundColor: "rgb(79 76 76 / 50%)",
            position: "fixed",
            inset: "0px",
            zIndex: 999,
          }}>
          <SpinnerDotted
            enabled={state.loadingSpinnerEnabled}
            size={100}
            color={"#df691a"}
            style={{
              top: "50%",
              left: "50%",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
              position: "absolute",
            }}
          />
        </div>
      ) : (
        <></>
      )}
      {children}
    </AppContext.Provider>
  );
}

function useApp() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context;
}

export { AppProvider, useApp };
