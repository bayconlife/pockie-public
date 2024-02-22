import { useEffect, useState } from 'react';
import { toServer } from '../../util/ServerSocket';

export function Ping() {
  const [ping, setPing] = useState(0);

  useEffect(() => {
    function pingServer() {
      const start = Date.now();
      toServer('ping', null, () => {
        setPing(Date.now() - start);
      });
    }
    const interval = setInterval(pingServer, 60000 / 2);

    pingServer();

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <span className="text-shadow" style={{ color: 'whitesmoke', position: 'relative', top: 3 }} title="Updates every 30s">
      {ping}ms
    </span>
  );
}
