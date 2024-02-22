import { CharacterAnimation, Depths } from '../../../enums';
import { FightTurn, UserSkills } from '../../interfaces/Interfaces';
import Character from '../Characters/Character';
import { CustomMotion } from '../Motions/CustomMotion';
import DizzyMotion from '../Motions/DizzyMotion';
import GreatStrengthDamageMotion from '../Motions/GreatStrengthDamageMotion';
import GreatStrengthMotion from '../Motions/GreatStrengthMotion';
import InstantMoveMotion from '../Motions/InstantMoveMotion';
import MoveMotion from '../Motions/MoveMotion';
import BombMotion from '../Motions/BombMotion';
import { FightScene } from '../Scenes';
import SkillFactory from '../SkillFactory';
import AssassinateMotion from '../Motions/AssassinateMotion';
import FiveElementalSealMotion from '../Motions/FiveElementalSealMotion';
import SubstitueMotion from '../Motions/SubstituteMotion';
import { CombatPlayerScene } from '../../../features/Fight/Scenes/CombatPlayerScene';

export enum CombatEvent {
  ATTACK = 'Attack',
  MOTION = 'CombatEventMotion',
  ATTACK_MOTION = 'CombatEventAttackMotion',
}

export interface SkillData {
  name: string;
  offset: {
    x: number;
    y: number;
  };
  events?: {
    [id: number]: {
      event: CombatEvent;
      fn?: (
        scene: Phaser.Scene,
        source: Character,
        target: Character,
        turn?: FightTurn,
        functionWithLock?: (...args: any[]) => void
      ) => void;
    };
  };
  depth?: Depths;
  jutsu?: boolean;
  characterAnimation?: string;
  targetAnimation?: string;
  move?: boolean;
  global?: boolean;
  damageMotion?: typeof CustomMotion | null;
  linked?: UserSkills[];
  onTarget?: boolean;
  next?: UserSkills;
  noSprite?: boolean;
  onPet?: boolean;
}

