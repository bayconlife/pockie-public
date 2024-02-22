import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { useAppSelector } from '../../hooks';
import useTranslator from '../../hooks/translate';
import { FightState } from '../../slices/fightSlice';
import { getAcceptLocation, getCurrentProgress, getTurnInLocation } from '../../util/questInfo';

export function DailyTask({ goTo, offset }: { goTo: (quest: any) => void; offset: number }) {
  const t = useTranslator();
  const inProgress = useAppSelector((state) => state.character.tasks.daily.inProgress);
  const fightState = useAppSelector((state) => state.fight.state);

  return (
    <>
      {inProgress
        .filter((quest) => !!quest)
        .map((quest, idx) => (
          <JPanel
            key={`main-quest-nav-${quest.id}-${idx}`}
            size={{ width: 273, height: 44 }}
            // position={{ x: 0, y: (offset + idx) * 53 }}
            background="UIResource.Common.SmallBG1">
            <div style={{ padding: 5, color: 'whitesmoke' }}>
              <b>{quest.group ? t(`task_group__${quest.group}--name`) : t(`task__${quest.id}--name`)}</b>
              {quest.completed ? (
                <div>Turn in at Task Board</div>
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
    </>
  );
}
