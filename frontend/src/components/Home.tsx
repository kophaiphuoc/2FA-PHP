import React, { useEffect, useState } from 'react';
import CardOtp from './CardOtp';
import Add from "../assets/images/add.png";
import { useNavigate } from 'react-router-dom';
import { GetTwoFAs } from "../../wailsjs/go/app/App";
import {toast} from "react-toastify";

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
                setList2FA(data);
            } catch (error) {
                console.log(error)
                toast.error(error+"")
            }
        };
        fetchList2FA();
    }, []);

    const test =async () =>{
        try {
            const res = await GetTwoFAs
            toast.error(res+"")
        }catch (e) {
            toast.error(e+"")
        }
    }

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
