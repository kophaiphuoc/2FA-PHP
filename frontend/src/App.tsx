import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import QRCodeScanner from "./components/QRCodeScanner";
import Home from './components/Home';
import Input2FA from './components/Input2FA';
import { ToastContainer } from 'react-toastify';
import './App.css';
function App() {

    return (
        <div id="App" style={{ backgroundColor: "#1e1e1e" }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/2fa" element={<QRCodeScanner />} />
                    <Route path="/form2fa" element={<Input2FA />} />
                </Routes>
            </BrowserRouter>
            <ToastContainer />
        </div>
    )
}

export default App
