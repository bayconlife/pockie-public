import { TooltipContainer } from './TooltipContainer';
import { useAppSelector } from '../../hooks';
import { Stats } from '../../slices/statSlice';
import { SERVER_CONFIG } from '../../util/serverConfig';

export function SkillTooltip({ id, text }: { id: number; text: string[] }) {
  const stats = useAppSelector((state) => state.stats.stats);
  const skillInfo = SERVER_CONFIG.SKILL_INFO[id];

  const lines = text.map((line, idx) => {
    if (line === '[break]') {
      return <div key={idx} className="tooltip-break" />;
    }

    if (skillInfo) {
      line = replaceServerInfo(line, skillInfo);
    }

    line = replaceMp(line, stats.level);
    const modifiedLine = replaceChance(line, stats);

    return <div key={idx}>{modifiedLine}</div>;
  });

  return (
    <TooltipContainer offsetX={27} offsetY={-4}>
      <div style={{ width: 250 }}>{lines}</div>
    </TooltipContainer>
  );
}

function replaceServerInfo(line: string, skillInfo: any[]) {
  const reg = /\@(.*?)\@/g;
  const it = line.matchAll(reg);
  let res = it.next();

  while (!res.done) {
    const idx = res.value[0].slice(1, res.value[0].length - 1);
    // @ts-ignore
    line = line.replace(res.value[0], skillInfo[idx]);
    res = it.next();
  }

  return line;
}

function replaceChance(line: string, stats: Stats) {
  const reg = /\~\~(.*?)\~\~/g;
  const it = line.matchAll(reg);
  let res = it.next();
  let modified = false;

  while (!res.done) {
    const mod = 'SkillAdd' + res.value[1].split(',')[0];
    const base = parseInt(res.value[1].split(',')[1]);
    let value = base;

    if (res.value[1].split(',')[2] === '%') {
      if (!!res.value[1].split(',')[3]) {
        // @ts-ignore
        value = ((stats[mod] * 0.0001 + 1) * base).toFixed(res.value[1].split(',')[3]);
      } else {
        // @ts-ignore
        value = Math.floor((stats[mod] * 0.0001 + 1) * base);
      }
    } else {
      // @ts-ignore
      value = Math.round(base + (stats[mod] % 100));
    }

    if (value !== base) {
      modified = true;
    }

    line = line.replace(res.value[0], value.toString());
    res = it.next();
  }

  if (modified) {
    return <span style={{ color: 'deepskyblue' }}>{line}</span>;
  }

  return line;
}

function replaceMp(line: string, level: number) {
  const reg = /\(\((.*?)\)\)/g;
  const it = line.matchAll(reg);
  let res = it.next();

  while (!res.done) {
    line = line.replace(res.value[0], getMpCost(level, parseFloat(res.value[1])).toFixed(0));
    res = it.next();
  }

  return line;
}

function getMpCost(level: number, modifier: number) {
  // prettier-ignore
  const BaseMPCost = (200 + 20 * (level - 1) * (1 + ((20 + level - 1 + Math.round(level / 3 + 1) * 8 + ((Math.round((level - 1) / 10) * 7 + 14) / 3) * 8) / 12) * 0.01)) / 30;
  return Math.floor(BaseMPCost * modifier);
}
