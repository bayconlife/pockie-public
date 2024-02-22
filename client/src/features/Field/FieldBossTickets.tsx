import { DropZone } from '../../components/DropZone/DropZone';
import { DisplayGrid } from '../../components/Grid/DisplayGrid';
import { Item } from '../../components/Item';
import Panel from '../../components/Panel/Panel';
import JPanel from '../../components/UI/JPanel';
import { ItemLocation, ItemType } from '../../enums';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { JButton } from '../../components/UI/JButton';
import { FightState, setFightState } from '../../slices/fightSlice';
import { toServer } from '../../util/ServerSocket';
import { getItemType } from '../../resources/Items';

const TICKET_TYPES = [ItemType.BossTicket];

export function FieldBossTickets({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();
  const ticket = useAppSelector((state) => state.inventory.items[state.inventory.locations[ItemLocation.BossTicket]]);
  const dragging = useAppSelector((state) => state.ui.dragging.item);
  const fightState = useAppSelector((state) => state.fight.state);

  function setTicket(uid: string) {
    toServer('fieldBossSetTicket', uid);
  }

  return (
    <Panel name="Ticket" onClose={onClose}>
      <JPanel size={{ width: 100, height: 85 }} background="UIResource.Common.BigBG2">
        <DisplayGrid size={{ width: 1, height: 1 }} position={{ x: 30, y: 10 }}>
          {ticket === undefined && dragging !== null && TICKET_TYPES.includes(getItemType(dragging)) && (
            <DropZone onDrop={() => setTicket(dragging.uid)} location={ItemLocation.Enhance} />
          )}
          {ticket && <Item item={ticket} />}
        </DisplayGrid>

        <JButton
          position={{ x: 13, y: 55 }}
          text="Fight"
          onClick={() => {
            dispatch(setFightState(FightState.LOADING));
            toServer('fieldBossFight');
          }}
          disabled={ticket === undefined || fightState !== FightState.FINISHED}
        />
      </JPanel>
    </Panel>
  );
}
