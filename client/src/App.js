import React from 'react';
import { useStepTracker } from './useStepTracker';

function StepTracker() {
  const { steps, distance, increment } = useStepTracker(0, 0);

  return (
    <div>
      <h1>Fitness Tracker</h1>
      <p>Steps Today: {steps}</p>
      <p>Distance Today: {distance} Kilometres</p>
      <button onClick={increment}>Add Step/Distance</button>
      {steps >= 10 && <p>You've reached your step goal!</p>}
      {distance >= 0.25 && <p>You've reached your distance goal!</p>}
    </div>
  );
}

export default StepTracker;
