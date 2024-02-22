import * as React from 'react';
import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';
import { MultilineLabel } from '../../components/UI/MultilineLabel';

export const SkillLearn: React.FC<{}> = ({}) => {
  return (
    <Panel onClose={() => {}} style={{ zIndex: 3000 }}>
      <JPanel size={{ width: 535, height: 263 }}>
        <JPanel size={{ width: 534, height: 235 }} background="UIResource.Common.BigBG1">
          <JPanel size={{ width: 512, height: 20 }} position={{ x: 11, y: 10 }} background="UIResource.Common.BigBG1">
            <MultilineLabel size={{ width: 508, height: 20 }} position={{ x: 2, y: 0 }} />
          </JPanel>

          <JPanel size={{ width: 232, height: 180 }} position={{ x: 11, y: 40 }} background="UIResource.Common.SmallBG2">
            <MultilineLabel size={{ width: 222, height: 170 }} position={{ x: 5, y: 5 }} />
          </JPanel>

          <JPanel size={{ width: 232, height: 180 }} position={{ x: 291, y: 40 }} background="UIResource.Common.SmallBG2">
            <MultilineLabel size={{ width: 222, height: 170 }} position={{ x: 5, y: 5 }} />
          </JPanel>
        </JPanel>

        <JButton size={{ width: 30, height: 34 }} position={{ x: 251, y: 111 }} />
        <JButton size={{ width: 100, height: 22 }} position={{ x: 65, y: 241 }} />
        <JButton size={{ width: 100, height: 22 }} position={{ x: 360, y: 241 }} />
      </JPanel>
    </Panel>
  );
};
