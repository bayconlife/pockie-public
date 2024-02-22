import { useContext, useState } from 'react';
import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import useTranslator from '../../hooks/translate';
import { DisplayGrid } from '../../components/Grid/DisplayGrid';
import { Item } from '../../components/Item';
import { IItem } from '../../slices/inventorySlice';
import { useAppSelector } from '../../hooks';
import { DailyQuest } from '../../slices/characterSlice';
import { Label } from '../../components/UI/Label';
import { Countdown } from '../MultiFightDisplay/Countdown';
import { prompt } from '../../util/EventEmitter';
import { getProgressForStep, getRequirementForStep } from '../../util/questInfo';
import { toServer } from '../../util/ServerSocket';

interface Props {
  onClose: () => void;
}

export function TaskBoard({ onClose }: Props) {
  const t = useTranslator();

  const availableTasks = useAppSelector((state) => state.character.tasks.daily.available);
  const inProgress = useAppSelector((state) => state.character.tasks.daily.inProgress);
  const nextRefreshTime = useAppSelector((state) => state.character.tasks.daily.nextRefreshTime);

  const [refreshLoading, setRefreshLoading] = useState(false);
  const [manualRefresh, setManualRefresh] = useState(0);
  const [viewedTaskIdx, setViewedTaskIdx] = useState<number>(-1);

  return (
    <Panel name="Task Board" onClose={onClose}>
      <JPanel size={{ width: 645, height: 435 }}>
        <JPanel size={{ width: 645, height: 30 }} position={{ x: 0, y: 0 }} background="UIResource.Common.BigBG4">
          {/* <JButton size={{ width: 95, height: 20 }} position={{ x: 544, y: 5 }} text="View Rewards" /> */}
        </JPanel>

        <MultilineLabel size={{ width: 140, height: 20 }} position={{ x: 5, y: 32 }} text="Receivable Mission" style={{ color: 'white' }} />

        <JPanel size={{ width: 190, height: 165 }} position={{ x: 0, y: 50 }} background="UIResource.Common.BigBG1">
          <JPanel size={{ width: 180, height: 60 }} position={{ x: 5, y: 5 }} background="UIResource.Common.BigBG3">
            <div
              className={'text-outline display-1'}
              style={{ position: 'absolute', left: 0, top: -5, textAlign: 'center', width: 180, color: 'whitesmoke' }}>
              {nextRefreshTime >= Date.now() ? (
                <Countdown initial={nextRefreshTime} onFinish={() => setManualRefresh(Date.now())} />
              ) : (
                <span>READY</span>
              )}
            </div>
            <JButton
              size={{ width: 160, height: 20 }}
              position={{ x: 10, y: 34 }}
              text="Refresh"
              disabled={nextRefreshTime >= Date.now()}
              loading={refreshLoading}
              onClick={() => {
                setRefreshLoading(true);
                toServer('refreshTasks', {}, () => {
                  setRefreshLoading(false);
                });
              }}
            />
          </JPanel>

          <JPanel size={{ width: 190, height: 90 }} position={{ x: 5, y: 68 }}>
            {availableTasks.map((task, idx) => (
              <Label key={idx} text="">
                <div onClick={() => setViewedTaskIdx(idx)}>
                  {_gradeToLetter(task.grade)} - {task.group ? t(`task_group__${task.group}--name`) : t(`task__${task.id}--name`)}
                </div>
              </Label>
            ))}
          </JPanel>
        </JPanel>

        <MultilineLabel
          size={{ width: 190, height: 20 }}
          position={{ x: 5, y: 222 }}
          text={`Received Mission ${inProgress.length}/10`}
          style={{ color: 'white' }}
        />

        <JPanel size={{ width: 190, height: 195 }} position={{ x: 0, y: 240 }} background="UIResource.Common.BigBG1">
          <JPanel size={{ width: 180, height: 155 }} position={{ x: 5, y: 5 }}>
            {inProgress.map((task, idx) => (
              <Label key={idx} text="">
                <div onClick={() => setViewedTaskIdx(idx + 20)}>
                  {_gradeToLetter(task.grade)} - {task.group ? t(`task_group__${task.group}--name`) : t(`task__${task.id}--name`)}
                  {task.completed ? ' ✔️' : ''}
                </div>
              </Label>
            ))}
          </JPanel>
        </JPanel>

        {viewedTaskIdx >= 0 && viewedTaskIdx < 20 && (
          <AvilableTask task={availableTasks[viewedTaskIdx]} idx={viewedTaskIdx} setViewedTaskIdx={setViewedTaskIdx} />
        )}
        {viewedTaskIdx >= 20 && (
          <InProgressTask task={inProgress[viewedTaskIdx - 20]} idx={viewedTaskIdx - 20} setViewedTaskIdx={setViewedTaskIdx} />
        )}
        {viewedTaskIdx < 0 && (
          <JPanel size={{ width: 450, height: 400 }} position={{ x: 195, y: 35 }} background="UIResource.Common.BigBG1" />
        )}
      </JPanel>
    </Panel>
  );
}

