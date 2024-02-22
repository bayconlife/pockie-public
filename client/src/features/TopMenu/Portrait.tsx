import { useEffect, useState } from 'react';
import { useAppSelector } from '../../hooks';
import { Tooltip } from '../../components/Tooltips/Tooltip';
import useObjectTranslator from '../../hooks/objectTranslate';
import { Countdown } from '../MultiFightDisplay/Countdown';
import { JImage } from '../../components/UI/JImage';
import { JButton } from '../../components/UI/JButton';
import ImageButton from '../../components/Buttons/ImageButton';
import { Label } from '../../components/UI/Label';
import { CDNImage } from '../../components/Elements/Image';
import { cancelFromServer, fromServer } from '../../util/ServerSocket';
import { display } from '../../util/EventEmitter';
import Panel from '../../components/Panel/Panel';
import JPanel from '../../components/UI/JPanel';

export function Portrait() {
  const equippedAvatar = useAppSelector((state) => state.inventory.items[state.inventory.locations[300]]);
  const buffs = useAppSelector((state) => state.character.buffs);
  const stats = useAppSelector((state) => state.stats.stats);
  const name = useAppSelector((state) => state.ui.displayName);
  const recovery = useAppSelector((state) => state.character.recovery);

  const percentage = 100;
  const hpPercentage = (stats.hp / stats.maxHp) * 100;
  const hpRecoveryPercentage = (recovery.hp / 10000) * 100;

  useEffect(() => {
    fromServer('recover', (args) => {});

    return () => {
      cancelFromServer('recover');
    };
  }, []);

  return (
    <div style={{ position: 'absolute', top: 35, display: 'flow' }}>
      <JImage position={{ y: 0 }} src="ui/RoleIcon/bg.png" />
      <JImage
        position={{ y: 0 }}
        src={`icons/people/${equippedAvatar?.props?.avatar}.png`}
        style={{
          WebkitMaskImage: `url(${process.env.REACT_APP_CDN_PATH}ui/RoleIcon/portrait_mask.png)`,
          WebkitMaskRepeat: 'no-repeat',
        }}
      />

      <Label position={{ x: 92, y: 2 }} text={name} style={{ width: 200, fontFamily: 'TrebuchetMS', fontSize: 12, color: 'whitesmoke' }} />

      <JImage position={{ x: 73, y: 18 }} src="ui/RoleIcon/indicators.png" />

      <JImage
        position={{ x: 100, y: 18 }}
        src="ui/RoleIcon/hp.png"
        style={{ clipPath: `polygon(0 0, ${hpPercentage}% 0, ${hpPercentage}% 100%, 0 100%)` }}
      />
      <JImage position={{ x: 99, y: 18 }} src="ui/RoleIcon/bar.png" />
      <JImage className="clickable" position={{ x: 204, y: 18 }} src="ui/RoleIcon/refill_box.png" />
      <JImage
        className="clickable"
        position={{ x: 206, y: 19 }}
        src="ui/RoleIcon/refill_hp.png"
        style={{ clipPath: `polygon(0 ${100 - hpRecoveryPercentage}%, 100% ${100 - hpRecoveryPercentage}%, 100% 100%, 0 100%)` }}
        onClick={() => {}}
      />

      <JImage
        position={{ x: 96, y: 30 }}
        src="ui/RoleIcon/mp.png"
        style={{ clipPath: `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)` }}
      />
      <JImage position={{ x: 95, y: 30 }} src="ui/RoleIcon/bar.png" />
      <JImage position={{ x: 200, y: 30 }} src="ui/RoleIcon/refill_box.png" />
      <JImage
        position={{ x: 202, y: 31 }}
        src="ui/RoleIcon/refill_mp.png"
        style={{ clipPath: `polygon(0 ${100 - percentage}%, 100% ${100 - percentage}%, 100% 100%, 0 100%)` }}
      />

      <JImage
        position={{ x: 92, y: 42 }}
        src="ui/RoleIcon/vp.png"
        style={{ clipPath: `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)` }}
      />
      <JImage position={{ x: 91, y: 42 }} src="ui/RoleIcon/bar.png" />
      <ImageButton style={{ position: 'absolute', left: 196, top: 42 }} defaultImage="ui/RoleIcon/refill_vp_btn.png" onClick={() => {}} />

      <Label
        position={{ x: 82, y: 58 }}
        text={`Lv. ${stats.level}`}
        style={{ width: 100, fontFamily: 'TrebuchetMS', fontSize: 12, color: 'whitesmoke' }}
      />

      <div style={{ position: 'absolute', top: 84 }}>
        {Object.keys(buffs).map((id) => (
          <BuffIcon key={id} id={id} expires={buffs[Number(id)]} />
        ))}
      </div>
    </div>
  );
}

function BuffIcon({ id, expires }: { id: string; expires: number }) {
  const t = useObjectTranslator();
  const [isHover, setIsHover] = useState(false);

  return (
    <>
      <CDNImage src={`icons/buffs/${id}.png`} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)} />
      {isHover && (
        <Tooltip text={t(`buff__${id}--tooltip`)}>
          <Countdown initial={expires - Date.now()} />
        </Tooltip>
      )}
    </>
  );
}

function RecoveryPanel() {
  return (
    <Panel name="Recovery" moveable={false}>
      <JPanel width={300} height={200} background="UIResource.Common.BigBG1"></JPanel>
    </Panel>
  );
}
