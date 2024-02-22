// export class OutlinePipeline extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {
//   public static readonly KEY = 'Outline';

//   constructor(game: Phaser.Game) {
//     super({
//       game: game,
//       renderer: game.renderer,
//       fragShader: `
// 				precision mediump float;
//         uniform sampler2D uMainSampler;
//         uniform vec2 uTextureSize;
//         varying vec2 outTexCoord;
//         varying float outTintEffect;
//         varying vec4 outTint;
//         void main(void)
//         {
//           vec4 texture = texture2D(uMainSampler, outTexCoord);
//           vec4 texel = vec4(outTint.rgb * outTint.a, outTint.a);
//           vec4 color = texture;

//           vec2 onePixel = vec2(1.0, 1.0) / uTextureSize;

//           float upAlpha = texture2D(uMainSampler, outTexCoord + vec2(0.0, onePixel.y)).a;
//           float leftAlpha = texture2D(uMainSampler, outTexCoord + vec2(-onePixel.x, 0.0)).a;
//           float downAlpha = texture2D(uMainSampler, outTexCoord + vec2(0.0, -onePixel.y)).a;
//           float rightAlpha = texture2D(uMainSampler, outTexCoord + vec2(onePixel.x, 0.0)).a;

//           if (texture.a == 0.0 && max(max(upAlpha, downAlpha), max(leftAlpha, rightAlpha)) >= 0.1)
//           {
//             color = vec4(1.0, 1.0, 1.0, 1.0);
//           }
//           gl_FragColor = color;
//         }
// 			`,
//       uniforms: ['uTextureSize', 'uMainSampler'],
//     });
//   }
// }

export default class OutlinePipeline {}
