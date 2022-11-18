import { useEffect, useState } from "react";
import { ResizableBox, ResizableBoxProps } from "react-resizable";
import "./Resizable.scss";
interface ResizableProps {
  direction: "horizontal" | "vertical";
  children?: React.ReactNode;
}
const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableProps: ResizableBoxProps;
  const [height, setHeight] = useState(window.innerHeight);
  const [width, setWidth] = useState(window.innerWidth);
  const [resizerWidth, setResizerWidth] = useState(window.innerWidth * 0.75);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const listener = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        setHeight(window.innerHeight);
        setWidth(window.innerWidth);
        if (window.innerWidth * 0.75 < resizerWidth) {
          setResizerWidth(window.innerWidth * 0.75);
        }
      }, 100);
    };
    window.addEventListener("resize", listener);
    return () => {
      window.removeEventListener("resize", listener);
      clearTimeout(timer);
    };
  }, [resizerWidth]);
  if (direction === "horizontal") {
    resizableProps = {
      className: "resize-horizontal",
      height: Infinity,
      width: resizerWidth,
      maxConstraints: [width * 0.75, Infinity],
      minConstraints: [width * 0.2, Infinity],
      resizeHandles: ["e"],
      onResizeStop: (_, data) => {
        setResizerWidth(data.size.width);
      },
    };
  } else {
    resizableProps = {
      className: "rezise-vertical",
      height: 300,
      width: Infinity,
      maxConstraints: [Infinity, height * 0.9],
      minConstraints: [Infinity, 32],
      resizeHandles: ["s"],
    };
  }
  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
