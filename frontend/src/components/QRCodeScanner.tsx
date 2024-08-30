import React from 'react';
import '../styles/QRCodeScanner.css';
import Cancel from '../assets/images/cancel.png';
import { useNavigate } from 'react-router-dom';
import { CaptureScreenAndScanQR, GetOTPAndTimeExp,AddTwoFA } from "../../wailsjs/go/app/App";
import { toast } from "react-toastify";

interface OTPAndTimeExp {
    Otp: string;
    TimeExp: number;
    Secret: string;
}

const QRCodeScanner = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    const scanSucess = (id:number) => {
        navigate('/form2fa', { state: { id }})
    }

    const handlerQrCode = async () => {
        try {
            const code = await CaptureScreenAndScanQR();

            const result: OTPAndTimeExp = await GetOTPAndTimeExp(code) as OTPAndTimeExp;

            if (result.TimeExp === 0) {
                toast.error("Not support");
            } else {
                const id = await AddTwoFA(1, "", "", result.Secret,"")
                scanSucess(id)
            }
        } catch (error) {
            toast.error(error+"");
        }
    };

    return (
        <div className="qr-scanner">
            <div className="scan-area">
                <div className="scan-frame">
                    <div className="scan-line"></div>
                    <img onClick={handleGoBack} src={Cancel} style={{ width: 20, height: 20, position: 'absolute', right: 10, top: 10 }} />
                </div>
            </div>
            <div onClick={handlerQrCode} style={{ flex: 1, alignItems: 'center', justifyContent: "center", display: 'flex' }}>
                <div style={{ width: 50, height: 50, borderWidth: 3, borderStyle: "solid", borderRadius: 30, borderColor: "green" }} />
            </div>
        </div>
    );
};

export default QRCodeScanner;
