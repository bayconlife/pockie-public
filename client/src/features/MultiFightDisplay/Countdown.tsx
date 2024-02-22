import { useEffect, useRef, useState } from 'react';

export function Countdown({ initial, onFinish = () => {} }: { initial: number; onFinish?: () => void }) {
  const timerRef = useRef<number>(initial - Date.now());
  const [timer, setTimer] = useState(initial - Date.now());
  const id = Math.random();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (initial - Date.now() > 0) {
        timerRef.current = initial - Date.now();
        setTimer(timerRef.current);
      } else {
        clearInterval(intervalId);
        onFinish();
      }
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [initial]);

  return (
    <div id={`countdown-${id}`} className="text-shadow">
      {secondsToDhms(timer / 1000)}
    </div>
  );
}

function secondsToDhms(seconds: number) {
  seconds = Math.max(seconds, 0);

  let d = Math.floor(seconds / (3600 * 24));
  let h = Math.floor((seconds % (3600 * 24)) / 3600);
  let m = Math.floor((seconds % 3600) / 60);
  let s = Math.floor(seconds % 60);

  let dDisplay = d > 0 ? String(d).padStart(2, '0') + 'd' : '';
  let hDisplay = String(h).padStart(2, '0') + ':';
  let mDisplay = String(m).padStart(2, '0') + ':';
  let sDisplay = String(s).padStart(2, '0');

  return dDisplay + hDisplay + mDisplay + sDisplay;
}
