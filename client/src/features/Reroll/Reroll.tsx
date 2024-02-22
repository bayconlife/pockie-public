import { useState } from 'react';
import { Backdrop } from '../../components/Backdrop';
import { DisplayGrid } from '../../components/Grid/DisplayGrid';
import { Item } from '../../components/Item';
import { DisplayItem } from '../../components/Item/DisplayItem';
import Panel from '../../components/Panel/Panel';
import { JLayout } from '../../components/UI/JLayout';
import { JPagination } from '../../components/UI/JPagination';
import JPanel from '../../components/UI/JPanel';
import { Label } from '../../components/UI/Label';
import { ItemLocation, ItemType } from '../../enums';
import { getItemType, setItemType } from '../../resources/Items';
import { closeDisplay, display } from '../../util/EventEmitter';
import { SERVER_CONFIG } from '../../util/serverConfig';
import { DropZone } from '../../components/DropZone/DropZone';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getItemAtLocation, updateItem } from '../../slices/inventorySlice';
import { toServer } from '../../util/ServerSocket';
import { JButton } from '../../components/UI/JButton';

export function Reroll() {
  const dispatch = useAppDispatch();
  const dragging = useAppSelector((state) => state.ui.dragging.item);
  const item = useAppSelector(getItemAtLocation(ItemLocation.RerollPet));
  const stones = useAppSelector((state) => state.currency.stones);
  const [selectedPetIID, setSelectedPetIID] = useState<number>();
  const [maxStones, setMaxStones] = useState<number>(1500);

  const targetItem = !!selectedPetIID
    ? setItemType(
        {
          iid: selectedPetIID,
        },
        ItemType.Pet
      )
    : undefined;

  return (
    <Panel name="Reroll" onClose={() => closeDisplay(Reroll.name)}>
      <JPanel width={230} height={150} background="UIResource.Common.BigBG1" padding={5}>
        <Label x={5} className="sm bold center" text="Item" style={{ width: 64 }} />
        <DisplayGrid x={5} y={15} size={{ width: 2, height: 2 }}>
          {item === undefined && dragging !== null && getItemType(dragging) === ItemType.Pet && (
            <DropZone onDrop={() => toServer('rerollPetSetItem', dragging.uid)} location={ItemLocation.RerollPet} />
          )}
          {item && <Item item={item} overridePosition={0} />}
        </DisplayGrid>

        <Label x={150} className="sm bold center" text="Target" style={{ width: 64 }} />
        <JPanel className="clickable" onClick={() => display(PetSelect.name, <PetSelect onSelect={setSelectedPetIID} />)}>
          <DisplayGrid x={150} y={15} size={{ width: 2, height: 2 }}>
            {targetItem && <DisplayItem item={targetItem} />}
          </DisplayGrid>
        </JPanel>

        <Label x={5} y={87} className="sm bold" text="Max Stones" />
        <JPanel x={85} y={85}>
          <input
            type="number"
            step={1}
            min={0}
            max={100000}
            value={maxStones}
            style={{ width: 75 }}
            onChange={(e) => {
              setMaxStones(Math.min(Math.max(Number(e.target.value), 0), 100000, stones));
            }}
          />
        </JPanel>

        <JButton
          x={115 - 75 / 2}
          y={115}
          text="Reroll"
          disabled={!item || !selectedPetIID || maxStones < 1500 || maxStones > 100000 || maxStones > stones || item.iid === selectedPetIID}
          onClick={() =>
            toServer('rerollPet', { targetIID: selectedPetIID, maxStones }, (newItem) => {
              dispatch(updateItem(newItem));
            })
          }
        />
      </JPanel>
    </Panel>
  );
}

function PetSelect({ onSelect }: { onSelect: (iid: number) => void }) {
  const petIds = SERVER_CONFIG.REROLL.pets;

  return (
    <>
      <Backdrop />
      <Panel moveable={false} onClose={() => closeDisplay(PetSelect.name)} style={{ zIndex: 2000 }}>
        <JPanel width={300} height={170} background="UIResource.Common.BigBG1" padding={5}>
          <JPagination
            perPage={8}
            items={petIds}
            render={(items) => (
              <JLayout horizontal>
                {items.map((id) => {
                  if (id === undefined) {
                    return <DisplayGrid key={id} size={{ width: 2, height: 2 }} />;
                  }

                  const item = setItemType(
                    {
                      iid: id,
                    },
                    ItemType.Pet
                  );

                  return (
                    <JPanel
                      key={id}
                      className="clickable"
                      onClick={() => {
                        onSelect(id);
                        closeDisplay(PetSelect.name);
                      }}>
                      <DisplayGrid size={{ width: 2, height: 2 }}>
                        <DisplayItem item={item} />
                      </DisplayGrid>
                    </JPanel>
                  );
                })}
              </JLayout>
            )}
          />
        </JPanel>
      </Panel>
    </>
  );
}
