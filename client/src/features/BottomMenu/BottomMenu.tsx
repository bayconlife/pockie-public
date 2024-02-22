import './BottomMenu.css';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import ImageButton from '../../components/Buttons/ImageButton';
import { NineSlice } from '../../components/NineSlice';
import SkillMenu from '../SkillMenu';
import { showSkills } from '../../slices/skillsSlice';
import { Inventory } from '../Inventory/Inventory';
import { hideInventory, showInventory } from '../../slices/inventorySlice';
import { useAppSelector } from '../../hooks';
import { StatMenu } from '../StatMenu/StatMenu';
import { hideStats, showStats } from '../../slices/statSlice';
import { QuestNavigation } from '../QuestNavigation/QuestNavigation';
import { SERVER_CONFIG } from '../../util/serverConfig';
import { hideSocial, showSocial } from '../../slices/panelSlice';
import { SocialMenu } from '../SocialMenu/SocialMenu';

export const BottomMenu: React.FC<{}> = ({}) => {
  const dispatch = useDispatch();
  const showInventoryMenu = useAppSelector((state) => state.inventory.show);
  const showSkillMenu = useAppSelector((state) => state.skills.show);
  const showStatMenu = useAppSelector((state) => state.stats.show);
  const stats = useAppSelector((state) => state.stats.stats);
  const isSocialShowing = useAppSelector((state) => state.panels.social);

  const [showQuests, setShowQuests] = React.useState(true);

  const expPerLevel = SERVER_CONFIG.LEVELING.expPerLevel;
  const expForLevel = expPerLevel[stats.level];
  const expToLevel = expPerLevel[stats.level + 1];

  const percent = Math.floor(((stats.exp - expForLevel) / (expToLevel - expForLevel)) * 100);
  const isMaxLevel = stats.level >= (SERVER_CONFIG.LEVELING?.max ?? 99);

  return (
    <>
      <div style={{ position: 'absolute', bottom: 1, right: 1, width: 656, height: 33 }}>
        <div style={{ position: 'relative' }}>
          <NineSlice
            url={`${process.env.REACT_APP_CDN_PATH}features/bottom-menu/2.png`}
            slice={[8, 20]}
            style={{ width: 238 - 10, height: 26 * 1.19 - 4, position: 'absolute', top: 0 }}
          />
          <div className="text-shadow" style={{ position: 'absolute', top: 4, left: 4, fontSize: 12 }}>
            Level: {stats.level}
          </div>
          <div className="text-shadow" style={{ position: 'absolute', top: 16, left: 4, fontSize: 12 }}>
            Exp:{isMaxLevel ? '' : ' '}
            {!isMaxLevel && (
              <progress max={100} value={percent} title={`${stats.exp} / ${expToLevel}`} style={{ width: 195, accentColor: 'green' }} />
            )}
          </div>

          {isMaxLevel && (
            <div
              className="text-outline"
              style={{
                position: 'absolute',
                top: -4,
                width: 228,
                textAlign: 'right',
                fontFamily: 'KOMIKAK',
                fontSize: 22,
                color: 'darkgreen',
              }}>
              MAX
            </div>
          )}

          <NineSlice
            url={`${process.env.REACT_APP_CDN_PATH}features/bottom-menu/2.png`}
            slice={[8, 20]}
            style={{ width: 419 - 10, height: 26 * 1.19 - 4, position: 'absolute', top: 0, left: 238 }}
          />

          <ImageButton
            onClick={() => dispatch(showInventoryMenu ? hideInventory() : showInventory())}
            defaultImage={'features/bottom-menu/11-1.png'}
            style={{ position: 'absolute', top: 3, left: 241 }}
          />
          <ImageButton
            onClick={() => dispatch(showStatMenu ? hideStats() : showStats())}
            defaultImage={'features/bottom-menu/11-2.png'}
            style={{ position: 'absolute', top: 3, left: 292 }}
          />
          <ImageButton
            onClick={() => dispatch(showSkillMenu ? showSkills(false) : showSkills(true))}
            defaultImage={'features/bottom-menu/11-3.png'}
            style={{ position: 'absolute', top: 3, left: 343 }}
          />
          <ImageButton
            onClick={() => setShowQuests(!showQuests)}
            defaultImage={'features/bottom-menu/task.png'}
            style={{ position: 'absolute', top: 3, left: 393 }}
          />
          <ImageButton
            onClick={() => dispatch(isSocialShowing ? hideSocial() : showSocial())}
            defaultImage={'features/bottom-menu/social.png'}
            style={{ position: 'absolute', top: 3, left: 443 }}
          />
          <ImageButton
            onClick={() => {}}
            defaultImage={'features/bottom-menu/rank.png'}
            style={{ position: 'absolute', top: 3, left: 493 }}
            disabled
          />
          <ImageButton
            onClick={() => {}}
            defaultImage={'features/bottom-menu/mart.png'}
            style={{ position: 'absolute', top: 3, left: 543 }}
            disabled
          />
          <ImageButton
            onClick={() => {}}
            defaultImage={'features/bottom-menu/shop.png'}
            style={{ position: 'absolute', top: 3, left: 593 }}
            disabled
          />
          {showQuests && (
            <QuestNavigation
              style={{ position: 'absolute', top: 0, left: 651, transform: 'translate(-100%, -100%)' }}
              onClose={() => setShowQuests(false)}
            />
          )}
        </div>
      </div>

      {showSkillMenu && <SkillMenu />}
      {showInventoryMenu && <Inventory />}
      {showStatMenu && <StatMenu />}
      <SocialMenu />
    </>
  );
};
