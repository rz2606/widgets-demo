import React from "@deskulpt-test/react";

function Counter() {
    const [count, setCount] = React.useState(0);

    return (
        <div>
            <div>Count: {count}</div>
            <button onClick={() => setCount(count + 1)}>Increment</button>
            <button onClick={() => setCount(0)}>Reset</button>
        </div>
    )
}

export default {
    render: () => <Counter />,
};