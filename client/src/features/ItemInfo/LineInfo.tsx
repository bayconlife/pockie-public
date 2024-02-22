import * as React from 'react';
import { LineBreak } from './components/LineBreak';
import useTranslator from '../../hooks/translate';
import useObjectTranslator from '../../hooks/objectTranslate';

const STAT: { [key: number]: string } = {
  1: 'Strength',
  2: 'Agility',
  3: 'Stamina',
  4: 'Defense',
  5: 'Defense Break',
  6: 'Dodge',
  7: 'Hit',
  8: 'Max HP',
  9: 'Max HP %',
  10: 'Max Attack',
  11: 'Attack %',
  12: 'Speed %',
  13: 'Max MP',
  14: 'Max MP %',
  15: 'Critical',
  16: 'Const',
  17: 'Block',
  18: 'Pierce',
  19: 'Min Attack',
  100: 'Skill',
};

const MULTIPLIERS: number[] = [9, 11, 12, 14];

export const LineInfo: React.FC<{ lines: any[] }> = ({ lines = [] }) => {
  const t = useObjectTranslator();

  return (
    <>
      {lines.length > 0 && <LineBreak />}
      {lines.map((line: any, idx: number) => (
        <div key={idx} style={{ position: 'relative', color: '#388ee9' }}>
          {line.stat === 100 ? (
            t(`skill__${line.min}`)
          ) : (
            <>
              {STAT[line.stat as number]}
              <span style={{ position: 'absolute', right: 0 }}>+{format(line)}</span>
            </>
          )}
        </div>
      ))}
    </>
  );
};

function format(line: any) {
  let roll = line.roll;
  let min = line.min;
  let max = line.max;

  if (MULTIPLIERS.includes(line.stat)) {
    roll = (roll / 10).toFixed(1);
    min = (min / 10).toFixed(1);
    max = (max / 10).toFixed(1);
  }

  return `${roll} (${min} - ${max}) T${line.id % 20}`;
}
