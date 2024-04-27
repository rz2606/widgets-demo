import React from "@deskulpt-test/react";
import apis from "@deskulpt-test/apis";


console.log('apis',apis)
const SysInfo = () => {
    const [systemInfo, setSystemInfo] = React.useState(null);

    React.useEffect(() => {
        const intervalId = setInterval(fetchSystemInfo, 1000);
        return () => clearInterval(intervalId); // Clear the interval on unmount
    }, []);

    const fetchSystemInfo = async () => {
        try {
            let data = await apis.sys.getSystemInfo();
            // Convert disk space to GB
            data.total_swap =  (data.total_swap/(1024 * 1024 * 1024)).toFixed(2)
            data.used_swap =  (data.used_swap/(1024 * 1024 * 1024)).toFixed(2)
            data.disks = data.disks.map(disk => ({
                ...disk,
                available_space: (disk.available_space / (1024 * 1024 * 1024)).toFixed(2),
                total_space: (disk.total_space / (1024 * 1024 * 1024)).toFixed(2)
            }));
            // Convert network data to KB
            data.networks = data.networks.map(network => ({
                ...network,
                total_received: (network.total_received / 1024/1024).toFixed(2),
                total_transmitted: (network.total_transmitted / 1024/1024).toFixed(2)
            }));
            data.total_memory=  (data.total_memory / 1024/1024/1024).toFixed(2)
            data.used_memory=  (data.used_memory / 1024/1024/1024).toFixed(2)

            setSystemInfo(data);
        } catch (error) {
            console.error('Error fetching system info:', error);
        }
    };

    if (!systemInfo) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f9f9f9' }}>
            <h1>System Information</h1>
            <p><strong>Total Swap:</strong> {systemInfo.total_swap}GB</p>
            <p><strong>Used Swap:</strong> {systemInfo.used_swap}GB</p>
            <p><strong>System Name:</strong> {systemInfo.system_name}</p>
            <p><strong>Kernel Version:</strong> {systemInfo.kernel_version}</p>
            <p><strong>OS Version:</strong> {systemInfo.os_version}</p>
            <p><strong>Host Name:</strong> {systemInfo.host_name}</p>
            <p><strong>CPU Count:</strong> {systemInfo.cpu_count}</p>
            <h2>Disks:</h2>
            <ul>
                {systemInfo.disks.map((disk, index) => (
                    <li key={index}>
                        <p><strong>Name:</strong> {disk.name}</p>
                        <p><strong>Available Space:</strong> {disk.available_space} GB</p>
                        <p><strong>Total Space:</strong> {disk.total_space} GB</p>
                        <p><strong>Mount Point:</strong> {disk.mount_point}</p>
                    </li>
                ))}
            </ul>
            <h2>Networks:</h2>
            <ul>
                {systemInfo.networks.map((network, index) => (
                    <li key={index}>
                        <p><strong>Interface Name:</strong> {network.interface_name}</p>
                        <p><strong>Total Received:</strong> {network.total_received} KB</p>
                        <p><strong>Total Transmitted:</strong> {network.total_transmitted} KB</p>
                    </li>
                ))}
            </ul>
            <p><strong>Total Memory:</strong> {systemInfo.total_memory}GB</p>
            <p><strong>Used Memory:</strong> {systemInfo.used_memory}GB</p>
        </div>
    );
};

export default {
    render: () => <SysInfo/>,
};
