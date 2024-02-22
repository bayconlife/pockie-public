import { registerModule } from '../kernel/moduleLoader';
import AchievementModule from './achievements';
import CharacterModule from './character';
import CurrencyModule from './currency';
import EnergyModule from './energy';
import PartyModule from './party';
import QuestModule from './quests';
import SkillModule from './skills';
import TaskModule from './tasks';
import TitleModule from './titles';
import VillageModule from './village';

export default () => {
  new AchievementModule(registerModule).load();
  new CharacterModule(registerModule).load();
  new CurrencyModule(registerModule).load();
  new EnergyModule(registerModule).load();
  new PartyModule(registerModule).load();
  new QuestModule(registerModule).load();
  new SkillModule(registerModule).load();
  new TaskModule(registerModule).load();
  new TitleModule(registerModule).load();
  new VillageModule(registerModule).load();
};
