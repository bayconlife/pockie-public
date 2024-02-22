import { registerModule } from '../kernel/moduleLoader';
import coreHooks from './core';
import ArenaModule from './core/arena';
import FieldModule from './core/fields';
import expeditionHooks from './expedition';

export default () => {
  coreHooks();
  expeditionHooks();

  new ArenaModule(registerModule).load();
  new FieldModule(registerModule).load();
};
