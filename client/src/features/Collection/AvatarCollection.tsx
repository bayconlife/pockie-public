import { useState } from 'react';
import { DisplayGrid } from '../../components/Grid/DisplayGrid';
import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import { JImage } from '../../components/UI/JImage';
import { JLayout } from '../../components/UI/JLayout';
import { JPagination } from '../../components/UI/JPagination';
import JPanel from '../../components/UI/JPanel';
import { Label } from '../../components/UI/Label';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useTranslator from '../../hooks/translate';
import { closeDisplay, display, prompt } from '../../util/EventEmitter';
import { SERVER_CONFIG } from '../../util/serverConfig';
import { Item } from '../../components/Item';
import { toServer } from '../../util/ServerSocket';
import { Notice } from '../../components/Notice/Notice';
import { InternalNotice } from '../../components/Notice/InternalNotice';
import { Backdrop } from '../../components/Backdrop';
import { getItemLocation } from '../../resources/Items';
import { removeItemFromInventory } from '../../slices/inventorySlice';

export function AvatarCollection() {
  const t = useTranslator();

  const collection = useAppSelector((state) => state.character.collection.avatar);

  const [type, setType] = useState<'gray' | 'blue' | 'orange'>('orange');

  const avatars = collection.collectedIdxs[type];
  const config = SERVER_CONFIG.COLLECTION.avatars;
  const avatarConfig = SERVER_CONFIG.AVATARS;

  let total = 0,
    collected = 0;

  collected += collection.collectedIdxs.gray.length;
  collected += collection.collectedIdxs.blue.length;
  collected += collection.collectedIdxs.orange.length;

  total += config.gray.outfits.length;
  total += config.blue.outfits.length;
  total += config.orange.outfits.length;

  return (
    <JPanel width={670} height={460} background="UIResource.Common.BigBG1" padding={5}>
      <JPanel width={185} height={29} background="UIResource.Common.BigBG4">
        <select
          style={{ position: 'absolute', left: 75, top: 4, width: 105, height: 21 }}
          value={type}
          onChange={(e) => {
            // @ts-ignore
            setType(e.target.value);
          }}>
          <option value={'gray'}>Gray</option>
          <option value={'blue'}>Blue</option>
          <option value={'orange'}>Orange</option>
        </select>
      </JPanel>

      <JPanel width={185} height={415} y={35} background="UIResource.Common.BigBG4">
        <JPanel width={185} padding={5}>
          {/* <Label y={35} text="Open Color" /> */}

          {/* <Label y={60} text="Remaining" /> */}
          {/* <Label x={103} y={60} text="LeftTimes" /> */}
          {/* <JButton size={{ width: 40, height: 20 }} x={137} y={60} text="Add" /> */}
          <Label y={60} text={`${type.charAt(0).toUpperCase() + type.slice(1)} Collected`} />
          <Label className="right" y={60} text={avatars.length + '/' + config[type].outfits.length} />
          <Label y={80} text="Total Collected" />
          <Label className="right" y={80} text={collected + '/' + total} />

          <Label y={100} text="Total Directory Lv" />
          <Label className="right" y={100} text={'' + collection.level} />

          <JPanel width={175} height={110} y={120} background="UIResource.Common.BigBG3" padding={5}>
            <Label className="center bold" text="Property Total" />
            <Label x={5} y={25} text="Strength" />
            <Label x={70} y={25} text={`+${collection.stats[1]}`} />
            <JPanel width={165} height={2} y={43} background="UIResource.Common.PartitionYellow" />
            <Label x={5} y={45} text="Agility" />
            <Label x={70} y={45} text={`+${collection.stats[2]}`} />
            <JPanel width={165} height={2} y={63} background="UIResource.Common.PartitionYellow" />
            <Label x={5} y={65} text="Stamina" />
            <Label x={70} y={65} text={`+${collection.stats[3]}`} />
            <JPanel width={165} height={2} y={83} background="UIResource.Common.PartitionYellow" />
          </JPanel>

          <JPanel width={175} height={170} y={235} background="UIResource.Common.BigBG3" padding={5}>
            <Label className="center bold" text="Level Bonus" />
            <Label x={5} y={25} text="Max Hp" />
            <Label x={70} y={25} text={`+${(collection.stats[9] / 10).toFixed(1)}%`} />
            <JPanel width={165} height={2} y={43} background="UIResource.Common.PartitionYellow" />
            <Label x={5} y={45} text="Attack" />
            <Label x={70} y={45} text={`+${(collection.stats[11] / 10).toFixed(1)}%`} />
            <JPanel width={165} height={2} y={63} background="UIResource.Common.PartitionYellow" />
            <Label x={5} y={65} text="Speed" />
            <Label x={70} y={65} text={`+${(collection.stats[12] / 10).toFixed(1)}%`} />
            <JPanel width={165} height={2} y={83} background="UIResource.Common.PartitionYellow" />
          </JPanel>
        </JPanel>
      </JPanel>

      <JPanel width={470} height={355} x={190} background="UIResource.Common.BigBG4" padding={5}>
        <Label className="center sm bold" text="Collect outfits at +2 or above to gain additional stats." />
        <JPagination
          items={config[type].outfits}
          perPage={9}
          render={(items, page) => (
            <JLayout horizontal>
              {items.map((i, idx) =>
                !!i ? (
                  <JPanel key={page * 9 + idx} width={150} height={100} background="UIResource.Common.BigBG3" padding={5}>
                    <JImage src={`ui/UIResource/Icon/${avatars.includes(page * 9 + idx) ? 'RoleAccomplish' : 'Roleing'}.png`} />
                    <Label className="center sm bold" x={20} y={1} text={t(`item__${i[0]}--name`)} style={{ width: 120 }} />
                    <DisplayGrid
                      size={{ width: 2, height: 2 }}
                      y={24}
                      onClick={() => {
                        if (!avatars.includes(page * 9 + idx)) {
                          display('avatarSelect', <AvatarSelect iid={i[0]} onClose={() => closeDisplay('avatarSelect')} />);
                        }
                      }}>
                      <JImage
                        className={avatars.includes(page * 9 + idx) ? '' : 'gray clickable'}
                        src={`icons/items/${avatarConfig[i[0]]?.src ?? 1}.png`}
                        // style={{ filter: 'grayscale(1)' }}
                      />
                    </DisplayGrid>

                    <JPanel width={70} height={20} x={70} y={20} background="UIResource.Common.BigBG2" padding={2}>
                      <Label text="Str" />
                      <Label y={0} className="right" text={`+${i[1]}`} />
                    </JPanel>

                    <JPanel width={70} height={20} x={70} y={45} background="UIResource.Common.BigBG2" padding={2}>
                      <Label text="Agi" />
                      <Label y={0} className="right" text={`+${i[2]}`} />
                    </JPanel>

                    <JPanel width={70} height={20} x={70} y={70} background="UIResource.Common.BigBG2" padding={2}>
                      <Label text="Sta" />
                      <Label y={0} className="right" text={`+${i[3]}`} />
                    </JPanel>
                  </JPanel>
                ) : (
                  <JPanel key={page * 9 + idx} width={150} height={100} padding={5} />
                )
              )}
            </JLayout>
          )}
          paginationStyle={{ position: 'absolute', top: 327 }}
        />
      </JPanel>

      <JPanel width={470} height={90} x={190} y={360} background="UIResource.Common.BigBG4" padding={5}>
        <Label className="center sm bold" text="Collect indicated number of outfits at +2 or above to gain additional stats." />

        {Object.keys(config[type].levels).map((lv, idx) => (
          <JPanel
            className="pointer"
            key={type + '' + lv}
            width={50}
            height={65}
            x={10 + 65 * idx}
            y={15}
            background="UIResource.Icon.Grid_Base1"
            padding={5}
            onClick={() =>
              display(
                'internal',
                <InternalNotice message={_formatLevelBonus(config[type].levels[lv])} onClose={() => closeDisplay('internal')} />
              )
            }>
            <Label className="center xs" text={`Lv ${idx + 1}`} />
            <JImage position={{ x: 0, y: 15 }} src={`ui/UIResource/Coat/Coat${idx + 1}.png`} />
          </JPanel>
        ))}
      </JPanel>
    </JPanel>
  );
}

