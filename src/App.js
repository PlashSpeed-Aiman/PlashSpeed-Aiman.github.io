import "./App.css";
import About from "./components/AboutNew";
import Navbar from "./components/Navbar";
import Lambda from "./components/Gerakan/Lambda";
import {Route, Routes} from "react-router-dom";
import AboutGerakan from "./components/Gerakan/AboutGerakan";
import NotFound from "./components/NotFound";
import QrCode from "./components/Utilities/QrCode";
import {WhatsApp} from "./components/Utilities/WhatsApp";
import Activities from "./components/Gerakan/Activities";

function App() {
    return (
        <>
            <div className="flex flex-col h-screen justify-between ">
                <div className='max-w-3xl mx-auto'>
                    <Navbar/>
                </div>

                <div className="mx-auto max-w-3xl items-center">

                    <Routes>
                        <Route index path="/" element={<About/>}/>
                        <Route path="/lambda" element={<Lambda/>}/>
                        <Route path="/gerakan" element={<AboutGerakan/>}/>
                        <Route path="/activities" element={<Activities/>}/>
                        <Route path="*" element={<NotFound/>}/>
                        <Route path="/qr" element={<QrCode/>}/>
                        <Route path="/whatsapp-tool" element={<WhatsApp/>}/>
                    </Routes>

                </div>
                <footer className="bg-orange-600 text-center md:lg:text-start text-lg text-white p-2 ">
                    Welkom bij mijn website! Ik ben een Developer.
                    <br/>
                    Aiman Rahim 2023
                </footer>
            </div>
        </>
    );
}

export default App;
