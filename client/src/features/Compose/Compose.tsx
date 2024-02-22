import * as React from 'react';
import { Item } from '../../components/Item';
import Panel from '../../components/Panel/Panel';
import JPanel from '../../components/UI/JPanel';
import { JTabbedPane } from '../../components/UI/JTabbedPane';
import { MultilineLabel } from '../../components/UI/MultilineLabel';
import { useAppSelector } from '../../hooks';
import { Inscribe } from './Inscribe';
import { DropZone } from '../../components/DropZone/DropZone';
import { Impress } from './Impress';
import { Synthesis } from './Synthesis';
import { toServer } from '../../util/ServerSocket';

enum Tab {
  Synthesis = 'Synthesis',
  Recast = 'Recast',
  Inscribe = 'Inscribe',
  Impress = 'Impress',
}

export const Compose: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const tabs = [{ name: Tab.Synthesis, displayName: 'Synthesis' }, { name: Tab.Recast }, { name: Tab.Inscribe }, { name: Tab.Impress }];

  return (
    <Panel onClose={onClose} name="Portable Function">
      <JPanel size={{ width: 368, height: 380 }}>
        <JTabbedPane size={{ width: 374, height: 380 }} tabs={tabs} active={Tab.Synthesis}>
          <JTabbedPane.Tab name={Tab.Synthesis}>
            <Synthesis />
          </JTabbedPane.Tab>

          <JTabbedPane.Tab name={Tab.Recast}>
            <JPanel size={{ width: 366, height: 350 - 26 }} background="UIResource.Common.BigBG1">
              <JPanel size={{ width: 356, height: 90 }} position={{ x: 5, y: 5 }} background="UIResource.Common.BigBG1">
                <MultilineLabel size={{ width: 346, height: 80 }} position={{ x: 5, y: 5 }} /> {/* text = MultiRefound*/}
              </JPanel>

              <JPanel size={{ width: 73, height: 117 }} position={{ x: 50, y: 145 }} background="UIResource.Common.BigBG3">
                <MultilineLabel size={{ width: 73, height: 20 }} position={{ x: 0, y: 1 }} /> {/* text = TipEquipType_Avatar*/}
                <GridContainer position={{ x: 5, y: 22 }} location={30} />
              </JPanel>

              <JPanel size={{ width: 23, height: 23 }} position={{ x: 180, y: 191 }} background="UIResource.Compose.Add"></JPanel>

              <JPanel size={{ width: 43, height: 63 }} position={{ x: 260, y: 172 }} background="UIResource.Common.BigBG3">
                <JPanel size={{ width: 36, height: 36 }} position={{ x: 5, y: 22 }} background="UIResource.Icon.Grid_Base1">
                  <JPanel size={{ width: 26, height: 26 }} position={{ x: 5, y: 5 }} background="UIResource.Icon.Grid_YellowBSD"></JPanel>
                </JPanel>
                <MultilineLabel size={{ width: 46, height: 20 }} position={{ x: 0, y: 1 }} /> {/* text = Recast_itemname*/}
              </JPanel>
            </JPanel>
          </JTabbedPane.Tab>

          <JTabbedPane.Tab name={Tab.Inscribe}>
            <Inscribe />
          </JTabbedPane.Tab>

          <JTabbedPane.Tab name={Tab.Impress}>
            <Impress />
          </JTabbedPane.Tab>

          {/* 366,350 */}
          {/* <JPanel size={{width: 366, height: 350}} position={{x: 4, y: 26}} background="UIResource.Common.BigBG1"></JPanel> */}
        </JTabbedPane>
      </JPanel>
    </Panel>
  );
};

const GridContainer: React.FC<{ position: { x: number; y: number }; location?: number }> = ({ position, location = -1, children }) => {
  const item = useAppSelector((store) => store.inventory.items[store.inventory.locations[location]]);
  const dragging = useAppSelector((state) => state.ui.dragging.item);

  const onDrop = (uid: string) => {
    toServer('synthesisSetItem', { uid, location });
  };

  return (
    <JPanel
      size={{ width: 63, height: 90 }}
      position={position}
      background="UIResource.Icon.Grid_Base1"
      childrenStyle={{ display: 'flex' }}>
      <JPanel size={{ width: 53, height: 80 }} position={{ x: 5, y: 5 }}>
        <JPanel size={{ width: 26, height: 26 }} position={{ x: 0, y: 0 }} background="UIResource.Icon.Grid_YellowBSD"></JPanel>
        <JPanel size={{ width: 26, height: 26 }} position={{ x: 0, y: 27 }} background="UIResource.Icon.Grid_YellowBSD"></JPanel>
        <JPanel size={{ width: 26, height: 26 }} position={{ x: 0, y: 54 }} background="UIResource.Icon.Grid_YellowBSD"></JPanel>
        <JPanel size={{ width: 26, height: 26 }} position={{ x: 27, y: 0 }} background="UIResource.Icon.Grid_YellowBSD"></JPanel>
        <JPanel size={{ width: 26, height: 26 }} position={{ x: 27, y: 27 }} background="UIResource.Icon.Grid_YellowBSD"></JPanel>
        <JPanel size={{ width: 26, height: 26 }} position={{ x: 27, y: 54 }} background="UIResource.Icon.Grid_YellowBSD"></JPanel>
      </JPanel>

      {children}

      {item && <Item item={item} />}
      {[20, 21, 22].includes(location) && item === undefined && dragging !== null && <DropZone onDrop={onDrop} location={location} />}
    </JPanel>
    // <Grid size={{ width: 2, height: 3 }} position={position}>
    //   {children}

    //   {item && <Item item={item} />}
    //   {[20, 21, 22].includes(location) && item === undefined && dragging !== null && <DropZone onDrop={onDrop} />}
    // </Grid>
  );
};

interface Props {
  location: number;
  onDrop: (uid: string, position: number) => void;
}
