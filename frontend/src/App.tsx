import { Route, Routes } from "react-router-dom";
import Prefix from "./Prefix";
import Root from "./Root";
import { ToastContextProvider } from "./ToastContext";

function App() {
  return (
    <ToastContextProvider>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/:prefix/*" element={<Prefix />} />
      </Routes>
    </ToastContextProvider>
  );
}

export default App;
