import React from "@deskulpt-test/react";
import apis from "@deskulpt-test/apis";

const SysInfo = () => {
    const [systemInfo, setSystemInfo] = React.useState(null);
    const [brand, setBrand] = React.useState(null);
    const [opacity, setOpacity] = React.useState(0.7);

    const increaseOpacity = () => {
        if (opacity < 1) {
            setOpacity(opacity + 0.1);
        }
    };

    const decreaseOpacity = () => {
        if (opacity > 0) {
            setOpacity(opacity - 0.1);
        }
    };

    React.useEffect(() => {
        const intervalId = setInterval(fetchSystemInfo, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const fetchSystemInfo = async () => {
        try {
            let data = await apis.sys.getSystemInfo();
            setBrand(data.cpu_info[0].brand);
            setSystemInfo(data);
        } catch (error) {
            console.error('Error fetching system info:', error);
        }
    };

    if (!systemInfo) {
        return <div>Loading...</div>;
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    return (
        <div className="task-manager" style={{ background: `rgba(255, 255, 255, ${opacity})`, fontFamily: 'Segoe UI', fontSize: '16px', padding: '20px', borderRadius: '10px' }}>
            <div style={{ marginBottom: '10px' }}>
                <button onClick={increaseOpacity}>Increase Opacity</button>
                <button onClick={decreaseOpacity}>Decrease Opacity</button>
            </div>
            {systemInfo && (
                <div>
                    <h2 style={{ color: '#0078d4' }}>CPU Usage</h2>
                    <div style={{ marginBottom: '10px' }}>
                        <strong style={{ color: '#0078d4' }}>CPU Brand:</strong> {brand}
                    </div>
                    <ul>
                        {systemInfo.cpu_info.map((cpu, index) => (
                            <li key={index} style={{ marginBottom: '5px' }}>
                                <strong style={{ color: '#0078d4' }}>CPU {index + 1}:</strong> {cpu.total_cpu_usage.toFixed(2)}%
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default {
    render: () => <SysInfo />,
};
