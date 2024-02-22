import './NewPlayer.css';
import * as React from 'react';
import Fight from '../../components/Fight/Fight';
import { DefineSprite } from '../../components/Flash/DefineSprite';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { Label } from '../../components/UI/Label';
import { useAppDispatch } from '../../hooks';
import { endFight } from '../../slices/fightSlice';
import { setHomeVillage } from '../../slices/uiSlice';
import { CDNImage } from '../../components/Elements/Image';
import { toServer } from '../../util/ServerSocket';

enum RoleList {
  NONE = -1,
  SHIZUNE = 39,
  NEMU = 65,
  NANAO = 32,
  GGIO = 3,
  KIBA = 17,
  Tenten = 63,
  Love = 9,
  Renji = 14,
  Rangiku = 34,
  Choji = 16,
}

enum VillageList {
  NONE = -1,
  FIRE = 111,
  WATER = 211,
  LIGHTNING = 311,
  WIND = 411,
  EARTH = 511,
}

const stats: { [id: number]: { avatar: number; isv: number[]; bmv: number[] } } = {
  290003: { avatar: 3, isv: [0.65, 1.1, 0.65], bmv: [17, 10, 14] },
  290009: { avatar: 9, isv: [1.2, 0.4, 0.8], bmv: [11, 22, 10] },
  290014: { avatar: 14, isv: [1.3, 0.3, 0.8], bmv: [10, 21, 12] },
  290016: { avatar: 16, isv: [1.15, 0.2, 1.15], bmv: [9, 121, 8] },
  290017: { avatar: 17, isv: [0.85, 1.15, 0.4], bmv: [12, 11, 18] },
  290032: { avatar: 32, isv: [0.7, 0.8, 1.0], bmv: [11, 26, 9] },
  290034: { avatar: 34, isv: [1.15, 0.35, 0.9], bmv: [10, 21, 11] },
  290039: { avatar: 39, isv: [0.5, 0.7, 1.2], bmv: [19, 16, 8] },
  290063: { avatar: 63, isv: [0.5, 1.0, 0.7], bmv: [17, 11, 13] },
  290065: { avatar: 65, isv: [0.6, 0.5, 1.3], bmv: [19, 29, 6] },
};

