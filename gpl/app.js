const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_NOTES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const FLAT_EQUIV = { "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#", "Bb": "A#" };
const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];
const MINOR_SCALE = [0, 2, 3, 5, 7, 8, 10];
const MODE_DATA = {
  major: {
    degrees: ["I", "ii", "iii", "IV", "V", "vi", "vii°"],
    qualities: ["maj", "min", "min", "maj", "maj", "min", "dim"]
  },
  minor: {
    degrees: ["i", "ii°", "III", "iv", "v", "VI", "VII"],
    qualities: ["min", "dim", "maj", "min", "min", "maj", "maj"]
  }
};

const keySelect = document.getElementById("keySelect");
const modeSelect = document.getElementById("modeSelect");
const tempoSlider = document.getElementById("tempo");
const tempoLabel = document.getElementById("tempoLabel");
const diatonicChords = document.getElementById("diatonicChords");
const progressionEl = document.getElementById("progression");
const progInput = document.getElementById("progInput");
const applyProg = document.getElementById("applyProg");
const clearProg = document.getElementById("clearProg");
const shuffleProg = document.getElementById("shuffleProg");
const playBtn = document.getElementById("playBtn");
const stopBtn = document.getElementById("stopBtn");
const styleSelect = document.getElementById("styleSelect");
const textureSelect = document.getElementById("textureSelect");
const sizeSelect = document.getElementById("sizeSelect");
const rhythmSelect = document.getElementById("rhythmSelect");
const drumToggle = document.getElementById("drumToggle");
const toneSlider = document.getElementById("toneSlider");
const holdSlider = document.getElementById("holdSlider");
const progressionSelect = document.getElementById("progressionSelect");
const genLength = document.getElementById("genLength");
const genSpice = document.getElementById("genSpice");
const genRhythm = document.getElementById("genRhythm");
const generateProg = document.getElementById("generateProg");

const sessionTimer = document.getElementById("sessionTimer");
const sessionStart = document.getElementById("sessionStart");
const sessionStop = document.getElementById("sessionStop");
const totalMinutesEl = document.getElementById("totalMinutes");
const sessionsLoggedEl = document.getElementById("sessionsLogged");
const streakEl = document.getElementById("streak");

const scaleSelect = document.getElementById("scaleSelect");
const scaleNotes = document.getElementById("scaleNotes");
const arpSelect = document.getElementById("arpSelect");
const arpNotes = document.getElementById("arpNotes");
const triadSelect = document.getElementById("triadSelect");
const triadNotes = document.getElementById("triadNotes");

const highlightSelect = document.getElementById("highlightSelect");
const positionSelect = document.getElementById("positionSelect");
const fretToggle = document.getElementById("fretToggle");
const fretboardMarkers = document.getElementById("fretboardMarkers");
const fretboardGrid = document.getElementById("fretboardGrid");

const nowChord = document.getElementById("nowChord");
const nowDetails = document.getElementById("nowDetails");
const spicySuggestion = document.getElementById("spicySuggestion");
const addSpicy = document.getElementById("addSpicy");
const refreshSpicy = document.getElementById("refreshSpicy");
const focusChord = document.getElementById("focusChord");
const focusScale = document.getElementById("focusScale");
const focusArp = document.getElementById("focusArp");
const focusTriad = document.getElementById("focusTriad");
const scaleToFret = document.getElementById("scaleToFret");
const arpToFret = document.getElementById("arpToFret");
const triadToFret = document.getElementById("triadToFret");

const extendedChords = document.getElementById("extendedChords");
const borrowedChords = document.getElementById("borrowedChords");

const selectedChordLabel = document.getElementById("selectedChordLabel");
const extensionButtons = document.getElementById("extensionButtons");
const beatButtons = document.getElementById("beatButtons");
const addChordSlot = document.getElementById("addChordSlot");
const addFourSlots = document.getElementById("addFourSlots");
const footerMinutes = document.getElementById("footerMinutes");
const resetMinutes = document.getElementById("resetMinutes");
const currentKey = document.getElementById("currentKey");

const scrollButtons = document.querySelectorAll("[data-scroll]");

const state = {
  progression: [],
  tempo: 100,
  key: "C",
  mode: "major",
  style: "clean",
  texture: "block",
  rhythm: "whole",
  drumsEnabled: true,
  followPlayback: true,
  chordSize: "triad",
  audioCtx: null,
  masterGain: null,
  masterFilter: null,
  drumBus: null,
  noiseBuffer: null,
  isPlaying: false,
  currentChord: 0,
  uiChord: 0,
  nextTime: 0,
  timerId: null,
  sessionTimerId: null,
  sessionStartTime: null,
  uiTimeouts: [],
  currentChordNotes: new Set(),
  currentChordRoot: null,
  selectedChord: 0,
  noteHold: 1.4,
  fretMode: "chord"
};

const scales = {
  "Major": MAJOR_SCALE,
  "Natural Minor": MINOR_SCALE,
  "Dorian": [0, 2, 3, 5, 7, 9, 10],
  "Mixolydian": [0, 2, 4, 5, 7, 9, 10],
  "Melodic Minor": [0, 2, 3, 5, 7, 9, 11],
  "Harmonic Minor": [0, 2, 3, 5, 7, 8, 11],
  "Pentatonic Major": [0, 2, 4, 7, 9],
  "Pentatonic Minor": [0, 3, 5, 7, 10]
};

const arpeggios = {
  "Maj7": [0, 4, 7, 11],
  "Min7": [0, 3, 7, 10],
  "Dom7": [0, 4, 7, 10],
  "Half-Diminished": [0, 3, 6, 10],
  "Diminished": [0, 3, 6, 9]
};

const triads = {
  "Major Triad": [0, 4, 7],
  "Minor Triad": [0, 3, 7],
  "Diminished Triad": [0, 3, 6],
  "Augmented Triad": [0, 4, 8]
};

const RHYTHMS = {
  whole: [0],
  halves: [0, 2],
  syncopated: [0, 1.5, 2.5, 3.5],
  offbeat: [0.5, 1.5, 2.5, 3.5],
  tresillo: [0, 1.5, 3]
};

const EXTENSION_OPTIONS = ["7", "9", "11", "13", "sus4", "add9"];

