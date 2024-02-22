import { IConfig } from 'config';

interface Pet {
  exp: number[];
  skillCount: number[];
  specificPetSkills: { [id: number]: number[][] };
  naturePetSkills: { [id: number]: number[][] };
  allPetSkills: number[][];
  lockSkillItem: number;
}

export let Pet: Pet = {
  exp: [],
  skillCount: [],
  specificPetSkills: {},
  naturePetSkills: {},
  allPetSkills: [],
  lockSkillItem: 150406,
};

export default function petLoader(config: IConfig) {
  Pet = config.get('Pet');
}
