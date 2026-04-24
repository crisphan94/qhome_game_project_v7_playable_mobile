const SAVE_KEY = "qhome_mobile_save_v1";

const defaultData = {
  scene: "OfficeScene",
  progressStep: 0,
  stats: {
    progress: 50,
    budget: 50,
    quality: 50,
    satisfaction: 50,
  },
};

export function newGameState() {
  return structuredClone(defaultData);
}

export function loadGameState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    return {
      scene: parsed.scene || defaultData.scene,
      progressStep: Number.isInteger(parsed.progressStep) ? parsed.progressStep : 0,
      stats: {
        progress: clamp(parsed.stats?.progress ?? 50),
        budget: clamp(parsed.stats?.budget ?? 50),
        quality: clamp(parsed.stats?.quality ?? 50),
        satisfaction: clamp(parsed.stats?.satisfaction ?? 50),
      },
    };
  } catch {
    return null;
  }
}

export function saveGameState(state) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function applyChoice(state, kind, option) {
  const s = state.stats;
  if (kind === "sale") {
    if (option === "A") {
      s.satisfaction += 8;
      s.budget -= 2;
    } else {
      s.progress += 5;
      s.satisfaction -= 5;
    }
  }

  if (kind === "architect") {
    if (option === "A") {
      s.quality += 10;
      s.satisfaction += 5;
    } else {
      s.budget += 8;
      s.quality -= 8;
    }
  }

  if (kind === "engineer") {
    if (option === "A") {
      s.quality += 8;
      s.progress -= 5;
    } else {
      s.progress += 10;
      s.quality -= 10;
    }
  }

  s.progress = clamp(s.progress);
  s.budget = clamp(s.budget);
  s.quality = clamp(s.quality);
  s.satisfaction = clamp(s.satisfaction);

  state.progressStep += 1;
}

export function getQuest(step) {
  const quests = [
    "Meet Sales for customer brief.",
    "Meet Architect to confirm layout.",
    "Go to site and meet Engineer.",
    "Finish and open project result.",
  ];
  return quests[step] || "All tasks completed.";
}

export function getResultText(stats) {
  const total = stats.progress + stats.budget + stats.quality + stats.satisfaction;
  if (total >= 260) {
    return "BIG SUCCESS\nProject closed with strong performance.";
  }
  if (total >= 200) {
    return "ACCEPTABLE\nProject is done but still improvable.";
  }
  return "FAILED\nProject quality and outcome need rework.";
}

function clamp(v) {
  return Math.max(0, Math.min(100, Number(v) || 0));
}