export const skills: { [name: number]: SkillData } = {
  [UserSkills.SECRET_TECHNIQUE]: {
    name: 'secret_technique',
    offset: { x: -1075.75, y: -760.85 },
    characterAnimation: CharacterAnimation.SECRET_TECHNIQUE,
  },
  [UserSkills.BASIC_ATTACK]: {
    name: 'basic_attack',
    offset: { x: 0, y: 0 },
    move: true,
    characterAnimation: CharacterAnimation.ATTACK,
  },
  [UserSkills.PRIORITY_ATTACK]: {
    name: 'basic_attack',
    offset: { x: 0, y: 0 },
    move: false,
    characterAnimation: CharacterAnimation.ATTACK,
  },
  [UserSkills.ASSASSINATE]: {
    name: 'assassinate',
    offset: { x: -570, y: -481.6 },
    events: {
      1: {
        event: CombatEvent.MOTION,
        fn: async (scene: Phaser.Scene, source: Character, target: Character, turn, functionWithLock?) => {
          functionWithLock?.(async () => {
            source.setLocation(source.x + (source.isOnOffense ? 330 : -330), source.y);
            await new AssassinateMotion(scene, source).create();
          });
        },
      },
      10: { event: CombatEvent.ATTACK },
    },
    onTarget: true,
    characterAnimation: CharacterAnimation.WINDUP_ATTACK,
  },
  [UserSkills.BALSAM]: {
    name: 'balsam',
    offset: { x: -502.2, y: -103.95 },
    events: { 1: { event: CombatEvent.ATTACK } },
    depth: Depths.BEHIND_CHARACTER,
  },
  [UserSkills.BLOODBOIL]: {
    name: 'bloodboil',
    offset: { x: -181.9, y: -508.0 },
    events: { 2: { event: CombatEvent.ATTACK } },
    depth: Depths.IN_FRONT_OF_CHARACTER,
    characterAnimation: CharacterAnimation.BUFF,
  },
  [UserSkills.BOMB]: {
    name: 'bomb',
    linked: [UserSkills.BOMB_THROW_BACK, UserSkills.BOMB_KICK, UserSkills.BOMB_EXPLODE],
    offset: { x: -345, y: -216.0 },
    // events: {
    //   12: {
    //     event: CombatEvent.MOTION,
    //     fn: async (scene: Phaser.Scene, source: Character, target: Character, turn?: FightTurn) => {
    //       await SkillFactory.create(scene as FightScene, UserSkills.BOMB_EXPLODE, source, target, turn);
    //     },
    //   },
    // },
    next: UserSkills.BOMB_EXPLODE,
    characterAnimation: CharacterAnimation.BOMB_THROW,
  },
  [UserSkills.BOMB_THROW_BACK]: {
    name: 'bomb',
    offset: { x: -345, y: -216.0 },
    characterAnimation: CharacterAnimation.BOMB_THROW,
  },
  [UserSkills.BOMB_KICK]: {
    name: 'bomb_kick',
    offset: { x: -430, y: -206 },
    onTarget: true,
    next: UserSkills.BOMB_EXPLODE,
    characterAnimation: CharacterAnimation.BOMB_KICK,
  },
  [UserSkills.BOMB_EXPLODE]: {
    name: 'bomb_explode',
    offset: { x: -534, y: -195 },
    events: { 2: { event: CombatEvent.ATTACK } },
    damageMotion: null,
    targetAnimation: CharacterAnimation.BOMB_KNOCKBACK,
  },
  [UserSkills.CHAKRA_BLADE]: {
    name: 'chakra_blade',
    offset: { x: -327.6, y: -222.6 },
    events: { 7: { event: CombatEvent.ATTACK } },
    move: true,
    characterAnimation: CharacterAnimation.ATTACK,
  },
  [UserSkills.CHIDORI]: {
    name: 'chidori',
    linked: [UserSkills.CHIDORI_2],
    offset: { x: -213.95, y: -77.15 },
    events: {
      14: {
        event: CombatEvent.MOTION,
        fn: (scene: Phaser.Scene, source: Character) => {
          source.moved = true;
          new InstantMoveMotion(scene, source).create();
        },
      },
    },
    next: UserSkills.CHIDORI_2,
    characterAnimation: CharacterAnimation.ATTACK_2,
  },
  [UserSkills.CHIDORI_2]: {
    name: 'chidori_2',
    offset: { x: -213.05, y: -268.8 },
    events: { 3: { event: CombatEvent.ATTACK } },
    characterAnimation: CharacterAnimation.ATTACK_3,
    damageMotion: DizzyMotion,
  },
  [UserSkills.CREATION_REBIRTH]: {
    name: 'creation_rebirth',
    offset: { x: -206.35, y: -407.05 },
    events: {
      15: { event: CombatEvent.ATTACK },
    },
    characterAnimation: CharacterAnimation.REVIVE,
    targetAnimation: CharacterAnimation.WIN,
  },
  [UserSkills.CRYSTAL_BLADE]: {
    name: 'crystal_blade',
    offset: { x: -940.9, y: -254.5 },
    events: { 6: { event: CombatEvent.ATTACK } },
    depth: Depths.IN_FRONT_OF_CHARACTER,
    move: true,
    characterAnimation: CharacterAnimation.ATTACK,
  },
  [UserSkills.CURSED_SEAL_OF_HEAVEN]: {
    name: 'cursed_seal_of_heaven',
    offset: { x: -159.95, y: -195.8 },
    events: { 4: { event: CombatEvent.ATTACK } },
  },
  [UserSkills.DEAD_DEMON_CONSUMING_SEAL]: {
    name: 'dead_demon_consuming_seal',
    linked: [UserSkills.DEAD_DEMON_CONSUMING_SEAL_2, UserSkills.DEAD_DEMON_CONSUMING_SEAL_3],
    offset: { x: -226.55, y: -178.25 },
    events: {
      14: {
        event: CombatEvent.MOTION,
        fn: (scene: Phaser.Scene, source: Character) => {
          source.moved = true;
          new InstantMoveMotion(scene, source).create();
        },
      },
    },
    next: UserSkills.DEAD_DEMON_CONSUMING_SEAL_2,
    characterAnimation: CharacterAnimation.ATTACK_2,
  },
  [UserSkills.DEAD_DEMON_CONSUMING_SEAL_2]: {
    name: 'dead_demon_consuming_seal_2',
    offset: { x: -181.45, y: -419.1 },
    events: {
      1: {
        event: CombatEvent.MOTION,
        fn: async (scene: Phaser.Scene, source: Character, target: Character, turn?: FightTurn) => {
          SkillFactory.create(scene as CombatPlayerScene, UserSkills.DEAD_DEMON_CONSUMING_SEAL_3, source, target, turn);
        },
      },
      2: { event: CombatEvent.ATTACK },
    },
    characterAnimation: CharacterAnimation.ATTACK_3,
  },
  [UserSkills.DEAD_DEMON_CONSUMING_SEAL_3]: {
    name: 'dead_demon_consuming_seal_3',
    offset: { x: -225.1, y: -258.7 },
    depth: Depths.BEHIND_CHARACTER,
  },
  [UserSkills.DEATH_MIRAGE_JUTSU]: {
    name: 'death_mirage_jutsu',
    offset: { x: -152.9, y: -458.3 },
    events: { 13: { event: CombatEvent.ATTACK } },
    onTarget: true,
  },
  [UserSkills.DETONATING_CLAY]: {
    name: 'detonating_clay',
    linked: [UserSkills.DETONATING_CLAY_2],
    offset: { x: -525.05, y: -243.65 },
    events: { 19: { event: CombatEvent.ATTACK } },
    characterAnimation: CharacterAnimation.JUTSU,
  },
  [UserSkills.DETONATING_CLAY_2]: {
    name: 'detonating_clay_2',
    offset: { x: -119.75, y: -161.15 },
  },
  [UserSkills.EARTH_PRISON]: {
    name: 'earth_prison',
    offset: { x: -689.5, y: -130.2 },
    depth: Depths.IN_FRONT_OF_CHARACTER,
    events: { 15: { event: CombatEvent.ATTACK } },
    characterAnimation: CharacterAnimation.JUTSU,
    jutsu: true,
  },
  [UserSkills.EIGHT_TRIGRAM_PALM]: {
    name: 'eight_trigram_palm',
    linked: [UserSkills.EIGHT_TRIGRAM_PALM_2, UserSkills.EIGHT_TRIGRAM_PALM_3],
    offset: { x: -745.0, y: -487.0 },
    events: {
      1: {
        event: CombatEvent.MOTION,
        fn: (scene: Phaser.Scene, source: Character, target: Character, turn?: FightTurn) => {
          SkillFactory.create(scene as CombatPlayerScene, UserSkills.EIGHT_TRIGRAM_PALM_3, source, target, turn);
        },
      },
      14: {
        event: CombatEvent.MOTION,
        fn: (scene: Phaser.Scene, source: Character) => {
          source.moved = true;
          new InstantMoveMotion(scene, source).create();
        },
      },
    },
    next: UserSkills.EIGHT_TRIGRAM_PALM_2,
    characterAnimation: CharacterAnimation.ATTACK_2,
  },
  [UserSkills.EIGHT_TRIGRAM_PALM_2]: {
    name: 'eight_trigram_palm_2',
    offset: { x: -275.65, y: -150.35 },
    events: { 2: { event: CombatEvent.ATTACK } },
    characterAnimation: CharacterAnimation.ATTACK_3,
  },
  [UserSkills.EIGHT_TRIGRAM_PALM_3]: {
    name: 'eight_trigram_palm_3',
    offset: { x: -318.45, y: -60.85 },
    depth: Depths.BEHIND_CHARACTER,
  },
  [UserSkills.FIREBALL]: {
    name: 'fireball',
    offset: { x: -572.5, y: -224.5 },
    events: { 15: { event: CombatEvent.ATTACK } },
    depth: Depths.IN_FRONT_OF_CHARACTER,
    characterAnimation: CharacterAnimation.JUTSU,
  },
  [UserSkills.FIVE_ELEMENTAL_SEAL]: {
    name: 'five_elemental_seal',
    offset: { x: -386.7, y: -255.7 },
    events: {
      1: {
        event: CombatEvent.MOTION,
        fn: async (scene: Phaser.Scene, source: Character, target: Character, turn, functionWithLock?) => {
          functionWithLock?.(async () => {
            await new FiveElementalSealMotion(scene, source).create();
          });
        },
      },
      15: { event: CombatEvent.ATTACK },
    },
    move: true,
    characterAnimation: CharacterAnimation.WINDUP_ATTACK,
  },
  [UserSkills.FLYING_THUNDER_GOD]: {
    name: 'flying_thunder_god',
    linked: [UserSkills.FLYING_THUNDER_GOD_2],
    offset: { x: -105.2, y: -203.95 },
    events: { 7: { event: CombatEvent.ATTACK } },
    characterAnimation: CharacterAnimation.JUTSU,
    onTarget: true,
  },
  [UserSkills.FLYING_THUNDER_GOD_2]: {
    name: 'flying_thunder_god_2',
    offset: { x: -125.55, y: -201.1 },
  },
  [UserSkills.GALE_PALM]: {
    name: 'gale_palm',
    offset: { x: -516.85, y: -282.0 },
    events: { 5: { event: CombatEvent.ATTACK } },
    characterAnimation: CharacterAnimation.ATTACK,
  },
  [UserSkills.GIANT_WATERFALL]: {
    name: 'giant_waterfall',
    linked: [UserSkills.GIANT_WATERFALL_2],
    offset: { x: -610.95, y: -290.35 },
    events: {
      1: {
        event: CombatEvent.MOTION,
        fn: (scene: Phaser.Scene, source: Character, target: Character) =>
          SkillFactory.create(scene as CombatPlayerScene, UserSkills.GIANT_WATERFALL_2, source, target),
      },
      13: { event: CombatEvent.ATTACK },
    },
    depth: Depths.IN_FRONT_OF_CHARACTER,
    characterAnimation: CharacterAnimation.JUTSU,
  },
  [UserSkills.GIANT_WATERFALL_2]: {
    name: 'giant_waterfall_2',
    offset: { x: -496.75, y: -11.25 },
  },
  [UserSkills.GREAT_STRENGTH]: {
    name: 'great_strength',
    offset: { x: -369, y: -325 },
    events: {
      2: {
        event: CombatEvent.MOTION,
        fn: (scene: Phaser.Scene, source: Character, target: Character) => {
          new GreatStrengthMotion(scene, source).create();
        },
      },
      10: {
        event: CombatEvent.ATTACK,
      },
    },
    characterAnimation: CharacterAnimation.GREAT_STRENGTH,
    move: true,
    damageMotion: GreatStrengthDamageMotion,
  },
  [UserSkills.LIQUOR]: {
    name: 'liquor',
    offset: { x: -459.2, y: -242.4 },
    events: { 13: { event: CombatEvent.ATTACK } },
    depth: Depths.IN_FRONT_OF_CHARACTER,
    characterAnimation: CharacterAnimation.BOMB_THROW,
  },
  [UserSkills.LOTUS]: {
    name: 'lotus',
    offset: { x: -220.0, y: -112.85 },
    events: { 2: { event: CombatEvent.ATTACK } },
    move: true,
  },
  [UserSkills.MIST]: {
    name: 'mist',
    offset: { x: -50.0, y: -50.0 },
    events: { 4: { event: CombatEvent.ATTACK } },
    global: true,
  },
  [UserSkills.MYSTICAL_PALM_TECHNIQUE]: {
    name: 'mystical_palm_technique',
    offset: { x: -126.2, y: -247.05 },
    events: { 15: { event: CombatEvent.ATTACK } },
    characterAnimation: CharacterAnimation.JUTSU,
  },
  [UserSkills.MUD_WALL]: {
    name: 'mud_wall',
    offset: { x: -188.0, y: -125.45 },
    characterAnimation: CharacterAnimation.BLOCK,
  },
  // [UserSkills.PET_ATTACK]: {
  //   name: 'attack',
  //   offset: { x: 0, y: 0 },
  //   events: {
  //     5: { event: CombatEvent.ATTACK },
  //   },
  //   onPet: true,
  // },
  [UserSkills.PRAYER]: {
    name: 'prayer',
    offset: { x: -136.0, y: -276.85 },
    events: { 9: { event: CombatEvent.ATTACK } },
    characterAnimation: CharacterAnimation.BUFF,
  },
  [UserSkills.PRE_HEALING_JUTSU]: {
    name: 'pre_healing_jutsu',
    offset: { x: -78.0, y: -171.45 },
    events: { 7: { event: CombatEvent.ATTACK } },
  },
  [UserSkills.PUPPET]: {
    name: 'puppet',
    offset: { x: -267.25, y: -205.0 },
    events: { 18: { event: CombatEvent.ATTACK } },
  },
  [UserSkills.QUICKSTEP]: {
    name: 'quickstep',
    offset: { x: -254.75, y: -123.9 },
    events: { 9: { event: CombatEvent.ATTACK } },
  },
  [UserSkills.RASENGAN]: {
    name: 'rasengan',
    linked: [UserSkills.RASENGAN_2],
    offset: { x: -337.1, y: -197.2 },
    events: {
      14: {
        event: CombatEvent.MOTION,
        fn: (scene: Phaser.Scene, source: Character) => {
          source.moved = true;
          new InstantMoveMotion(scene, source).create();
        },
      },
    },
    next: UserSkills.RASENGAN_2,
    characterAnimation: CharacterAnimation.ATTACK_2,
  },
  [UserSkills.RASENGAN_2]: {
    name: 'rasengan_2',
    offset: { x: -645.85, y: -206.25 },
    events: { 2: { event: CombatEvent.ATTACK } },
    characterAnimation: CharacterAnimation.ATTACK_3,
  },
  [UserSkills.SEXY_TECHNIQUE]: {
    name: 'sexy_technique',
    offset: { x: -462.2, y: -235.65 },
    events: { 14: { event: CombatEvent.ATTACK } },
  },
  [UserSkills.SNARED]: {
    name: 'snared',
    offset: { x: -512.8, y: -158.65 },
    events: { 14: { event: CombatEvent.ATTACK } },
    characterAnimation: CharacterAnimation.BOMB_THROW,
  },
  [UserSkills.STATIC_FIELD]: {
    name: 'static_field',
    offset: { x: -100.55, y: -117.0 },
    events: { 5: { event: CombatEvent.ATTACK } },
    characterAnimation: CharacterAnimation.JUTSU,
  },
  [UserSkills.SUBSTITUTE]: {
    name: 'substitution_technique',
    offset: { x: -195.35, y: -199.45 },
    events: {
      1: {
        event: CombatEvent.MOTION,
        fn: (scene: Phaser.Scene, source: Character) => {
          new SubstitueMotion(scene, source).create();
        },
      },
    },
  },
  [UserSkills.SUNSET]: {
    name: 'sunset',
    offset: { x: -50.0, y: -50.0 },
    events: { 11: { event: CombatEvent.ATTACK } },
    global: true,
  },
  [UserSkills.TAILED_BEAST_HEART]: {
    name: 'tailed_beast_heart',
    offset: { x: -97.8, y: -447.9 },
    events: { 11: { event: CombatEvent.ATTACK } },
    characterAnimation: CharacterAnimation.JUTSU,
    jutsu: true,
  },
  [UserSkills.THE_EIGHT_INNER_GATES_RELEASED]: {
    name: 'the_eight_inner_gates_released',
    offset: { x: -236.65, y: -320.5 },
    events: { 13: { event: CombatEvent.ATTACK } },
    characterAnimation: CharacterAnimation.BUFF,
  },
  [UserSkills.THUNDERFALL]: {
    name: 'thunderfall',
    offset: { x: -133.45, y: -290.85 }, //x: -133.45, y: -290.85 },
    events: { 6: { event: CombatEvent.ATTACK } },
    characterAnimation: CharacterAnimation.JUTSU,
    onTarget: true,
  },
  [UserSkills.WINDSTORM_ARRAY]: {
    name: 'windstorm_array',
    offset: { x: -125, y: -158 },
    events: {
      1: { event: CombatEvent.ATTACK },
    },
    depth: Depths.IN_FRONT_OF_CHARACTER,
    characterAnimation: CharacterAnimation.SPIN,
  },
  [UserSkills.JUTSU]: {
    name: 'jutsu',
    offset: { x: -168, y: -180 },
    depth: Depths.IN_FRONT_OF_CHARACTER,
  },
  [40002]: {
    name: '18',
    offset: { x: 0, y: 0 },
    events: {
      7: { event: CombatEvent.ATTACK },
    },
    onPet: true,
  },
  [40006]: {
    name: '69',
    offset: { x: 0, y: 0 },
    events: {
      0: {
        event: CombatEvent.MOTION,
        fn: (scene: Phaser.Scene, source: Character) => {
          source.pet.x = source.x;
          source.pet.y = source.y + 100;
          source.pet.container.x = source.x;
          source.pet.container.y = source.y + 100;
        },
      },
      7: { event: CombatEvent.ATTACK },
      999: {
        event: CombatEvent.MOTION,
        fn: (scene: Phaser.Scene, source: Character) => {
          source.pet.x = source.pet.startingPosition.x;
          source.pet.y = source.pet.startingPosition.y;
          source.pet.container.x = source.pet.startingPosition.x;
          source.pet.container.y = source.pet.startingPosition.y;
        },
      },
    },
    onPet: true,
  },
};
