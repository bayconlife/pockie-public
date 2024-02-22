import { IConfig } from 'config';
import { NpcId } from '../types';

interface Quest {
  [key: string]: number;
}

interface QuestType {
  [key: string]: number;
}

interface Quests {
  [id: number]: {
    level: number;
    requires: number[];
    acceptFrom: NpcId;
    steps: { type: number; [key: string]: any }[];
    turnIn: NpcId;
    rewards: { [key: string]: any };
    unlocks: number[];
  };
}

export let Quest: Quest = {};
export let QuestType: QuestType = {};
export let Quests: Quests = {};

export default function questLoader(config: IConfig) {
  Quest = config.get('Quest');
  QuestType = config.get('QuestType');
  Quests = config.get('Quests');
}
