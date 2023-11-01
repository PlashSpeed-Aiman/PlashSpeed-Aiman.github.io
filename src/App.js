import logo from "./logo.svg";
import "./App.css";
import About from "./components/AboutNew";
import Navbar from "./components/Navbar";
import Lambda from "./components/Lambda";
import { HashRouter,Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <div className="mx-auto max-w-3xl items-center">
        <Navbar />

        <Routes>
          <Route index path="/" element={<About />} />
          <Route path="/lambda" element={<Lambda />} />
        </Routes>
      </div>

    
    </>
  );
}

export default App;