const STYLE_PRESETS = {
  clean: { texture: "block", rhythm: "whole", drums: true, filter: 1200 },
  neosoul: { texture: "pulse", rhythm: "syncopated", drums: true, filter: 900 },
  jazz: { texture: "arp", rhythm: "halves", drums: true, filter: 1400 },
  cinematic: { texture: "block", rhythm: "tresillo", drums: false, filter: 1800 }
};

const PROGRESSION_LIBRARY = [
  { name: "Modern Pop Anthem", tokens: ["I", "V", "vi", "IV"] },
  { name: "Indie Rock Drive", tokens: ["I", "V", "vi", "IV"] },
  { name: "Pop Ballad Lift", tokens: ["I", "V", "vi", "IV"] },
  { name: "Synthwave Minor", tokens: ["i", "bVI", "bIII", "bVII"] },
  { name: "Alt Pop Minor", tokens: ["i", "bVI", "bIII", "bVII"] },
  { name: "Reggaeton Pop", tokens: ["i", "bVII", "bVI", "V"] },
  { name: "Stomp Rock", tokens: ["I", "bVII", "IV"] },
  { name: "Cinematic Pop", tokens: ["I", "V", "vi", "III", "IV", "I", "IV", "V"] }
];

const DRUM_PATTERNS = {
  clean: {
    kick: [0, 2],
    snare: [1, 3],
    hat: [0.5, 1.5, 2.5, 3.5]
  },
  neosoul: {
    kick: [0, 2.5],
    snare: [1.5, 3],
    hat: [0.5, 1, 1.5, 2.5, 3, 3.5]
  },
  jazz: {
    kick: [0],
    snare: [2],
    hat: [0, 1.5, 2, 3.5]
  },
  cinematic: {
    kick: [0, 2.5],
    snare: [3],
    hat: [1, 2, 3]
  }
};

function init() {
  NOTES.forEach((note) => {
    const option = document.createElement("option");
    option.value = note;
    option.textContent = note;
    keySelect.appendChild(option);
  });

  if (scaleSelect) Object.keys(scales).forEach((scale) => addOption(scaleSelect, scale));
  if (arpSelect) Object.keys(arpeggios).forEach((arp) => addOption(arpSelect, arp));
  if (triadSelect) Object.keys(triads).forEach((triad) => addOption(triadSelect, triad));

  updateTempo();
  buildChordPalette();
  updateScaleNotes();
  if (arpSelect) updateArpNotes();
  if (triadSelect) updateTriadNotes();
  buildFretboard();
  loadProgress();
  setStyle(state.style);
  updateSpicySuggestion();
  updateKeyBanner();
  fretboardGrid.classList.toggle("hidden", !fretToggle.checked);
  initProgressionLibrary();
  buildFretMarkers();
  updateChordEditor();

  keySelect.addEventListener("change", () => {
    state.key = keySelect.value;
    buildChordPalette();
    updateScaleNotes();
    if (arpSelect) updateArpNotes();
    if (triadSelect) updateTriadNotes();
    buildFretboard();
    updateSpicySuggestion();
    updateKeyBanner();
  });

  modeSelect.addEventListener("change", () => {
    state.mode = modeSelect.value;
    buildChordPalette();
    updateScaleNotes();
    if (arpSelect) updateArpNotes();
    if (triadSelect) updateTriadNotes();
    buildFretboard();
    updateSpicySuggestion();
    updateKeyBanner();
  });

  tempoSlider.addEventListener("input", updateTempo);

  clearProg.addEventListener("click", () => {
    state.progression = [];
    renderProgression();
  });

  shuffleProg.addEventListener("click", () => {
    state.progression = state.progression.slice().reverse();
    renderProgression();
  });

  applyProg.addEventListener("click", () => {
    const tokens = parseProgressionInput();
    if (tokens.length) {
      state.progression = tokens;
      state.selectedChord = 0;
      updateChordEditor();
      renderProgression();
    }
  });

  progInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyProg.click();
    }
  });

  addSpicy.addEventListener("click", () => {
    const token = spicySuggestion.dataset.token;
    const roman = spicySuggestion.dataset.roman;
    if (token) {
      state.progression.push(createChordItem(token, 1, roman));
      state.selectedChord = state.progression.length - 1;
      updateChordEditor();
      renderProgression();
    }
  });

  refreshSpicy.addEventListener("click", updateSpicySuggestion);

  playBtn.addEventListener("click", startPlayback);
  stopBtn.addEventListener("click", stopPlayback);

  styleSelect.addEventListener("change", () => {
    setStyle(styleSelect.value);
  });

  textureSelect.addEventListener("change", () => {
    state.texture = textureSelect.value;
  });

  sizeSelect.addEventListener("change", () => {
    state.chordSize = sizeSelect.value;
    buildChordPalette();
  });

  rhythmSelect.addEventListener("change", () => {
    state.rhythm = rhythmSelect.value;
  });

  drumToggle.addEventListener("change", () => {
    state.drumsEnabled = drumToggle.checked;
  });

  toneSlider.addEventListener("input", () => {
    if (state.masterFilter) {
      state.masterFilter.frequency.setValueAtTime(parseInt(toneSlider.value, 10), state.audioCtx.currentTime);
    }
  });

  if (holdSlider) {
    holdSlider.addEventListener("input", () => {
      state.noteHold = parseFloat(holdSlider.value);
    });
  }

  if (scaleSelect) {
    scaleSelect.addEventListener("change", () => {
      updateScaleNotes();
      buildFretboard();
    });
  }

  if (arpSelect) {
    arpSelect.addEventListener("change", () => {
      updateArpNotes();
      buildFretboard();
    });
  }

  if (triadSelect) {
    triadSelect.addEventListener("change", () => {
      updateTriadNotes();
      buildFretboard();
    });
  }

  if (highlightSelect) highlightSelect.addEventListener("change", buildFretboard);
  if (positionSelect) positionSelect.addEventListener("change", buildFretboard);
  fretToggle.addEventListener("change", () => {
    fretboardGrid.classList.toggle("hidden", !fretToggle.checked);
  });

  if (focusChord) {
    focusChord.addEventListener("click", () => {
      state.fretMode = "chord";
      buildFretboard();
    });
  }
  if (focusScale) {
    focusScale.addEventListener("click", () => {
      state.fretMode = "scale";
      buildFretboard();
    });
  }

  if (scaleToFret) {
    scaleToFret.addEventListener("click", () => {
      state.fretMode = "scale";
      buildFretboard();
    });
  }

  if (sessionStart) sessionStart.addEventListener("click", startSession);
  if (sessionStop) sessionStop.addEventListener("click", stopSession);
  if (generateProg) generateProg.addEventListener("click", generateProgression);

  progressionEl.addEventListener("dragover", (event) => event.preventDefault());
  progressionEl.addEventListener("drop", (event) => {
    const data = event.dataTransfer.getData("application/json");
    if (!data) return;
    const item = normalizeProgression([JSON.parse(data)])[0];
    state.progression.push(item);
    state.selectedChord = state.progression.length - 1;
    updateChordEditor();
    renderProgression();
  });

  if (addChordSlot) {
    addChordSlot.addEventListener("click", () => {
      state.progression.push(createChordItem("I", 4));
      state.selectedChord = state.progression.length - 1;
      updateChordEditor();
      renderProgression();
    });
  }

  if (addFourSlots) {
    addFourSlots.addEventListener("click", () => {
      for (let i = 0; i < 4; i += 1) {
        state.progression.push(createChordItem("I", 4));
      }
      state.selectedChord = state.progression.length - 1;
      updateChordEditor();
      renderProgression();
    });
  }

  if (resetMinutes) {
    resetMinutes.addEventListener("click", () => {
      const confirmed = window.confirm("Are you sure you want to reset your total practice minutes?");
      if (!confirmed) return;
      const data = JSON.parse(localStorage.getItem("fretflow_progress") || "{}");
      const updated = { ...data, totalMinutes: 0 };
      localStorage.setItem("fretflow_progress", JSON.stringify(updated));
      loadProgress();
    });
  }

  scrollButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = document.querySelector(button.dataset.scroll);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });

  if (state.progression.length === 0) {
    state.progression = [
      createChordItem("I"),
      createChordItem("vi"),
      createChordItem("IV"),
      createChordItem("V")
    ];
    renderProgression();
  }
}

