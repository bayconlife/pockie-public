import { UserSkills } from '../components/interfaces/Interfaces';
import { Effects } from '../enums';
import { skillIcons } from './skills';

function getEffectInfo(effect: Effects) {
  switch (effect) {
    case Effects.BLOODBOIL:
      return [
        'Warm Blooded:',
        '* Increase non basic damage by 15%.',
        '* Increase cast rate of all skills by 15%.',
        '* Receive 20% recoil damage when using chakra based skills.',
      ];
    case Effects.BURN:
      return ['Ignite:', '* Take damage before every move.', '* Reduce stacks by 1 when damage is dealt.'];
    case Effects.CLOUD:
      return [
        'Cloud:',
        '* Take 7% max hp damage before every move.',
        '* On damage: Apply dazed status for 3.5 seconds.',
        '* On damage: Remove dizzy status.',
        '* Does not apply dazed status or remove dizzy status if enemy under static status.',
        '* 30% chance to switch sides before attack if player has Flying Thunder God skill.',
      ];
    case Effects.CHARM:
      return ['Charm:', '* Cannot attack.'];
    case Effects.DETONATING_CLAY:
      return ['Explosive:', '* After 11 seconds the enemy receives the total damage accumulated during the duration.'];
    case Effects.DIZZY:
      return ['Dizzy:', '* Cannot move or attack.'];
    case Effects.DOOR_ONE:
      return ['Door:', '* Increase speed by 10% per door level.'];
    case Effects.DOUBLE_MP:
      return ['Double MP:', '* Chakra skills cost 2x.'];
    case Effects.DRAIN:
      return ['Drain:', '* Take 6% max hp damage before every move.', '* Removed when chakra is spent.'];
    case Effects.ELEMENTAL_SEAL:
      return [
        'Elemental Seal:',
        '* Prevent enemy from using elemental skills.',
        '* Elemental Skills: fire, water, earth, lightning, and wind.',
      ];
    case Effects.FROZEN:
      return ['Frozen:', '* Cannot move or attack.', '* Receive 2x damage on the next attack.'];
    case Effects.GHOST:
      return ['Ghost:', "* Reduce enemy's body damage by 30%", "* Reduce enemy's healing by 30%", "* Reduce enemy's chakra gain by 30%"];
    case Effects.HEAL:
      return ['Regeneration:', '* Gain 3% max hp before every move.', '* Reduce stacks by 1 when healing is gained.'];
    case Effects.LIQUOR:
      return ['Drunk:', '* Reduce hit by 12%.', '* Increase critical by 3%.', '* If hit by fire skill gain ignite status.'];
    case Effects.MARK:
      return [
        'Cursed:',
        '* For every 1% of max hp lost increases attack by 0.5%.',
        '* Reduce duration of other sealing skills applied to you by 50%.',
      ];
    case Effects.MIST:
      return [
        'Mist:',
        '* Cannot co-exist with mist status, both will be removed.',
        '* Increases chance to prevent the enemy from moving or attacking the longer the fight goes on.',
      ];
    case Effects.PARALYSIS:
      return ['Dazed:', '* Increase next attack time.'];
    case Effects.POISON:
      return ['Poison:', '* Lose 3% max hp before every move.'];
    case Effects.PRAYER:
      return ['Invulnerable:', '* Take no damage.'];
    case Effects.SLOW:
      return ['Slow:', '* Reduce attack speed by 50%.'];
    case Effects.SNARED:
      return ['Snared:', '* Reduce dodge by 2.5%.'];
    case Effects.STATIC:
      return ['Static:', '* Reduce lightning damage taken by 33%.', '* Increase lightning damage dealt by 20%.'];
    case Effects.SUNSET:
      return [
        'Sunset:',
        '* Cannot co-exist with mist status, both will be removed.',
        '* Increases chance to deal 2x damage on elemental skills the longer the fight goes on.',
        '* Elemental Skills: fire, water, earth, lightning, and wind.',
      ];
    case Effects.WEAK:
      return ['Weak:', '* Cannot attack.'];
  }

  return [];
}

