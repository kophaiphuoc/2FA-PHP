import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Copy from "../assets/images/duplicate.png"
import {GetOTPAndTimeExp} from "../../wailsjs/go/app/App";

interface CardOtpProps {
    logo: string;
    name: string;
    secret: string;
    otp: string;
    priority: number;
    timeExp: number;
    domain:string;
}

interface OTPAndTimeExp {
    Otp: string;
    TimeExp: number;
    Secret: string;
}


function CardOtp({ logo, name, secret, otp, timeExp,domain }: CardOtpProps) {
    const [countdown, setCountdown] = useState(timeExp);
    const [isOtp, setOtp] = useState(otp);

// Hàm xử lý khi countdown về 0
    const handleCountdownFinish = async () => {
        try {
            const result: OTPAndTimeExp = await GetOTPAndTimeExp(secret) as OTPAndTimeExp;
            setCountdown(result.TimeExp);
            setOtp(result.Otp);
        } catch (error) {
            console.error('Error fetching OTP and time:', error);
        }
    };

    useEffect(() => {
        // Hàm giảm countdown
        const tick = () => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    // Khi countdown đạt 0, dừng interval và gọi hàm xử lý
                    handleCountdownFinish();
                    return 0;
                }
                return prevCountdown - 1;
            });
        };

        // Khởi tạo countdown lần đầu
        const fetchOTPAndTime = async () => {
            await handleCountdownFinish(); // Lấy dữ liệu OTP và thời gian ngay lập tức
        };

        fetchOTPAndTime();

        // Thiết lập interval để giảm countdown mỗi giây
        const intervalId = setInterval(tick, 1000);

        // Dọn dẹp interval khi component unmount
        return () => clearInterval(intervalId);
    }, [secret]); // Dependency array chứa `secret` để cập nhật khi secret thay đổi

    const handleCopy = (otp: string) => {
        navigator.clipboard.writeText(otp)
            .then(() => toast("Copy success", {
                position: "top-left",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                type: "success",
                style: { width: 330, top: 40, marginTop: 5 }
            }))
            .catch(() => toast("Copy failed", {
                position: "top-left",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                type: "error"
            }));
    };

    return (
        <div style={{ width: '100%', backgroundColor: '#323232', display: 'flex', borderRadius: 5, marginTop: 10 }}>
            <img src={logo} style={{ width: 50, borderRadius: 5 }} alt="logo" />
            <div style={{ flex: 1, display: 'flex', height: 50 }}>
                <div style={{ display: 'flex', flexDirection: 'column', height: 50, paddingLeft: 7, justifyContent: 'center' }}>
                    <span style={{ fontSize: 16, textAlign: 'left', color: 'white' }}>{domain}</span>
                    <span style={{ fontSize: 12, textAlign: 'left', color: "#878787" }}>{name}</span>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 50, paddingRight: 7}}>
                    <div style={{display:'flex'}}>
                        <div style={{display:'flex',flex:1,height:30,alignItems:'flex-end',justifyContent:"flex-end"}}>
                            <img
                                onClick={() => handleCopy(isOtp)}
                                src={Copy}
                                style={{width: 30, height: 28, transition: 'transform 0.3s ease, cursor 0.3s ease',paddingRight:7}}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.1)';
                                    e.currentTarget.style.cursor = 'copy';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                    e.currentTarget.style.cursor = 'default';
                                }}
                                alt="copy"
                            />
                        </div>
                        <span style={{fontSize: 22, textAlign: 'right', color: "white", flex: 1}}>{isOtp}</span>
                    </div>
                    <span style={{
                        fontSize: 12,
                        textAlign: 'right',
                        color: countdown <= 5 ? "red" : "white"
                    }}>{countdown}</span>
                </div>
            </div>
        </div>
    );
}

export default CardOtp;
