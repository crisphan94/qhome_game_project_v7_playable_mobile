import { BasePlayScene } from "./BasePlayScene";
import { saveGameState } from "../state";

export class OfficeScene extends BasePlayScene {
  constructor() {
    super("OfficeScene");
  }

  create(data) {
    this.init(data);
    this.createBase(0x1f2937);

    this.sale = this.add.circle(260, 420, 35, 0xef4444);
    this.architect = this.add.circle(520, 520, 35, 0x22c55e);
    this.siteDoor = this.add.rectangle(640, 160, 90, 90, 0xf59e0b);

    this.add.text(220, 380, "Sales", { fontSize: "22px", color: "#ffffff" });
    this.add.text(466, 478, "Architect", { fontSize: "22px", color: "#ffffff" });
    this.add.text(596, 102, "To Site", { fontSize: "22px", color: "#ffffff" });

    this.state.scene = "OfficeScene";
    saveGameState(this.state);
  }

  updateRange() {
    this.inRange = "";
    if (this.isNear(this.sale.x, this.sale.y)) {
      this.inRange = "sale";
    }
    if (this.isNear(this.architect.x, this.architect.y)) {
      this.inRange = "architect";
    }
    if (this.isNear(this.siteDoor.x, this.siteDoor.y, 85)) {
      this.inRange = "door_site";
    }
  }

  onInteractTarget(target) {
    if (!target) {
      return;
    }

    if (target === "door_site" && this.state.progressStep >= 2) {
      this.state.scene = "SiteScene";
      saveGameState(this.state);
      this.scene.start("SiteScene", { state: this.state });
      return;
    }

    if (target === "sale" && this.state.progressStep === 0) {
      this.showDialog([
        "Customer asks for modern townhouse style.",
        "You need to choose consulting approach.",
      ], "sale");
      return;
    }

    if (target === "architect" && this.state.progressStep === 1) {
      this.showDialog([
        "Architect is drafting base layout.",
        "You need to pick planning priority.",
      ], "architect");
    }
  }
}
