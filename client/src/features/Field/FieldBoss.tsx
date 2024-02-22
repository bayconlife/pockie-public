import { NPCContainer } from '../../components/NPC/NPCContainer';
import { prompt } from '../../util/EventEmitter';
import { toServer } from '../../util/ServerSocket';

export function FieldBoss({ id }: { id: number }) {
  return (
    <>
      <NPCContainer
        id={id}
        onClick={() => {
          prompt('Use Demon Proof of Suppression to fight boss?', () => {
            toServer('fieldBossFight');
          });
          // setShowTickets(!showTickets)
        }}
      />

      {/* {showTickets && <FieldBossTickets onClose={() => setShowTickets(false)} />} */}
    </>
  );
}
