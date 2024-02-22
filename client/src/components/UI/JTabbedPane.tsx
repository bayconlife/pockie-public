import './JTabbedPane.css';
import * as React from 'react';
import useTranslator from '../../hooks/translate';
import { Position, Size } from '../interfaces/Interfaces';
import { NineSlice } from '../NineSlice';
import JPanel from './JPanel';
import TabDefault from '../../assets/UILookAndFeel/Default/TabDefault.png';
import TabSelected from '../../assets/UILookAndFeel/Default/TabSelected.png';

export interface Tab {
  name: string;
  displayName?: string;
  events?: {
    [event: string]: any;
  };
}

interface IJTabbedPane {
  Tab: React.FC<TabProps>;
}

interface JTabbedPaneProps {
  tabs: Tab[];
  size: Size;
  position?: Position;
  style?: React.CSSProperties;
  displayName?: string;
  active?: string;
  background?: string;
  tabWidth?: number;
  onChange?: (name: string) => void;
}

interface ITabContext {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const TabContext = React.createContext<ITabContext | null>(null);

export const JTabbedPane: React.FC<JTabbedPaneProps> & IJTabbedPane = ({
  tabs,
  size,
  position,
  style,
  active = '',
  children,
  background,
  tabWidth,
  onChange,
}) => {
  const [activeTab, setActiveTab] = React.useState(active);
  const value = React.useMemo(() => ({ activeTab, setActiveTab }), [activeTab]);

  React.useEffect(() => setActiveTab(active), [active]);

  return (
    <TabContext.Provider value={value}>
      <JTabbedPaneHelper
        tabs={tabs}
        size={size}
        position={position}
        style={style}
        children={children}
        background={background}
        tabWidth={tabWidth}
        onChange={onChange}
      />
    </TabContext.Provider>
  );
};

const JTabbedPaneHelper: React.FC<JTabbedPaneProps> = ({
  tabs,
  size,
  position = { x: 0, y: 0 },
  style,
  children,
  background,
  tabWidth,
  onChange,
}) => {
  const { activeTab, setActiveTab } = React.useContext(TabContext) as ITabContext;
  const t = useTranslator();

  React.useEffect(() => onChange?.(activeTab), [activeTab]);

  const tabOffset = 26;

  const _size = {
    width: size.width,
    height: size.height - tabOffset,
  };

  function getUrl(name: string) {
    if (name === activeTab) {
      return TabDefault;
    }

    return TabSelected;
  }

  return (
    <div style={{ position: 'absolute', left: position.x }}>
      <div className="tabbed_pane__tabs">
        {tabs.map(({ name, displayName, events }, idx) => (
          <div key={idx} className="tabbed_pane__tab">
            <NineSlice className="tabbed_pane__tab_background" url={getUrl(name)} slice={[5, 5]} />
            <button
              className="tabbed_pane__tab_button"
              onClick={(e) => setActiveTab(name)}
              onDrag={events ? events.onDrag : (e: React.DragEvent) => e.preventDefault()}
              onDragOver={events ? events.onDragOver : (e: React.DragEvent) => e.preventDefault()}
              onDragEnter={events ? events.onDragEnter : (e: React.DragEvent) => e.preventDefault()}
              onDragLeave={events ? events.onDragLeave : (e: React.DragEvent) => e.preventDefault()}>
              <div style={tabWidth !== undefined ? { width: tabWidth } : {}}>{displayName ? displayName : name}</div>
            </button>
          </div>
        ))}
      </div>

      <JPanel size={_size} background={background}>
        <div className="tabbed_pane__content" style={{ marginTop: 26 }}>
          {children}
        </div>
      </JPanel>
    </div>
  );
};

interface TabProps {
  name: string;
}

const Tab: React.FC<TabProps> = ({ name, children }) => {
  const { activeTab } = React.useContext(TabContext) as ITabContext;

  return <div style={name === activeTab ? {} : { display: 'none' }}>{children}</div>;
};

JTabbedPane.Tab = Tab;
