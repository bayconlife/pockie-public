import { useState } from 'react';
import { DisplayGrid } from '../../components/Grid/DisplayGrid';
import { Item } from '../../components/Item';
import Panel from '../../components/Panel/Panel';
import { JLayout } from '../../components/UI/JLayout';
import { JPagination } from '../../components/UI/JPagination';
import JPanel from '../../components/UI/JPanel';
import { ItemType } from '../../enums';
import { useAppSelector } from '../../hooks';
import { IItem } from '../../slices/inventorySlice';
import { JButton } from '../../components/UI/JButton';
import { prompt } from '../../util/EventEmitter';
import { toServer } from '../../util/ServerSocket';
import { isItemType } from '../../resources/Items';

interface Props {
  item: IItem;
  onClose: () => void;
}

export function PetSkillBook({ item, onClose }: Props) {
  const items = useAppSelector((state) => state.inventory.items);
  const [selectedUID, setSelectedUID] = useState<string>();
  const [loading, setLoading] = useState(false);

  const pets = Object.keys(items).filter((uid) => isItemType(items[uid], ItemType.Pet));

  return (
    <Panel name="Add Pet Skill" moveable={false} onClose={onClose}>
      <JPanel size={{ width: 300, height: 200 }} background="UIResource.Common.BigBG1" padding={5}>
        <JPagination
          items={pets}
          perPage={8}
          render={(petUIDs) => (
            <JLayout horizontal>
              {petUIDs.map((uid, idx) => (
                <DisplayGrid key={uid + '-' + idx} size={{ width: 2, height: 2 }} selected={selectedUID === uid}>
                  {items[uid] && (
                    <Item
                      item={items[uid]}
                      onClick={() => {
                        setSelectedUID(selectedUID === uid ? null : uid);
                      }}
                      overridePosition={0}
                      noBackground
                    />
                  )}
                </DisplayGrid>
              ))}
            </JLayout>
          )}
          style={{ marginBottom: 5 }}
        />
        <JLayout horizontal>
          <JButton
            text="Apply"
            disabled={!selectedUID || loading}
            loading={loading}
            onClick={() => {
              setLoading(true);
              prompt(
                'Are you sure you want to apply this skill to this pet?',
                () => {
                  toServer('petSkillUseBook', { book: item.uid, pet: selectedUID }, () => {
                    setLoading(false);
                    onClose();
                  });
                },
                () => {
                  setLoading(false);
                }
              );
            }}
          />
        </JLayout>
      </JPanel>
    </Panel>
  );
}
