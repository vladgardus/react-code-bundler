import { useCells } from "./useCells";

export const useCumulativeCode = (cellId: string) => {
  const { state } = useCells();
  const { data, order } = state;
  let idx = order.indexOf(cellId);
  const showFunction = `
    import _React from "react";
    import _ReactDOM from "react-dom";
    var show = (value) => { 
      const root = document.querySelector('#root');
      if(typeof value == 'object') {
        if(value.$$typeof && value.props) _ReactDOM.render(value, root);
        else root.innerHTML = JSON.stringify(value);
      }
      else root.innerHTML = value; 
    }
    `;
  const showFunctionNoop = "var show = () => {}";
  return order
    .slice(0, idx + 1)
    .map((id) => data[id])
    .filter((item) => item.type === "code")
    .map((item) => (item.id === cellId ? showFunction : showFunctionNoop) + "\n" + item.content)
    .join("\n");
};
