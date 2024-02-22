import { IConfig } from 'config';
import { User } from '../components/classes';
import { SkillLoader, serverSkillLoader } from './skills';
import { serverLevelingLoader } from './leveling';
import achievementLoader, { AchievementConfig } from './achievements';
import { serverHomeLoader } from './home';
import { serverTasksLoader } from './tasks';
import { serverLoaderEnergy } from './energy';
import { serverLoaderImpress } from './impress';
import { serverLoaderPetTracing } from './petTracing';
import { serverLoaderExploration } from './exploration';
import { serverLoaderMonsters } from './monsters';
import { serverLoaderDropTables } from './dropTables';
import { serverLoaderItems } from './items';
import { serverLoaderCollection } from './collection';
import { serverLoaderValhalla } from './valhalla';

interface Servers {
  [id: number]: {
    config: any;
    check: (user: User) => boolean;
    newCharacter: boolean;
  };
}

interface ExpeditionLoader {}

export interface Config extends AchievementConfig {
  Base: any;
  Collection: ReturnType<typeof serverLoaderCollection>;
  DropTables: ReturnType<typeof serverLoaderDropTables>;
  Energy: ReturnType<typeof serverLoaderEnergy>;
  Exploration: ReturnType<typeof serverLoaderExploration>;
  Home: ReturnType<typeof serverHomeLoader>;
  Impress: ReturnType<typeof serverLoaderImpress>;
  Items: ReturnType<typeof serverLoaderItems>;
  Leveling: ReturnType<typeof serverLevelingLoader>;
  Monsters: ReturnType<typeof serverLoaderMonsters>;
  PetTracing: ReturnType<typeof serverLoaderPetTracing>;
  Skills: ReturnType<typeof serverSkillLoader>;
  Tasks: ReturnType<typeof serverTasksLoader>;
  Expedition?: ExpeditionLoader;
  Modules: string[];
  Valhalla: ReturnType<typeof serverLoaderValhalla>;
  getVersion: () => string;
}

export let SERVERS: Servers = {};
const servers = new Map<number, Config>();

export default function serverLoader(config: IConfig) {
  SERVERS = config.get('servers');

  Object.keys(SERVERS).forEach((id) => {
    const config = SERVERS[Number(id)].config;

    servers.set(Number(id), {
      ...achievementLoader(config),
      Base: config,
      Collection: serverLoaderCollection(config),
      DropTables: serverLoaderDropTables(config),
      Energy: serverLoaderEnergy(config),
      Exploration: serverLoaderExploration(config),
      Home: serverHomeLoader(config),
      Impress: serverLoaderImpress(config),
      Items: serverLoaderItems(config),
      Leveling: serverLevelingLoader(config),
      Monsters: serverLoaderMonsters(config),
      PetTracing: serverLoaderPetTracing(config),
      Skills: serverSkillLoader(config),
      Tasks: serverTasksLoader(config),
      Modules: config.get('Modules'),
      Valhalla: serverLoaderValhalla(config),
      getVersion: () => config.version,
    });
  });
}

export function getServerConfig(idx: number) {
  return servers.get(idx) || servers.get(1)!;
}
