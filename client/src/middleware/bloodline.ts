import { Middleware } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { removeFromSynth, setNextSynth, setSynthResult } from '../slices/bloodlineSlice';

export const bloodlineUpdater: Middleware<{}, RootState> = (store) => (next) => (action) => {
  if (action.type === setNextSynth.type || action.type === removeFromSynth.type) {
    next(action);

    console.log(store.getState().bloodline.synth, store.getState().bloodline.synthResult);

    if (store.getState().bloodline.synth.includes(null)) {
      if (store.getState().bloodline.synthResult !== null) {
        store.dispatch(setSynthResult(null));
      }

      return;
    }

    const souls = store.getState().bloodline.synth.map((idx) => store.getState().character.bloodlines.souls[idx!]);
    const soulIdsAreTheSame = souls.every((soul) => soul.id === souls[0].id);
    const soulLevelsAreTheSame = souls.every((soul) => soul.level === souls[0].level);

    if (soulIdsAreTheSame && soulLevelsAreTheSame) {
      store.dispatch(setSynthResult({ id: souls[0].id, level: souls[0].level + 1 }));
    } else if (soulLevelsAreTheSame) {
      store.dispatch(setSynthResult({ id: 0, level: souls[0].level + 1 }));
    }

    return;
  }

  return next(action);
};
