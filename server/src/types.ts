import { Skill } from './classes';
import { User } from './components/classes';
import { CustomSocket } from './interfaces';

export type Callback = (...args: any[]) => void;
export type DropTable = number;
export type KnownSkills = (number | null)[];
export type NpcId = number;
export type QuestId = number;
export type UID = string;

export type AttackSkill = Skill;
export type PassiveSkill = Skill;
export type TriggerSkill = Skill;

export type SocketFunction<T = any> = (
  socket: CustomSocket,
  character: User,
  data: T,
  cb: Callback
) => Promise<boolean | Function[] | void>;

export type EmitterFunction = (socket: CustomSocket, character: User) => void;
