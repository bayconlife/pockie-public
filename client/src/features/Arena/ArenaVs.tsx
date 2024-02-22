import * as React from 'react';
import { useAppSelector } from '../../hooks';
import ArenaVsSVGBackground from './ArenaVsSVGBackground';
import TintButton from '../../components/Buttons/TintButton';
import Panel from '../../components/Panel/Panel';
import { getAvatarPose } from '../../resources/Items';
import useTranslator from '../../hooks/translate';
import { CDNImage } from '../../components/Elements/Image';
import { toServer } from '../../util/ServerSocket';

interface Props {
  onFight: () => void;
  onClose: () => void;
  id?: string;
  role?: number;
  name: string;
  index: number;
}
const ArenaVs: React.FC<Props> = ({ onFight, onClose, id, role, name, index }) => {
  const t = useTranslator();
  const displayName = useAppSelector((state) => state.character.displayName);
  const equippedAvatar = useAppSelector((state) => state.inventory.items[state.inventory.locations[300]]);
  const score = useAppSelector((state) => state.stats.stats.score);
  const [opponentScore, setOpponentScore] = React.useState(0);
  const [scoreMod, setScoreMod] = React.useState([
    [0, 0],
    [0, 0],
  ]);

  React.useEffect(() => {
    toServer('arenaInfo', index, (info: any) => {
      setOpponentScore(info.score);
      setScoreMod(info.mod);
    });
  }, []);

  const playerScoreMod = scoreMod[0];
  const opponentScoreMod = scoreMod[1];

  return (
    <Panel onClose={onClose}>
      <div style={{ position: 'relative' }}>
        <ArenaVsSVGBackground />

        {equippedAvatar && (
          <CDNImage
            src={getAvatarPose(equippedAvatar)}
            className="absolute"
            style={{ inset: 0, transform: 'matrix(0.5, 0, 0, 0.5, 88, 104) translateY(-100%) translateX(-100%)' }}
          />
        )}
        <CDNImage
          src={`poses/${role}.png`}
          className="absolute"
          style={{ inset: 0, transform: 'matrix(0.5, 0, 0, 0.5, 291, 104) translateY(-100%) translateX(-100%)' }}
        />

        <span className="test-text" style={{ position: 'absolute', top: 18, left: 88, transform: 'translateY(-50%) translateX(-50%)' }}>
          {displayName}
        </span>
        <span className="test-text" style={{ position: 'absolute', top: 18, left: 289, transform: 'translateY(-50%) translateX(-50%)' }}>
          {t(name)}
        </span>

        <span style={{ position: 'absolute', bottom: 85, left: 5 }}>On Win: +{playerScoreMod[0]}</span>
        <span style={{ position: 'absolute', bottom: 65, left: 5 }}>On Loss: {playerScoreMod[1]}</span>
        <span style={{ position: 'absolute', bottom: 45, left: 5, width: 170, textAlign: 'center' }}>Score: {score / 100}</span>

        <span style={{ position: 'absolute', bottom: 85, left: 206 }}>On Win: +{opponentScoreMod[0]}</span>
        <span style={{ position: 'absolute', bottom: 65, left: 206 }}>On Loss: {opponentScoreMod[1]}</span>
        <span style={{ position: 'absolute', bottom: 45, left: 206, width: 170, textAlign: 'center' }}>Score: {opponentScore / 100}</span>

        <TintButton defaultImage="scenes/arena/battle-button.png" style={{ position: 'absolute', top: 270, left: 97 }} onClick={onFight} />
      </div>
    </Panel>
  );
};

export default ArenaVs;
