import { useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../../hooks';
import { decompressFromEncodedURIComponent } from 'lz-string';
import { setFight } from '../../slices/fightSlice';
import Fight from '../Fight/Fight';
import { TestScene } from './TestScene';

export function Replay() {
  const ref = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  function submit(compressed: string) {
    const fight = JSON.parse(decompressFromEncodedURIComponent(compressed) ?? '{}');

    dispatch(setFight(fight));
  }

  useEffect(() => {
    const data = new URLSearchParams(window.location.search).get('data');

    if (data) {
      const fight = JSON.parse(decompressFromEncodedURIComponent(data) ?? '{}');
      dispatch(setFight(fight));
    }
  }, []);
  return (
    <>
      <input ref={ref} />
      <button onClick={() => submit(ref.current?.value ?? '')}>Play</button>
      <Fight />
    </>
  );
}
