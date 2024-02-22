export function createLoader(scene: Phaser.Scene) {
  const progressBar = scene.add.graphics();
  const progressBox = scene.add.graphics();

  progressBox.fillStyle(0x222222, 0.8);
  progressBox.fillRect(scene.cameras.main.centerX - 160, scene.cameras.main.centerY - 25, 320, 50);

  scene.load.on('progress', function (value: number) {
    progressBar.clear();
    progressBar.fillStyle(0xffffff, 1);
    progressBar.fillRect(scene.cameras.main.centerX - 150, scene.cameras.main.centerY - 15, 300 * value, 30);
  });

  // scene.load.on('fileprogress', function (file: any) {
  // 	console.log(file.src);
  // });

  scene.load.on('complete', function () {
    progressBar.destroy();
    progressBox.destroy();
  });

  scene.load.setBaseURL(process.env.REACT_APP_CDN_PATH);
}
