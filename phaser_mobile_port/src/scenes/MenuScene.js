import { loadGameState, newGameState, saveGameState } from "../state";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    this.add.rectangle(360, 640, 720, 1280, 0x0f172a);
    this.add.text(360, 240, "QHOME", { fontSize: "82px", color: "#ffffff", fontStyle: "bold" }).setOrigin(0.5);

    this.makeButton(360, 560, "New Game", () => {
      const state = newGameState();
      saveGameState(state);
      this.scene.start("OfficeScene", { state });
    });

    this.makeButton(360, 680, "Continue", () => {
      const state = loadGameState() || newGameState();
      this.scene.start(state.scene || "OfficeScene", { state });
    });

    this.makeButton(360, 800, "Exit", () => {
      window.close();
    });
  }

  makeButton(x, y, label, onClick) {
    const box = this.add.rectangle(x, y, 360, 84, 0x1d4ed8).setStrokeStyle(2, 0xffffff).setInteractive({ useHandCursor: true });
    const text = this.add.text(x, y, label, { fontSize: "30px", color: "#ffffff" }).setOrigin(0.5);
    box.on("pointerup", onClick);
    text.setInteractive({ useHandCursor: true }).on("pointerup", onClick);
  }
}
