import { StrictMode } from "react";
import { render } from "react-dom";

function App() {
  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "sans-serif",
      }}
    >
      <h1>Hello from React</h1>
      <p>
        Edit <code>src/index.js</code> and save to reload.
      </p>
    </div>
  );
}

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
