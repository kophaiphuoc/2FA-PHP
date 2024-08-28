import React, { useState, useRef, useEffect } from 'react';
import '../styles/QRCodeScanner.css';
import {CaptureScreenAndScanQR, HandlerSecret} from "../../wailsjs/go/app/App";

const QRCodeScanner: React.FC = () => {
    const [dragging, setDragging] = useState<boolean>(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (dragging && containerRef.current) {
                setPosition({
                    x: event.clientX - containerRef.current.offsetWidth / 2,
                    y: event.clientY - containerRef.current.offsetHeight / 2,
                });
            }
        };

        const handleMouseUp = () => {
            setDragging(false);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging]);

    const handleMouseDown = () => {
        setDragging(true);
    };

    return (
        // <div
        //     ref={containerRef}
        //     className="qr-scanner-container"
        //     style={{ left: `${position.x}px`, top: `${position.y}px` }}
        //     onMouseDown={handleMouseDown}
        // >
        // </div>
        <>
            <div className="qr-scanner-container">
                <div style={{width: 50, height: 50, border: 1, borderStyle: "solid", borderRadius: 50, marginTop: 400}}
                     onClick={HandlerSecret}/>
            </div>

        </>
    );
};

export default QRCodeScanner;
