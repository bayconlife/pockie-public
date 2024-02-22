import * as React from 'react';
import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { JScrollPane } from '../../components/UI/JScollPane';
import { JTabbedPane } from '../../components/UI/JTabbedPane';
import { QuestType } from '../../enums';
import { useAppSelector } from '../../hooks';
import useTranslator from '../../hooks/translate';
import { getAcceptLocation, getCurrentProgress, getTurnInLocation } from '../../util/questInfo';
import { SERVER_CONFIG } from '../../util/serverConfig';
import { FightState } from '../../slices/fightSlice';
import { DailyTask } from './DailyTask';
import { toServer } from '../../util/ServerSocket';

enum Tab {
  AVAILABLE = 'Available',
  IN_PROGRESS = 'In Progress',
}

const tabs = [{ name: Tab.IN_PROGRESS }, { name: Tab.AVAILABLE }];

export const QuestNavigation: React.FC<{ onClose: () => void; style?: React.CSSProperties }> = ({ onClose, style }) => {
  const t = useTranslator();

  const available = useAppSelector((state) => state.quests.available);
  const inProgress = useAppSelector((state) => state.quests.inProgress);
  const village = useAppSelector((state) => state.ui.homeVillage);
  const fightState = useAppSelector((state) => state.fight.state);
  const dailyTaskCount = useAppSelector((state) => state.character.tasks.daily.inProgress.length);
  const scenes = SERVER_CONFIG.SCENES;

  const goTo = React.useCallback(
    (quest: any) => {
      let scene = '-1';
      let step = quest.steps[quest.step];
      let auto = '';

      if (step.type === QuestType.GIVE_ITEM) {
        scene = '' + village;
        auto = 'open__taskboard';
      }

      if (step.type === QuestType.KILL || step.type === QuestType.COLLECT) {
        scene = Object.keys(scenes).find((key) => isVillageLocation(key, village) && scenes[key].monsters.includes(step.monster)) || '-1';
        auto = step.monster;
      }

      if (step.type === QuestType.TALK) {
        scene = Object.keys(scenes).find((key) => isVillageLocation(key, village) && scenes[key].npcs.includes(step.npc)) || '-1';
        auto = step.npc;
      }

      if (available.find((q) => q.id === quest.id) !== undefined) {
        scene = Object.keys(scenes).find((key) => isVillageLocation(key, village) && scenes[key].npcs.includes(quest.acceptFrom)) || '-1';
        auto = quest.acceptFrom;
      }

      if (quest.completed) {
        if (quest.group) {
          scene = '' + village;
          auto = 'open__taskboard';
        } else {
          scene = Object.keys(scenes).find((key) => isVillageLocation(key, village) && scenes[key].npcs.includes(quest.turnIn)) || '-1';
          auto = quest.turnIn;
        }
      }

      if (scene !== '-1') {
        if (auto !== '') {
          localStorage.setItem('autoInteract', auto);
        }
        toServer('switchScene', parseInt(scene, 10));
      }
    },
    [available, inProgress]
  );

  const showInProgressTab = inProgress.length > 0 || available.length === 0 || dailyTaskCount > 0;

  return (
    <Panel name="Quest Navigation" moveable={false} style={{ ...style, width: 300 }} onClose={onClose}>
      <JPanel size={{ width: 300, height: 150 }}>
        <JTabbedPane size={{ width: 300, height: 150 }} tabs={tabs} active={showInProgressTab ? Tab.IN_PROGRESS : Tab.AVAILABLE}>
          <JTabbedPane.Tab name={Tab.IN_PROGRESS}>
            <JScrollPane size={{ width: 290, height: 120 }} position={{ x: 0, y: 0 }} style={{ fontSize: 12 }}>
              {inProgress.map((quest, idx) => (
                <JPanel
                  key={`main-quest-nav-${quest.id}`}
                  size={{ width: 273, height: 44 }}
                  // position={{ x: 0, y: idx * 53 }}
                  background="UIResource.Common.SmallBG1">
                  <div style={{ padding: 5, color: 'whitesmoke' }}>
                    <b>{t(`quest__${quest.id}--name`)}</b>
                    {quest.completed ? (
                      <div dangerouslySetInnerHTML={{ __html: t(`quest__available`).replace('%', getTurnInLocation(quest)) }}></div>
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: getCurrentProgress(quest) }}></div>
                    )}
                  </div>
                  <JButton
                    size={{ width: 30, height: 20 }}
                    position={{ x: 240, y: 20 }}
                    text={'Go'}
                    onClick={() => goTo(quest)}
                    disabled={fightState !== FightState.FINISHED}
                  />
                </JPanel>
              ))}
              <DailyTask goTo={goTo} offset={inProgress.length} />
            </JScrollPane>
          </JTabbedPane.Tab>

          <JTabbedPane.Tab name={Tab.AVAILABLE}>
            <JScrollPane size={{ width: 290, height: 120 }} position={{ x: 0, y: 0 }} style={{ fontSize: 12 }}>
              {available.map((quest, idx) => (
                <JPanel
                  key={`quest-nav-${quest.id}`}
                  size={{ width: 273, height: 44 }}
                  position={{ x: 0, y: idx * 53 }}
                  background="UIResource.Common.SmallBG1">
                  <div style={{ padding: 5, color: 'whitesmoke' }}>
                    <b>{t(`quest__${quest.id}--name`)}</b>
                    <b style={{ float: 'right' }}>Level Required {quest.level}</b>
                    <div dangerouslySetInnerHTML={{ __html: t(`quest__available`).replace('%', getAcceptLocation(quest)) }}></div>
                  </div>
                  <JButton
                    size={{ width: 30, height: 20 }}
                    position={{ x: 240, y: 20 + idx * 53 }}
                    text={'Go'}
                    onClick={() => goTo(quest)}
                  />
                </JPanel>
              ))}
            </JScrollPane>
          </JTabbedPane.Tab>
        </JTabbedPane>
      </JPanel>
    </Panel>
  );
};

function isVillageLocation(scene: string, village: number) {
  const sceneId = parseInt(scene, 10);
  const villageId = Math.floor(village / 100);
  const sceneReduced = Math.floor((parseInt(scene, 10) % 2000) / 100);

  if (sceneId >= 2100 && sceneId < 2600 && sceneReduced !== villageId) {
    return false;
  }

  if ([111, 211, 311, 411, 511].includes(sceneId) && sceneId !== village) {
    return false;
  }

  return true;
}
