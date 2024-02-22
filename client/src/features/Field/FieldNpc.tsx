import { useEffect, useState } from 'react';
import { NPCContainer } from '../../components/NPC/NPCContainer';
import { NpcMenu } from '../../components/NpcMenu/NpcMenu';

export function FieldNpc({ id }: { id: number }) {
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const autoTalk = localStorage.getItem('autoInteract');

    if (autoTalk !== null && autoTalk === id.toString()) {
      localStorage.removeItem('autoInteract');
      setIsInteracting(true);
    }
  });

  return (
    <>
      <NPCContainer id={id} onClick={() => setIsInteracting(!isInteracting)} />

      {isInteracting && <NpcMenu onEnd={() => setIsInteracting(false)} npc={id} />}
    </>
  );
}
