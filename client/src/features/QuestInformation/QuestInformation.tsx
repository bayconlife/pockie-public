import * as React from 'react';
import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { useAppDispatch, useAppSelector } from '../../hooks';
import useTranslator from '../../hooks/translate';
import { displayQuest } from '../../slices/questsSlice';
import { getProgress } from '../../util/questInfo';
import { CDNImage } from '../../components/Elements/Image';
import { toServer } from '../../util/ServerSocket';

export const QuestInformation: React.FC<{}> = ({}) => {
  const t = useTranslator();
  const dispatch = useAppDispatch();
  const quest = useAppSelector((store) => store.quests.questToDisplay);
  const questList = useAppSelector((store) => store.quests.inProgress);

  function abandonQuest() {
    toServer('abandonQuest', { id: quest.id }, () => {
      dispatch(displayQuest(null));
    });
  }

  function acceptQuest() {
    toServer('acceptQuest', { id: quest.id }, (_quest: any) => {
      // dispatch(addQuest(_quest))
      dispatch(displayQuest(null));
    });
  }

  function finishQuest() {
    toServer('finishQuest', { id: quest.id }, () => {
      dispatch(displayQuest(null));
    });
  }

  if (quest === null || quest === undefined) {
    return null;
  }

  const progress = getProgress(quest);
  const isComplete = quest.completed;
  const inProgress = questList.find((q) => q.id === quest.id) !== undefined && !isComplete;

  return (
    <Panel>
      <JPanel size={{ width: 340, height: 420 }}>
        <JPanel size={{ width: 340, height: 388 }} position={{ x: 0, y: 0 }} background="UIResource.Common.BigBG1">
          <JPanel size={{ width: 320, height: 368 }} position={{ x: 10, y: 10 }}>
            <JPanel size={{ width: 320, height: 20 }} position={{ x: 0, y: 10 }} background="UIResource.Common.TextBG1">
              <CDNImage src="ui/UIResource/Icon/Icon_Scroll.png" style={{ marginTop: -3 }} />
              <MultilineLabel size={{ width: 200, height: 15 }} position={{ x: 30, y: 3 }} text={t(`quest__${quest.id}--name`)} />
            </JPanel>

            <MultilineLabel
              size={{ width: 300, height: 75 }}
              position={{ x: 10, y: 35 }}
              text={isComplete ? t(`quest__${quest.id}--submit`) : t(`quest__${quest.id}--info`)}
            />

            <JPanel size={{ width: 320, height: 20 }} position={{ x: 0, y: 115 }} background="UIResource.Common.TextBG1">
              <CDNImage src="ui/UIResource/Icon/Icon_ExcalmatoryPoint.png" style={{ marginLeft: 6, marginTop: 2 }} />
              <MultilineLabel size={{ width: 200, height: 15 }} position={{ x: 30, y: 3 }} text="Progress" />
            </JPanel>

            <MultilineLabel size={{ width: 300, height: 45 }} position={{ x: 10, y: 140 }} text={progress} />

            <JPanel size={{ width: 320, height: 20 }} position={{ x: 0, y: 195 }} background="UIResource.Common.TextBG1">
              <CDNImage src="ui/UIResource/Icon/Icon_ExcalmatoryPoint.png" style={{ marginLeft: 6, marginTop: 2 }} />
              <MultilineLabel size={{ width: 200, height: 15 }} position={{ x: 30, y: 3 }} text="Rewards" />
            </JPanel>

            <JPanel size={{ width: 150, height: 21 }} position={{ x: 9, y: 225 }} background="UIResource.Common.TextBG1">
              <JPanel size={{ width: 45, height: 22 }} position={{ x: -3, y: 0 }} background="UIResource.Common.EspecialBG8">
                <MultilineLabel
                  size={{ width: 45, height: 20 }}
                  position={{ x: 0, y: 3 }}
                  text="Exp"
                  style={{ textAlign: 'center', color: 'whitesmoke' }}
                />
                <MultilineLabel size={{ width: 45, height: 20 }} position={{ x: 50, y: 3 }} text={quest.rewards.exp} />
              </JPanel>
            </JPanel>

            <JPanel size={{ width: 150, height: 21 }} position={{ x: 161, y: 225 }} background="UIResource.Common.TextBG1">
              <JPanel size={{ width: 45, height: 22 }} position={{ x: -3, y: 0 }} background="UIResource.Common.EspecialBG8">
                <MultilineLabel
                  size={{ width: 45, height: 20 }}
                  position={{ x: 0, y: 3 }}
                  text="Gift"
                  style={{ textAlign: 'center', color: 'whitesmoke' }}
                />
              </JPanel>
            </JPanel>

            <JPanel size={{ width: 302, height: 21 }} position={{ x: 9, y: 248 }} background="UIResource.Common.TextBG1">
              <JPanel size={{ width: 45, height: 22 }} position={{ x: -3, y: 0 }} background="UIResource.Common.EspecialBG8">
                <MultilineLabel
                  size={{ width: 45, height: 20 }}
                  position={{ x: 0, y: 3 }}
                  text="Stones"
                  style={{ textAlign: 'center', color: 'whitesmoke' }}
                />
                <MultilineLabel size={{ width: 45, height: 20 }} position={{ x: 50, y: 3 }} text={quest.rewards.stones} />
              </JPanel>
            </JPanel>

            {/* <MultilineLabel size={{width: 302, height: 20}} position={{x: 10, y: 278}} text="Item 1" />
						<MultilineLabel size={{width: 302, height: 20}} position={{x: 10, y: 298}} text="Item 2" />
						<MultilineLabel size={{width: 302, height: 20}} position={{x: 10, y: 318}} text="Item 3" />
						<MultilineLabel size={{width: 302, height: 20}} position={{x: 10, y: 338}} text="Item 4" /> */}
          </JPanel>
        </JPanel>

        {inProgress ? (
          <>
            <JButton size={{ width: 90, height: 22 }} position={{ x: 35, y: 398 }} text="Abandon" onClick={abandonQuest} />
            <JButton
              size={{ width: 90, height: 22 }}
              position={{ x: 215, y: 398 }}
              text="Close"
              onClick={() => dispatch(displayQuest(null))}
            />
          </>
        ) : isComplete ? (
          <>
            <JButton size={{ width: 90, height: 22 }} position={{ x: 35, y: 398 }} text="Turn In" onClick={finishQuest} />
            <JButton
              size={{ width: 90, height: 22 }}
              position={{ x: 215, y: 398 }}
              text="Close"
              onClick={() => dispatch(displayQuest(null))}
            />
          </>
        ) : (
          <>
            <JButton size={{ width: 90, height: 22 }} position={{ x: 35, y: 398 }} text="Accept" onClick={acceptQuest} />
            <JButton
              size={{ width: 90, height: 22 }}
              position={{ x: 215, y: 398 }}
              text="Not Now"
              onClick={() => dispatch(displayQuest(null))}
            />
          </>
        )}
      </JPanel>
    </Panel>
  );
};
