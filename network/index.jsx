import React from "@deskulpt-test/react";
import apis from "@deskulpt-test/apis";

const SysInfo = () => {
    const [systemInfo, setSystemInfo] = React.useState(null);
    const [backgroundOpacity, setBackgroundOpacity] = React.useState(1);

    React.useEffect(() => {
        const intervalId = setInterval(fetchSystemInfo, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const fetchSystemInfo = async () => {
        try {
            let data = await apis.sys.getSystemInfo();
            setSystemInfo(data);
        } catch (error) {
            console.error('Error fetching system info:', error);
        }
    };

    const handleOpacityChange = (event) => {
        setBackgroundOpacity(parseFloat(event.target.value));
    };

    if (!systemInfo) {
        return <div>Loading...</div>;
    }


    function formatBytes(bytes) {
        if (bytes === 0) return '0 KB';
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i))).toFixed(2);
    }

    return (
        <div className="task-manager" style={{ background: `rgba(255, 255, 255, ${backgroundOpacity})`, fontFamily: 'Segoe UI', fontSize: '16px', padding: '20px', borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
            {systemInfo && (
                <div>
                    <h2>Network Usage</h2>
                    <ul>
                        {systemInfo.networks.map((network, index) => (
                            <li key={index} style={{ marginBottom: '10px' }}>
                                <strong style={{ color: '#0078d4' }}>{network.interface_name}</strong>
                                <br />
                                Total Received: {formatBytes(network.total_received)} KB
                                <br />
                                Total Transmitted: {formatBytes(network.total_transmitted)} KB
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div style={{ marginTop: '20px' }}>
                <label htmlFor="opacityRange">Background Opacity:</label>
                <input type="range" id="opacityRange" min="0" max="1" step="0.1" value={backgroundOpacity} onChange={handleOpacityChange} />
                <span>{backgroundOpacity}</span>
            </div>
        </div>
    );
};

export default {
    render: () => <SysInfo />,
};
