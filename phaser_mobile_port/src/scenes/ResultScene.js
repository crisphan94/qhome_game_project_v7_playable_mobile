import { getResultText, newGameState, saveGameState } from "../state";

export class ResultScene extends Phaser.Scene {
  constructor() {
    super("ResultScene");
  }

  init(data) {
    this.state = data?.state;
  }

  create() {
    if (!this.state) {
      this.scene.start("MenuScene");
      return;
    }

    this.add.rectangle(360, 640, 720, 1280, 0x0b1020);

    const result = getResultText(this.state.stats);
    this.add.text(360, 380, "PROJECT RESULT", { fontSize: "44px", color: "#ffffff", fontStyle: "bold" }).setOrigin(0.5);
    this.add.text(360, 560, result, {
      fontSize: "30px",
      color: "#bfdbfe",
      align: "center",
    }).setOrigin(0.5);

    this.makeButton(360, 820, "Restart", () => {
      const fresh = newGameState();
      saveGameState(fresh);
      this.scene.start("OfficeScene", { state: fresh });
    });

    this.makeButton(360, 940, "Back To Menu", () => {
      this.scene.start("MenuScene");
    });
  }

  makeButton(x, y, label, onClick) {
    const box = this.add.rectangle(x, y, 360, 84, 0x1d4ed8).setStrokeStyle(2, 0xffffff).setInteractive({ useHandCursor: true });
    const text = this.add.text(x, y, label, { fontSize: "30px", color: "#ffffff" }).setOrigin(0.5);
    box.on("pointerup", onClick);
    text.setInteractive({ useHandCursor: true }).on("pointerup", onClick);
  }
}
