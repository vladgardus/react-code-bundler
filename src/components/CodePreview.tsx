import { useEffect, useRef } from "react";
import "./CodePreview.scss";

interface CodePreviewProps {
  code: string;
  err: string;
}
const html = `<html>
<head>
<style>html { background-color: white }</style>
</head>
<body>
  <div id="root"></div>
  <script>
    const handleError = (err) => {
        const root = document.querySelector("#root");
        root.innerHTML = "<div style='color: red'><h4>Runtime Error<h4/>" + err + "</div>";
        console.error(err);
    };
    window.addEventListener("error", (event) => {
        event.preventDefault();
        handleError(event.error);
    });
    window.addEventListener("message", ({data}) => {
      try {
        eval(data);
      } catch (err) {
        handleError(err);
      }
    }, false);
  </script>
</body>
</html>`;
const CodePreview: React.FC<CodePreviewProps> = ({ code, err }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = html;
      setTimeout(() => {
        iframeRef?.current?.contentWindow?.postMessage(code, "*");
      }, 50);
    }
  }, [code]);
  return (
    <div className='code-preview-wrapper'>
      <iframe title='Code Preview' ref={iframeRef} srcDoc={html} sandbox='allow-scripts'></iframe>
      {err && (
        <div className='preview-error-wrapper'>
          <div className='preview-error-header'>Bundling Error</div>
          <div className='preview-error-message'>{err}</div>
        </div>
      )}
    </div>
  );
};

export default CodePreview;
