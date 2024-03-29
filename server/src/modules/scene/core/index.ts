import { registerModule } from '../../kernel/moduleLoader';
import ArenaModule from './arena';
import BloodlineModule from './bloodline';
import CardModule from './cards';
import DungeonModule from './dungeons';
import ExplorationModule from './exploration';
import ExplorationV2Module from './explorationV2';
import FieldBossModule from './fieldBoss';
import FieldModule from './fields';
import HomeModule from './home';
import LasNochesModule from './lasNoches';
import NewPlayerModule from './newCharacter';
import newCharacterHook from './newCharacter';
import PetTracingModule from './petTracing';
import RerollModule from './reroll';
import SceneModule from './scenes';
import ShopModule from './shops';
import SlotFightsModule from './slotFights';

export default () => {
  new ArenaModule(registerModule).load();
  new BloodlineModule(registerModule).load();
  new CardModule(registerModule).load();
  new DungeonModule(registerModule).load();
  new ExplorationModule(registerModule).load();
  new ExplorationV2Module(registerModule).load();
  new FieldBossModule(registerModule).load();
  new FieldModule(registerModule).load();
  new HomeModule(registerModule).load();
  new LasNochesModule(registerModule).load();
  new NewPlayerModule(registerModule).load();
  new PetTracingModule(registerModule).load();
  new RerollModule(registerModule).load();
  new SceneModule(registerModule).load();
  new SlotFightsModule(registerModule).load();
  new ShopModule(registerModule).load();
};
