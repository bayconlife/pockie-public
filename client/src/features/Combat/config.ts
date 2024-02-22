import Image from '../../components/Fight/Image';
import { HealthBar } from './Components/HealthBar';
import { ManaBar } from './Components/ManaBar';

interface Config {
  [key: string]: {
    class: typeof HealthBar | typeof Image;
    x: number;
    y: number;
    config?: any;
    flip?: boolean;
  };
}

export default {
  target_icon: {
    class: Image,
    x: 925.45 - 7.3,
    y: 33.9 - 6.1,
    config: {
      key: 'target_icon',
      file: 'ui/combat/target_icon.png',
    },
  },
  selfIcon: {
    class: Image,
    x: 75.8 + 7.3,
    y: 33.9 - 6.1,
    config: {
      key: 'target_icon',
      file: 'ui/combat/target_icon.png',
    },
    flip: true,
  },
  playerBar: {
    class: Image,
    x: 79.95,
    y: 27.4,
    config: {
      key: 'bars',
      file: 'ui/combat/bars.png',
    },
  },
  targetBar: {
    class: Image,
    x: 495.9,
    y: 27.4,
    config: {
      key: 'target_bars',
      file: 'ui/combat/target_bars.png',
    },
  },
  target_2: {
    class: Image,
    x: 830.1 - 4.95,
    y: 55.9 - 4.1,
    config: {
      key: 'target_ally',
      file: 'ui/combat/target_ally.png',
    },
  },
  target_1: {
    class: Image,
    x: 877.1 - 4.95,
    y: 55.9 - 4.1,
    config: {
      key: 'target_ally',
      file: 'ui/combat/target_ally.png',
    },
  },
  ally_2: {
    class: Image,
    x: 125,
    y: 55.9 - 4.1,
    config: {
      key: 'ally_2',
      file: 'ui/combat/target_ally.png',
    },
  },
  ally_1: {
    class: Image,
    x: 80,
    y: 55.9 - 4.1,
    config: {
      key: 'ally_2',
      file: 'ui/combat/target_ally.png',
    },
  },
  playerHealth: {
    class: HealthBar,
    x: 374 + 80 + 14,
    y: 12 + 27 - 3,
  },
  playerMana: {
    class: ManaBar,
    x: 282 + 43 + 155,
    y: 38 + 12,
  },
  targetHealth: {
    class: HealthBar,
    x: 495.9 + 36.2,
    y: 27.4 + 10,
    flip: true,
  },
  targetMana: {
    class: ManaBar,
    x: 495.9 + 178 - 155,
    y: 38 + 12,
    flip: true,
  },
  vsBase: {
    class: Image,
    x: 469,
    y: 2,
    config: {
      key: 'vs_base',
      file: 'ui/combat/vs_base.png',
    },
  },
  vsText: {
    class: Image,
    x: 470,
    y: 22,
    config: {
      key: 'vs_text',
      file: 'ui/combat/vs_text.png',
    },
  },
  buffBars: {
    class: Image,
    x: 162,
    y: 57,
    config: {
      key: 'buff_bars',
      file: 'ui/combat/buff_bars.png',
    },
  },
} as Config;
