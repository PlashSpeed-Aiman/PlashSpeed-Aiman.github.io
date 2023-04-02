import logo from "./logo.svg";
import "./App.css";
import About from "./components/AboutNormal";
import Navbar from "./components/Navbar";
import Lambda from "./components/Lambda";
import { HashRouter,Router, Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
    <Navbar />
    <HashRouter>
    <Routes>
      <Route index path="/" element={<About />} />
      
      <Route path="/lambda" element={<Lambda />} />
      </Routes>    

      
      
    </HashRouter>
    
      
    
    </>
  );
}

export default App;
