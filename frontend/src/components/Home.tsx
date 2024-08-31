import React, { useEffect, useState } from 'react';
import CardOtp from './CardOtp';
import Add from "../assets/images/add.png";
import { useNavigate } from 'react-router-dom';
import { GetTwoFAs } from "../../wailsjs/go/app/App";

function Home() {
    const navigate = useNavigate();
    const toCreate2FA = () => {
        navigate('/2fa');
    };

    const [list2FA, setList2FA] = useState<any[]>([]);

    useEffect(() => {
        const fetchList2FA = async () => {
            try {
                const data = await GetTwoFAs();
                // Kiểm tra nếu dữ liệu hợp lệ
                if (data && Array.isArray(data)) {
                    setList2FA(data);
                } else {
                    // Nếu dữ liệu không hợp lệ, có thể log lỗi hoặc thông báo
                    console.error('Invalid data received:', data);
                    // toast.error('Dữ liệu không hợp lệ');
                }
            } catch (error) {
                // Log lỗi và thông báo cho người dùng
                console.error('Fetch error:', error);
                // toast.error('Lỗi khi lấy dữ liệu');
            }
        };

        // Sử dụng setTimeout để gọi fetchList2FA sau 5 giây
        const timeoutId = setTimeout(() => {
            fetchList2FA();
        }, 5000); // 5000 ms = 5 giây

        // Clean up hàm khi component bị unmount
        return () => clearTimeout(timeoutId);
    }, []); // Chạy effect này chỉ một lần khi component mount

    return (
        <div style={{ width: 332, height: 550, display: 'flex', flexDirection: 'column' }}>
            <div style={{
                padding: 10,
                marginTop: 25,
                overflowY: "scroll",
                flex: 1,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
            }}>
                <style>
                    {`
                        div::-webkit-scrollbar {
                            display: none;
                        }
                    `}
                </style>
                {list2FA && list2FA?.length > 0 && <div>
                    {/* SPECIAL 🔥 */}
                    {list2FA.some((item: any) => item.priority === 2) && (
                        <>
                            <div>
                                <span style={{ color: "#878787", textAlign: 'left', flex: 1, display: 'flex', fontSize: 13, marginTop: 10 }}>SPECIAL 🔥</span>
                            </div>
                            {list2FA.filter((item: any) => item.priority === 2).map((item: any, index: number) => (
                                <CardOtp
                                    key={index}
                                    logo={item.Logo}
                                    name={item.Name}
                                    secret={item.Secret}
                                    otp={item.otp}
                                    priority={item.priority}
                                    timeExp={item.timeExp}
                                    domain={item.domain}
                                />
                            ))}
                        </>
                    )}

                    {/* PRIORITY */}
                    {list2FA.some((item: any) => item.priority === 1) && (
                        <>
                            <div>
                                <span style={{ color: "#878787", textAlign: 'left', flex: 1, display: 'flex', fontSize: 13, marginTop: 10 }}>PRIORITY</span>
                            </div>
                            {list2FA.filter((item: any) => item.priority === 1).map((item: any, index: number) => (
                                <CardOtp
                                    key={index}
                                    logo={item.Logo}
                                    name={item.Name}
                                    secret={item.Secret}
                                    otp={item.otp}
                                    priority={item.priority}
                                    timeExp={item.timeExp}
                                    domain={item.domain}
                                />
                            ))}
                        </>
                    )}

                    {/* NORMAL */}
                    {list2FA.some((item: any) => item.priority === 0) && (
                        <>
                            <div>
                                <span style={{ color: "#878787", textAlign: 'left', flex: 1, display: 'flex', fontSize: 13, marginTop: 10 }}>NORMAL</span>
                            </div>
                            {list2FA.filter((item: any) => item.priority === 0).map((item: any, index: number) => (
                                <CardOtp
                                    key={index}
                                    logo={item.Logo}
                                    name={item.Name}
                                    secret={item.Secret}
                                    otp={item.otp}
                                    priority={item.priority}
                                    timeExp={item.timeExp}
                                    domain={item.domain}
                                />
                            ))}
                        </>
                    )}
                </div>}
            </div>
            <div style={{ backgroundColor: "#323232", display: 'flex', justifyContent: "space-between", borderTopLeftRadius: 10, borderTopRightRadius: 10, padding: 7, alignItems: "center" }}>
                <span style={{ textAlign: "center", flex: 1, color: 'white', fontSize: 13 }}>create two-factor authentication</span>
                <img src={Add} style={{ width: 25, height: 25, paddingRight: 5 }} onClick={toCreate2FA}/>
            </div>
        </div>
    );
}

export default Home;
