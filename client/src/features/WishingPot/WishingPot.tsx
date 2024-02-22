import './WishingPot.css';
import * as React from 'react';
import { Position, Size } from '../../components/interfaces/Interfaces';
import Panel from '../../components/Panel/Panel';
import JPanel from '../../components/UI/JPanel';
import { JTabbedPane } from '../../components/UI/JTabbedPane';
import { Item } from '../../components/Item';
import { IItem } from '../../slices/inventorySlice';
import { JButton } from '../../components/UI/JButton';
import { JPagination } from '../../components/UI/JPagination';
import { cancelFromServer, fromServer } from '../../util/ServerSocket';

enum Tabs {
  MALE = 'Male',
  FEMALE = 'Female',
}

let cb: (d: { tab: number; idx: number }) => void = () => {};

export function WishingPot() {
  const [tab, setTab] = React.useState<string>(Tabs.MALE);
  const [items, setItems] = React.useState<IItem[][]>([]);
  const [selected, setSelected] = React.useState(-1);

  React.useEffect(() => {
    fromServer('promptBoxSelect', (data, _cb: any) => {
      setItems(data.content);
      cb = _cb;
    });

    return () => {
      cancelFromServer('promptBoxSelect');
    };
  }, []);

  React.useEffect(() => setSelected(-1), [tab]);

  if (items.length === 0) {
    return null;
  }

  const tabs = items.map((_, idx) => ({ name: '' + idx }));

  return (
    <Panel onClose={() => setItems([])}>
      <JPanel size={{ width: 308, height: 260 }}>
        <JTabbedPane size={{ width: 307, height: 202 }} position={{ x: 0, y: 26 }} tabs={tabs} active={'0'} onChange={(t) => setTab(t)}>
          {items.map((group, idx) => (
            <JTabbedPane.Tab key={idx} name={'' + idx}>
              <JPanel size={{ width: 307, height: 210 }} position={{ x: 0, y: 0 }} background="UIResource.Common.BigBG1">
                <JPagination
                  perPage={15}
                  items={group}
                  render={(itemGroup, page) =>
                    itemGroup.map((item, idx) => {
                      if (item === undefined) {
                        return null;
                      }

                      return (
                        <Grid
                          key={idx}
                          size={{ width: 2, height: 2 }}
                          position={{ x: 6 + (idx % 5) * 60, y: 6 + Math.floor(idx / 5) * 60 }}
                          selected={idx === selected}>
                          <Item item={item} onClick={() => setSelected(page * 15 + idx)} />
                        </Grid>
                      );
                    })
                  }
                  paginationStyle={{ position: 'absolute', bottom: 5 }}
                />
              </JPanel>
            </JTabbedPane.Tab>
          ))}
        </JTabbedPane>

        <JButton
          size={{ width: 75, height: 20 }}
          position={{ x: 117, y: 240 }}
          text="Claim"
          onClick={() => {
            cb({ tab: tabs.findIndex((t) => t.name === tab), idx: selected });
            setItems([]);
            setSelected(-1);
          }}
          disabled={selected === -1}
        />
      </JPanel>
    </Panel>
  );
}

interface GridProps {
  size: Size;
  position: Position;
  children: React.ReactNode;
  selected: boolean;
}

function Grid({ size, position, children, selected }: GridProps) {
  return (
    <JPanel size={{ width: size.width * 27, height: size.height * 27 }} position={position} childrenStyle={{ display: 'flex' }}>
      {Array.apply(null, Array(size.width * size.height)).map((_, idx) => (
        <JPanel
          key={idx}
          size={{ width: 26, height: 26 }}
          position={{ x: (idx % size.width) * 27, y: Math.floor(idx / size.height) * 27 }}
          background="UIResource.Icon.Grid_YellowBSD"
        />
      ))}
      <div className={`grid-overlay ${selected ? 'selected' : ''}`} />
      <div style={{ position: 'absolute' }}>{children}</div>
    </JPanel>
  );
}
