import { applyChoice, getQuest, saveGameState } from "../state";

export class BasePlayScene extends Phaser.Scene {
  constructor(key) {
    super(key);
    this.moveVec = new Phaser.Math.Vector2(0, 0);
    this.speed = 230;
    this.interactPressed = false;
    this.inRange = "";
    this.choiceKind = "";
  }

  init(data) {
    this.state = data?.state;
  }

  createBase(bgColor) {
    if (!this.state) {
      this.scene.start("MenuScene");
      return;
    }

    this.add.rectangle(360, 640, 720, 1280, bgColor);

    this.player = this.add.circle(180, 1040, 28, 0x3b82f6);
    this.playerPos = new Phaser.Math.Vector2(this.player.x, this.player.y);

    this.keys = this.input.keyboard.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT,E,SPACE");
    this.input.keyboard.on("keydown-E", () => this.tryInteract());
    this.input.keyboard.on("keydown-SPACE", () => this.tryInteract());

    this.questText = this.add.text(16, 20, "", { fontSize: "28px", color: "#ffffff", wordWrap: { width: 680 } });
    this.statsText = this.add.text(16, 108, "", { fontSize: "24px", color: "#bfdbfe", wordWrap: { width: 680 } });

    this.dialogPanel = this.makePanel(360, 320, 640, 240, false);
    this.dialogText = this.add.text(80, 245, "", { fontSize: "24px", color: "#ffffff", wordWrap: { width: 560 } }).setVisible(false);

    this.choicePanel = this.makePanel(360, 600, 640, 320, false);
    this.choiceTitle = this.add.text(80, 500, "", { fontSize: "28px", color: "#ffffff" }).setVisible(false);
    this.choiceA = this.makeChoiceButton(360, 610, "", () => this.pickChoice("A"));
    this.choiceB = this.makeChoiceButton(360, 710, "", () => this.pickChoice("B"));

    this.joyBase = this.add.circle(120, 1130, 90, 0xffffff, 0.16).setStrokeStyle(2, 0x93c5fd, 0.8);
    this.joyKnob = this.add.circle(120, 1130, 32, 0xffffff, 0.5);
    this.joyPointer = null;

    this.interactBtn = this.add.rectangle(610, 1130, 180, 120, 0x1d4ed8).setStrokeStyle(2, 0xffffff).setInteractive({ useHandCursor: true });
    this.add.text(610, 1130, "Interact", { fontSize: "28px", color: "#ffffff" }).setOrigin(0.5);
    this.interactBtn.on("pointerdown", () => this.tryInteract());

    this.input.on("pointerdown", this.onPointerDown, this);
    this.input.on("pointermove", this.onPointerMove, this);
    this.input.on("pointerup", this.onPointerUp, this);

    this.refreshHud();
  }

  update(_time, deltaMs) {
    if (!this.player) {
      return;
    }

    const dt = deltaMs / 1000;
    const keyboard = new Phaser.Math.Vector2(
      Number(this.keys.D.isDown || this.keys.RIGHT.isDown) - Number(this.keys.A.isDown || this.keys.LEFT.isDown),
      Number(this.keys.S.isDown || this.keys.DOWN.isDown) - Number(this.keys.W.isDown || this.keys.UP.isDown)
    );

    const move = keyboard.lengthSq() > 0 ? keyboard.normalize() : this.moveVec.clone();
    this.playerPos.x = Phaser.Math.Clamp(this.playerPos.x + move.x * this.speed * dt, 24, 696);
    this.playerPos.y = Phaser.Math.Clamp(this.playerPos.y + move.y * this.speed * dt, 140, 1250);
    this.player.setPosition(this.playerPos.x, this.playerPos.y);

    this.updateRange();
  }

  onPointerDown(pointer) {
    if (pointer.x < 280 && pointer.y > 940) {
      this.joyPointer = pointer.id;
      this.updateJoystick(pointer);
    }
  }

  onPointerMove(pointer) {
    if (this.joyPointer === pointer.id) {
      this.updateJoystick(pointer);
    }
  }