function AvilableTask({ task, idx, setViewedTaskIdx }: { task: DailyQuest; idx: number; setViewedTaskIdx: (id: number) => void }) {
  return (
    <JPanel size={{ width: 450, height: 400 }} position={{ x: 195, y: 35 }} background="UIResource.Common.BigBG1" padding={5}>
      <TaskName task={task} />

      <JPanel background="UIResource.Common.BigBG4">
        <JPanel size={{ width: 440, height: 20 }} background="UIResource.Common.BigBG3">
          <MultilineLabel size={{ width: 342, height: 20 }} position={{ x: 25, y: 3 }} text="Steps" />
          <JPanel size={{ width: 16, height: 16 }} position={{ x: 3, y: 2 }} background="UIResource.Icon.Icon_ExcalmatoryPoint" />
        </JPanel>

        <JPanel size={{ width: 440, height: 170 }} padding={5}>
          {task && task.steps && <Steps task={task} />}
        </JPanel>
      </JPanel>

      <JPanel background="UIResource.Common.BigBG4">
        <JPanel size={{ width: 440, height: 20 }} background="UIResource.Common.BigBG3">
          <MultilineLabel size={{ width: 342, height: 20 }} position={{ x: 25, y: 3 }} text="Rewards" />
          <JPanel size={{ width: 16, height: 16 }} position={{ x: 3, y: 2 }} background="UIResource.Icon.Icon_ExcalmatoryPoint" />
        </JPanel>

        <TaskRewards task={task} />
      </JPanel>

      <JPanel size={{ width: 440, height: 20 }} position={{ x: 0, y: 400 - 10 - 20 }}>
        <JButton
          size={{ width: 80, height: 20 }}
          position={{ x: 220 - 40, y: 0 }}
          text="Accept"
          onClick={() => {
            setViewedTaskIdx(-1);
            toServer('acceptTask', idx, () => {});
          }}
        />
      </JPanel>
    </JPanel>
  );
}

