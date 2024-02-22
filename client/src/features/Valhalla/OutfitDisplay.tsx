import { useEffect } from 'react';
import Panel from '../../components/Panel/Panel';
import JPanel from '../../components/UI/JPanel';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { hideOutfits } from '../../slices/dungeonSlice';
import { DisplayGrid } from '../../components/Grid/DisplayGrid';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { Item } from '../../components/Item';
import { IItem } from '../../slices/inventorySlice';
import useTranslator from '../../hooks/translate';

const ITEMS_PER_ROW = 7;
const HORIZONTAL_SPACING = 70;
const VERTICAL_SPACING = 70;

export function OutfitDisplay({ sets }: { sets: { id: string; items: IItem[] }[] }) {
  const t = useTranslator();
  const dispatch = useAppDispatch();
  const showOutfits = useAppSelector((state) => state.dungeon.showOutfits);

  if (!showOutfits) {
    return null;
  }

  return (
    <Panel name="Equipment Set Display" onClose={() => dispatch(hideOutfits())}>
      <JPanel size={{ width: 505, height: sets.length * 105 + 5 }} background="UIResource.Common.BigBG1">
        {sets.map((set, setIdx) => (
          <JPanel
            key={`set-${setIdx}`}
            size={{ width: 495, height: 100 }}
            position={{ x: 5, y: 5 + setIdx * 105 }}
            background="UIResource.Common.BigBG3">
            <JPanel
              size={{ width: 150, height: 18 }}
              position={{ x: 505 / 2 - 150 / 2, y: 5 }}
              background="UIResource.Common.TextBG2"></JPanel>
            <MultilineLabel
              size={{ width: 150, height: 18 }}
              position={{ x: 505 / 2 - 150 / 2, y: 7 }}
              style={{ textAlign: 'center' }}
              text={t(`set__${set.id}`)}
            />
            {set.items.map((item, idx) => (
              <DisplayGrid
                key={`outfit-${idx}`}
                size={{ width: 2, height: 2 }}
                position={{
                  x: 6 + (idx % ITEMS_PER_ROW) * HORIZONTAL_SPACING,
                  y: 26 + Math.floor(idx / ITEMS_PER_ROW) * VERTICAL_SPACING,
                }}>
                <Item item={item} onClick={() => {}} />
              </DisplayGrid>
            ))}
          </JPanel>
        ))}
      </JPanel>
    </Panel>
  );
}
