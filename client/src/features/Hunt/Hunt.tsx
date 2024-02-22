import { useEffect } from 'react';
import Panel from '../../components/Panel/Panel';
import JPanel from '../../components/UI/JPanel';
import { SERVER_CONFIG } from '../../util/serverConfig';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { setHunt } from '../../slices/fieldSlice';
import { CDNImage } from '../../components/Elements/Image';
import { cancelFromServer, fromServer, toServer } from '../../util/ServerSocket';

export function Hunt() {
  const dispatch = useAppDispatch();
  const village = useAppSelector((state) => state.ui.homeVillage);
  const hunt = useAppSelector((state) => state.field.hunt);

  const scenes = SERVER_CONFIG.SCENES;

  useEffect(() => {
    fromServer('huntInfo', (data) => dispatch(setHunt(data)));

    return () => {
      cancelFromServer('huntInfo');
    };
  }, []);

  function goto(monsterId: number) {
    const scene = Object.keys(scenes).find((key) => scenes[key].monsters.includes(monsterId)) || '-1';

    if (scene !== '-1') {
      localStorage.setItem('autoInteract', '' + monsterId);
      toServer('switchScene', parseInt(scene, 10));
    }
  }

  if (hunt.monsters.length === 0) {
    return null;
  }

  return (
    <Panel name="Hunt" minimizable style={{ width: 150 }}>
      <JPanel size={{ width: 150, height: 52 }} background="UIResource.Common.BigBG4">
        {hunt.monsters.map((monster, idx) => (
          <CDNImage
            key={`hunt-${idx}-${monster.id}`}
            className={hunt.killed.includes(idx) ? 'disabled' : 'clickable'}
            src={`icons/monsters/${monster.avatar}.png`}
            width="50"
            height="50"
            onClick={() => {
              if (!hunt.killed.includes(idx)) {
                goto(monster.id);
              }
            }}
          />
        ))}

        {hunt.killed.length === hunt.monsters.length && (
          <div
            className="text-outline clickable"
            style={{
              position: 'absolute',
              top: 5,
              left: 5,
              fontSize: 22,
              fontFamily: 'KOMIKAK',
              textAlign: 'center',
              width: 140,
              color: 'darkgreen',
              userSelect: 'none',
            }}
            onClick={() => {
              localStorage.setItem('autoInteract', '11002');
              toServer('switchScene', village);
            }}>
            Completed
          </div>
        )}
      </JPanel>
    </Panel>
  );
}