function addOption(select, label) {
  const option = document.createElement("option");
  option.value = label;
  option.textContent = label;
  select.appendChild(option);
}

function createChordItem(token, beats = 4, roman = null, exts = []) {
  return { token, beats, roman, exts };
}

function normalizeProgression(items) {
  if (!Array.isArray(items)) return [];
  if (items.length === 0) return [];
  if (typeof items[0] === "string") {
    return items.map((entry) => {
      const { core, beats } = parseTokenBeat(entry);
      return createChordItem(core, beats);
    });
  }
  return items.map((item) => ({
    token: item.token,
    beats: item.beats ?? 4,
    roman: item.roman ?? null,
    exts: Array.isArray(item.exts) ? item.exts : []
  }));
}

function setStyle(style) {
  state.style = style;
  const preset = STYLE_PRESETS[style] || STYLE_PRESETS.clean;
  styleSelect.value = style;
  state.texture = preset.texture;
  state.rhythm = preset.rhythm;
  state.drumsEnabled = preset.drums;
  textureSelect.value = state.texture;
  rhythmSelect.value = state.rhythm;
  drumToggle.checked = state.drumsEnabled;
  if (toneSlider) toneSlider.value = preset.filter;
  if (state.masterFilter) state.masterFilter.frequency.setValueAtTime(preset.filter, state.audioCtx.currentTime);
}

function updateChordEditor() {
  if (!selectedChordLabel || !extensionButtons || !beatButtons) return;
  state.progression = normalizeProgression(state.progression);
  if (!state.progression.length) {
    selectedChordLabel.textContent = "Select a chord";
    extensionButtons.innerHTML = "";
    beatButtons.innerHTML = "";
    return;
  }
  const item = state.progression[state.selectedChord] || state.progression[0];
  const description = describeItem(item);
  selectedChordLabel.textContent = `${description.name} • ${description.label}`;
  if (!state.isPlaying) {
    const chord = chordFromItem(item);
    state.currentChordNotes = new Set(chord.intervals.map((interval) => noteAt(chord.root, interval)));
    state.currentChordRoot = chord.root;
    buildFretboard();
  }

  extensionButtons.innerHTML = "";
  EXTENSION_OPTIONS.forEach((ext) => {
    const btn = document.createElement("button");
    btn.className = "btn ghost small";
    btn.textContent = ext;
    if (item.exts.includes(ext)) btn.classList.add("active");
    btn.addEventListener("click", () => {
      if (item.exts.includes(ext)) {
        item.exts = item.exts.filter((value) => value !== ext);
      } else {
        item.exts.push(ext);
      }
      if (!state.isPlaying) {
        const chord = chordFromItem(item);
        state.currentChordNotes = new Set(chord.intervals.map((interval) => noteAt(chord.root, interval)));
        state.currentChordRoot = chord.root;
      }
      buildFretboard();
      renderProgression();
      updateChordEditor();
    });
    extensionButtons.appendChild(btn);
  });

  beatButtons.innerHTML = "";
  [1, 2, 3, 4].forEach((beat) => {
    const btn = document.createElement("button");
    btn.className = "btn ghost small";
    btn.textContent = beat;
    if (item.beats === beat) btn.classList.add("active");
    btn.addEventListener("click", () => {
      item.beats = beat;
      renderProgression();
      updateChordEditor();
    });
    beatButtons.appendChild(btn);
  });
}

function updateTempo() {
  state.tempo = parseInt(tempoSlider.value, 10);
  tempoLabel.textContent = `${state.tempo} BPM`;
}

function updateKeyBanner() {
  if (!currentKey) return;
  const modeLabel = state.mode === "major" ? "Major" : "Minor";
  currentKey.textContent = `${state.key} ${modeLabel}`;
}

function updateSpicySuggestion() {
  const suggestions = getSpicySuggestions();
  const pick = suggestions[Math.floor(Math.random() * suggestions.length)];
  spicySuggestion.textContent = `${pick.roman} • ${pick.token}`;
  spicySuggestion.dataset.token = pick.token;
  spicySuggestion.dataset.roman = pick.roman;
}

