import { Stat } from '../../resources/lines';
import { ItemLocations, ItemType, SkillType } from '../../enums';
import { CustomSocket, PassiveSkill, Stats } from '../../interfaces';
import { getItem, getItemBase, getItemBaseFromSocketConfig, getItemInLocation } from '../items/itemSystem';
import { equipableItemTypes } from '../items/equip';
import { Skills } from '../../resources/skills';
import { SETS } from '../../resources/items';
import { User } from '../../components/classes';
import { Callback } from '../../types';
import { TITLES } from '../../resources/titles';
import { expNeededForLevel } from './level';

export function calculateStats(character: User): Stats {
  let previousHpPercentage = 1;

  // if (character.stats) {
  //   previousHpPercentage = character.stats.hp / character.stats.maxHp;
  // }

  const level = character.level;

  const role = getItem(character, character.locations[ItemLocations.Equipment_Avatar]) || { iid: 290003, props: { level } };
  const roleBase = getItemBase(role.iid);

  const weapon = getItem(character, character.locations[ItemLocations.Equipment_Avatar + ItemType.Weapon]) ?? { iid: 250101 };
  const weaponBase = getItemBase(weapon.iid);

  const currentPet = getItem(character, getItemInLocation(character, ItemLocations.Equipment_Avatar + ItemType.Pet)?.uid ?? '');
  const pet = currentPet?.props.avatar ?? undefined;
  const petSkills = currentPet
    ? [...currentPet.props.skills.aura, ...currentPet.props.skills.active, ...currentPet.props.skills.passive]
    : undefined;

  let str = Math.floor(20 * roleBase.innate.isv[0] + 8 * roleBase.innate.isv[0] * role.props.level + roleBase.innate.isv[0] * level);
  let agi = Math.floor(20 * roleBase.innate.isv[1] + 8 * roleBase.innate.isv[1] * role.props.level + roleBase.innate.isv[1] * level);
  let sta = Math.floor(20 * roleBase.innate.isv[2] + 8 * roleBase.innate.isv[2] * role.props.level + roleBase.innate.isv[2] * level);

  const speed = 1000; // Need to figure out how this is going to convert to seconds
  let parry = 0; // this is block in the english version
  let pierce = 0; // lower enemy block
  let defense = 0;
  let defenseBreak = 0; // lower enemy defense
  let dodge = 0;
  let hit = 0; // lower enemy dodge
  let critical = 0;
  let con = 0; // Lower enemy crit
  let minAttack = weaponBase.innate.attack[0];
  let maxAttack = weaponBase.innate.attack[1];

  const hp = 200 + 20 * level;
  const chakra = 200 + 20 * level;

  let bonusMaxAttack = 0;
  let bonusMinAttack = 0;
  let bonusAttackPercent = 0;

  let bonusParry = 0;
  let bonusParryMultiplier = 0;

  let bonusSpeed = 0;
  let bonusSpeedPercent = 0;

  let bonusDodge = 0;

  let bonusHp = 0;
  let bonusHpPercent = 0;

  let bonusChakra = 0;
  let bonusChakraPercent = 0;

  let bonusCriticalMultipler = 0;
  let bonusCon = 0;

  let skillAddArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const skillsFromItems: number[] = [];

  let expPercent = 0;
  let dropPercent = 0;

  const addStatLine = (line: any) => {
    switch (line.stat) {
      case Stat.Strength:
        return (str += line.roll);
      case Stat.Agility:
        return (agi += line.roll);
      case Stat.Stamina:
        return (sta += line.roll);
      case Stat.Defense:
        return (defense += line.roll);
      case Stat.Defense_Break:
        return (defenseBreak += line.roll);
      case Stat.Dodge:
        return (dodge += line.roll);
      case Stat.Hit:
        return (hit += line.roll);
      case Stat.Max_Hp:
        return (bonusHp += line.roll);
      case Stat.Max_Hp_Multiplier:
        return (bonusHpPercent += line.roll / 10);
      case Stat.Max_Attack:
        return (bonusMaxAttack += line.roll);
      case Stat.Attack_Multiplier:
        return (bonusAttackPercent += line.roll / 10);
      case Stat.Speed_Multiplier:
        return (bonusSpeedPercent += line.roll / 10);
      case Stat.Max_Mp:
        return (bonusChakra += line.roll);
      case Stat.Max_Mp_Multiplier:
        return (bonusChakraPercent += line.roll / 10);
      case Stat.Critical_Multiplier:
        return (critical += line.roll);
      case Stat.Toughness:
        return (con += line.roll);
      case Stat.Parry_Multiplier:
        return (bonusParry += line.roll);
      case Stat.Pierce:
        return (pierce += line.roll);
      case Stat.Min_Attack:
        return (bonusMinAttack += line.roll);
      case Stat.SkillAdd0:
        return (skillAddArray[0] += line.roll);
      case Stat.SkillAdd1:
        return (skillAddArray[1] += line.roll);
      case Stat.SkillAdd2:
        return (skillAddArray[2] += line.roll);
      case Stat.SkillAdd3:
        return (skillAddArray[3] += line.roll);
      case Stat.SkillAdd4:
        return (skillAddArray[4] += line.roll);
      case Stat.SkillAdd5:
        return (skillAddArray[5] += line.roll);
      case Stat.SkillAdd6:
        return (skillAddArray[6] += line.roll);
      case Stat.SkillAdd7:
        return (skillAddArray[7] += line.roll);
      case Stat.SkillAdd8:
        return (skillAddArray[8] += line.roll);
      case Stat.SkillAdd9:
        return (skillAddArray[9] += line.roll);
      case Stat.Skill:
        return skillsFromItems.push(line.roll);
      case Stat.ExpRate:
        return (expPercent += line.roll);
      case Stat.ItemDrop:
        return (dropPercent += line.roll);
    }
  };

  // TODO move this to config
  const villageSkillMap: any = {
    [-1]: { stat: Stat.SkillAdd0, roll: 0 },
    111: { stat: Stat.SkillAdd0, roll: 3 },
    211: { stat: Stat.SkillAdd1, roll: 3 },
    311: { stat: Stat.SkillAdd3, roll: 3 },
    411: { stat: Stat.SkillAdd4, roll: 3 },
    511: { stat: Stat.SkillAdd2, roll: 3 },
  };

  addStatLine(villageSkillMap[character.village]);

  const sets: { [setId: string]: number } = {};

  Object.keys(equipableItemTypes).forEach((location) => {
    const uid = character.locations[ItemLocations.Equipment_Avatar + parseInt(location, 10)];
    const item = getItem(character, uid);
    const props = item?.props ?? {};

    if (props.defense) {
      defense += props.defense;
    }

    (props.lines ?? []).forEach((line: any) => addStatLine(line));
    Object.entries(props.stats ?? {}).forEach(([key, line]: [string, any]) => addStatLine(line));

    if (props.set) {
      if (!(props.set in sets)) {
        sets[props.set] = 0;
      }

      sets[props.set] += 1;

      if (sets[props.set] in SETS[props.set].bonus) {
        const line = SETS[props.set].bonus[sets[props.set]];

        addStatLine({ stat: line[0], roll: line[1] });
      }
    }

    props.gems?.forEach((gemUID: string) => {
      const gem = getItem(character, gemUID);

      if (gem === undefined) {
        return;
      }

      const innate = getItemBase(gem.iid).innate;
      addStatLine({
        stat: innate.stat,
        roll: innate.value,
      });
    });
  });

  if (currentPet) {
    currentPet.props.skills.passive.forEach((id: number) =>
      addStatLine({
        stat: (Skills[id] as PassiveSkill).modifier,
        roll: (Skills[id] as PassiveSkill).amount,
      })
    );
  }

  character.skillsKnown
    .filter((skill) => {
      return Skills[skill.id]?.type === SkillType.PASSIVE;
    })
    .forEach((skill) => {
      addStatLine({
        stat: (Skills[skill.id] as PassiveSkill).modifier,
        roll: (Skills[skill.id] as PassiveSkill).amount,
      });
    });

  roleBase.innate.skills
    .filter((id: number) => {
      return Skills[id]?.type === SkillType.PASSIVE;
    })
    .forEach((id: number) => {
      addStatLine({
        stat: (Skills[id] as PassiveSkill).modifier,
        roll: (Skills[id] as PassiveSkill).amount,
      });
    });

  if (character.titles.current) {
    TITLES[character.titles.current].forEach((line: [number, number]) => {
      addStatLine({
        stat: line[0],
        roll: line[1],
      });
    });
  }

  if (character.statBonus) {
    Object.keys(character.statBonus).forEach((key) => {
      character.statBonus[key].forEach((line) => addStatLine({ stat: line[0], roll: line[1] }));
    });
  }

  bonusAttackPercent += Math.floor(str / roleBase.innate.bmv[0]);
  bonusParry += Math.floor(str / roleBase.innate.bmv[0]);

  bonusDodge += Math.floor(agi / roleBase.innate.bmv[1]);
  bonusSpeedPercent += Math.floor(agi / roleBase.innate.bmv[1]);

  bonusHpPercent += Math.floor(sta / roleBase.innate.bmv[2]);
  bonusChakraPercent += Math.floor(sta / roleBase.innate.bmv[2]);

  const maxHp = Math.floor((hp + bonusHp) * (1 + bonusHpPercent / 100));

  return {
    id: character.displayName,
    avatar: roleBase.innate.avatar,
    level,
    str,
    agi,
    sta,
    hp: Math.floor(maxHp * previousHpPercentage),
    maxHp,
    chakra: Math.floor((chakra + bonusChakra) * (1 + bonusChakraPercent / 100)),
    maxChakra: Math.floor((chakra + bonusChakra) * (1 + bonusChakraPercent / 100)),
    speed: Math.floor((speed + bonusSpeed) * (1 + bonusSpeedPercent / 100)),
    dodge: dodge + bonusDodge,
    pierce,
    defense,
    defenseBreak,
    hit,
    critical: Math.floor(critical * (1 + bonusCriticalMultipler / 100)),
    criticalDamage: 200,
    con,
    priorityMultipler: 0,
    maxAttack: Math.floor((maxAttack + bonusMaxAttack) * (1 + bonusAttackPercent / 100)),
    minAttack: Math.floor((minAttack + bonusMinAttack) * (1 + bonusAttackPercent / 100)),
    rebound: 0, // Reflect % damage
    decDamage: 0, // % Damage reduction
    parry: Math.floor((parry + bonusParry) * (1 + bonusParryMultiplier / 100)), // This is the english version of block
    canKickBomb: true,
    // counter: 5,
    SkillAdd0: skillAddArray[0],
    SkillAdd1: skillAddArray[1],
    SkillAdd2: skillAddArray[2],
    SkillAdd3: skillAddArray[3],
    SkillAdd4: skillAddArray[4],
    SkillAdd5: skillAddArray[5],
    SkillAdd6: skillAddArray[6],
    SkillAdd7: skillAddArray[7],
    SkillAdd8: skillAddArray[8],
    SkillAdd9: skillAddArray[9],
    resistance: {
      duration: {
        poison: 0,
      },
    },
    weaponId: parseInt(
      (weaponBase.src ?? '1').replace('weapons/', '').replace('blunt/', '').replace('fists/', '').replace('sharp/', ''),
      10
    ),
    pet,
    petSkills,
    sets,
    skills: [...character.skills.filter((skill) => skill !== null), ...roleBase.innate.skills, ...skillsFromItems],
    title: character?.titles.current ?? undefined,
    expPercent,
    dropPercent,
  };
}

