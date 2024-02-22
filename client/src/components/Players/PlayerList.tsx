import * as React from 'react';

import { useCallback } from 'react';
import { useAppSelector } from '../../hooks';
import Panel from '../Panel/Panel';
import { JButton } from '../UI/JButton';
import JPanel from '../UI/JPanel';
import { JTabbedPane } from '../UI/JTabbedPane';
import { JPagination } from '../UI/JPagination';
import { JLayout } from '../UI/JLayout';
import { toServer } from '../../util/ServerSocket';

enum Tab {
  ALL = 'Area',
  FRIEND = 'Friend',
  APPRENTICE = 'Apprentice',
}

export function PlayerList() {
  const players = useAppSelector((state) => state.scene.players);
  const serverId = useAppSelector((state) => state.account.serverId);
  const [playerList, setPlayerList] = React.useState<typeof players>([...players]);

  const invite = useCallback((id: number) => {
    toServer('partyInvite', id);
  }, []);

  const tabs = [{ name: Tab.ALL }, { name: Tab.FRIEND }, { name: Tab.APPRENTICE }];

  return (
    <Panel name="Player List" minimizable={true} style={{ width: 187 }}>
      <JPanel size={{ width: 187, height: 235 }}>
        <JButton position={{ x: 187 / 2 - 75 / 2, y: 0 }} text="Refresh" onClick={() => setPlayerList([...players])} />

        <JPanel size={{ width: 187, height: 212 }} position={{ x: 5, y: 25 }}>
          <JTabbedPane size={{ width: 187, height: 212 }} tabs={tabs} active={Tab.ALL}>
            <JTabbedPane.Tab name={Tab.ALL}>
              <JPanel size={{ width: 179, height: 160 }} position={{ x: 0, y: 0 }} background="UIResource.Common.SmallBG1">
                <JPagination
                  perPage={6}
                  items={playerList}
                  render={(items, page) =>
                    items.map((player, idx) => (
                      <JLayout key={page * 6 + idx}>
                        {!!player ? (
                          <JPanel size={{ width: 170, height: 22 }}>
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '40px 1fr 20px',
                                fontSize: '12px',
                                marginTop: 2,
                                color: 'whitesmoke',
                              }}>
                              <div>Lv. {player.level}</div>
                              <div
                                style={{
                                  textDecoration: 'underline',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  overflowX: 'hidden',
                                  cursor: 'pointer',
                                }}
                                title={player.name}
                                onClick={() => toServer('viewCharacter', { serverId, accountId: player.id })}>
                                {player.name}
                              </div>
                              <JButton
                                size={{ width: 20, height: 20 }}
                                text=""
                                style={{ marginTop: -2 }}
                                onClick={() => invite(player.id)}
                              />
                            </div>

                            <JPanel
                              size={{ width: 168, height: 1 }}
                              position={{ x: 0, y: 21 }}
                              background="UIResource.Common.PartitionYellow"
                            />
                          </JPanel>
                        ) : (
                          <JPanel key={idx} size={{ width: 170, height: 22 }} />
                        )}
                      </JLayout>
                    ))
                  }
                />
              </JPanel>
            </JTabbedPane.Tab>

            <JTabbedPane.Tab name={Tab.FRIEND}>
              <JPanel size={{ width: 179, height: 160 }} position={{ x: 0, y: 0 }} background="UIResource.Common.SmallBG1"></JPanel>
            </JTabbedPane.Tab>

            <JTabbedPane.Tab name={Tab.APPRENTICE}>
              <JPanel size={{ width: 179, height: 160 }} position={{ x: 0, y: 0 }} background="UIResource.Common.SmallBG1"></JPanel>
            </JTabbedPane.Tab>
          </JTabbedPane>
        </JPanel>
      </JPanel>
    </Panel>
  );
}
