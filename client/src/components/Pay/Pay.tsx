import * as React from 'react';
import Panel from '../Panel/Panel';
import { JButton } from '../UI/JButton';
import JPanel from '../UI/JPanel';
import { MultilineLabel } from '../UI/MultilineLabel';

export const Pay: React.FC<{}> = ({}) => {
  return (
    <Panel name="Confirm Purchase">
      <JPanel size={{ width: 341, height: 182 }}>
        <JPanel size={{ width: 340, height: 150 }} position={{ x: 0, y: 0 }} background="UIResource.Common.BigBG1">
          <MultilineLabel size={{ width: 315, height: 47 }} position={{ x: 10, y: 10 }} text="Description" />

          <JPanel size={{ width: 315, height: 78 }} position={{ x: 12, y: 65 }} background="UIResource.Common.BigBG1"></JPanel>
        </JPanel>

        <JButton size={{ width: 76, height: 22 }} position={{ x: 50, y: 160 }} text="Confirm" />
        <JButton size={{ width: 76, height: 22 }} position={{ x: 215, y: 160 }} text="Cancel" />
      </JPanel>
    </Panel>
  );
};
