import * as React from 'react';
import Panel from '../../components/Panel/Panel';
import JPanel from '../../components/UI/JPanel';

export const QuestList: React.FC<{}> = ({}) => {
  return (
    <Panel>
      <JPanel size={{ width: 645, height: 435 }}>
        <JPanel size={{ width: 190, height: 200 }} position={{ x: 0, y: 50 }} background="UIResource.Common.BigBG1">
          <JPanel size={{ width: 180, height: 60 }} position={{ x: 5, y: 5 }} background="UIResource.Common.BigBG3">
            {/* <JPanel size={{width: 320, height: 20}} position={{x: 0, y: 10}} background="UIResource.Task.TaskInformantionBG"> */}
            {/* </JPanel> */}
          </JPanel>
        </JPanel>
      </JPanel>
    </Panel>
  );
};