  onPointerUp(pointer) {
    if (this.joyPointer !== pointer.id) {
      return;
    }
    this.joyPointer = null;
    this.moveVec.set(0, 0);
    this.joyKnob.setPosition(this.joyBase.x, this.joyBase.y);
  }

  updateJoystick(pointer) {
    const dx = pointer.x - this.joyBase.x;
    const dy = pointer.y - this.joyBase.y;
    const vec = new Phaser.Math.Vector2(dx, dy);
    if (vec.length() > 90) {
      vec.normalize().scale(90);
    }
    this.joyKnob.setPosition(this.joyBase.x + vec.x, this.joyBase.y + vec.y);
    this.moveVec.set(vec.x / 90, vec.y / 90);
  }

  tryInteract() {
    if (this.dialogPanel.visible) {
      this.setDialogVisible(false);
      if (this.choiceKind) {
        this.showChoice(this.choiceKind);
      }
      return;
    }
    this.onInteractTarget(this.inRange);
  }

  onInteractTarget(_target) {}

  showDialog(lines, kind) {
    this.choiceKind = kind;
    this.dialogText.setText(lines.join("\n") + "\n\nPress Interact to continue.");
    this.setDialogVisible(true);
  }

  showChoice(kind) {
    this.choicePanel.setVisible(true);
    this.choiceTitle.setVisible(true);
    this.choiceA.box.setVisible(true);
    this.choiceA.label.setVisible(true);
    this.choiceB.box.setVisible(true);
    this.choiceB.label.setVisible(true);

    if (kind === "sale") {
      this.choiceTitle.setText("Pick consultant strategy");
      this.choiceA.label.setText("A: Listen to customer deeply");
      this.choiceB.label.setText("B: Push quick closure for speed");
    }

    if (kind === "architect") {
      this.choiceTitle.setText("Pick layout strategy");
      this.choiceA.label.setText("A: Prioritize function");
      this.choiceB.label.setText("B: Prioritize lower budget");
    }

    if (kind === "engineer") {
      this.choiceTitle.setText("Pick site handling");
      this.choiceA.label.setText("A: Follow proper process");
      this.choiceB.label.setText("B: Patch fast for deadline");
    }
  }

  pickChoice(option) {
    if (!this.choiceKind) {
      return;
    }
    applyChoice(this.state, this.choiceKind, option);
    saveGameState(this.state);
    this.choiceKind = "";
    this.setChoiceVisible(false);
    this.afterChoice();
  }

  afterChoice() {
    this.refreshHud();
  }

  setDialogVisible(visible) {
    this.dialogPanel.setVisible(visible);
    this.dialogText.setVisible(visible);
  }

  setChoiceVisible(visible) {
    this.choicePanel.setVisible(visible);
    this.choiceTitle.setVisible(visible);
    this.choiceA.box.setVisible(visible);
    this.choiceA.label.setVisible(visible);
    this.choiceB.box.setVisible(visible);
    this.choiceB.label.setVisible(visible);
  }

  refreshHud() {
    this.questText.setText(`Quest: ${getQuest(this.state.progressStep)}`);
    const s = this.state.stats;
    this.statsText.setText(`Progress ${s.progress} | Budget ${s.budget} | Quality ${s.quality} | Satisfaction ${s.satisfaction}`);
  }

  makePanel(x, y, w, h, visible) {
    return this.add.rectangle(x, y, w, h, 0x111827, 0.94).setStrokeStyle(2, 0x60a5fa).setVisible(visible);
  }

  makeChoiceButton(x, y, text, onClick) {
    const box = this.add.rectangle(x, y, 580, 70, 0x1e3a8a).setStrokeStyle(2, 0x93c5fd).setInteractive({ useHandCursor: true }).setVisible(false);
    const label = this.add.text(x, y, text, { fontSize: "22px", color: "#ffffff" }).setOrigin(0.5).setVisible(false);
    box.on("pointerup", onClick);
    label.setInteractive({ useHandCursor: true }).on("pointerup", onClick);
    return { box, label };
  }

  isNear(objX, objY, radius = 72) {
    return Phaser.Math.Distance.Between(this.playerPos.x, this.playerPos.y, objX, objY) <= radius;
  }
}
