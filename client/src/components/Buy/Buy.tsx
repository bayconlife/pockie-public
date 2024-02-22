import * as React from 'react';
import Panel from '../Panel/Panel';
import { JButton } from '../UI/JButton';
import JPanel from '../UI/JPanel';
import { JTextField } from '../UI/JTextField';
import { MultilineLabel } from '../UI/MultilineLabel';

export const Buy: React.FC<{}> = ({}) => {
  return (
    <Panel name="Confirm Purchase">
      <JPanel size={{ width: 340, height: 157 }}>
        <JPanel size={{ width: 340, height: 125 }} position={{ x: 0, y: 0 }} background="UIResource.Common.BigBG1">
          <JPanel size={{ width: 38, height: 38 }} position={{ x: 10, y: 10 }} background="UIResource.Common.BigBG7" />

          <JPanel size={{ width: 320, height: 30 }} position={{ x: 10, y: 85 }} background="UIResource.Common.BigBG3">
            <MultilineLabel size={{ width: 123, height: 20 }} position={{ x: 0, y: 5 }} text="Amount" />
            <JTextField size={{ width: 60, height: 20 }} position={{ x: 110, y: 5 }} text={'1'} />
          </JPanel>

          <MultilineLabel size={{ width: 70, height: 20 }} position={{ x: 65, y: 10 }} text="Name" />
          <MultilineLabel size={{ width: 70, height: 20 }} position={{ x: 65, y: 35 }} text="Price" />
          <MultilineLabel size={{ width: 132, height: 20 }} position={{ x: 3, y: 59 }} text="Amount" />
          <JTextField size={{ width: 60, height: 20 }} position={{ x: 135, y: 60 }} text={'1'} />
        </JPanel>

        <JButton size={{ width: 75, height: 22 }} position={{ x: 40, y: 135 }} text="Confirm" />
        <JButton size={{ width: 75, height: 22 }} position={{ x: 219, y: 135 }} text="Cancel" />
      </JPanel>
    </Panel>
  );
};