export function calculateStatsV2(socket: CustomSocket, character: User): Stats {
  let previousHpPercentage = 1;

  // if (character.stats) {
  //   previousHpPercentage = character.stats.hp / character.stats.maxHp;
  // }

  const level = character.level;

  const role = getItem(character, character.locations[ItemLocations.Equipment_Avatar]) || { iid: 290003, props: { level } };
  const roleBase = getItemBaseFromSocketConfig(socket, role.iid);

  const weapon = getItem(character, character.locations[ItemLocations.Equipment_Avatar + ItemType.Weapon]) ?? { iid: 250101 };
  const weaponBase = getItemBaseFromSocketConfig(socket, weapon.iid);

  const currentPet = getItem(character, getItemInLocation(character, ItemLocations.Equipment_Avatar + ItemType.Pet)?.uid ?? '');
  const pet = currentPet?.props.avatar ?? undefined;
  const petSkills = currentPet
    ? [...currentPet.props.skills.aura, ...currentPet.props.skills.active, ...currentPet.props.skills.passive]
    : undefined;

  let str = Math.floor(20 * roleBase.innate.isv[0] + 8 * roleBase.innate.isv[0] * role.props.level + roleBase.innate.isv[0] * level);
  let agi = Math.floor(20 * roleBase.innate.isv[1] + 8 * roleBase.innate.isv[1] * role.props.level + roleBase.innate.isv[1] * level);
  let sta = Math.floor(20 * roleBase.innate.isv[2] + 8 * roleBase.innate.isv[2] * role.props.level + roleBase.innate.isv[2] * level);

  const speed = 1000; // Need to figure out how this is going to convert to seconds
  let parry = 0; // this is block in the english version
  let pierce = 0; // lower enemy block
  let defense = 0;
  let defenseBreak = 0; // lower enemy defense
  let dodge = 0;
  let hit = 0; // lower enemy dodge
  let critical = 0;
  let con = 0; // Lower enemy crit
  let minAttack = weaponBase.innate.attack[0];
  let maxAttack = weaponBase.innate.attack[1];

  const hp = 200 + 20 * level;
  const chakra = 200 + 20 * level;

  let bonusMaxAttack = 0;
  let bonusMinAttack = 0;
  let bonusAttackPercent = 0;

  let bonusParry = 0;
  let bonusParryMultiplier = 0;

  let bonusSpeed = 0;
  let bonusSpeedPercent = 0;

  let bonusDodge = 0;

  let bonusHp = 0;
  let bonusHpPercent = 0;

  let bonusChakra = 0;
  let bonusChakraPercent = 0;

  let bonusCriticalMultipler = 0;
  let bonusCon = 0;

  let skillAddArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const skillsFromItems: number[] = [];

  let expPercent = 0;
  let dropPercent = 0;

  const addStatLine = (line: any) => {
    switch (line.stat) {
      case Stat.Strength:
        return (str += line.roll);
      case Stat.Agility:
        return (agi += line.roll);
      case Stat.Stamina:
        return (sta += line.roll);
      case Stat.Defense:
        return (defense += line.roll);
      case Stat.Defense_Break:
        return (defenseBreak += line.roll);
      case Stat.Dodge:
        return (dodge += line.roll);
      case Stat.Hit:
        return (hit += line.roll);
      case Stat.Max_Hp:
        return (bonusHp += line.roll);
      case Stat.Max_Hp_Multiplier:
        return (bonusHpPercent += line.roll / 10);
      case Stat.Max_Attack:
        return (bonusMaxAttack += line.roll);
      case Stat.Attack_Multiplier:
        return (bonusAttackPercent += line.roll / 10);
      case Stat.Speed_Multiplier:
        return (bonusSpeedPercent += line.roll / 10);
      case Stat.Max_Mp:
        return (bonusChakra += line.roll);
      case Stat.Max_Mp_Multiplier:
        return (bonusChakraPercent += line.roll / 10);
      case Stat.Critical_Multiplier:
        return (critical += line.roll);
      case Stat.Toughness:
        return (con += line.roll);
      case Stat.Parry_Multiplier:
        return (bonusParry += line.roll);
      case Stat.Pierce:
        return (pierce += line.roll);
      case Stat.Min_Attack:
        return (bonusMinAttack += line.roll);
      case Stat.SkillAdd0:
        return (skillAddArray[0] += line.roll);
      case Stat.SkillAdd1:
        return (skillAddArray[1] += line.roll);
      case Stat.SkillAdd2:
        return (skillAddArray[2] += line.roll);
      case Stat.SkillAdd3:
        return (skillAddArray[3] += line.roll);
      case Stat.SkillAdd4:
        return (skillAddArray[4] += line.roll);
      case Stat.SkillAdd5:
        return (skillAddArray[5] += line.roll);
      case Stat.SkillAdd6:
        return (skillAddArray[6] += line.roll);
      case Stat.SkillAdd7:
        return (skillAddArray[7] += line.roll);
      case Stat.SkillAdd8:
        return (skillAddArray[8] += line.roll);
      case Stat.SkillAdd9:
        return (skillAddArray[9] += line.roll);
      case Stat.Skill:
        return skillsFromItems.push(line.roll);
      case Stat.ExpRate:
        return (expPercent += line.roll);
      case Stat.ItemDrop:
        return (dropPercent += line.roll);
    }
  };

  // TODO move this to config
  const villageSkillMap: any = {
    [-1]: { stat: Stat.SkillAdd0, roll: 0 },
    111: { stat: Stat.SkillAdd0, roll: 3 },
    211: { stat: Stat.SkillAdd1, roll: 3 },
    311: { stat: Stat.SkillAdd3, roll: 3 },
    411: { stat: Stat.SkillAdd4, roll: 3 },
    511: { stat: Stat.SkillAdd2, roll: 3 },
  };

  addStatLine(villageSkillMap[character.village]);

  const sets: { [setId: string]: number } = {};

  Object.keys(equipableItemTypes).forEach((location) => {
    const uid = character.locations[ItemLocations.Equipment_Avatar + parseInt(location, 10)];
    const item = getItem(character, uid);
    const props = item?.props ?? {};

    if (props.defense) {
      defense += props.defense;
    }

    (props.lines ?? []).forEach((line: any) => addStatLine(line));
    Object.entries(props.stats ?? {}).forEach(([key, line]: [string, any]) => addStatLine(line));

    if (props.set) {
      if (!(props.set in sets)) {
        sets[props.set] = 0;
      }

      sets[props.set] += 1;

      if (sets[props.set] in SETS[props.set].bonus) {
        const line = SETS[props.set].bonus[sets[props.set]];

        addStatLine({ stat: line[0], roll: line[1] });
      }
    }

    props.gems?.forEach((gemUID: string) => {
      const gem = getItem(character, gemUID);

      if (gem === undefined) {
        return;
      }

      const innate = getItemBaseFromSocketConfig(socket, gem.iid).innate;
      addStatLine({
        stat: innate.stat,
        roll: innate.value,
      });
    });
  });

  if (currentPet) {
    currentPet.props.skills.passive.forEach((id: number) =>
      addStatLine({
        stat: (Skills[id] as PassiveSkill).modifier,
        roll: (Skills[id] as PassiveSkill).amount,
      })
    );
  }

  character.skillsKnown
    .filter((skill) => {
      return Skills[skill.id]?.type === SkillType.PASSIVE;
    })
    .forEach((skill) => {
      addStatLine({
        stat: (Skills[skill.id] as PassiveSkill).modifier,
        roll: (Skills[skill.id] as PassiveSkill).amount,
      });
    });

  roleBase.innate.skills
    .filter((id: number) => {
      return Skills[id]?.type === SkillType.PASSIVE;
    })
    .forEach((id: number) => {
      addStatLine({
        stat: (Skills[id] as PassiveSkill).modifier,
        roll: (Skills[id] as PassiveSkill).amount,
      });
    });

  if (character.titles.current) {
    TITLES[character.titles.current].forEach((line: [number, number]) => {
      addStatLine({
        stat: line[0],
        roll: line[1],
      });
    });
  }

  if (character.statBonus) {
    Object.keys(character.statBonus).forEach((key) => {
      character.statBonus[key].forEach((line) => addStatLine({ stat: line[0], roll: line[1] }));
    });
  }

  if (character.bloodlines) {
    const bloodlineData = socket.getConfig().Base.Bloodline.Limits;
    const soulData = socket.getConfig().Base.Bloodline.Souls;

    character.bloodlines.active.forEach((id) => {
      if (id === null || !bloodlineData[id]) {
        return;
      }

      addStatLine({ stat: Stat.Strength, roll: bloodlineData[id].stats[0] });
      addStatLine({ stat: Stat.Agility, roll: bloodlineData[id].stats[1] });
      addStatLine({ stat: Stat.Stamina, roll: bloodlineData[id].stats[2] });

      bloodlineData[id]?.bonus.forEach((row: [number, number]) => addStatLine({ stat: row[0], roll: row[1] }));

      character.bloodlines.limits[id].souls.forEach((soul) =>
        addStatLine({ stat: soulData[soul.id].stat, roll: soulData[soul.id].levels[soul.level] })
      );
    });
  }

  bonusAttackPercent += Math.floor(str / roleBase.innate.bmv[0]);
  bonusParry += Math.floor(str / roleBase.innate.bmv[0]);

  bonusDodge += Math.floor(agi / roleBase.innate.bmv[1]);
  bonusSpeedPercent += Math.floor(agi / roleBase.innate.bmv[1]);

  bonusHpPercent += Math.floor(sta / roleBase.innate.bmv[2]);
  bonusChakraPercent += Math.floor(sta / roleBase.innate.bmv[2]);

  const maxHp = Math.floor((hp + bonusHp) * (1 + bonusHpPercent / 100));

  return {
    id: character.displayName,
    avatar: roleBase.innate.avatar,
    level,
    str,
    agi,
    sta,
    hp: Math.floor(maxHp * previousHpPercentage),
    maxHp,
    chakra: Math.floor((chakra + bonusChakra) * (1 + bonusChakraPercent / 100)),
    maxChakra: Math.floor((chakra + bonusChakra) * (1 + bonusChakraPercent / 100)),
    speed: Math.floor((speed + bonusSpeed) * (1 + bonusSpeedPercent / 100)),
    dodge: dodge + bonusDodge,
    pierce,
    defense,
    defenseBreak,
    hit,
    critical: Math.floor(critical * (1 + bonusCriticalMultipler / 100)),
    criticalDamage: 200,
    con,
    priorityMultipler: 0,
    maxAttack: Math.floor((maxAttack + bonusMaxAttack) * (1 + bonusAttackPercent / 100)),
    minAttack: Math.floor((minAttack + bonusMinAttack) * (1 + bonusAttackPercent / 100)),
    rebound: 0, // Reflect % damage
    decDamage: 0, // % Damage reduction
    parry: Math.floor((parry + bonusParry) * (1 + bonusParryMultiplier / 100)), // This is the english version of block
    canKickBomb: true,
    // counter: 5,
    SkillAdd0: skillAddArray[0],
    SkillAdd1: skillAddArray[1],
    SkillAdd2: skillAddArray[2],
    SkillAdd3: skillAddArray[3],
    SkillAdd4: skillAddArray[4],
    SkillAdd5: skillAddArray[5],
    SkillAdd6: skillAddArray[6],
    SkillAdd7: skillAddArray[7],
    SkillAdd8: skillAddArray[8],
    SkillAdd9: skillAddArray[9],
    resistance: {
      duration: {
        poison: 0,
      },
    },
    weaponId: parseInt(
      (weaponBase.src ?? '1').replace('weapons/', '').replace('blunt/', '').replace('fists/', '').replace('sharp/', ''),
      10
    ),
    pet,
    petSkills,
    sets,
    skills: [...character.skills.filter((skill) => skill !== null), ...roleBase.innate.skills, ...skillsFromItems],
    title: character?.titles.current ?? undefined,
    expPercent,
    dropPercent,
  };
}

export async function emitStats(socket: CustomSocket, character: User) {
  socket.emit('updateStats', {
    ...character.stats,
    level: character.level,
    rank: character.arena.rank,
    score: character.arena.score,
    exp: character.exp,
  });
}

export async function emitLevelStats(socket: CustomSocket, character: User) {
  socket.emit('updateStats', {
    level: character.level,
    rank: character.arena.rank,
    score: character.arena.score,
    exp: character.exp,
    // expForLevel: expNeededForLevel(socket, character.level),
    // expToLevel: expNeededForLevel(socket, character.level + 1),
  });
}

export async function getStats(socket: CustomSocket, data: any, cb: Callback) {
  cb((await socket.getUnlockedCharacter()).stats);
}
