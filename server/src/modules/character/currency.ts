import character from '.';
import { GameModule } from '../../components/classes';
import { onLogin, onRequestLoginData } from '../kernel/pubSub';

const MODULE_NAME = 'Currency';

onLogin(MODULE_NAME, (socket, character) => {
  character.currency = {
    // @ts-ignore
    giftCertificates: 0,
    ...character.currency,
  };
});

onRequestLoginData(MODULE_NAME, (character) => ({
  currency: character.currency,
  stones: character.stones,
}));

export default class CurrencyModule extends GameModule {
  moduleName = MODULE_NAME;
  modules = {};
}