function getLaunchTiming(skill: UserSkills) {
  switch (skill) {
    case UserSkills.DEATH_MIRAGE_JUTSU:
    case UserSkills.GALE_PALM:
    case UserSkills.PUPPET:
    case UserSkills.THUNDERFALL:
      return 'Additional attack';

    case UserSkills.BALSAM:
    case UserSkills.PRAYER:
    case UserSkills.PRE_HEALING_JUTSU:
    case UserSkills.THE_EIGHT_INNER_GATES_RELEASED:
      return 'After taking damage';

    case UserSkills.BLOODBOIL:
    case UserSkills.DETONATING_CLAY:
    case UserSkills.FLYING_THUNDER_GOD:
    case UserSkills.QUICKSTEP:
    case UserSkills.SNARED:
    case UserSkills.TAILED_BEAST_HEART:
      return 'Before attack';

    case UserSkills.EARTH_PRISON:
    case UserSkills.GIANT_WATERFALL:
    case UserSkills.GREAT_MUD_RIVER:
    case UserSkills.MUD_WALL:
    case UserSkills.SEXY_TECHNIQUE:
    case UserSkills.STATIC_FIELD:
    case UserSkills.SUBSTITUTE:
      return 'Before enemy moves';

    case UserSkills.CURSED_SEAL_OF_HEAVEN:
    case UserSkills.LIQUOR:
    case UserSkills.MIST:
    case UserSkills.SUNSET:
      return 'Beginning of combat';

    case UserSkills.WINDSTORM_ARRAY:
    case UserSkills.MYSTICAL_PALM_TECHNIQUE:
      return 'Under attack';

    case UserSkills.ASSASSINATE:
    case UserSkills.BOMB:
    case UserSkills.CHAKRA_BLADE:
    case UserSkills.DEAD_DEMON_CONSUMING_SEAL:
    case UserSkills.EIGHT_TRIGRAM_PALM:
    case UserSkills.FIREBALL:
    case UserSkills.FIVE_ELEMENTAL_SEAL:
    case UserSkills.GREAT_STRENGTH:
    case UserSkills.LOTUS:
    case UserSkills.RASENGAN:
      return 'Your attack';
  }
  return 'N/A';
}

function getMpCost(level: number, modifier: number) {
  // prettier-ignore
  const BaseMPCost = (200 + 20 * (level - 1) * (1 + ((20 + level - 1 + Math.round(level / 3 + 1) * 8 + ((Math.round((level - 1) / 10) * 7 + 14) / 3) * 8) / 12) * 0.01)) / 30;
  return Math.floor(BaseMPCost * modifier * 2);
}

