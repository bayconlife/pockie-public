import CharacterFactoryV2, { FightRole } from '../../../components/Fight/CharacterFactoryV2';
import AnimatedQuad from '../../../components/Fight/Characters/AnimatedQuad';
import Character from '../../../components/Fight/Characters/Character';
import { Effect } from '../../../components/Fight/Effects/Effect';
import EffectFactory from '../../../components/Fight/Effects/EffectFactory';
import HurtLiteMotion from '../../../components/Fight/Motions/DamageHeavyMotion';
import DizzyMotion from '../../../components/Fight/Motions/DizzyMotion';
import { Motion } from '../../../components/Fight/Motions/Motion';
import { DamageNumbers } from '../../../components/Fight/Numbers/DamageNumbers';
import { FontNumbers } from '../../../components/Fight/Numbers/FontNumbers';
import SkillFactory from '../../../components/Fight/SkillFactory';
import SkillFactoryV2 from '../../../components/Fight/SkillFactoryV2';
import { skills } from '../../../components/Fight/Skills/Skills';
import { FightEvents, FightTurn, UserSkills } from '../../../components/interfaces/Interfaces';
import { CharacterAnimation, Depths } from '../../../enums';
import { endFight, setRewards } from '../../../slices/fightSlice';
import store from '../../../store';
import Events from '../../../util/EventEmitter';
import { TopUI } from '../../Combat/Components/TopUI';

export class CombatPlayerScene extends Phaser.Scene {
  constructor() {
    super({ key: 'combatPlayer' });
  }

  private d: any = {};
  private timeDisplay: Phaser.GameObjects.Text;
  private offenseUnits: Character[] = [];
  private defenseUnits: Character[] = [];
  private offenseCurrent = 0;
  private defenseCurrent = 0;
  private readyCount = 0;
  private topUI: TopUI;

  protected turns: FightTurn[] = [];
  protected roles: Character[] = [];
  protected effects: Effect[] = [];
  protected reason: number;
  protected rewards: any;
  protected onFinish: () => void;
  protected fightScene = 1;

  public motionData: Map<number, any>;
  public skillData: Map<number, any>;
  public petData: Map<number, any>;
  public motions = new Map<number, Motion>();
  public originalNumbers = false;
  public font = '';

  init(data: any) {
    this.d = data;

    this.turns = data.fight;
    this.skillData = data.skillData;
    this.rewards = data.rewards;
    this.motionData = data.motionData;
    this.petData = data.petData;
    this.onFinish = data.onFinish;

    const settings = store.getState().settings;
    this.font = settings.font;
    this.originalNumbers = settings.originalDamage;

    this.offenseCurrent = 0;
    this.defenseCurrent = 0;

    this.offenseUnits = [];
    this.defenseUnits = [];
    this.roles = [];

    this.events.off('damage');
    this.events.on('damage', (args: any) => {
      this.showDamage(args);
    });

    this.topUI = new TopUI(this);

    const id = Events.on('fightClose', () => {
      this.scene.stop(this.scene.key);
    });

    this.events.on(Phaser.Scenes.Events.DESTROY, () => {
      Events.off(id);
    });
  }

  create() {
    if (this.d.roles === undefined) {
      return;
    }

    this.add.image(0, 0, `background-${this.d.scene}`).setDepth(Depths.BASE).setOrigin(0);
    this.timeDisplay = this.add.text(500, 580, '').setOrigin(0.5);

    this.d.roles.forEach((role: FightRole) => {
      const character = CharacterFactoryV2.create(this, role);

      if (role.isOnOffense) {
        this.offenseUnits.push(character);
      } else {
        this.defenseUnits.push(character);
      }

      this.roles.push(character);
    });

    this.topUI.create(this.offenseUnits, this.defenseUnits);

    this.offenseUnits.forEach((unit) => unit.create().flip());
    this.defenseUnits.forEach((unit) => unit.create());

    this.add.text(30, this.cameras.main.height - 30, ((Date.now() - this.d.startTime) / 1000).toFixed(2) + 's', {
      fontFamily: 'CustomFont',
    });

    Events.emit('updateCharacters', {
      offense: this.offenseUnits[this.offenseCurrent].fightRole.index,
      defense: this.defenseUnits[this.defenseCurrent].fightRole.index,
    });
  }

  firstLoad = false;

  update(): void {
    if (!this.firstLoad) {
      this.offenseUnits[0].zoneIn(300, 455, () => this.readyCheck());
      this.defenseUnits[0].zoneIn(700, 455, () => this.readyCheck());

      this.firstLoad = true;
    }
  }

  readyCheck() {
    this.readyCount++;

    if (this.readyCount < 2) {
      return;
    }

    (async () => {
      await this.iterateTurns();
      setTimeout(() => {
        this.finish();
      }, 500);
    })();
  }

