import { registerModule } from '../kernel/moduleLoader';
import SocialModule from './social';

export default () => {
  new SocialModule(registerModule).load();
};
