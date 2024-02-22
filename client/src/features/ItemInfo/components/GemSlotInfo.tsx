import * as React from 'react';
import useTranslator from '../../../hooks/translate';
import { useAppSelector } from '../../../hooks';
import { LineBreak } from './LineBreak';
import { getItemSrc } from '../../../resources/Items';
import { CharacterContext } from '../../../context/CharacterContext';
import { CDNImage } from '../../../components/Elements/Image';

interface Props {
  gems: (string | null)[];
}

export function GemSlotInfo({ gems }: Props) {
  return (
    <>
      <LineBreak />
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', gap: 4 }}>
        {gems.map((uid, idx) => (
          <GemSlot key={uid + '-' + idx} uid={uid} />
        ))}
      </div>
    </>
  );
}

function GemSlot({ uid }: { uid: string | null }) {
  const { character } = React.useContext(CharacterContext);
  const t = useTranslator();
  let item = useAppSelector((state) => (uid === null ? null : state.inventory.items[uid]));

  if (!!character && !!uid) {
    item = character.items[uid];
  }

  const props = item?.props || { stat: 0, value: 0 };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'center', gap: 4 }}>
      <div className="grid--overlap">
        <CDNImage src={'ui/Gems/Open.png'} style={{ margin: 'auto' }} />
        {!!item && <CDNImage src={getItemSrc(item) ?? ''} width={24} height={24} style={{ margin: 'auto' }} />}
      </div>

      {item !== null && (
        <div style={{ color: '#388ee9' }}>
          {t(`stat__${props.stat}`)} +{[9, 11, 12, 14].includes(props.stat) ? (props.value / 10).toFixed(1) : props.value}
        </div>
      )}
      {item === null && <div>Open Socket</div>}
    </div>
  );
}