  async iterateTurns() {
    for (const idx in this.turns) {
      const turn = this.turns[idx];
      // console.log('Turn', turn);
      // console.log();

      const source = this.roles[turn.role];
      const target = source.isOnOffense ? this.defenseUnits[this.defenseCurrent] : this.offenseUnits[this.offenseCurrent];

      this.timeDisplay.text = `${parseFloat(((turn.time || 0) / 100).toFixed(2))}s`;

      const checkVictory = async () => {
        if (target.hp <= 0) {
          if (target.animation !== CharacterAnimation.DEAD) {
            target.animate(CharacterAnimation.DEAD);
          }
        } else if (source.hp <= 0) {
          if (source.animation !== CharacterAnimation.DEAD) {
            source.animate(CharacterAnimation.DEAD);
          }
        } else {
          // if (turn.skillId === UserSkills.BOMB) {
          //   await target.animate(CharacterAnimation.REVIVE);
          // }
        }
      };

      if (turn.event === FightEvents.CANT_MOVE) {
        await new DizzyMotion(this, source).create();
      }

      if (turn.event === FightEvents.PRIORITY_MUL) {
        await target.move();
        target.animate(CharacterAnimation.IDLE);
        await SkillFactory.create(this, UserSkills.PRIORITY_ATTACK, source, target, turn);

        checkVictory();
      }

      if (turn.event === FightEvents.BACK_THROWED) {
        await SkillFactory.create(this, UserSkills.BOMB_THROW_BACK, source, target, turn);
        await SkillFactory.create(this, UserSkills.BOMB_KICK, target, source, turn);

        if (turn.isHit ?? false) {
          await source.animate(CharacterAnimation.REVIVE);
        }

        checkVictory();
      }

      if (turn.event === FightEvents.COUNTER_DAMAGE) {
        await SkillFactory.counter(this, source, target, turn.targetLastDamage);

        checkVictory();
      }

      if (turn.event === FightEvents.CHANGE_BUFF) {
        if (turn.selfLastDamage !== undefined) {
          if (turn.targetSkillId) {
            await SkillFactory.create(this, UserSkills.FLYING_THUNDER_GOD_2, source, target);
          }
          await source.damage(turn.selfLastDamage, turn.isCrit ?? false, HurtLiteMotion);
        }

        source.decreaseMp(turn.decMp ?? 0);
        source.damage((turn.incHp ?? 0) * -1, turn.isCrit ?? false, null);

        turn.statChange?.forEach((change) => Events.emit('combatStatUpdate', change));

        const { addEffect = [], removeEffect = [] } = turn;

        EffectFactory.remove(this, removeEffect);
        EffectFactory.add(this, addEffect);

        if (turn.skillId !== undefined) {
          await SkillFactory.create(this, turn.skillId, source, target, turn);
        }

        checkVictory();
      }

      if (turn.event === FightEvents.USER_SKILL) {
        // await SkillFactory.create(this, UserSkills.PET_ATTACK, source, target, turn);
        if (turn.skillId) {
          if (this.skillData.has(turn.skillId)) {
            await SkillFactoryV2.create(this, turn.skillId, source, target, turn);
          } else {
            await SkillFactory.create(this, turn.skillId in skills ? turn.skillId : UserSkills.BASIC_ATTACK, source, target, turn);
          }
        }

        checkVictory();
      }

      if (turn.event === FightEvents.BE_DIE) {
        if (source.animation !== CharacterAnimation.DEAD) {
          await source.animate(CharacterAnimation.DEAD);
        }
      }

      if (turn.event === FightEvents.CHANGE_ROLE) {
        await target.end();
        await source.end();

        source.hide(true);

        if (source.isOnOffense) {
          this.offenseCurrent += 1;
          this.topUI.newSource(this.offenseUnits[this.offenseCurrent]);
          await this.offenseUnits[this.offenseCurrent].zoneIn(300, 455);
        } else {
          this.defenseCurrent += 1;
          this.topUI.newTarget(this.defenseUnits[this.defenseCurrent]);
          await this.defenseUnits[this.defenseCurrent].zoneIn(700, 455);
        }

        Events.emit('updateCharacters', {
          offense: this.offenseUnits[this.offenseCurrent].fightRole.index,
          defense: this.defenseUnits[this.defenseCurrent].fightRole.index,
        });
      }

      if (turn.event === FightEvents.VICTORY) {
        await source.animate(CharacterAnimation.WIN);
        source.animate(CharacterAnimation.IDLE);
      }

      if (turn.event === FightEvents.END_ATTACK) {
        source.animate(CharacterAnimation.IDLE);
        await source.end();
      }
    }
  }

  addEffect(effect: Effect) {
    if (!this.effects.find((e) => e.name === effect.sprite.name)) {
      this.effects.push(effect);
      this.add.existing(effect);
    }
  }

  removeEffect(effect: String) {
    const idx = this.effects.findIndex((e) => e.name === effect);

    if (idx !== -1) {
      this.effects[idx].destroy();
      this.effects.splice(idx, 1);
    }
  }

  finish() {
    this.onFinish?.();

    if (this.reason === -1) {
      store.dispatch(endFight());
    } else {
      store.dispatch(setRewards(this.rewards));
    }
  }

  getCharacter(role: number) {
    for (let i = 0; i < this.offenseUnits.length; i++) {
      if (this.offenseUnits[i].index === role) {
        return this.offenseUnits[i];
      }
    }

    for (let i = 0; i < this.defenseUnits.length; i++) {
      if (this.defenseUnits[i].index === role) {
        return this.defenseUnits[i];
      }
    }

    return null;
  }

  showDamage({ amount, x, y, isCrit = false }: { amount: number; x: number; y: number; isCrit: boolean }) {
    if (this.originalNumbers) {
      this.add.existing(new DamageNumbers(this, amount, x, y - 30, isCrit));
    } else {
      this.add.existing(new FontNumbers(this, amount, x, y - 30, isCrit));
    }
  }
}
