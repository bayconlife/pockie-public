const { generateFieldMonster } = require('./util');

function bossHealth(stats) {
  stats.maxHp *= 1.5;
  stats.hp = stats.maxHp;

  stats.maxChakra *= 1.5;
  stats.chakra = stats.maxChakra;

  return stats;
}

function applyMods(stats, mods) {
  mods.forEach(mod => stats = mod(stats));

  return stats;
}

module.exports = {
  33017: generateFieldMonster({ avatar: 10076, level: 2, skills: [40027] }),
  33006: generateFieldMonster({ avatar: 10065, level: 4, skills: [40023]  }),
  33026: generateFieldMonster({ avatar: 10085, level: 6 }),
  32001: generateFieldMonster({ avatar: 10001, level: 8, skills: [40031, 40033], canKickBombs: true }),
  32002: applyMods(generateFieldMonster({ avatar: 10002, level: 10, skills: [40031, 40033, 40036], canKickBombs: true }), [bossHealth]),
  33018: generateFieldMonster({ avatar: 10077, level: 12, skills: [40028] }),
  33008: generateFieldMonster({ avatar: 10067, level: 14, skills: [40024] }),
  33027: generateFieldMonster({ avatar: 10086, level: 16, skills: [40020] }),
  33016: generateFieldMonster({ avatar: 10075, level: 17, skills: [40026] }),
  33011: generateFieldMonster({ avatar: 10070, level: 18 }),
  33015: generateFieldMonster({ avatar: 10074, level: 19 }),
  32003: {
    ...generateFieldMonster({ avatar: 10004, level: 20 }),
    maxHp: 1500,
    hp: 1500,
    maxChakra: 1500,
    chakra: 1500
  },
  32015: generateFieldMonster({ avatar: 10015, level: 21 }),
  33019: generateFieldMonster({ avatar: 10078, level: 22 }),
  32020: generateFieldMonster({ avatar: 10020, level: 23 }),
  33007: generateFieldMonster({ avatar: 10066, level: 24 }),
  33010: generateFieldMonster({ avatar: 10069, level: 26 }),
  33014: generateFieldMonster({ avatar: 10073, level: 27 }),
  33020: generateFieldMonster({ avatar: 10079, level: 28 }),
  33021: generateFieldMonster({ avatar: 10080, level: 28 }),
  33022: generateFieldMonster({ avatar: 10081, level: 28 }),
  33023: generateFieldMonster({ avatar: 10082, level: 28 }),
  33024: generateFieldMonster({ avatar: 10083, level: 28 }),
  33005: generateFieldMonster({ avatar: 10064, level: 29 }),
  32011: generateFieldMonster({ avatar: 10012, level: 30 }),
  33004: generateFieldMonster({ avatar: 10063, level: 31 }),
  33009: generateFieldMonster({ avatar: 10068, level: 32 }),
  32010: generateFieldMonster({ avatar: 10010, level: 33 }),
  33025: generateFieldMonster({ avatar: 10084, level: 34 }),
  32016: generateFieldMonster({ avatar: 10016, level: 36 }),
  33012: generateFieldMonster({ avatar: 10071, level: 37 }),
  32027: generateFieldMonster({ avatar: 10027, level: 38 }),
  32018: generateFieldMonster({ avatar: 10018, level: 39 }),
  32006: generateFieldMonster({ avatar: 10007, level: 40 }),
  33013: generateFieldMonster({ avatar: 10072, level: 41 }),
  33002: generateFieldMonster({ avatar: 10061, level: 42 }),
  32023: generateFieldMonster({ avatar: 10023, level: 43 }),
  33003: generateFieldMonster({ avatar: 10062, level: 44 }),
  33001: generateFieldMonster({ avatar: 10060, level: 46 }),
  33033: generateFieldMonster({ avatar: 10092, level: 47 }),
  32012: generateFieldMonster({ avatar: 10012, level: 48 }),
  33035: generateFieldMonster({ avatar: 10094, level: 49 }),
  32022: generateFieldMonster({ avatar: 10023, level: 50 }),
  33028: generateFieldMonster({ avatar: 10087, level: 51 }),
  33041: generateFieldMonster({ avatar: 10100, level: 52 }),
  32032: generateFieldMonster({ avatar: 10032, level: 53 }),
  33034: generateFieldMonster({ avatar: 10093, level: 54 }),
  33038: generateFieldMonster({ avatar: 10097, level: 56 }),
  33031: generateFieldMonster({ avatar: 10090, level: 57 }),
  32036: generateFieldMonster({ avatar: 10036, level: 58 }),
  33042: generateFieldMonster({ avatar: 10101, level: 59 }),
  32019: generateFieldMonster({ avatar: 10020, level: 60 }),
  33037: generateFieldMonster({ avatar: 10096, level: 61 }),
  33043: generateFieldMonster({ avatar: 10102, level: 62 }),
  32031: generateFieldMonster({ avatar: 10031, level: 63 }),
  33029: generateFieldMonster({ avatar: 10088, level: 64 }),
  33036: generateFieldMonster({ avatar: 10095, level: 66 }),
  33040: generateFieldMonster({ avatar: 10099, level: 66 }),
  31041: generateFieldMonster({ avatar: 10042, level: 67 }),
  32038: generateFieldMonster({ avatar: 10038, level: 68 }),
  31018: generateFieldMonster({ avatar: 10075, level: 69 }),
  32030: generateFieldMonster({ avatar: 10031, level: 70 }),
}