function getSpicySuggestions() {
  const rootIndex = NOTES.indexOf(state.key);
  const buildToken = (interval, quality, preferFlats = false) => {
    const root = preferFlats ? FLAT_NOTES[(rootIndex + interval + 1200) % 12] : NOTES[(rootIndex + interval + 1200) % 12];
    if (quality === "min") return `${root}m`;
    if (quality === "dom7") return `${root}7`;
    if (quality === "maj7") return `${root}maj7`;
    if (quality === "m7") return `${root}m7`;
    if (quality === "dim") return `${root}dim`;
    return `${root}`;
  };

  if (state.mode === "major") {
    return [
      { roman: "bVII", token: buildToken(10, "maj", true) },
      { roman: "bVI", token: buildToken(8, "maj", true) },
      { roman: "iv", token: buildToken(5, "min") },
      { roman: "V/V", token: buildToken(2, "dom7") },
      { roman: "bII", token: buildToken(1, "maj", true) },
      { roman: "bIIImaj7", token: buildToken(3, "maj7", true) },
      { roman: "#iv°", token: buildToken(6, "dim") },
      { roman: "ivm7", token: buildToken(5, "m7") }
    ];
  }

  return [
    { roman: "V (major)", token: buildToken(7, "dom7") },
    { roman: "bII", token: buildToken(1, "maj", true) },
    { roman: "bVI", token: buildToken(8, "maj", true) },
    { roman: "bVII", token: buildToken(10, "maj", true) },
    { roman: "bIIImaj7", token: buildToken(3, "maj7", true) },
    { roman: "bVImaj7", token: buildToken(8, "maj7", true) },
    { roman: "ivm7", token: buildToken(5, "m7") }
  ];
}

function initProgressionLibrary() {
  progressionSelect.innerHTML = "<option value=\"\">Select a progression</option>";
  PROGRESSION_LIBRARY.forEach((item, idx) => {
    const option = document.createElement("option");
    option.value = String(idx);
    option.textContent = item.name;
    progressionSelect.appendChild(option);
  });

  progressionSelect.addEventListener("change", () => {
    const selected = PROGRESSION_LIBRARY[parseInt(progressionSelect.value, 10)];
    if (!selected) return;
    state.progression = selected.tokens.map((token) => createChordItem(token));
    state.selectedChord = 0;
    updateChordEditor();
    renderProgression();
  });
}

function generateProgression() {
  const length = parseInt(genLength?.value || "4", 10);
  const spice = genSpice?.value || "light";
  const rhythm = genRhythm?.value || "steady";

  const randomKey = NOTES[Math.floor(Math.random() * NOTES.length)];
  const chosenKey = keySelect?.value === "random" ? randomKey : keySelect?.value || randomKey;
  state.key = chosenKey;
  keySelect.value = chosenKey;

  const modeOptions = ["major", "minor"];
  const chosenMode = modeSelect?.value === "random" ? modeOptions[Math.floor(Math.random() * modeOptions.length)] : modeSelect?.value || "major";
  state.mode = chosenMode;
  modeSelect.value = chosenMode;

  const styleOptions = ["clean", "neosoul", "jazz", "cinematic"];
  const chosenStyle = styleSelect?.value === "random" ? styleOptions[Math.floor(Math.random() * styleOptions.length)] : styleSelect?.value || "clean";
  setStyle(chosenStyle);

  buildChordPalette();
  updateScaleNotes();
  buildFretboard();
  updateSpicySuggestion();
  updateKeyBanner();

  const diatonic = MODE_DATA[state.mode].degrees;
  const basic = ["I", "vi", "IV", "V"];
  const minorBasic = ["i", "bVII", "bVI", "V"];
  const base = state.mode === "major" ? basic : minorBasic;

  const picks = [];
  for (let i = 0; i < length; i += 1) {
    const useBase = Math.random() < 0.6;
    const token = useBase ? base[i % base.length] : diatonic[Math.floor(Math.random() * diatonic.length)];
    picks.push(token);
  }

  const items = picks.map((token) => {
    const beats = rhythm === "mixed" && Math.random() < 0.35 ? 2 + Math.floor(Math.random() * 3) : 4;
    return createChordItem(token, beats);
  });

  if (spice !== "none") {
    const spiceCount = spice === "bold" ? Math.max(1, Math.round(length * 0.3)) : Math.max(1, Math.round(length * 0.15));
    const suggestions = getSpicySuggestions();
    for (let i = 0; i < spiceCount; i += 1) {
      const index = Math.floor(Math.random() * items.length);
      const pick = suggestions[Math.floor(Math.random() * suggestions.length)];
      items[index] = createChordItem(pick.token, items[index].beats, pick.roman);
    }
  }

  state.progression = items;
  state.selectedChord = 0;
  updateChordEditor();
  renderProgression();
}

function buildFretMarkers() {
  if (!fretboardMarkers) return;
  fretboardMarkers.innerHTML = "";
  for (let fret = 0; fret <= 12; fret += 1) {
    const marker = document.createElement("div");
    marker.textContent = fret === 0 ? "Open" : `${fret}fr`;
    fretboardMarkers.appendChild(marker);
  }
}

function buildChordPalette() {
  buildDiatonicChords();
  buildExtendedChords();
  buildBorrowedChords();
}

function buildDiatonicChords() {
  if (!diatonicChords) return;
  diatonicChords.innerHTML = "";
  const scale = state.mode === "major" ? MAJOR_SCALE : MINOR_SCALE;
  const { degrees, qualities } = MODE_DATA[state.mode];
  scale.forEach((interval, idx) => {
    const root = noteAt(state.key, interval);
    const quality = qualities[idx];
    const name = formatChordName(root, quality, state.chordSize);
    const item = createChordItem(degrees[idx], 1);
    const button = createPaletteButton(`${degrees[idx]} • ${name}`, item);
    diatonicChords.appendChild(button);
  });
}

