# QHome Phaser Mobile Port

This is a non-Godot port of the game using Phaser + Capacitor.

## Features implemented

- Splash -> Main Menu -> Office -> Site -> Result flow
- Keyboard movement (WASD/Arrow)
- Touch joystick and Interact button
- Choice-based stat changes
- Save/Continue via localStorage

## Run locally

```bash
cd phaser_mobile_port
npm install
npm run dev
```

## Build web bundle

```bash
cd phaser_mobile_port
npm run build
npm run preview
```

## Build Android on local machine

```bash
cd phaser_mobile_port
npm install
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

Then build APK from Android Studio (Debug or Release).

## Build APK on GitHub Actions

Workflow file:

- `.github/workflows/build-apk-phaser.yml`

Artifact output:

- `qhome-phaser-apk` -> `app-debug.apk`
