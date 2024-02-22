import { useDispatch } from 'react-redux';
import { ImageWithSpinner } from '../../components/ImageWithSpinner';
import { NpcMenu } from '../../components/NpcMenu/NpcMenu';
import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import { JImage } from '../../components/UI/JImage';
import { JLayout } from '../../components/UI/JLayout';
import { JPagination } from '../../components/UI/JPagination';
import JPanel from '../../components/UI/JPanel';
import { Label } from '../../components/UI/Label';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useTranslator from '../../hooks/translate';
import { getItemAmount, getItemSrc } from '../../resources/Items';
import { updateBloodlineLimit } from '../../slices/characterSlice';
import { closeDisplay, display } from '../../util/EventEmitter';
import { toServer } from '../../util/ServerSocket';
import { SERVER_CONFIG } from '../../util/serverConfig';
import { useState } from 'react';
import { LimitTooltip } from '../Bloodlines/Limits/LimitTooltip';

const WIDTH = 550;

export function NinjaHouse({ onClose }: { onClose: () => void }) {
  const t = useTranslator();
  const dispatch = useDispatch();
  const bloods = useAppSelector((state) => state.character.bloodlines);

  const bloodlines = SERVER_CONFIG.BLOODLINE.Limits;

  return (
    <Panel name="Ninja House" onClose={onClose}>
      <JPanel width={WIDTH} height={310} background="UIResource.Common.BigBG1" padding={5}>
        <JPanel width={WIDTH - 10} height={300} background="UIResource.Common.BigBG4">
          <JPagination
            perPage={8}
            items={Object.keys(bloodlines).sort((k1, k2) => bloodlines[k1].level - bloodlines[k2].level)}
            render={(items) =>
              items
                .filter((i) => i !== null && i !== undefined)
                .map((i, idx) => (
                  <JPanel
                    key={i}
                    position={{ x: 5 + (idx % 4) * 134, y: 5 + Math.floor(idx / 4) * 135 }}
                    width={(WIDTH - 40) / 4}
                    height={130}
                    background="UIResource.Common.BigBG3"
                    padding={5}
                    style={{ position: 'absolute', fontSize: '0.8rem' }}>
                    <JImage position={{ x: 5, y: 5 }} src={`icons/people51/${bloodlines[i].avatar}.jpg`} />
                    <JButton
                      y={5}
                      x={65}
                      size={{ width: 50, height: 20 }}
                      text="Talk"
                      onClick={() =>
                        display(
                          'bloodlineNpcMenu',
                          <BloodlineNpcMenu id={i} bloodline={bloodlines[i]} onClose={() => closeDisplay('bloodlineNpcMenu')} />
                        )
                      }
                    />
                    <BloodlineLookup id={i} />

                    <Label y={60} text={t(`item__${290000 + bloodlines[i].avatar}--name`)} />
                    <Label y={75} text={`Likes: ${t(`item__${bloodlines[i].item}--name`)}`} />
                    <Label y={90} text={`Amity ${bloods.limits[i]?.amity ?? 0}/${bloodlines[i].amity}`} />
                    <Label y={105} text={`Lv. ${bloodlines[i].level}`} />
                  </JPanel>
                ))
            }
            paginationStyle={{ position: 'absolute', bottom: 5 }}
          />
        </JPanel>
      </JPanel>
    </Panel>
  );
}

function BloodlineNpcMenu({ id, bloodline, onClose }: { id: number; bloodline: any; onClose: () => void }) {
  const t = useTranslator();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.inventory.items);
  const limit = useAppSelector((state) => state.character.bloodlines.limits[id]);

  const itemAmount = Object.keys(items).reduce((sum, uid) => {
    if (items[uid].iid === bloodline.item) {
      sum += getItemAmount(items[uid]);
    }

    return sum;
  }, 0);

  return (
    <Panel name={'Ninja Saga'} moveable onClose={onClose}>
      <JPanel size={{ width: 475, height: 204 }}>
        <JPanel size={{ width: 161, height: 204 }} background="UIResource.NPC.TottomBG1">
          <JPanel size={{ width: 137, height: 182 }} position={{ x: 13, y: 13 }} background="UIResource.NPC.EstopCircle" />
          <JPanel size={{ width: 135, height: 180 }} position={{ x: 13, y: 13 }}>
            <ImageWithSpinner src={`icons/npc/${81000 + Number(id)}.png`} />
          </JPanel>
        </JPanel>

        <JPanel size={{ width: 309, height: 65 }} position={{ x: 166, y: 0 }} background="UIResource.Common.BigBG1">
          <MultilineLabel size={{ width: 299, height: 55 }} position={{ x: 5, y: 5 }} text={t(`npc__${81000 + Number(id)}--talk`)} />
        </JPanel>

        <JPanel size={{ width: 309, height: 134 }} position={{ x: 166, y: 70 }} background="UIResource.Common.BigBG1" padding={5}>
          <div className="bold">Quest Description</div>
          <JImage position={{ x: 5, y: 20 }} src={getItemSrc({ iid: bloodline.item })} />
          <Label x={35} y={25} text={`${`item__${bloodline.item}--name`} x4`} />
          <Label y={50} className="bold" text="Amity" />
          <Label x={5} y={75} text={`${limit?.amity ?? 0}/${bloodline.amity}`} />
          <JButton
            x={309 / 2 - 75 / 2}
            y={100}
            text="Turn In"
            disabled={(limit?.amity ?? 0) >= bloodline.amity || itemAmount < 4}
            onClick={() => {
              toServer('bloodlineTurnIn', id, (limit) => {
                dispatch(updateBloodlineLimit({ id, limit }));
              });
            }}
          />
        </JPanel>
      </JPanel>
    </Panel>
  );
}

function BloodlineLookup({ id }: { id: number }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
      <Label className="clickable" y={25} x={65} text="Bloodline" style={{ fontSize: '0.75rem' }} />
      {isHovering && <LimitTooltip id={id} />}
    </div>
  );
}