function InProgressTask({ task, idx, setViewedTaskIdx }: { task: DailyQuest; idx: number; setViewedTaskIdx: (id: number) => void }) {
  const t = useTranslator();

  const step = task.completed ? 'Task Completed' : getProgressForStep(task.steps[task.step]);

  return (
    <JPanel size={{ width: 450, height: 400 }} position={{ x: 195, y: 35 }} background="UIResource.Common.BigBG1" padding={5}>
      <TaskName task={task} />

      <JPanel background="UIResource.Common.BigBG4">
        <JPanel size={{ width: 440, height: 20 }} background="UIResource.Common.BigBG3">
          <MultilineLabel size={{ width: 342, height: 20 }} position={{ x: 25, y: 3 }} text="Current Step" />
          <JPanel size={{ width: 16, height: 16 }} position={{ x: 3, y: 2 }} background="UIResource.Icon.Icon_ExcalmatoryPoint" />
        </JPanel>

        <MultilineLabel size={{ width: 387, height: 30 }} text={step} style={{ marginLeft: 5 }} />

        {!task.completed && task.steps[task.step].type === QuestType.GiveItem && (
          <JButton
            size={{ width: 63, height: 20 }}
            position={{ x: 370, y: 25 }}
            text="Deliver"
            onClick={() => toServer('deliverTaskItem', idx)}
          />
        )}
      </JPanel>

      <JPanel background="UIResource.Common.BigBG4">
        <JPanel size={{ width: 440, height: 20 }} background="UIResource.Common.BigBG3">
          <MultilineLabel size={{ width: 342, height: 20 }} position={{ x: 25, y: 3 }} text="Steps" />
          <JPanel size={{ width: 16, height: 16 }} position={{ x: 3, y: 2 }} background="UIResource.Icon.Icon_ExcalmatoryPoint" />
        </JPanel>

        <JPanel size={{ width: 440, height: 120 }} padding={5}>
          {task && task.steps && <Steps task={task} />}
        </JPanel>
      </JPanel>

      <JPanel background="UIResource.Common.BigBG4">
        <JPanel size={{ width: 440, height: 20 }} background="UIResource.Common.BigBG3">
          <MultilineLabel size={{ width: 342, height: 20 }} position={{ x: 25, y: 3 }} text="Rewards" />
          <JPanel size={{ width: 16, height: 16 }} position={{ x: 3, y: 2 }} background="UIResource.Icon.Icon_ExcalmatoryPoint" />
        </JPanel>

        {/* <MultilineLabel size={{ width: 440, height: 64 }} position={{ x: 5, y: 300 }} text="Bonus" /> */}
        <TaskRewards task={task} />
      </JPanel>

      <JPanel size={{ width: 440, height: 20 }} position={{ x: 0, y: 400 - 10 - 20 }}>
        <JButton
          size={{ width: 80, height: 20 }}
          position={{ x: 220 - 40, y: 0 }}
          text={task.completed ? 'Turn In' : 'Give Up'}
          onClick={() => {
            // if (!task.completed) {
            //   prompt('Are you sure you want to abandon this task?', () => {
            //     setViewedTaskIdx(-1);
            //     toServer('abandonTask', idx);
            //   });
            // } else {
            //   setViewedTaskIdx(-1);
            toServer('turnInTask', idx);
            // }
          }}
        />
      </JPanel>
    </JPanel>
  );
}

const QuestType = {
  Collect: 1,
  Kill: 2,
  Talk: 3,
  GiveItem: 6,
};

function Steps({ task }: { task: any }) {
  const t = useTranslator();

  let steps = task.steps.map((step: any) => getRequirementForStep(step)).join('\n');

  return <MultilineLabel size={{ width: 420, height: 126 }} text={steps} />;
}

function TaskName({ task }: { task: DailyQuest }) {
  const t = useTranslator();

  return (
    <JPanel size={{ width: 440, height: 30 }} background="UIResource.Common.BigBG3">
      <Label
        className="sm"
        position={{ x: 5, y: 8 }}
        text={task.group ? t(`task_group__${task.group}--name`) : t(`task__${task?.id ?? ''}--name`)}
        style={{ fontWeight: 'bold' }}
      />
      <MultilineLabel size={{ width: 151, height: 22 }} position={{ x: 339, y: 8 }} text={`Grade: ${_gradeToLetter(task?.grade ?? '')}`} />
    </JPanel>
  );
}

function TaskRewards({ task }: { task: DailyQuest }) {
  const t = useTranslator();

  return (
    <JPanel size={{ width: 440, height: 75 }} padding={5}>
      {task?.rewards?.items?.map(([item, amount]: [IItem, number], idx: number) => (
        <DisplayGrid key={idx + item.uid + amount} size={{ width: 2, height: 2 }}>
          {item && <Item item={item} style={{ position: 'relative', top: 0, left: 0 }} onClick={() => {}} />}
        </DisplayGrid>
      ))}
      {task?.rewards?.exp && <div>{task.rewards.exp} EXP</div>}
      {task?.rewards?.stones && <div>{task.rewards.stones} Stones</div>}
      {task?.rewards?.table && <div>{t(`task_reward_table__${task.rewards?.table}--name`)}</div>}
    </JPanel>
  );
}

function _gradeToLetter(grade: number) {
  switch (grade) {
    case 2:
      return 'D';
    case 3:
      return 'C';
    case 4:
      return 'B';
    case 5:
      return 'A';
    default:
      return '' + grade;
  }
}