function AvatarSelect({ iid, onClose }: { iid: number; onClose: () => void }) {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.inventory.items);
  const [selectedUID, setSelectedUID] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const avatars = Object.keys(items).filter(
    (uid) => items[uid].iid === iid && items[uid].props?.level >= 2 && getItemLocation(items[uid]) <= 9
  );

  return (
    <>
      <Backdrop />
      <Panel moveable={false} onClose={onClose} style={{ zIndex: 21000 }}>
        <JPanel size={{ width: 300, height: 200 }} background="UIResource.Common.BigBG1" padding={5}>
          <JPagination
            items={avatars}
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
              text="Submit"
              disabled={!selectedUID || loading}
              loading={loading}
              onClick={() => {
                setLoading(true);
                prompt(
                  'This will destroy the outfit, are you sure you want to proceed?',
                  () => {
                    toServer('collectItem', selectedUID, () => {
                      setLoading(false);
                      onClose();
                      dispatch(removeItemFromInventory(selectedUID));
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
    </>
  );
}

function _formatLevelBonus(levelBonus: [number, number, number][]) {
  return `Max Hp: ${(levelBonus[0][1] / 10).toFixed(1)}%\nAttack: ${(levelBonus[1][1] / 10).toFixed(1)}%\nSpeed: ${(
    levelBonus[2][1] / 10
  ).toFixed(1)}%`;
}
