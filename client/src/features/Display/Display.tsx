import { Fragment, useEffect, useState } from 'react';
import Events from '../../util/EventEmitter';

export function Display() {
  const [displayNodes, setDisplayNodes] = useState<{ [id: string]: React.ReactNode }>({});

  useEffect(() => {
    const id = Events.on('display', (node, id) => {
      if (!!displayNodes[id]) {
        return;
      }

      const newNodes = { ...displayNodes };

      newNodes[id] = node;

      setDisplayNodes(newNodes);
    });

    const closeId = Events.on('closeDisplay', (id) => {
      const newNodes = { ...displayNodes };

      delete newNodes[id];

      setDisplayNodes(newNodes);
    });

    return () => {
      Events.off(id);
      Events.off(closeId);
    };
  }, [displayNodes]);

  return (
    <>
      {Object.values(displayNodes).map((node, idx) => (
        <Fragment key={idx}>{node}</Fragment>
      ))}
    </>
  );
}
