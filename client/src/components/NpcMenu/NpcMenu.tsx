import './NpcMenu.css';
import * as React from 'react';
import Panel from '../Panel/Panel';
import JPanel from '../UI/JPanel';
import { MultilineLabel } from '../UI/MultilineLabel';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useTranslator from '../../hooks/translate';
import { displayQuest } from '../../slices/questsSlice';
import { batch } from 'react-redux';
import { QuestType } from '../../enums';
import { ImageWithSpinner } from '../ImageWithSpinner';
import { toServer } from '../../util/ServerSocket';

interface Props {
  onEnd: () => void;
  npc: number;
  name?: string;
  moveable?: boolean;
  imageOverride?: number;
  talkId?: string;
}

export const NpcMenu: React.FC<Props> = ({ onEnd, npc, moveable = true, imageOverride, children, talkId = '', name }) => {
  const dispatch = useAppDispatch();
  const t = useTranslator();
  const currentQuests = useAppSelector((store) => store.quests.inProgress);
  const [quests, setQuests] = React.useState<number[] | null>(null);
  const [tasks, setTasks] = React.useState<number[][]>([]);
  const [overwriteText, setOverwriteText] = React.useState('');
  const first = React.useRef(true);

  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    getQuests();
  }, [currentQuests, npc]);

  function getQuests() {
    toServer('getQuestsForNpc', { npc }, (questList: any, taskList: any) => {
      setQuests(questList);
      setTasks(taskList);
    });
  }

  function interactQuest(id: number) {
    const _quest = currentQuests.find((q) => q.id === id);

    if (_quest === undefined) {
      toServer('getQuestInfo', { id }, (resp: any) => {
        if (resp.error) {
          return;
        }

        onEnd();
        dispatch(displayQuest(resp));
      });
    } else {
      if (_quest.steps[_quest.step].type === QuestType.TALK && !_quest.completed) {
        setOverwriteText(t(`quest__${id}--talk${_quest.step === 0 ? '' : _quest.step}`));
        toServer('completeQuest', { id });
      } else {
        if (_quest.steps[_quest.step].type === QuestType.TALK) {
          setOverwriteText('');
        }

        if (_quest.completed) {
          onEnd();
        }

        dispatch(displayQuest(_quest));
      }
    }
  }

  function getQuestStatus(id: number) {
    const _quest = currentQuests.find((q) => q.id === id);

    if (_quest === undefined) {
      return '[Not Accepted]';
    }

    if (_quest.completed) {
      return '[Completed]';
    }

    if (_quest.steps[_quest.step].type === QuestType.TALK) {
      return '[Converse]';
    }

    return '[In Progress]';
  }

  function _onEnd() {
    batch(() => {
      setQuests(null);
      onEnd();
    });
  }

  const questList = (quests || []).map((quest, idx) => (
    <div key={idx} className="clickable" onClick={() => interactQuest(quest)}>
      {getQuestStatus(quest)} {t(`quest__${quest}--name`)}
    </div>
  ));

  const taskList = tasks.map((task, idx) => (
    <div
      key={idx}
      className="clickable"
      onClick={() => {
        toServer('talkToNpcForTask', npc, () => {
          setOverwriteText('Not bad, you found me quickly. Go claim your reward at the task board.');
          getQuests();
        });
      }}>
      [Converse] {t(`task_group__${task[1]}--name`)}
    </div>
  ));

  return (
    <Panel name={name ? name : t(`npc__${npc}--name`)} moveable>
      <JPanel size={{ width: 475, height: 204 }}>
        <JPanel size={{ width: 161, height: 204 }} background="UIResource.NPC.TottomBG1">
          <JPanel size={{ width: 137, height: 182 }} position={{ x: 13, y: 13 }} background="UIResource.NPC.EstopCircle" />
          <JPanel size={{ width: 135, height: 180 }} position={{ x: 13, y: 13 }}>
            <ImageWithSpinner src={`icons/npc/${imageOverride ?? npc}.png`} />
          </JPanel>
        </JPanel>

        <JPanel size={{ width: 309, height: 65 }} position={{ x: 166, y: 0 }} background="UIResource.Common.BigBG1">
          <MultilineLabel
            size={{ width: 299, height: 55 }}
            position={{ x: 5, y: 5 }}
            text={overwriteText !== '' ? overwriteText : t(`npc__${npc}--talk${talkId}`)}
          />
        </JPanel>

        <JPanel size={{ width: 309, height: 134 }} position={{ x: 166, y: 70 }} background="UIResource.Common.BigBG1">
          <div style={{ padding: 5, userSelect: 'none' }}>
            {quests === null && (
              <div className="clickable" onClick={getQuests}>
                Quests
              </div>
            )}
            {quests !== null ? (
              <>
                {questList}
                {taskList}
              </>
            ) : (
              children
            )}
            {quests !== null && (
              <div
                className="clickable"
                onClick={() => {
                  setQuests(null);
                  setOverwriteText('');
                }}>
                Back
              </div>
            )}
            <div className="clickable" onClick={_onEnd}>
              End Conversation
            </div>
          </div>
        </JPanel>
      </JPanel>
    </Panel>
  );
};
