import React, { useState } from 'react';

const PropsAndState = ({ initialCount }) => {
  const [count, setCount] = useState(initialCount);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Click</button>
    </div>
  );
};

export default PropsAndState;