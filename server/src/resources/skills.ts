import { Skill } from '../classes';
import { IConfig } from 'config';

export let Skills: { [id: number]: Skill } = {};
export let SKILL_CONFIG: { [key: string]: any } = {};
export const DEFAULT_ATTACK_ID = 1;

export interface SkillLoader {
  Skills: { [id: number]: Skill };
  SKILL_CONFIG: { [key: string]: any };
}

export default function skillLoader(config: IConfig): SkillLoader {
  Skills = config.get('Skills');
  SKILL_CONFIG = config.get('SkillConfig');

  return {
    Skills,
    SKILL_CONFIG,
  };
}

export function serverSkillLoader(config: IConfig) {
  const skills = config.get('Skills') as { [id: number]: Skill };
  return {
    Skills: skills,
    SKILL_CONFIG: config.get('SkillConfig') as { [key: string]: any },
    SKILL_INFO: Object.entries(skills).reduce((map: any, entry) => {
      const [id, skill]: [string, any] = entry;
      const s = new skill(id, 1);

      if (!!s.skillInfo) {
        map[id] = s.skillInfo;
      }

      return map;
    }, {}),
  };
}
