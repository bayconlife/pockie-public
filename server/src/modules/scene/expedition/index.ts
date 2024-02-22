import { registerModule } from '../../../modules/kernel/moduleLoader';
import ExpeditionArenaModule from './arena';
import huntHook from './hunt';

export default () => {
  new ExpeditionArenaModule(registerModule).load();
  huntHook();
};
