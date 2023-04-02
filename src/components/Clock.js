
import React, { useEffect, useState } from 'react';

export default function Clock() {
    const [clockState, setClockState] = useState("0");
    useEffect(() => {
      setInterval(() => {
        const date = new Date();
        setClockState(date.toLocaleTimeString());
      }, 1000);
    }, []);
    return (
      <div className='text-white'>{clockState}</div>
    )
  }