export const NewPlayer: React.FC<{}> = ({}) => {
  const dispatch = useAppDispatch();

  const [selected, setSelected] = React.useState<RoleList>(RoleList.NONE);

  const [selectedVillage, setVillage] = React.useState<VillageList>(VillageList.NONE);

  const [name, setName] = React.useState('');
  const [invalidMessage, setInvalidMessage] = React.useState('Name must be at least 3 characters long.');

  const disabled = selected === RoleList.NONE || name === '' || name.length < 3 || selectedVillage == VillageList.NONE;

  function onClick() {
    toServer('firstFight', { id: selected, displayName: name, village: selectedVillage }, (message: string) => {
      setInvalidMessage(message);
    });
  }

  const onFinish = React.useCallback(() => {
    dispatch(setHomeVillage(selectedVillage));
    dispatch(endFight());

    toServer('switchScene', selectedVillage);
  }, [selectedVillage]);

  React.useEffect(() => {
    if (name.length < 3) {
      setInvalidMessage('Name must be at least 3 characters long.');
    } else if (selectedVillage === VillageList.NONE) {
      setInvalidMessage('Select a village in step 1.');
    } else {
      setInvalidMessage('');
    }
  }, [name, selectedVillage]);

  const props = selected !== RoleList.NONE ? stats[290000 + selected] : { isv: [0, 0, 0], bmv: [0, 0, 0] };

  return (
    <div className="newPlayer" style={{ position: 'relative', background: 'black', height: '100vh' }}>
      <CDNImage src="scenes/newPlayer/bg.jpg" />

      <Label className={'text-shadow'} text={'lbl_step_1'} position={{ x: 20, y: 39 }} style={{ color: 'whitesmoke' }} />
      <DefineSprite src="scenes/newPlayer/villageBg.png" position={{ x: 68, y: 80 }} />
      <Villages selectedVillage={selectedVillage} setVillage={setVillage} />
      <Label text={'lbl_tribe'} position={{ x: 80, y: 90 }} style={{ color: 'whitesmoke', fontSize: 13, fontFamily: 'tahoma' }} />
      <Label className={'text-shadow'} text={'lbl_step_2'} position={{ x: 20, y: 154 }} style={{ color: 'whitesmoke' }} />
      <Roles selected={selected} setSelected={setSelected} />
      <DefineSprite src="scenes/newPlayer/statBg.png" position={{ x: 68, y: 348 }} />
      {selected !== RoleList.NONE && (
        <>
          <div style={{ position: 'absolute', top: 355, left: 75, color: 'whitesmoke' }}>
            Base Stats: Str - {props.isv[0] * 20} | Agi - {props.isv[1] * 20} | Sta - {props.isv[2] * 20}
          </div>
          <div style={{ position: 'absolute', top: 375, left: 75, color: 'whitesmoke', fontSize: 8 }}>
            Every {props.bmv[0]} points of Strength increases attack by 1% and block by 1 point
            <br />
            Every {props.bmv[1]} points of Agililty increases speed by 1% and dodge by 1 point
            <br />
            Every {props.bmv[2]} points of Stamina increases health and chakra by 1%
          </div>
        </>
      )}

      <Label className={'text-shadow'} text={'lbl_step_3'} position={{ x: 550, y: 425 }} style={{ color: 'whitesmoke' }} />
      <DefineSprite src="scenes/newPlayer/nameCharacterBg.png" position={{ x: 609, y: 450 }} />
      <input
        style={{ position: 'absolute', top: 459, left: 724, width: 143, height: 18, border: 0, padding: 0 }}
        onChange={(e) => setName(e.currentTarget.value)}
      />
      <Label
        text={'lbl_name_character'}
        position={{ x: 621, y: 458 }}
        style={{ color: 'whitesmoke', fontSize: 13, fontFamily: 'tahoma' }}
      />
      <div style={{ position: 'absolute', top: 488, left: 621, color: 'red', fontSize: 12 }}>{invalidMessage}</div>

      <Label className={'text-shadow'} text={'lbl_step_4'} position={{ x: 550, y: 552 }} style={{ color: 'whitesmoke' }} />
      <JButton text={'Play Game'} onClick={onClick} size={{ width: 186, height: 34 }} position={{ x: 654, y: 537 }} disabled={disabled} />

      <Fight onFinish={onFinish} />
    </div>
  );
};

const Roles: React.FC<{ setSelected: (id: RoleList) => void; selected: RoleList }> = ({ setSelected, selected }) => {
  return (
    <JPanel size={{ width: 338, height: 127 }} position={{ x: 58, y: 198 }}>
      <Role x={0} y={0} role={RoleList.SHIZUNE} onClick={setSelected} selected={selected} />
      <Role x={65} y={0} role={RoleList.NEMU} onClick={setSelected} selected={selected} />
      <Role x={130} y={0} role={RoleList.NANAO} onClick={setSelected} selected={selected} />
      <Role x={195} y={0} role={RoleList.GGIO} onClick={setSelected} selected={selected} />
      <Role x={260} y={0} role={RoleList.KIBA} onClick={setSelected} selected={selected} />

      <Role x={-15} y={64} role={RoleList.Tenten} onClick={setSelected} selected={selected} />
      <Role x={50} y={64} role={RoleList.Love} onClick={setSelected} selected={selected} />
      <Role x={115} y={64} role={RoleList.Renji} onClick={setSelected} selected={selected} />
      <Role x={180} y={64} role={RoleList.Rangiku} onClick={setSelected} selected={selected} />
      <Role x={245} y={64} role={RoleList.Choji} onClick={setSelected} selected={selected} />
    </JPanel>
  );
};

