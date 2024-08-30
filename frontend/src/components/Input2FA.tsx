import React, { useState, useEffect } from 'react';
import { DebounceInput } from 'react-debounce-input';
import '../styles/Input2FA.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { UpdateTwoFA } from '../../wailsjs/go/app/App';
import { toast } from 'react-toastify';

function Input2FA() {
    const [logoSearch, setLogoSearch] = useState('');
    const [logoOptions, setLogoOptions] = useState<{ name: string; logo: string; domain: string }[]>([]);
    const [selectedLogo, setSelectedLogo] = useState<string>('');
    const [selectedLogoName, setSelectedLogoName] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [priority, setPriority] = useState<number>(0);

    const location = useLocation();
    const { id } = location.state || {};

    // Function to fetch logo options from the API
    const fetchLogoOptions = async (query: string) => {
        try {
            const response = await fetch(`https://search.logo.dev/?query=${query}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setLogoOptions(data || []);
        } catch (error) {
            toast.error('Error fetching logo options: ' + error);
        }
    };

    useEffect(() => {
        if (logoSearch.length > 0) {
            fetchLogoOptions(logoSearch);
        } else {
            setLogoOptions([]);
        }
    }, [logoSearch]);

    const update2FA = async (id: number | undefined, priority: number = 0, logo: string = '', name: string = '', domain: string = '') => {
        if (!id) {
            toast.error('Invalid ID');
            return;
        }

        try {
            await UpdateTwoFA(id, priority, logo, name, domain);
            handleGoBack();
        } catch (e) {
            toast.error('Error updating 2FA: ' + e);
        }
    };

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-2);
    };

    return (
        <div className="input2fa-container">
            <div className="input2fa-content">
                <h2 className="input2fa-heading">Fill in information</h2>
                <div className="input2fa-field">
                    <label className="input2fa-label">
                        <DebounceInput
                            minLength={2}
                            debounceTimeout={300}
                            value={logoSearch}
                            onChange={(e) => setLogoSearch(e.target.value)}
                            placeholder="Search for a logo"
                            className="input2fa-input"
                        />
                    </label>
                    {logoOptions.length > 0 && (
                        <ul className="input2fa-options">
                            {logoOptions.map((option, index) => (
                                <li
                                    key={index}
                                    onClick={() => {
                                        setSelectedLogo(`https://img.logo.dev/${option.domain}?token=pk_MQr__BVLTWi-hbKeeu89xg`);
                                        setSelectedLogoName(option.name);
                                        setLogoSearch(option.name);
                                        setLogoOptions([]);
                                    }}
                                    className="input2fa-option"
                                >
                                    <img
                                        src={`https://img.logo.dev/${option.domain}?token=pk_MQr__BVLTWi-hbKeeu89xg`}
                                        alt={option.name}
                                        className="input2fa-option-img"
                                    />
                                    <span className="input2fa-option-name">{option.name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="input2fa-field">
                    <label className="input2fa-label">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter name"
                            className="input2fa-input"
                        />
                    </label>
                </div>
                <div className="input2fa-field">
                    <label className="input2fa-label">
                        <select value={priority} onChange={(e) => setPriority(parseInt(e.target.value))} className="input2fa-input">
                            <option value={0}>Normal</option>
                            <option value={1}>Priority</option>
                            <option value={2}>Special</option>
                        </select>
                    </label>
                </div>
                <div className="input2fa-field">
                    <button onClick={() => update2FA(id as number, priority, selectedLogo, name, selectedLogoName)} className="input2fa-submit-button">
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Input2FA;
