import { SpinnerDotted } from "spinners-react";
import React, { createContext, Dispatch, useEffect, useRef } from "react";
import { Toast, ToastMessageType } from "primereact/toast";
import { AppActions, AppActionTypes } from "../state/actions/AppActions";
import { appReducer } from "../state/reducers/AppReducer";

interface AppContextState {
  state: typeof appInitialState;
  dispatch: Dispatch<AppActionTypes>;
  showToastMessage: (message: ToastMessageType) => void;
}
const AppContext = createContext({} as AppContextState);

let appInitialState = {
  loadingSpinnerEnabled: false,
  isMobile: false,
};

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
