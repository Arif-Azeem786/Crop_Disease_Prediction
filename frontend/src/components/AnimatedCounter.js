import React, { useState, useEffect, useRef } from 'react';

export default function AnimatedCounter({ value = 0, duration = 1500 }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    const end = typeof value === 'number' ? value : parseInt(value, 10) || 0;
    let startTime;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(easeOut * end));
      if (progress < 1) startRef.current = requestAnimationFrame(animate);
    };

    startRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(startRef.current);
  }, [value, duration]);

  return <span>{display}</span>;
}