function buildExtendedChords() {
  if (!extendedChords) return;
  extendedChords.innerHTML = "";
  const { degrees, qualities } = MODE_DATA[state.mode];
  degrees.forEach((degree, idx) => {
    const quality = qualities[idx];
    const exts = quality === "maj" ? ["7", "9"] : ["7", "9"];
    exts.forEach((ext) => {
      const item = createChordItem(degree, 1, null, [ext]);
      const chord = chordFromItem(item);
      const label = `${degree}${ext} • ${buildChordName(formatChordName(chord.root, quality, state.chordSize), [ext])}`;
      const button = createPaletteButton(label, item);
      extendedChords.appendChild(button);
    });
  });
}

function buildBorrowedChords() {
  if (!borrowedChords) return;
  borrowedChords.innerHTML = "";
  const suggestions = getSpicySuggestions();
  suggestions.forEach((pick) => {
    const item = createChordItem(pick.token, 1, pick.roman);
    const label = `${pick.roman} • ${pick.token}`;
    const button = createPaletteButton(label, item);
    borrowedChords.appendChild(button);
  });
}

function createPaletteButton(label, item) {
  const button = document.createElement("button");
  button.className = "chord-btn";
  button.textContent = label;
  button.draggable = true;
  button.addEventListener("click", () => previewChord(item));
  button.addEventListener("dragstart", (event) => {
    event.dataTransfer.setData("application/json", JSON.stringify(item));
    event.dataTransfer.effectAllowed = "copy";
  });
  return button;
}

function formatChordName(root, quality, size) {
  let suffix = "";
  if (quality === "min") suffix = "m";
  if (quality === "dim") suffix = "dim";

  if (size === "seventh") {
    if (quality === "maj") suffix = "maj7";
    if (quality === "min") suffix = "m7";
    if (quality === "dim") suffix = "m7b5";
  }

  return `${root}${suffix}`;
}

function renderProgression() {
  progressionEl.innerHTML = "";
  state.progression = normalizeProgression(state.progression);
  state.progression.forEach((item, idx) => {
    const itemEl = document.createElement("div");
    const description = describeItem(item);
    itemEl.className = "progression-item";
    if (state.isPlaying && idx === state.uiChord) itemEl.classList.add("playing");
    if (idx === state.selectedChord) itemEl.classList.add("selected");
    itemEl.draggable = true;
    itemEl.dataset.index = idx;
    const beatLabel = item.beats !== 1 ? `<div class="beats">${item.beats} beats</div>` : "";
    itemEl.innerHTML = `<span>${description.label}</span><strong>${description.name}</strong>${beatLabel}<button class="remove-chord" aria-label="Remove">×</button>`;
    itemEl.title = "Click to select";
    itemEl.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-chord")) return;
      state.selectedChord = idx;
      updateChordEditor();
      renderProgression();
    });
    itemEl.querySelector(".remove-chord").addEventListener("click", (event) => {
      event.stopPropagation();
      state.progression.splice(idx, 1);
      if (state.selectedChord >= state.progression.length) {
        state.selectedChord = Math.max(0, state.progression.length - 1);
      }
      updateChordEditor();
      renderProgression();
    });
    itemEl.addEventListener("dragstart", handleDragStart);
    itemEl.addEventListener("dragover", handleDragOver);
    itemEl.addEventListener("drop", handleDrop);
    progressionEl.appendChild(itemEl);
  });
  syncProgressionInput();
}

function parseProgressionInput() {
  if (!progInput) return [];
  return progInput.value
    .split(/[\s,]+/g)
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => {
      const { core, beats } = parseTokenBeat(token);
      const romanParsed = parseRomanToken(core);
      if (romanParsed) {
        return createChordItem(romanParsed.token, beats, null, romanParsed.exts);
      }
      return createChordItem(core, beats);
    });
}

function syncProgressionInput() {
  if (!progInput || document.activeElement === progInput) return;
  const tokens = state.progression.map((item) => {
    const extLabel = item.exts.length ? `(${item.exts.join(",")})` : "";
    return `${item.token}${extLabel}${item.beats !== 1 ? `:${item.beats}` : ""}`;
  });
  progInput.value = tokens.join(" ");
}

function parseRomanToken(token) {
  const match = token.match(/^([ivIV]+°?)(.*)$/);
  if (!match) return null;
  const roman = match[1];
  if (!romanToDegree(roman)) return null;
  const extPart = match[2].toLowerCase();
  if (!extPart) return { token: roman, exts: [] };
  const exts = [];
  if (extPart.includes("sus4")) exts.push("sus4");
  if (extPart.includes("add9")) exts.push("add9");
  if (extPart.includes("13")) exts.push("13");
  if (extPart.includes("11")) exts.push("11");
  if (extPart.includes("9")) exts.push("9");
  if (extPart.includes("7")) exts.push("7");
  return { token: roman, exts };
}

function parseTokenBeat(token) {
  const match = token.match(/^(.*?)(?::([0-9.]+))?$/);
  const core = match ? match[1] : token;
  const beats = match && match[2] ? Math.max(0.5, parseFloat(match[2])) : 4;
  return { core, beats };
}

let dragIndex = null;

function handleDragStart(event) {
  dragIndex = parseInt(event.currentTarget.dataset.index, 10);
  event.dataTransfer.effectAllowed = "move";
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function handleDrop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("application/json");
  if (data) {
    const item = JSON.parse(data);
    const dropIndex = parseInt(event.currentTarget.dataset.index, 10);
    if (!Number.isNaN(dropIndex)) {
      state.progression[dropIndex] = normalizeProgression([item])[0];
      state.selectedChord = dropIndex;
      updateChordEditor();
      renderProgression();
    }
    return;
  }
  const dropIndex = parseInt(event.currentTarget.dataset.index, 10);
  if (Number.isNaN(dragIndex) || Number.isNaN(dropIndex) || dragIndex === dropIndex) return;
  const updated = state.progression.slice();
  const [moved] = updated.splice(dragIndex, 1);
  updated.splice(dropIndex, 0, moved);
  state.progression = updated;
  state.selectedChord = dropIndex;
  updateChordEditor();
  renderProgression();
}

function noteAt(root, interval, preferFlats = null) {
  const normalized = FLAT_EQUIV[root] || root;
  const rootIndex = NOTES.indexOf(normalized);
  const noteIndex = (rootIndex + interval + 1200) % 12;
  const useFlats = preferFlats === null ? shouldPreferFlats(root) : preferFlats;
  return useFlats ? FLAT_NOTES[noteIndex] : NOTES[noteIndex];
}

