import {useState} from 'react';
import './App.css';
import QRCodeScanner from "./components/QRCodeScanner";

function App() {

    return (
        <div id="App">
            <QRCodeScanner/>
        </div>
    )
}

export default App
