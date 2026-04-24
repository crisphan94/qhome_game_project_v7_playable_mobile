import Phaser from "phaser";
import { SplashScene } from "./scenes/SplashScene";
import { MenuScene } from "./scenes/MenuScene";
import { OfficeScene } from "./scenes/OfficeScene";
import { SiteScene } from "./scenes/SiteScene";
import { ResultScene } from "./scenes/ResultScene";

const config = {
  type: Phaser.AUTO,
  parent: "app",
  backgroundColor: "#0e1116",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 720,
    height: 1280,
  },
  scene: [SplashScene, MenuScene, OfficeScene, SiteScene, ResultScene],
};

new Phaser.Game(config);
