import { Route, Routes } from "react-router-dom";
import Prefix from "./Prefix";
import Root from "./Root";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/:prefix/*" element={<Prefix />} />
    </Routes>
  );
}

export default App;