const Villages: React.FC<{ setVillage: (villageId: VillageList) => void; selectedVillage: VillageList }> = ({
  setVillage,
  selectedVillage,
}) => {
  return (
    <JPanel size={{ width: 68, height: 80 }} position={{ x: 68, y: 80 }}>
      <Village x={60} y={0} village={VillageList.FIRE} onClick={setVillage} selectedVillage={selectedVillage} />
      <Village x={100} y={0} village={VillageList.WATER} onClick={setVillage} selectedVillage={selectedVillage} />
      <Village x={132} y={0} village={VillageList.WIND} onClick={setVillage} selectedVillage={selectedVillage} />
      <Village x={180} y={0} village={VillageList.EARTH} onClick={setVillage} selectedVillage={selectedVillage} />
      <Village x={220} y={0} village={VillageList.LIGHTNING} onClick={setVillage} selectedVillage={selectedVillage} />
    </JPanel>
  );
};

const roleOffset = {
  [RoleList.NONE]: { x: 0, y: 0, src: '' },
  [RoleList.SHIZUNE]: { x: 2, y: 7, src: 'scenes/newPlayer/momo.png' },
  [RoleList.NEMU]: { x: 5, y: 8, src: 'scenes/newPlayer/kurotsuchi.png' },
  [RoleList.NANAO]: { x: 6, y: 8, src: 'scenes/newPlayer/nanao.png' },
  [RoleList.GGIO]: { x: 4, y: 8, src: 'scenes/newPlayer/ggio.png' },
  [RoleList.KIBA]: { x: 4, y: 8, src: 'scenes/newPlayer/kiba.png' },
  [RoleList.Tenten]: { x: 6, y: 8, src: 'scenes/newPlayer/tenten.png' },
  [RoleList.Love]: { x: 5, y: 8, src: 'scenes/newPlayer/love.png' },
  [RoleList.Renji]: { x: 4, y: 8, src: 'scenes/newPlayer/renji.png' },
  [RoleList.Rangiku]: { x: 3, y: 8, src: 'scenes/newPlayer/rangiku.png' },
  [RoleList.Choji]: { x: 3, y: 8, src: 'scenes/newPlayer/choji.png' },
};

const villageOffeset = {
  [VillageList.NONE]: { x: 0, y: 0, src: '' },
  [VillageList.FIRE]: { x: 6, y: 5, src: 'scenes/newPlayer/villageLeaf.png' },
  [VillageList.WATER]: { x: 8, y: 5, src: 'scenes/newPlayer/villageMist.png' },
  [VillageList.WIND]: { x: 15, y: 3, src: 'scenes/newPlayer/villageSand.png' },
  [VillageList.EARTH]: { x: 10, y: 3, src: 'scenes/newPlayer/villageRock.png' },
  [VillageList.LIGHTNING]: { x: 15, y: 3, src: 'scenes/newPlayer/villageCloud.png' },
};

const Role: React.FC<{ x: number; y: number; role: RoleList; selected: RoleList; onClick: (role: RoleList) => void }> = ({
  x,
  y,
  role,
  selected,
  onClick,
}) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    top: y + roleOffset[role].y,
    left: x + roleOffset[role].x,
    WebkitMaskImage: `url(${process.env.REACT_APP_CDN_PATH}scenes/newPlayer/iconBgMask.png)`,
    WebkitMaskPosition: `-${roleOffset[role].x - 2}px -${roleOffset[role].y - 2}px`,
  };

  const className = selected === role ? 'newPlayer__role-selected' : 'newPlayer__role';

  return (
    <>
      <DefineSprite src="scenes/newPlayer/iconBg.png" position={{ x, y }} />
      <CDNImage className={className} src={roleOffset[role].src} style={style} onClick={() => onClick(role)} />
    </>
  );
};

const Village: React.FC<{
  x: number;
  y: number;
  village: VillageList;
  selectedVillage: VillageList;
  onClick: (village: VillageList) => void;
}> = ({ x, y, village, selectedVillage, onClick }) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    top: y + villageOffeset[village].y,
    left: x + villageOffeset[village].x,
    WebkitMaskImage: `url(${process.env.REACT_APP_CDN_PATH}scenes/newPlayer/iconBgMask.png)`,
    WebkitMaskPosition: `-${villageOffeset[village].x - 2}px -${villageOffeset[village].y - 2}px`,
  };

  const className = selectedVillage === village ? 'newPlayer__role' : 'newPlayer__role-selected';

  return (
    <>
      <CDNImage className={className} src={villageOffeset[village].src} style={style} onClick={() => onClick(village)} />
    </>
  );
};