function shouldPreferFlats(key) {
  if (!key) return false;
  if (key.includes("b")) return true;
  const flatKeys = ["F", "Bb", "Eb", "Ab", "Db", "Gb", "Cb"];
  return flatKeys.includes(key);
}

function shouldUseFlatsForToken(token) {
  if (!token) return shouldPreferFlats(state.key);
  if (token.includes("b")) return true;
  return shouldPreferFlats(state.key);
}

function romanToDegree(token) {
  const normalized = token.replace(/[^IViv°b]/g, "");
  const accidental = normalized.startsWith("b") ? -1 : 0;
  const stripped = normalized.replace("b", "");
  const degreeMap = {
    "I": 0,
    "ii": 1,
    "iii": 2,
    "IV": 3,
    "V": 4,
    "vi": 5,
    "vii°": 6,
    "ii°": 1,
    "i": 0,
    "III": 2,
    "iv": 3,
    "v": 4,
    "VI": 5,
    "VII": 6
  };
  const degree = degreeMap[stripped] ?? null;
  if (degree === null) return null;
  return { degree, accidental };
}

function chordFromDegree(token) {
  const parsed = romanToDegree(token);
  if (!parsed) return { root: "C", intervals: [0, 4, 7], quality: "maj" };
  const scale = state.mode === "major" ? MAJOR_SCALE : MINOR_SCALE;
  const { degree, accidental } = parsed;
  const root = noteAt(state.key, scale[degree] + accidental, shouldUseFlatsForToken(token));
  const quality = MODE_DATA[state.mode].qualities[degree];
  let intervals = quality === "maj" ? [0, 4, 7] : [0, 3, 7];
  if (quality === "dim") intervals = [0, 3, 6];

  if (state.chordSize === "seventh") {
    intervals = quality === "maj" ? [0, 4, 7, 11] : [0, 3, 7, 10];
    if (quality === "dim") intervals = [0, 3, 6, 10];
  }

  return { root, intervals, quality };
}