export function getInfo(skill: UserSkills, level: number) {
  switch (skill) {
    case UserSkills.ASSASSINATE:
      return [
        'Assassinate',
        '[break]',
        'Damage: 120% Illusion Damage',
        '[break]',
        "Skill Effect: Recover 50% of the damage done. Absorb enemy's drunk and poison status.",
        '[break]',
        ...getEffectInfo(Effects.LIQUOR),
        '[break]',
        ...getEffectInfo(Effects.POISON),
        '[break]',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 28%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 0.7)} points`,
      ];
    case UserSkills.BALSAM:
      return [
        'Balsam',
        '[break]',
        'Damage: 40% Fire Damage',
        '[break]',
        'Skill Effect: If enemy under drunk status apply 2 stacks of ignite status for 40% damage each.',
        '[break]',
        ...getEffectInfo(Effects.BURN),
        '[break]',
        'Limitation: Deals no damage if enemy under frozen status',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 38%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 0.3)} points`,
      ];
    case UserSkills.BLOODBOIL:
      return [
        'Bloodboil',
        '[break]',
        'Skill Effect: Gain warm blooded status for 21 seconds.',
        '[break]',
        ...getEffectInfo(Effects.BLOODBOIL),
        '[break]',
        'Limitation: 1 use per battle',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 32%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 2.3)} points`,
      ];
    case UserSkills.BOMB:
      return [
        'Bomb',
        '[break]',
        'Damage: 210% Tool Damage',
        '[break]',
        'Skill Effect: Has a chance to be knocked back to you and damage you instead. Chances of knockback increase the longer the fight goes on.',
        '[break]',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 33%',
      ];
    case UserSkills.CHAKRA_BLADE:
      return [
        'Chakra Blade',
        '[break]',
        'Damage: 100% Basic Damage',
        '[break]',
        "Skill Effect: Reduce enemy's chakra by 15% of your max chakra.",
        '[break]',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 24%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 1)} points`,
      ];
    case UserSkills.CHIDORI:
      return [
        'Chidori',
        '[break]',
        'Damage: 160% Lightning Damage',
        '[break]',
        'Skill Effect: Inflict dazed status for 3.5 seconds. Removes dizzy status.',
        '[break]',
        ...getEffectInfo(Effects.PARALYSIS),
        '[break]',
        'Limitation: Deals no damage if enemy under frozen status, does not apply dizzy or remove dazed if enemy under static status.',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 17%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 2)} points`,
      ];
    case UserSkills.CREATION_REBIRTH:
      return [
        'Creation Rebirth',
        '[break]',
        'Skill Effect: Revive with 25% hp after death. Cast chance reduced the longer the fight goes on.',
        '[break]',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: Variable',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 1)} points`,
      ];
    case UserSkills.CRYSTAL_BLADE:
      return [
        'Crystal Blade',
        '[break]',
        'Damage: 1 Basic Damage',
        '[break]',
        'Skill Effect: Inflict frozen status (ongoing). Remove ignite status. Remove warm blooded status.',
        '[break]',
        ...getEffectInfo(Effects.FROZEN),
        '[break]',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 27%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 2.6)} points`,
      ];
    case UserSkills.CURSED_SEAL_OF_HEAVEN:
      return [
        'Cursed Seal of Heaven',
        '[break]',
        'Skill Effect: Gain cursed status (ongoing).',
        '[break]',
        ...getEffectInfo(Effects.MARK),
        '[break]',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 100%',
      ];
    case UserSkills.DEAD_DEMON_CONSUMING_SEAL:
      return [
        'Dead Demon Consuming Seal',
        '[break]',
        'Damage: 100% Basic Damage',
        '[break]',
        'Skill Effect: Inflict ghost status for 25 seconds.',
        '[break]',
        ...getEffectInfo(Effects.GHOST),
        '[break]',
        'Limitation: 1 use per battle',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 24%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 3.1)} points`,
      ];
    case UserSkills.DEATH_MIRAGE_JUTSU:
      return [
        'Death Mirage Jutsu',
        '[break]',
        'Skill Effect: Inflict drain status (ongoing).',
        '[break]',
        ...getEffectInfo(Effects.DRAIN),
        '[break]',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 28%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 0.9)} points`,
      ];
    case UserSkills.DETONATING_CLAY:
      return [
        'Detonating Clay',
        '[break]',
        'Skill Effect: Inflict explosive status for 11 seconds.',
        '[break]',
        ...getEffectInfo(Effects.DETONATING_CLAY),
        '[break]',
        'Limitation: 1 use per battle',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 36%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 2)} points`,
      ];
    case UserSkills.EARTH_PRISON:
      return [
        'Earth Prison',
        '[break]',
        "Skill Effect: Absorbs 3% of the enemy's chakra and lowers the enemy's defense by 50 points.",
        '[break]',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 20%',
      ];
    case UserSkills.EIGHT_TRIGRAM_PALM:
      return [
        'Eight Trigram Palm',
        '[break]',
        'Damage: 150% Basic Damage',
        '[break]',
        'Skill Effect: Inflict double mp status (ongoing).',
        '[break]',
        ...getEffectInfo(Effects.DOUBLE_MP),
        '[break]',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 28%',
      ];
    case UserSkills.FIREBALL:
      return [
        'Fireball',
        '[break]',
        'Damage: 130% Fire Damage',
        '[break]',
        'Skill Effect: If enemy under drunk status apply 2 stacks of ignite status for 40% damage each.',
        '[break]',
        ...getEffectInfo(Effects.BURN),
        '[break]',
        'Limitation: Deals no damage if enemy under frozen status',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 33%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 1)} points`,
      ];
    case UserSkills.FIVE_ELEMENTAL_SEAL:
      return [
        'Five Elements Seal',
        '[break]',
        'Damage: 100% Basic Damage',
        '[break]',
        'Skill Effect: Inflict elemental seal status for 23 seconds.',
        '[break]',
        ...getEffectInfo(Effects.ELEMENTAL_SEAL),
        '[break]',
        'Limitation: 1 use per battle',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 27%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 2.8)} points`,
      ];
    case UserSkills.FLYING_THUNDER_GOD:
      return [
        'Flying Thunder God',
        '[break]',
        'Skill Effect: Inflict cloud status (ongoing).',
        '[break]',
        ...getEffectInfo(Effects.CLOUD),
        '[break]',
        'Limitation: 1 use per battle',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 100%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 3.8)} points`,
      ];
    case UserSkills.GALE_PALM:
      return [
        'Gale Palm',
        '[break]',
        'Damage: 120% Wind Damage',
        '[break]',
        'Skill Effect: Launch a sharp whirlwind as an additional attack.',
        '[break]',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 27%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 1.1)} points`,
      ];
    case UserSkills.GIANT_WATERFALL:
      return [
        'Giant Waterfall',
        '[break]',
        'Skill Effect: When suffering from a debuff, inflict dizzy status for 6 seconds. Removes ignite status.',
        '[break]',
        ...getEffectInfo(Effects.DIZZY),
        '[break]',
        'Limitation: 3 uses per battle',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Requirement: Activated when you are under the influence of a debuff',
        'Cast Chance: 43%',
      ];
    case UserSkills.GREAT_MUD_RIVER:
      return [
        'Great Mud River',
        '[break]',
        'Skill Effect: Inflict slow status for 12 seconds.',
        '[break]',
        ...getEffectInfo(Effects.SLOW),
        '[break]',
        'Limitation: 1 use per battle',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 32%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 1.9)} points`,
      ];
    case UserSkills.GREAT_STRENGTH:
      return [
        'Great Strength',
        '[break]',
        'Damage: 100% Basic Damage + 7% of the enemys max hp as Body Damage',
        '[break]',
        'Skill Effect: Inflict dizzy status for 6 seconds.',
        '[break]',
        ...getEffectInfo(Effects.DIZZY),
        '[break]',
        'Limitation: 3 uses per battle',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 15%',
      ];
    case UserSkills.LIQUOR:
      return [
        'Liquor',
        '[break]',
        'Skill Effect: Inflict drunk status (ongoing).',
        '[break]',
        ...getEffectInfo(Effects.LIQUOR),
        '[break]',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 100%',
      ];
    case UserSkills.LOTUS:
      return [
        'Lotus',
        '[break]',
        'Damage: [200 - 300]% Body Damage',
        '[break]',
        'Skill Effect: 50% to do 200% Body Damage, 50% to do 300% Body Damage. Gain weak status for 8 seconds.',
        '[break]',
        ...getEffectInfo(Effects.WEAK),
        '[break]',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 23%',
      ];
    case UserSkills.MIST:
      return [
        'Mist',
        '[break]',
        'Skill Effect: Gain mist status (ongoing).',
        '[break]',
        ...getEffectInfo(Effects.MIST),
        '[break]',
        'Limitation: 1 use per battle',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 100%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 3.4)} points`,
      ];
    case UserSkills.MYSTICAL_PALM_TECHNIQUE:
      return [
        'Mystical Palm Technique',
        '[break]',
        'Skill Effect: Gain 11% of lost hp. Remove poison status.',
        '[break]',
        'Limitation: 3 uses per battle',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 22%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 1.2)} points`,
      ];
    case UserSkills.MUD_WALL:
      return [
        'Mud Wall',
        '[break]',
        'Skill Effect: Reflect 60% of the damage taken to the enemy.',
        '[break]',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 19%',
      ];
    case UserSkills.PRAYER:
      return [
        'Prayer',
        '[break]',
        'Skill Effect: Gain invulnerable status for 9 seconds.',
        '[break]',
        ...getEffectInfo(Effects.PRAYER),
        '[break]',
        'Limitation: 1 use per battle',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 28%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 1.8)} points`,
      ];
    case UserSkills.PRE_HEALING_JUTSU:
      return [
        'Pre-Healing Jutsu',
        '[break]',
        'Skill Effect: Gain 3% max hp. Gain 2 stacks of regeneration status. Remove poison status.',
        '[break]',
        ...getEffectInfo(Effects.HEAL),
        '[break]',
        'Limitation: 3 uses per battle',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 31%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 0.6)} points`,
      ];
    case UserSkills.PUPPET:
      return [
        'Puppet',
        '[break]',
        'Damage: 60% Basic Damage',
        '[break]',
        'Skill Effect: Inflicts poison status on the enemy for 60 seconds.',
        '[break]',
        ...getEffectInfo(Effects.POISON),
        '[break]',
        'Limitation: Poison status can only be inflicted 1 time',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 33%',
      ];
    case UserSkills.QUICKSTEP:
      return [
        'Quickstep',
        '[break]',
        'Skill Effect: Launch an additional attack but the damage is reduced by 35%.',
        '[break]',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 20%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 1.1)} points`,
      ];
    case UserSkills.RASENGAN:
      return [
        'Rasengan',
        '[break]',
        'Damage: 180% Wind Damage',
        '[break]',
        'Skill Effect: Recieve 30% recoil damage.',
        '[break]',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 26%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 1.4)} points`,
      ];
    case UserSkills.SEXY_TECHNIQUE:
      return [
        'Sexy Technique',
        '[break]',
        'Skill Effect: If opponent would use a buffing skill inflict charmed status for 15 seconds.',
        '[break]',
        ...getEffectInfo(Effects.CHARM),
        '[break]',
        'Limitation: 1 use per battle',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 39%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 2.4)} points`,
      ];
    case UserSkills.SNARED:
      return [
        'Snared',
        '[break]',
        'Skill Effect: Inflict snared until enemy takes turn.',
        '[break]',
        ...getEffectInfo(Effects.SNARED),
        '[break]',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 37%',
      ];
    case UserSkills.STATIC_FIELD:
      return [
        'Static Field',
        '[break]',
        'Skill Effect: Gain a shield that will block enemy attacks. Shield strength is 18% of your max hp. Gain static status while shield is active.',
        '[break]',
        ...getEffectInfo(Effects.STATIC),
        '[break]',
        'Limitation: 1 use per battle',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 32%',
      ];
    case UserSkills.SUBSTITUTE:
      return [
        'Subtitution Technique',
        '[break]',
        'Skill Effect: Block one attack. Gain 2 stacks of burn status if enemy under burn status.',
        '[break]',
        ...getEffectInfo(Effects.BURN),
        '[break]',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 17%',
      ];
    case UserSkills.SUNSET:
      return [
        'Sunset',
        '[break]',
        'Skill Effect: Gain sunset status (ongoing).',
        '[break]',
        ...getEffectInfo(Effects.SUNSET),
        '[break]',
        'Limitation: 1 use per battle. ',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 100%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 3.4)} points`,
      ];
    case UserSkills.TAILED_BEAST_HEART:
      return [
        'Tailed Beast Heart',
        '[break]',
        'Skill Effect: Removes 1 random debuff.',
        '[break]',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Requirement: Activated when you are under the influence of a debuff',
        'Cast Chance: 50%',
      ];
    case UserSkills.THE_EIGHT_INNER_GATES_RELEASED:
      return [
        'The Eight Inner Gates Released',
        '[break]',
        'Skill Effect: Gain door status for 10 seconds or upgrade door status by one level for 10 seconds.',
        '[break]',
        ...getEffectInfo(Effects.DOOR_ONE),
        '[break]',
        ...getEffectInfo(Effects.DIZZY),
        '[break]',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 100%',
      ];
    case UserSkills.THUNDERFALL:
      return [
        'Thunderfall',
        '[break]',
        'Damage: 80% Lightning Damage',
        '[break]',
        'Skill Effect: Inflict dazed status for 3.5 seconds. Removes dizzy status.',
        '[break]',
        ...getEffectInfo(Effects.PARALYSIS),
        '[break]',
        'Limitation: Deals no damage if enemy under frozen status',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 24%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 1)} points`,
      ];
    case UserSkills.WINDSTORM_ARRAY:
      return [
        'Windstorm Array',
        '[break]',
        'Damage: 160% Wind Damage',
        '[break]',
        'Skill Effect: Summon a hurricane to counter attack.',
        '[break]',
        `Launch Timing: ${getLaunchTiming(skill)}`,
        'Cast Chance: 22%',
        '[break]',
        `Chakra Consumption: ${getMpCost(level, 1.1)} points`,
      ];
  }
  return [skillIcons[skill], '[break]', 'Skill Effect'];
}
