import * as React from 'react';
import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import JPanel from '../../components/UI/JPanel';

export const NinjaNpc: React.FC<{}> = ({}) => {
  return (
    <Panel>
      <JPanel size={{ width: 489, height: 130 }} background="UIResource.Common.BigBG1">
        <JPanel size={{ width: 64, height: 64 }} position={{ x: 15, y: 15 }} background="UIResource.Icon.Grid_HeadPortraitBase2" />
        <JPanel size={{ width: 64, height: 64 }} position={{ x: 94, y: 15 }} background="UIResource.Icon.Grid_HeadPortraitBase2" />
        <JPanel size={{ width: 64, height: 64 }} position={{ x: 173, y: 15 }} background="UIResource.Icon.Grid_HeadPortraitBase2" />
        <JPanel size={{ width: 64, height: 64 }} position={{ x: 252, y: 15 }} background="UIResource.Icon.Grid_HeadPortraitBase2" />
        <JPanel size={{ width: 64, height: 64 }} position={{ x: 331, y: 15 }} background="UIResource.Icon.Grid_HeadPortraitBase2" />
        <JPanel size={{ width: 64, height: 64 }} position={{ x: 410, y: 15 }} background="UIResource.Icon.Grid_HeadPortraitBase2" />

        <JButton size={{ width: 18, height: 18 }} position={{ x: 60, y: 15 }} />
        <JButton size={{ width: 18, height: 18 }} position={{ x: 139, y: 15 }} />
        <JButton size={{ width: 18, height: 18 }} position={{ x: 218, y: 15 }} />
        <JButton size={{ width: 18, height: 18 }} position={{ x: 297, y: 15 }} />
        <JButton size={{ width: 18, height: 18 }} position={{ x: 376, y: 15 }} />
        <JButton size={{ width: 18, height: 18 }} position={{ x: 455, y: 15 }} />
      </JPanel>
    </Panel>
  );
};
