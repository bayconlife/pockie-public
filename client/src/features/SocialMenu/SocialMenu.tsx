import { useEffect, useState } from 'react';
import Panel from '../../components/Panel/Panel';
import { JButton } from '../../components/UI/JButton';
import { JLayout } from '../../components/UI/JLayout';
import { JPagination } from '../../components/UI/JPagination';
import JPanel from '../../components/UI/JPanel';
import { JTabbedPane } from '../../components/UI/JTabbedPane';
import { Label } from '../../components/UI/Label';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { unblockAccount } from '../../slices/characterSlice';
import { toServer } from '../../util/ServerSocket';
import { Spinner } from '../../components/Spinner';
import { CenterContainer } from '../../components/CenterContainer/CenterContainer';
import { useDispatch } from 'react-redux';
import { hideSocial } from '../../slices/panelSlice';

enum Tab {
  BLOCKED = 'Blocked',
}

const TABS = [{ name: Tab.BLOCKED }];
const HEIGHT = 160;
const WIDTH = 200;

export function SocialMenu() {
  const dispatch = useDispatch();
  const show = useAppSelector((state) => state.panels.social);

  if (!show) {
    return null;
  }

  return (
    <Panel name="Social" onClose={() => dispatch(hideSocial())}>
      <JPanel width={WIDTH} height={HEIGHT + 26}>
        <JTabbedPane size={{ width: WIDTH, height: HEIGHT + 26 }} tabs={TABS} active={Tab.BLOCKED}>
          <JTabbedPane.Tab name={Tab.BLOCKED}>
            <BlockedList />
          </JTabbedPane.Tab>
        </JTabbedPane>
      </JPanel>
    </Panel>
  );
}

function BlockedList() {
  const dispatch = useAppDispatch();
  const blockedAccountIds = useAppSelector((state) => state.character.social.blockedAccountIds);
  const [isLoading, setIsLoading] = useState(true);
  const [accountIdToName, setAccountIdToName] = useState<{ [id: number]: string }>({});

  useEffect(() => {
    setIsLoading(true);
    toServer('getDisplayNames', blockedAccountIds, (names) => {
      setAccountIdToName(names);
      setIsLoading(false);
    });
  }, [blockedAccountIds]);

  return (
    <JPanel width={WIDTH} height={HEIGHT} background="UIResource.Common.BigBG1">
      {isLoading && (
        <CenterContainer>
          <Spinner width={64} />
        </CenterContainer>
      )}
      <JPagination
        perPage={5}
        items={isLoading ? [] : blockedAccountIds}
        render={(items) => {
          return items
            .filter((id) => !!id)
            .map((id) => (
              <JPanel key={id} width={WIDTH} height={20} padding={8}>
                <Label y={0} x={0} text={accountIdToName[id]} />
                <JButton
                  y={0}
                  x={WIDTH - 12 - 75}
                  text="Unblock"
                  onClick={() => {
                    dispatch(unblockAccount(id));
                    toServer('unblockAccount', id);
                  }}
                />
              </JPanel>
            ));
        }}
        paginationStyle={{ position: 'absolute', top: 135, left: (WIDTH - 175) / 2 }}
      />
    </JPanel>
  );
}
