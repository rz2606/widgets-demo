import React from "@deskulpt-test/react";
import apis from "@deskulpt-test/apis";

const jsonFile = 'output.json';
const weatherAPIKey = 'e30fb117e9fc4a9b88b135353242204';
const weatherAPIURL = `https://api.weatherapi.com/v1/current.json?key=${weatherAPIKey}&q=`;

function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function TodoList() {
    const [tasks, setTasks] = React.useState([]);
    const [taskValue, setTaskValue] = React.useState('');
    const [taskStartDate, setTaskStartDate] = React.useState('2024-01-01T00:00');
    const [taskEndDate, setTaskEndDate] = React.useState('2024-12-31T23:59');
    const [selectAll, setSelectAll] = React.useState(false);
    const [weather, setWeather] = React.useState(null);
    const [msg, setMsg] = React.useState('');
    const [city, setCity] = React.useState('');

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await apis.fs.readFile(jsonFile, 'utf8');
                if (data) {
                    setTasks(JSON.parse(data));
                }
            } catch (error) {
                console.error('Error reading file:', error);
            }
        };
        fetchData();

        // Fetch weather information for default city when component mounts
        fetchWeatherInfo();
    }, []);

    const fetchWeatherInfo = async () => {
        try {
            const response = await fetch(`${weatherAPIURL}New York`); // Default city is New York
            const data = await response.json();
            setWeather(data);
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    };

    const searchWeather = async () => {
        try {
            if (!city) {
                setMsg('city name is empty ')
                let time = setTimeout(function () {
                    setMsg('')
                    clearTimeout(time)
                }, 1000)
                return
            }
            const response = await fetch(`${weatherAPIURL}${city}`);
            const data = await response.json();
            if (data['error']) {
                setMsg('No search info')
                let time = setTimeout(function () {
                    setMsg('')
                    clearTimeout(time)
                }, 1000)
                return
            }
            setWeather(data);
        } catch (error) {
            console.error('Error fetching weather:', error);
        }
    };

    const saveTasksToFile = async (data) => {
        try {
            await apis.fs.writeFile(jsonFile, JSON.stringify(data));
            console.log('Tasks saved successfully');
        } catch (error) {
            console.error('Error writing file:', error);
        }
    };

    const addTask = () => {
        if (taskValue.trim() === '') {
            console.error('Cannot add empty task');
            setMsg('Cannot add empty task');
            let time = setTimeout(function () {
                setMsg('')
                clearTimeout(time)
            }, 1000);
        } else if (taskStartDate >= taskEndDate) {
            console.error('Invalid task: Start time must be before end time');
            setMsg('Start time must be before end time');
            let time = setTimeout(function () {
                setMsg('')
                clearTimeout(time)
            }, 1000);
        } else {
            const newTask = {
                text: taskValue.trim(),
                completed: false,
                startDate: taskStartDate,
                endDate: taskEndDate
            };
            setTasks([...tasks, newTask]);
            saveTasksToFile([...tasks, newTask]);
            setTaskValue('');
            setTaskStartDate('2024-01-01T00:00');
            setTaskEndDate('2024-12-31T23:59');
        }
    };

    const deleteTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
        saveTasksToFile(updatedTasks);
    };

    const toggleComplete = (index) => {
        const updatedTasks = tasks.map((task, i) => {
            if (i === index) {
                return {...task, completed: !task.completed};
            }
            return task;
        });
        setTasks(updatedTasks);
        saveTasksToFile(updatedTasks);
    };

    const toggleSelectAll = () => {
        const updatedTasks = tasks.map(task => ({...task, completed: !selectAll}));
        setTasks(updatedTasks);
        setSelectAll(!selectAll);
        saveTasksToFile(updatedTasks);
    };

    const markAllComplete = () => {
        const updatedTasks = tasks.map(task => ({...task, completed: true}));
        setTasks(updatedTasks);
        saveTasksToFile(updatedTasks);
    };

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            maxWidth: '600px',
            margin: 'auto',
            padding: '20px',
            backgroundColor: '#f9f9f9',
            borderRadius: '10px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
        }}>
            <h2 style={{textAlign: 'center', marginBottom: '20px', color: '#333'}}>Todo List</h2>
            {/*msg place*/}
            {weather && (
                <p style={{textAlign: 'center', marginBottom: '20px', color: '#666'}}>
                    Weather in {weather.location.name}: {weather.current.temp_c}°C, {weather.current.condition.text}
                </p>
            )}
            <div style={{marginBottom: '20px', display: 'flex', alignItems: 'center'}}>
                <input
                    style={{
                        flex: '1',
                        padding: '10px',
                        fontSize: '16px',
                        marginRight: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc'
                    }}
                    placeholder="Enter City Name"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
                <button
                    style={{
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '10px',
                        cursor: 'pointer',
                        marginLeft: '10px',
                        borderRadius: '5px'
                    }}
                    onClick={searchWeather}
                >
                    Search Weather
                </button>
            </div>

            <div>{msg}</div>
            <div style={{marginBottom: '20px', display: 'flex', alignItems: 'center'}}>
                <input
                    style={{
                        flex: '1',
                        padding: '10px',
                        fontSize: '16px',
                        marginRight: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        maxWidth: '300px'
                    }}
                    placeholder="Task Name"
                    value={taskValue}
                    onChange={(e) => setTaskValue(e.target.value)}
                    maxLength={20}
                />
                <input
                    style={{
                        width: '45%',
                        padding: '10px',
                        fontSize: '16px',
                        marginRight: '5px',
                        borderRadius: '5px',
                        border: '1px solid #ccc'
                    }}
                    type="datetime-local"
                    value={taskStartDate}
                    onChange={(e) => setTaskStartDate(e.target.value)}
                />
                <input
                    style={{
                        width: '45%',
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        border: '1px solid #ccc'
                    }}
                    type="datetime-local"
                    value={taskEndDate}
                    onChange={(e) => setTaskEndDate(e.target.value)}
                />
                <button
                    style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        padding: '10px',
                        cursor: 'pointer',
                        marginLeft: '10px',
                        borderRadius: '5px'
                    }}
                    onClick={addTask}
                >
                    Add Task
                </button>
                <button
                    style={{
                        backgroundColor: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '10px',
                        cursor: 'pointer',
                        marginLeft: '10px',
                        borderRadius: '5px'
                    }}
                    onClick={toggleSelectAll}
                >
                    {selectAll ? 'Deselect All' : 'Select All'}
                </button>
                <button
                    style={{
                        backgroundColor: '#FFC107',
                        color: 'white',
                        border: 'none',
                        padding: '10px',
                        cursor: 'pointer',
                        marginLeft: '10px',
                        borderRadius: '5px'
                    }}
                    onClick={markAllComplete}
                >
                    Mark All Complete
                </button>
            </div>

            <ul style={{listStyleType: 'none', padding: 0}}>
                {tasks.map((task, index) => (
                    <li key={index} style={{
                        marginBottom: '10px',
                        backgroundColor: '#fff',
                        padding: '10px',
                        borderRadius: '5px',
                        boxShadow: '0 0 5px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <input
                            type="checkbox"
                            style={{marginRight: '10px'}}
                            checked={task.completed}
                            onChange={() => toggleComplete(index)}
                        />
                        <span style={{
                            flex: '1',
                            textDecoration: task.completed ? 'line-through' : 'none',
                            color: '#333'
                        }}>{task.text} - Start: {formatDateTime(task.startDate)} - End: {formatDateTime(task.endDate)}</span>
                        <button
                            style={{
                                backgroundColor: '#f44336',
                                color: 'white',
                                border: 'none',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                borderRadius: '5px'
                            }}
                            onClick={() => deleteTask(index)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            <p style={{textAlign: 'center', marginTop: '20px', color: '#666'}}>Total tasks: {tasks.length}</p>
        </div>
    );
}

export default {
    render: () => <TodoList/>,
};
