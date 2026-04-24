export class SplashScene extends Phaser.Scene {
  constructor() {
    super("SplashScene");
  }

  create() {
    this.add.rectangle(360, 640, 720, 1280, 0x111827);
    this.add.text(360, 560, "QHOME", {
      fontSize: "82px",
      color: "#ffffff",
      fontStyle: "bold",
    }).setOrigin(0.5);

    this.add.text(360, 660, "Mobile Port", {
      fontSize: "38px",
      color: "#93c5fd",
    }).setOrigin(0.5);

    this.time.delayedCall(1200, () => {
      this.scene.start("MenuScene");
    });
  }
}
