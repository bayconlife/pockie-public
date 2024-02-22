import { IConfig } from 'config';

// {[value]: [iid]}
export let randomSynthesis: { [value: string]: number[] } = {};
export let fixedSynthesis: { [value: string]: number[][] } = {};
export let levelUpRates: { [value: number]: number[] } = {};
export let SYNTHESIS_BY_TYPE: { [type: number]: { [value: number]: number[] } } = {};

export default function synthesisLoader(config: IConfig) {
  randomSynthesis = config.get('Synthesis.Random');
  fixedSynthesis = config.get('Synthesis.Fixed');
  levelUpRates = config.get('Synthesis.LevelUpRates');
  SYNTHESIS_BY_TYPE = config.get('Synthesis.Types');
}
