import { BasePlayScene } from "./BasePlayScene";
import { saveGameState } from "../state";

export class SiteScene extends BasePlayScene {
  constructor() {
    super("SiteScene");
  }

  create(data) {
    this.init(data);
    this.createBase(0x2b2418);

    this.engineer = this.add.circle(270, 420, 35, 0xef4444);
    this.resultDoor = this.add.rectangle(640, 160, 90, 90, 0xf59e0b);

    this.add.text(222, 380, "Engineer", { fontSize: "22px", color: "#ffffff" });
    this.add.text(578, 102, "Result", { fontSize: "22px", color: "#ffffff" });

    this.state.scene = "SiteScene";
    saveGameState(this.state);
  }

  updateRange() {
    this.inRange = "";
    if (this.isNear(this.engineer.x, this.engineer.y)) {
      this.inRange = "engineer";
    }
    if (this.isNear(this.resultDoor.x, this.resultDoor.y, 85)) {
      this.inRange = "result_door";
    }
  }

  onInteractTarget(target) {
    if (!target) {
      return;
    }

    if (target === "engineer" && this.state.progressStep === 2) {
      this.showDialog([
        "Ceiling issue found at site.",
        "Pick correct process or quick patch.",
      ], "engineer");
      return;
    }

    if (target === "result_door" && this.state.progressStep >= 3) {
      this.state.scene = "ResultScene";
      saveGameState(this.state);
      this.scene.start("ResultScene", { state: this.state });
    }
  }
}
