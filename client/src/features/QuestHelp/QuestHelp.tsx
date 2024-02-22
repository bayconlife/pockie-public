import * as React from 'react';
import ImageButton from '../../components/Buttons/ImageButton';
import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';

export const QuestHelp: React.FC<{}> = ({}) => {
  return (
    <Panel>
      <JPanel size={{ width: 506, height: 410 }}>
        <JPanel size={{ width: 506, height: 365 }} position={{ x: 0, y: 0 }} background="UIResource.Common.BigBG1">
          {/* <JPanel size={{width: 180, height: 60}} position={{x: 5, y: 5}} background="UIResource.Common.BigBG3"> */}
          {/* <JPanel size={{width: 320, height: 20}} position={{x: 0, y: 10}} background="UIResource.Task.TaskInformantionBG"> */}
          {/* </JPanel> */}
          {/* </JPanel> */}
        </JPanel>

        <JPanel size={{ width: 506, height: 40 }} position={{ x: 0, y: 370 }} background="UIResource.Common.BigBG1">
          <JPanel size={{ width: 396, height: 30 }} position={{ x: 5, y: 5 }} background="UIResource.Common.BigBG3">
            <JButton size={{ width: 13, height: 15 }} position={{ x: 105, y: 8 }}></JButton>
          </JPanel>
        </JPanel>
      </JPanel>
    </Panel>
  );
};
