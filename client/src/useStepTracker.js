import { useState, useEffect } from 'react';

export const useStepTracker = (initialSteps = 0, initialDistance = 0) => {
  const [steps, setSteps] = useState(initialSteps);
  const [distance, setDistance] = useState(initialDistance);

  useEffect(() => {
    document.title = `Steps: ${steps}, Distance: ${distance}`;
  }, [steps, distance]);

  const increment = () => {
    setSteps(steps + 1);
    setDistance(distance + 0.01);
  };

  return { steps, distance, increment };
};