function parseChordName(token) {
  const match = token.match(/^([A-Ga-g])([b#]?)(.*)$/);
  if (!match) return null;
  const letter = match[1].toUpperCase();
  const accidental = match[2];
  const suffix = match[3].toLowerCase();
  const root = `${letter}${accidental}`;
  let intervals = [0, 4, 7];
  let quality = "maj";

  if (suffix.includes("maj7")) intervals = [0, 4, 7, 11];
  else if (suffix.includes("m7b5")) intervals = [0, 3, 6, 10];
  else if (suffix.includes("dim")) {
    intervals = [0, 3, 6];
    quality = "dim";
  } else if (suffix.includes("aug")) {
    intervals = [0, 4, 8];
    quality = "aug";
  } else if (suffix.includes("m7")) {
    intervals = [0, 3, 7, 10];
    quality = "min";
  } else if (suffix.includes("m")) {
    intervals = [0, 3, 7];
    quality = "min";
  } else if (suffix.includes("7")) {
    intervals = [0, 4, 7, 10];
    quality = "dom";
  }

  if (suffix.includes("maj7")) quality = "maj";

  return { root, intervals, name: `${root}${suffix}`, quality };
}

function chordFromItem(item) {
  if (romanToDegree(item.token)) {
    const chord = chordFromDegree(item.token);
    const intervals = applyExtensions(chord.intervals, chord.quality, item.exts);
    return { root: chord.root, intervals, quality: chord.quality };
  }
  const parsed = parseChordName(item.token);
  if (parsed) {
    const intervals = applyExtensions(parsed.intervals, parsed.quality, item.exts);
    return { root: parsed.root, intervals, quality: parsed.quality, name: parsed.name };
  }
  return { root: "C", intervals: [0, 4, 7], quality: "maj" };
}

function describeItem(item) {
  const roman = romanToDegree(item.token);
  if (roman) {
    const chord = chordFromDegree(item.token);
    const base = formatChordName(chord.root, MODE_DATA[state.mode].qualities[roman.degree], state.chordSize);
    return { label: item.token, name: buildChordName(base, item.exts) };
  }
  const parsed = parseChordName(item.token);
  if (parsed) {
    const label = item.roman ? `Spicy (${item.roman})` : `Spicy (${item.token})`;
    return { label, name: buildChordName(parsed.name, item.exts) };
  }
  return { label: item.token, name: item.token };
}

function applyExtensions(intervals, quality, exts = []) {
  const set = new Set(intervals);
  if (exts.includes("sus4")) {
    set.delete(3);
    set.delete(4);
    set.add(5);
  }
  const addSeventh = (value) => set.add(value);
  if (exts.includes("7")) {
    if (quality === "maj") addSeventh(11);
    else if (quality === "min") addSeventh(10);
    else if (quality === "dom") addSeventh(10);
    else addSeventh(10);
  }
  if (exts.includes("9") || exts.includes("add9")) set.add(14);
  if (exts.includes("11")) set.add(17);
  if (exts.includes("13")) set.add(21);
  return Array.from(set).sort((a, b) => a - b);
}

function buildChordName(baseName, exts = []) {
  const extras = exts.filter((ext) => !baseName.toLowerCase().includes(ext));
  if (extras.length === 0) return baseName;
  return `${baseName}(${extras.join(",")})`;
}

function initAudio() {
  state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  state.masterGain = state.audioCtx.createGain();
  state.masterFilter = state.audioCtx.createBiquadFilter();
  const compressor = state.audioCtx.createDynamicsCompressor();
  const delay = state.audioCtx.createDelay();
  const feedback = state.audioCtx.createGain();
  const wetGain = state.audioCtx.createGain();
  const convolver = state.audioCtx.createConvolver();
  state.masterFilter.type = "lowpass";
  const preset = STYLE_PRESETS[state.style] || STYLE_PRESETS.clean;
  state.masterFilter.frequency.value = preset.filter;
  if (toneSlider) toneSlider.value = preset.filter;
  state.masterGain.gain.value = 0.9;
  compressor.threshold.value = -18;
  compressor.ratio.value = 2.5;
  compressor.attack.value = 0.01;
  compressor.release.value = 0.2;

  delay.delayTime.value = 0.22;
  feedback.gain.value = 0.25;
  wetGain.gain.value = 0.2;
  delay.connect(feedback).connect(delay);

  convolver.buffer = buildImpulse(state.audioCtx, 1.6, 0.4);

  state.masterFilter.connect(compressor);
  compressor.connect(state.masterGain);
  compressor.connect(delay);
  delay.connect(wetGain);
  compressor.connect(convolver);
  convolver.connect(wetGain);
  wetGain.connect(state.masterGain);
  state.masterGain.connect(state.audioCtx.destination);

  state.drumBus = state.audioCtx.createGain();
  state.drumBus.gain.value = 0.55;
  state.drumBus.connect(state.audioCtx.destination);

  state.noiseBuffer = state.audioCtx.createBuffer(1, state.audioCtx.sampleRate, state.audioCtx.sampleRate);
  const data = state.noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
}

function startPlayback() {
  if (state.isPlaying || state.progression.length === 0) return;
  if (!state.audioCtx) initAudio();

  state.isPlaying = true;
  state.currentChord = 0;
  state.uiChord = 0;
  state.selectedChord = 0;
  updateChordEditor();
  state.nextTime = state.audioCtx.currentTime + 0.05;

  state.fretMode = "chord";
  buildFretboard();

  const firstItem = state.progression[0];
  if (firstItem) updateNowPlaying(firstItem, chordFromItem(firstItem), 0);

  state.timerId = setInterval(schedulePlayback, 25);
  if (!state.sessionTimerId) startSession();
}

function schedulePlayback() {
  if (!state.isPlaying || !state.audioCtx) return;
  const lookAhead = 0.15;
  while (state.nextTime < state.audioCtx.currentTime + lookAhead) {
    const index = state.currentChord;
    const item = state.progression[index];
    const chord = chordFromItem(item);
    scheduleChord(item, chord, state.nextTime, index, item.beats);
    if (state.drumsEnabled) scheduleDrums(state.nextTime, item.beats);
    const duration = (60 / state.tempo) * item.beats;
    state.nextTime += duration;
    state.currentChord = (state.currentChord + 1) % state.progression.length;
  }
}

function scheduleChord(item, chord, time, index, beats) {
  const { root, intervals } = chord;
  const baseMidi = noteToMidi(root, 3);
  const notes = intervals.map((interval) => baseMidi + interval);
  const duration = (60 / state.tempo) * beats;
  const rhythm = RHYTHMS[state.rhythm] || RHYTHMS.whole;
  rhythm.filter((beat) => beat < beats).forEach((beat) => {
    const hitTime = time + (60 / state.tempo) * beat;
    if (state.texture === "arp") {
      notes.forEach((midi, idx) => playNote(midi, hitTime + idx * 0.08, duration * 0.6));
    } else if (state.texture === "pulse") {
      notes.forEach((midi) => playNote(midi, hitTime, duration * 0.35));
    } else {
      notes.forEach((midi, idx) => playNote(midi, hitTime + idx * 0.02, duration * 0.7));
    }
  });

  scheduleUiUpdate(item, chord, time, index);
}

function previewChord(item) {
  if (!state.audioCtx) initAudio();
  const chord = chordFromItem(item);
  const duration = (60 / state.tempo) * 1.2;
  const baseMidi = noteToMidi(chord.root, 3);
  chord.intervals.forEach((interval, idx) => {
    playNote(baseMidi + interval, state.audioCtx.currentTime + idx * 0.02, duration);
  });
}

function playNote(midi, time, duration) {
  if (!state.audioCtx) return;
  const oscA = state.audioCtx.createOscillator();
  const oscB = state.audioCtx.createOscillator();
  const oscC = state.audioCtx.createOscillator();
  const oscMix = state.audioCtx.createGain();
  const gain = state.audioCtx.createGain();
  const frequency = midiToFrequency(midi);
  oscA.type = "sine";
  oscB.type = "triangle";
  oscC.type = "sawtooth";
  oscA.frequency.value = frequency;
  oscB.frequency.value = frequency * 1.003;
  oscC.frequency.value = frequency * 0.995;

  const hold = state.noteHold || 1;
  const sustain = duration * hold;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.16, time + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, time + sustain + 0.2);

  oscMix.gain.value = 0.6;
  oscA.connect(oscMix);
  oscB.connect(oscMix);
  oscC.connect(oscMix);
  oscMix.connect(gain);
  gain.connect(state.masterFilter);
  oscA.start(time);
  oscB.start(time);
  oscC.start(time);
  oscA.stop(time + sustain + 0.3);
  oscB.stop(time + sustain + 0.3);
  oscC.stop(time + sustain + 0.3);
}

function scheduleDrums(time, beats = 4) {
  if (!state.audioCtx || !state.drumBus || !state.drumsEnabled) return;
  const pattern = DRUM_PATTERNS[state.style] || DRUM_PATTERNS.clean;
  const beat = 60 / state.tempo;
  pattern.kick.filter((step) => step < beats).forEach((step) => playKick(time + step * beat));
  pattern.snare.filter((step) => step < beats).forEach((step) => playSnare(time + step * beat));
  pattern.hat.filter((step) => step < beats).forEach((step) => playHat(time + step * beat));
}

function playKick(time) {
  const osc = state.audioCtx.createOscillator();
  const gain = state.audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(120, time);
  osc.frequency.exponentialRampToValueAtTime(50, time + 0.2);
  gain.gain.setValueAtTime(0.7, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);
  osc.connect(gain).connect(state.drumBus);
  osc.start(time);
  osc.stop(time + 0.3);
}

function playSnare(time) {
  const noise = state.audioCtx.createBufferSource();
  noise.buffer = state.noiseBuffer;
  const filter = state.audioCtx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 1200;
  const gain = state.audioCtx.createGain();
  gain.gain.setValueAtTime(0.35, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
  noise.connect(filter).connect(gain).connect(state.drumBus);
  noise.start(time);
  noise.stop(time + 0.22);
}

function playHat(time) {
  const noise = state.audioCtx.createBufferSource();
  noise.buffer = state.noiseBuffer;
  const filter = state.audioCtx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 5000;
  const gain = state.audioCtx.createGain();
  gain.gain.setValueAtTime(0.2, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
  noise.connect(filter).connect(gain).connect(state.drumBus);
  noise.start(time);
  noise.stop(time + 0.1);
}

function stopPlayback() {
  state.isPlaying = false;
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
  state.uiTimeouts.forEach((id) => clearTimeout(id));
  state.uiTimeouts = [];
  state.currentChordNotes = new Set();
  state.currentChordRoot = null;
  if (nowChord) nowChord.textContent = "—";
  if (nowDetails) nowDetails.textContent = "Playback stopped.";
  renderProgression();
  buildFretboard();
  if (state.sessionTimerId) stopSession();
}

function scheduleUiUpdate(item, chord, time, index) {
  const delay = Math.max(0, (time - state.audioCtx.currentTime) * 1000);
  const timeout = setTimeout(() => {
    updateNowPlaying(item, chord, index);
  }, delay);
  state.uiTimeouts.push(timeout);
}

function updateNowPlaying(item, chord, index) {
  state.currentChordNotes = new Set(chord.intervals.map((interval) => noteAt(chord.root, interval)));
  state.currentChordRoot = chord.root;
  state.uiChord = index;
  if (state.selectedChord !== index) {
    state.selectedChord = index;
    updateChordEditor();
  }
  const description = describeItem(item);
  if (nowChord) nowChord.textContent = description.name;
  if (nowDetails) nowDetails.textContent = `${description.label} • Vibe: ${state.style} • ${state.texture} • ${state.rhythm}`;
  renderProgression();
  buildFretboard();
}

function noteToMidi(note, octave) {
  const normalized = FLAT_EQUIV[note] || note;
  const index = NOTES.indexOf(normalized);
  return 12 * (octave + 1) + index;
}

function midiToFrequency(midi) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function buildImpulse(context, duration, decay) {
  const rate = context.sampleRate;
  const length = rate * duration;
  const impulse = context.createBuffer(2, length, rate);
  for (let channel = 0; channel < 2; channel += 1) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
}

function updateScaleNotes() {
  if (!scaleSelect || !scaleNotes) return;
  const scale = scales[scaleSelect.value];
  const notes = scale.map((interval) => noteAt(state.key, interval));
  renderNoteList(scaleNotes, notes);
}

function updateArpNotes() {
  if (!arpSelect || !arpNotes) return;
  const arp = arpeggios[arpSelect.value];
  const notes = arp.map((interval) => noteAt(state.key, interval));
  renderNoteList(arpNotes, notes);
}

function updateTriadNotes() {
  if (!triadSelect || !triadNotes) return;
  const triad = triads[triadSelect.value];
  const notes = triad.map((interval) => noteAt(state.key, interval));
  renderNoteList(triadNotes, notes);
}

function renderNoteList(container, notes) {
  container.innerHTML = "";
  notes.forEach((note) => {
    const span = document.createElement("span");
    span.textContent = note;
    container.appendChild(span);
  });
}

function buildFretboard() {
  fretboardGrid.innerHTML = "";
  const strings = ["E", "B", "G", "D", "A", "E"];
  const frets = 12;

  const { highlightSet, overlaySet } = getHighlightNotes();
  const offset = 0;
  strings.forEach((open) => {
    for (let fret = 0; fret <= frets; fret += 1) {
      const note = noteAt(open, (fret + offset) % 12);
      const cell = document.createElement("div");
      cell.className = "fret";
      cell.textContent = note;
      if (highlightSet.has(note)) cell.classList.add("active");
      if (overlaySet.has(note)) cell.classList.add("overlay");
      if (state.currentChordRoot && note === state.currentChordRoot) cell.classList.add("root");
      fretboardGrid.appendChild(cell);
    }
  });
}

function getHighlightNotes() {
  const chordSet = state.currentChordNotes.size > 0 ? state.currentChordNotes : new Set();
  if (state.fretMode === "scale") {
    if (!scaleSelect) return { highlightSet: chordSet, overlaySet: new Set() };
    const intervals = scales[scaleSelect.value];
    const overlaySet = new Set(intervals.map((interval) => noteAt(state.key, interval)));
    return { highlightSet: chordSet, overlaySet };
  }
  return { highlightSet: chordSet, overlaySet: new Set() };
}

function startSession() {
  if (state.sessionTimerId) return;
  state.sessionStartTime = Date.now();
  state.sessionTimerId = setInterval(updateSessionTimer, 1000);
}

function stopSession() {
  if (!state.sessionTimerId) return;
  clearInterval(state.sessionTimerId);
  state.sessionTimerId = null;
  const minutes = Math.max(1, Math.round((Date.now() - state.sessionStartTime) / 60000));
  logSession(minutes);
  state.sessionStartTime = null;
  if (sessionTimer) sessionTimer.textContent = "00:00";
}

function updateSessionTimer() {
  if (!sessionTimer) return;
  const elapsed = Math.floor((Date.now() - state.sessionStartTime) / 1000);
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");
  sessionTimer.textContent = `${minutes}:${seconds}`;
}

function loadProgress() {
  const data = JSON.parse(localStorage.getItem("fretflow_progress") || "{}");
  if (totalMinutesEl) totalMinutesEl.textContent = data.totalMinutes || 0;
  if (sessionsLoggedEl) sessionsLoggedEl.textContent = data.sessions || 0;
  if (streakEl) streakEl.textContent = `${data.streak || 0} days`;
  if (footerMinutes) footerMinutes.textContent = data.totalMinutes || 0;
}

function logSession(minutes) {
  const data = JSON.parse(localStorage.getItem("fretflow_progress") || "{}");
  const today = new Date().toDateString();
  const lastDate = data.lastDate;
  const sessions = (data.sessions || 0) + 1;
  const totalMinutes = (data.totalMinutes || 0) + minutes;
  let streak = data.streak || 0;
  if (lastDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastDate === yesterday.toDateString()) streak += 1;
    else streak = 1;
  }

  const updated = { sessions, totalMinutes, streak, lastDate: today };
  localStorage.setItem("fretflow_progress", JSON.stringify(updated));
  loadProgress();
}

init();
