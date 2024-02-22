export default class AnimatedQuad extends Phaser.GameObjects.Quad {
  public sprite: Phaser.GameObjects.Sprite;
  private dx: number;
  private dy: number;
  private fixedHeight: number;
  public tx: number = 0;
  public ty: number = 0;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, 0, 0, texture);

    this.setTexture(texture);
    this.sprite = scene.add.sprite(0, 0, texture).setVisible(false);

    this.dx = x;
    this.dy = y;
  }

  remove() {
    //this.sprite.destroy();
    //super.destroy();
  }

  animate(callback: Function = () => {}, frameEvents: any = {}) {
    this.sprite.anims.play(this.texture.key);
    this.sprite.on(`animationupdate-${this.texture.key}`, (_: any, frame: Phaser.Animations.AnimationFrame) => {
      this.setFrame(frame.textureFrame);

      if (frame.index in frameEvents) {
        frameEvents[frame.index]();
      }
    });
    this.sprite.on(`animationcomplete-${this.texture.key}`, callback);

    if (1 in frameEvents) {
      frameEvents[0]();
    }

    return this;
  }

  animate2(animation: string, offsets: [number, number], callback: Function = () => {}, frameEvents: any = {}) {
    this.sprite.play(animation);

    this.setPosition(this.tx + offsets[0] + this.sprite.frame.halfWidth, this.ty + offsets[1] + this.sprite.frame.halfHeight);
    this.dx = offsets[0];
    this.dy = offsets[1];

    this.setTopLeft(this.x - this.sprite.frame.halfWidth, this.y - this.sprite.frame.halfHeight);
    this.setTopRight(this.x + this.sprite.frame.halfWidth, this.y - this.sprite.frame.halfHeight);
    this.setBottomLeft(this.x - this.sprite.frame.halfWidth, this.y + this.sprite.frame.halfHeight);
    this.setBottomRight(this.x + this.sprite.frame.halfWidth, this.y + this.sprite.frame.halfHeight);

    this.sprite.on(`animationupdate-${animation}`, (_: any, frame: Phaser.Animations.AnimationFrame) => {
      this.setFrame(frame.textureFrame);

      if (frame.index in frameEvents) {
        frameEvents[frame.index]();
      }
    });
    this.sprite.on(`animationcomplete-${animation}`, () => {
      this.sprite.off(`animationupdate-${animation}`);
      this.sprite.off(`animationcomplete-${animation}`);
      callback();
    });

    if (1 in frameEvents) {
      frameEvents[0]();
    }

    return this;
  }

  pause() {
    this.sprite.anims.pause();
  }

  setHeight(height: number) {
    this.fixedHeight = height;
    this.setY(this.x + this.fixedHeight);
  }

  setOffsets(xOffset: number, yOffset: number) {
    this.setXOffset(xOffset);
    this.setYOffset(yOffset);

    return this;
  }

  setXOffset(xOffset: number) {
    this.dx = xOffset;
    this.setX(xOffset + this.frame.width / 2);
  }

  setYOffset(yOffset: number) {
    this.dy = yOffset;
    this.setY(yOffset + (this.fixedHeight ? this.fixedHeight : this.frame.height / 2));
  }

  updatePosition(x: number, y: number) {
    this.dx = x;
    this.dy = y;
  }

  stopAnimate() {
    if (this.sprite) {
      this.sprite.off(`animationupdate-${this.texture.key}`);
    }
  }

  // [scaleX, skewY, skewX, scaleY, translateX, translateY]
  transform(m: number[], flipped?: boolean) {
    if (flipped === undefined || flipped === null) {
      flipped = false;
    }

    const w = this.frame.halfWidth;
    const h = this.frame.halfHeight;

    const tl = [-w * m[0] - h * m[2], -h * m[3] - w * m[1]];
    const bl = [-w * m[0] + h * m[2], +h * m[3] - w * m[1]];
    const br = [+w * m[0] + h * m[2], +h * m[3] + w * m[1]];
    const tr = [+w * m[0] - h * m[2], -h * m[3] + w * m[1]];

    const x = (this.dx + this.frame.x) * m[0] + (this.frame.width * m[0]) / 2;
    const y = (this.dy + this.frame.y) * m[3] + (this.frame.height * m[3]) / 2;

    this.setTopLeft(x + tl[0], y + tl[1]);
    this.setTopRight(x + tr[0], y + tr[1]);
    this.setBottomLeft(x + bl[0], y + bl[1]);
    this.setBottomRight(x + br[0], y + br[1]);
  }

  setAlphas(alpha: number) {
    this.topLeftAlpha = alpha;
    this.topRightAlpha = alpha;
    this.bottomLeftAlpha = alpha;
    this.bottomRightAlpha = alpha;
  }
}
