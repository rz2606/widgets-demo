import React from "@deskulpt-test/react";
import apis from "@deskulpt-test/apis";

const SysInfo = () => {
    const [systemInfo, setSystemInfo] = React.useState(null);
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
        <div className="container">
            <div className="task-manager" style={{ background: `rgba(255, 255, 255, ${opacity})`, padding: '20px', borderRadius: '8px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ marginBottom: '10px' }}>
                    <button onClick={increaseOpacity}>Increase Opacity</button>
                    <button onClick={decreaseOpacity}>Decrease Opacity</button>
                </div>
                {systemInfo && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h2 style={{ marginBottom: '20px', fontSize: '24px', color: '#333' }}>Memory Usage</h2>
                        <div style={{ marginBottom: '10px' }}>
                            <strong>Total Memory:</strong> {formatBytes(systemInfo.total_memory)}
                        </div>
                        <div>
                            <strong>Used Memory:</strong> {formatBytes(systemInfo.used_memory)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default {
    render: () => <SysInfo />,
};
