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
const tempoDown = document.getElementById("tempoDown");
const tempoUp = document.getElementById("tempoUp");
const tempoLabelMobile = document.getElementById("tempoLabelMobile");
const tempoDownMobile = document.getElementById("tempoDownMobile");
const tempoUpMobile = document.getElementById("tempoUpMobile");
const mobilePlay = document.getElementById("mobilePlay");
const mobileKey = document.getElementById("mobileKey");
const diatonicChords = document.getElementById("diatonicChords");
const progressionEl = document.getElementById("progression");
const progInput = document.getElementById("progInput");
const applyProg = document.getElementById("applyProg");
const clearProg = document.getElementById("clearProg");
const shuffleProg = document.getElementById("shuffleProg");
const playBtn = document.getElementById("playBtn");
const styleSelect = document.getElementById("styleSelect");
const textureSelect = document.getElementById("textureSelect");
const sizeSelect = document.getElementById("sizeSelect");
const rhythmSelect = document.getElementById("rhythmSelect");
const drumToggle = document.getElementById("drumToggle");
const toneSlider = document.getElementById("toneSlider");
const holdSlider = document.getElementById("holdSlider");
const sampleOffsetSlider = document.getElementById("sampleOffset");
const sampleTrimSlider = document.getElementById("sampleTrim");
const drumStyleSelect = document.getElementById("drumStyleSelect");
const instrumentSelect = document.getElementById("instrumentSelect");
const guitarLevelSlider = document.getElementById("guitarLevel");
const guitarLevelValue = document.getElementById("guitarLevelValue");
const bassToggle = document.getElementById("bassToggle");
const bassLevelSlider = document.getElementById("bassLevel");
const bassRhythmSelect = document.getElementById("bassRhythmSelect");
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
const chordEditor = document.querySelector(".chord-editor");
// chord slots are added by dragging chords into the progression
const footerMinutes = document.getElementById("footerMinutes");
const resetMinutes = document.getElementById("resetMinutes");
const currentKey = document.getElementById("currentKey");
const keyBanner = document.querySelector(".key-banner");
const downloadMidiBtn = document.getElementById("downloadMidi");
const keyLockBtn = document.getElementById("keyLockBtn");
const countInEl = document.getElementById("countIn");
const saveProgressionBtn = document.getElementById("saveProgression");
const loadProgressionBtn = document.getElementById("loadProgression");
const deleteProgressionBtn = document.getElementById("deleteProgression");
const presetOneChord = document.getElementById("presetOneChord");
const presetBlues = document.getElementById("presetBlues");
const presetFamous = document.getElementById("presetFamous");
const presetIIVI = document.getElementById("presetIIVI");
const presetMinorLoop = document.getElementById("presetMinorLoop");

const scrollButtons = document.querySelectorAll("[data-scroll]");

const state = {
  progression: [],
  tempo: 100,
  key: "C",
  mode: "major",
  style: "clean",
  texture: "pulse",
  rhythm: "eighths",
  drumsEnabled: true,
  bassEnabled: true,
  followPlayback: true,
  chordSize: "triad",
  drumStyle: "pop",
  bassRhythm: "steady",
  audioCtx: null,
  masterGain: null,
  masterFilter: null,
  guitarBusGain: null,
  pianoBusGain: null,
  bassBusGain: null,
  drumBus: null,
  noiseBuffer: null,
  isPlaying: false,
  isPaused: false,
  currentChord: 0,
  uiChord: 0,
  nextTime: 0,
  timerId: null,
  lastDrumBar: null,
  lastCountBar: null,
  lastVoicing: null,
  editorPinned: false,
  sessionTimerId: null,
  sessionStartTime: null,
  pauseStartTime: null,
  pausedTotalMs: 0,
  sessionLoggedMinutes: 0,
  uiTimeouts: [],
  currentChordNotes: new Set(),
  currentChordRoot: null,
  selectedChord: 0,
  noteHold: 1.4,
  fretMode: "chord",
  sampleBuffers: {},
  samplesLoaded: false,
  samplesLoading: null,
  sampleOffsetMs: -40,
  sampleTrimMs: 20,
  synthEnabled: false,
  sampleInstrument: "guitar",
  guitarLevel: 0.05,
  bassLevel: 0.35,
  drumPattern: null,
  drumSampleBuffers: {},
  drumSamplesLoaded: false,
  drumSamplesLoading: null,
  keyLocked: false,
  isCountingIn: false,
  countInTimeouts: [],
  sampleStatusTimeout: null
};

const SAVED_PROG_KEY = "gpl_saved_progressions";

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
  quarters: [0, 1, 2, 3],
  eighths: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
  syncopated: [0, 1.5, 2.5, 3.5],
  offbeat: [0.5, 1.5, 2.5, 3.5],
  push: [0, 1.75, 2.75, 3.5],
  tresillo: [0, 1.5, 3],
  habanera: [0, 1.5, 2, 3],
  clave: [0, 1.5, 2.5, 3],
  sparse: [0, 2.5],
  rockStrum: [0, 0.5, 1.5, 2, 2.5, 3.5]
};

const EXTENSION_OPTIONS = ["maj7", "7", "9", "11", "13", "sus4", "add9"];

const SAMPLE_LIBRARY = {
  piano: [
    { midi: 48, url: "gpl/samples/Piano.pp.C3.wav" },
    { midi: 60, url: "gpl/samples/Piano.pp.C4.wav" },
    { midi: 72, url: "gpl/samples/Piano.pp.C5.wav" }
  ],
  guitar: [
    { midi: 48, url: "gpl/samples/guitar/Guitar.C3.wav" },
    { midi: 60, url: "gpl/samples/guitar/Guitar.C4.wav" },
    { midi: 72, url: "gpl/samples/guitar/Guitar.C5.wav" }
  ]
};

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

const DRUM_PATTERN_BANK = {
  pop: [
    { kick: [0, 2], snare: [1, 3], hat: [0.5, 1.5, 2.5, 3.5] },
    { kick: [0, 2.5], snare: [1, 3], hat: [0.5, 1.5, 2, 2.5, 3.5], hatOpen: [3.5] },
    { kick: [0, 1.5, 2], snare: [1, 3], hat: [0.5, 1.5, 2.5, 3.5] }
  ],
  electronic: [
    { kick: [0, 1.5, 2.5], snare: [1, 3], hat: [0.25, 0.75, 1.25, 1.75, 2.25, 2.75, 3.25, 3.75] },
    { kick: [0, 2], snare: [1.5, 3], hat: [0.25, 0.75, 1.25, 1.75, 2.5, 3.25, 3.75] },
    { kick: [0, 1, 2.5], snare: [1.5, 3], hat: [0.5, 1, 1.5, 2, 2.5, 3, 3.5] }
  ],
  edm: [
    { kick: [0, 1, 2, 3], snare: [2], hat: [0.5, 1.5, 2.5, 3.5] },
    { kick: [0, 1, 2, 3], snare: [2], hat: [0.25, 0.75, 1.25, 1.75, 2.25, 2.75, 3.25, 3.75] }
  ],
  industrial: [
    { kick: [0, 2.5], snare: [1.5, 3], hat: [0.5, 1, 1.5, 2.5, 3, 3.5], perc: [1.25, 2.25] },
    { kick: [0, 1.75, 3], snare: [1.5], hat: [0.5, 1.25, 2, 2.75, 3.5], perc: [2.25] }
  ],
  african: [
    { kick: [0, 1.5, 2.75], snare: [2], hat: [0.5, 1.25, 2, 2.75, 3.5], perc: [1.75, 3.25] },
    { kick: [0, 1, 2.5], snare: [1.75, 3], hat: [0.5, 1.5, 2.25, 3.25], perc: [0.75, 2.75] }
  ],
  clave: [
    { kick: [0, 1.5, 2.5, 3], snare: [2], hat: [0.5, 1.75, 2.75, 3.5], perc: [0, 1.5, 2.5, 3] },
    { kick: [0, 2, 2.5], snare: [1.5, 3], hat: [0.5, 1.5, 2, 3.5], perc: [0, 2.5] }
  ],
  bossa: [
    { kick: [0, 2.5], snare: [1, 3], hat: [0.5, 1.5, 2, 3.5] },
    { kick: [0, 1.75, 2.5], snare: [1, 3], hat: [0.5, 1.5, 2.5, 3.5] }
  ],
  jazz: [
    { kick: [0], snare: [2], hat: [0, 1.5, 2, 3.5] },
    { kick: [0, 2.5], snare: [2], hat: [0, 1.5, 2.5, 3.5] }
  ],
  cinematic: [
    { kick: [0, 2.5], snare: [3], hat: [1, 2, 3] },
    { kick: [0, 3], snare: [2], hat: [1, 2.5, 3.5] }
  ]
};

const DRUM_KITS = {
  pearl: {
    kick: "gpl/samples/drums/pearl/kick-01.wav",
    snareA: "gpl/samples/drums/pearl/snare-01.wav",
    snareB: "gpl/samples/drums/pearl/snare-02.wav",
    hatClosed: "gpl/samples/drums/pearl/hihat-closed.wav",
    hatOpen: "gpl/samples/drums/pearl/hihat-open.wav"
  },
  cr78: {
    kick: "gpl/samples/drums/cr78/kick.wav",
    snareA: "gpl/samples/drums/cr78/snare.wav",
    hatClosed: "gpl/samples/drums/cr78/hihat.wav",
    hatOpen: "gpl/samples/drums/cr78/hihat-metal.wav",
    perc: "gpl/samples/drums/cr78/conga-l.wav",
    cowbell: "gpl/samples/drums/cr78/cowbell.wav",
    rim: "gpl/samples/drums/cr78/rim.wav",
    tamb: "gpl/samples/drums/cr78/tamb-short.wav"
  }
};

const DRUM_STYLE_KIT = {
  pop: "pearl",
  bossa: "pearl",
  jazz: "pearl",
  cinematic: "pearl",
  electronic: "cr78",
  edm: "cr78",
  industrial: "cr78",
  african: "cr78",
  clave: "cr78"
};

const BASS_RHYTHMS = {
  steady: [0, 2],
  eighths: [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5],
  syncopated: [0, 1.5, 2.5, 3.5],
  offbeat: [0.5, 1.5, 2.5, 3.5],
  tresillo: [0, 1.5, 3],
  push: [0, 1.75, 2.75, 3.5],
  oneDrop: [1.5, 3],
  motown: [0, 1.5, 2, 3.5],
  walking: [0, 1, 2, 3]
};

const DRUM_SOUNDS = {
  pop: { kick: 110, snareTone: 1800, hatTone: 6000, hatDecay: 0.08 },
  electronic: { kick: 80, snareTone: 2200, hatTone: 8000, hatDecay: 0.06 },
  edm: { kick: 55, snareTone: 2000, hatTone: 9000, hatDecay: 0.05 },
  industrial: { kick: 90, snareTone: 2600, hatTone: 9500, hatDecay: 0.04 },
  african: { kick: 140, snareTone: 1600, hatTone: 5000, hatDecay: 0.07 },
  clave: { kick: 120, snareTone: 2400, hatTone: 7000, hatDecay: 0.06 },
  bossa: { kick: 105, snareTone: 1900, hatTone: 6500, hatDecay: 0.06 },
  jazz: { kick: 80, snareTone: 1400, hatTone: 4500, hatDecay: 0.09 },
  cinematic: { kick: 70, snareTone: 1200, hatTone: 4000, hatDecay: 0.1 }
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
  updatePlayButton();

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
  if (tempoDown) {
    tempoDown.addEventListener("click", () => {
      const next = Math.max(parseInt(tempoSlider.min, 10), state.tempo - 1);
      tempoSlider.value = next;
      updateTempo();
    });
  }
  if (tempoUp) {
    tempoUp.addEventListener("click", () => {
      const next = Math.min(parseInt(tempoSlider.max, 10), state.tempo + 1);
      tempoSlider.value = next;
      updateTempo();
    });
  }

  if (tempoDownMobile) {
    tempoDownMobile.addEventListener("click", () => {
      const next = Math.max(parseInt(tempoSlider.min, 10), state.tempo - 1);
      tempoSlider.value = next;
      updateTempo();
    });
  }

  if (tempoUpMobile) {
    tempoUpMobile.addEventListener("click", () => {
      const next = Math.min(parseInt(tempoSlider.max, 10), state.tempo + 1);
      tempoSlider.value = next;
      updateTempo();
    });
  }

  if (mobilePlay) {
    mobilePlay.addEventListener("click", togglePlayback);
  }

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

  playBtn.addEventListener("click", togglePlayback);
  if (downloadMidiBtn) downloadMidiBtn.addEventListener("click", downloadMidi);

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

  if (sampleOffsetSlider) {
    sampleOffsetSlider.addEventListener("input", () => {
      state.sampleOffsetMs = parseInt(sampleOffsetSlider.value, 10);
    });
  }

  if (sampleTrimSlider) {
    sampleTrimSlider.addEventListener("input", () => {
      state.sampleTrimMs = parseInt(sampleTrimSlider.value, 10);
    });
  }

  if (drumStyleSelect) {
    drumStyleSelect.addEventListener("change", () => {
      state.drumStyle = drumStyleSelect.value;
      selectDrumPattern();
    });
  }

  if (bassToggle) {
    bassToggle.addEventListener("change", () => {
      state.bassEnabled = bassToggle.checked;
    });
  }

  if (bassRhythmSelect) {
    bassRhythmSelect.addEventListener("change", () => {
      state.bassRhythm = bassRhythmSelect.value;
    });
  }

  if (bassLevelSlider) {
    bassLevelSlider.addEventListener("input", () => {
      state.bassLevel = Math.max(0, parseInt(bassLevelSlider.value, 10) / 100);
      if (state.bassBusGain) {
        state.bassBusGain.gain.setValueAtTime(state.bassLevel, state.audioCtx?.currentTime || 0);
      }
    });
  }

  if (instrumentSelect) {
    instrumentSelect.addEventListener("change", () => {
      state.sampleInstrument = instrumentSelect.value;
      reloadSamples();
    });
  }

  if (guitarLevelSlider) {
    guitarLevelSlider.addEventListener("input", () => {
      state.guitarLevel = Math.max(0, parseInt(guitarLevelSlider.value, 10) / 100);
      if (state.guitarBusGain) {
        state.guitarBusGain.gain.setValueAtTime(state.guitarLevel, state.audioCtx?.currentTime || 0);
      }
      if (guitarLevelValue) guitarLevelValue.textContent = `${Math.round(state.guitarLevel * 100)}%`;
    });
  }

  if (saveProgressionBtn) {
    saveProgressionBtn.addEventListener("click", () => {
      const name = window.prompt("Save progression name:");
      if (!name) return;
      const saved = loadSavedProgressions();
      saved[name] = {
        progression: state.progression,
        key: state.key,
        mode: state.mode,
        tempo: state.tempo
      };
      localStorage.setItem(SAVED_PROG_KEY, JSON.stringify(saved));
    });
  }

  if (loadProgressionBtn) {
    loadProgressionBtn.addEventListener("click", () => {
      const saved = loadSavedProgressions();
      const names = Object.keys(saved);
      if (!names.length) {
        window.alert("No saved progressions yet.");
        return;
      }
      const choice = window.prompt(`Load which progression?\n${names.join(", ")}`);
      if (!choice || !saved[choice]) return;
      const data = saved[choice];
      state.progression = normalizeProgression(data.progression);
      state.key = data.key || state.key;
      state.mode = data.mode || state.mode;
      state.tempo = data.tempo || state.tempo;
      updateKeyBanner();
      if (tempoSlider) {
        tempoSlider.value = state.tempo;
        updateTempo();
      }
      renderProgression();
      updateChordEditor();
    });
  }

  if (deleteProgressionBtn) {
    deleteProgressionBtn.addEventListener("click", () => {
      const saved = loadSavedProgressions();
      const names = Object.keys(saved);
      if (!names.length) {
        window.alert("No saved progressions to delete.");
        return;
      }
      const choice = window.prompt(`Delete which progression?\n${names.join(", ")}`);
      if (!choice || !saved[choice]) return;
      delete saved[choice];
      localStorage.setItem(SAVED_PROG_KEY, JSON.stringify(saved));
    });
  }

  if (presetOneChord) {
    presetOneChord.addEventListener("click", () => {
      applyPreset({
        tokens: ["I"],
        beats: 16,
        mode: "major"
      });
    });
  }

  if (presetBlues) {
    presetBlues.addEventListener("click", () => {
      const seq = ["I", "I", "I", "I", "IV", "IV", "I", "I", "V", "IV", "I", "V"];
      applyPreset({
        tokens: seq,
        beats: 4,
        mode: "major",
        exts: ["7"]
      });
    });
  }

  if (presetFamous) {
    presetFamous.addEventListener("click", () => {
      const presets = [
        ["I", "V", "vi", "IV"],
        ["vi", "IV", "I", "V"],
        ["I", "IV", "V", "IV"],
        ["i", "bVI", "bIII", "bVII"]
      ];
      const pick = presets[Math.floor(Math.random() * presets.length)];
      applyPreset({
        tokens: pick,
        beats: 4,
        mode: pick[0].includes("i") ? "minor" : "major"
      });
    });
  }

  if (presetIIVI) {
    presetIIVI.addEventListener("click", () => {
      applyPreset({
        tokens: ["ii", "V", "I"],
        beats: 4,
        mode: "major"
      });
    });
  }

  if (presetMinorLoop) {
    presetMinorLoop.addEventListener("click", () => {
      applyPreset({
        tokens: ["i", "bVI", "bIII", "bVII"],
        beats: 4,
        mode: "minor"
      });
    });
  }

  if (keyLockBtn) {
    keyLockBtn.addEventListener("click", () => {
      state.keyLocked = !state.keyLocked;
      keyLockBtn.setAttribute("aria-pressed", String(state.keyLocked));
      keyLockBtn.textContent = state.keyLocked ? "Locked" : "Lock";
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
    const targetItem = event.target.closest(".progression-item");
    if (targetItem) return;
    event.preventDefault();
    const item = normalizeProgression([JSON.parse(data)])[0];
    state.progression.push(item);
    state.selectedChord = state.progression.length - 1;
    updateChordEditor();
    renderProgression();
  });
  progressionEl.addEventListener("drop", (event) => {
    const data = event.dataTransfer.getData("application/json");
    if (!data) return;
    const item = normalizeProgression([JSON.parse(data)])[0];
    state.progression.push(item);
    state.selectedChord = state.progression.length - 1;
    updateChordEditor();
    renderProgression();
  });

  // chord slots are added by dragging chords into the progression

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
    randomizeInitialSetup();
    generateProgression();
  }

  if (instrumentSelect) instrumentSelect.value = state.sampleInstrument;
  if (guitarLevelSlider) guitarLevelSlider.value = Math.round(state.guitarLevel * 100);
  if (guitarLevelValue) guitarLevelValue.textContent = `${Math.round(state.guitarLevel * 100)}%`;
  if (drumStyleSelect) drumStyleSelect.value = state.drumStyle;
  if (bassToggle) bassToggle.checked = state.bassEnabled;
  if (bassRhythmSelect) bassRhythmSelect.value = state.bassRhythm;
  if (bassLevelSlider) bassLevelSlider.value = Math.round(state.bassLevel * 100);
  if (rhythmSelect) rhythmSelect.value = state.rhythm;
  if (textureSelect) textureSelect.value = state.texture;
  selectDrumPattern();
  applyInstrumentDefaults(false);
  if (state.guitarBusGain) {
    state.guitarBusGain.gain.value = state.guitarLevel;
  }
  if (state.bassBusGain) {
    state.bassBusGain.gain.value = state.bassLevel;
  }
  if (keyLockBtn) keyLockBtn.setAttribute("aria-pressed", String(state.keyLocked));

  refreshSavedProgressions();
  if (chordEditor) chordEditor.classList.add("hidden");
  updateKeyBanner();
  if (tempoSlider) updateTempo();
  collapseMobileDetails();
}

function collapseMobileDetails() {
  if (window.innerWidth > 900) return;
  document.querySelectorAll(".palette-drawer").forEach((details) => {
    details.removeAttribute("open");
  });
  document.querySelectorAll(".builder-details").forEach((details) => {
    details.removeAttribute("open");
  });
}

function randomizeInitialSetup() {
  if (keySelect) keySelect.value = "random";
  if (modeSelect) modeSelect.value = "random";
  if (styleSelect) styleSelect.value = "random";
  if (drumStyleSelect) drumStyleSelect.value = "random";
  if (genLength) genLength.value = "4";
  if (genRhythm) genRhythm.value = "steady";
  if (bassRhythmSelect) {
    const options = Array.from(bassRhythmSelect.options).map((opt) => opt.value);
    bassRhythmSelect.value = options[Math.floor(Math.random() * options.length)];
    state.bassRhythm = bassRhythmSelect.value;
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

function applyInstrumentDefaults(randomize = false) {
  if (state.sampleInstrument !== "guitar" && state.sampleInstrument !== "piano") return;
  state.texture = "pulse";
  if (randomize) {
    const options = ["rockStrum", "syncopated", "offbeat", "push", "tresillo"];
    state.rhythm = options[Math.floor(Math.random() * options.length)];
  } else if (state.sampleInstrument === "guitar") {
    state.rhythm = "rockStrum";
  }
  if (textureSelect) textureSelect.value = state.texture;
  if (rhythmSelect) rhythmSelect.value = state.rhythm;
}

function updateChordEditor() {
  if (!selectedChordLabel || !extensionButtons || !beatButtons) return;
  state.progression = normalizeProgression(state.progression);
  if (!state.progression.length) {
    selectedChordLabel.textContent = "Select a chord";
    extensionButtons.innerHTML = "";
    beatButtons.innerHTML = "";
    if (chordEditor) chordEditor.classList.add("hidden");
    return;
  }
  if (chordEditor && !state.editorPinned) chordEditor.classList.add("hidden");
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
  [1, 2, 3, 4, 6, 8, 16].forEach((beat) => {
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
  tempoLabel.textContent = `${state.tempo} bpm`;
  if (tempoLabelMobile) tempoLabelMobile.textContent = `${state.tempo} bpm`;
}

function updateKeyBanner() {
  if (!currentKey) return;
  const modeLabel = state.mode === "major" ? "Major" : "Minor";
  currentKey.textContent = `${state.key} ${modeLabel}`;
  if (keyBanner) {
    keyBanner.classList.remove("pulse");
    void keyBanner.offsetWidth;
    keyBanner.classList.add("pulse");
  }
  if (mobileKey) mobileKey.textContent = `Key: ${state.key} ${modeLabel}`;
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
  const chosenKey = state.keyLocked ? state.key : (keySelect?.value === "random" ? randomKey : keySelect?.value || randomKey);
  state.key = chosenKey;
  if (keySelect) keySelect.value = chosenKey;

  const modeOptions = ["major", "minor"];
  const chosenMode = modeSelect?.value === "random" ? modeOptions[Math.floor(Math.random() * modeOptions.length)] : modeSelect?.value || "major";
  state.mode = chosenMode;
  modeSelect.value = chosenMode;

  const styleOptions = ["clean", "neosoul", "jazz", "cinematic"];
  const chosenStyle = styleSelect?.value === "random" ? styleOptions[Math.floor(Math.random() * styleOptions.length)] : styleSelect?.value || "clean";
  setStyle(chosenStyle);
  applyInstrumentDefaults(true);

  const drumOptions = Object.keys(DRUM_PATTERN_BANK);
  const chosenDrum = drumStyleSelect?.value === "random" ? drumOptions[Math.floor(Math.random() * drumOptions.length)] : drumStyleSelect?.value || "pop";
  state.drumStyle = chosenDrum;
  if (drumStyleSelect) drumStyleSelect.value = chosenDrum;
  selectDrumPattern();

  const rhythmMap = {
    pulse: "quarters",
    drive: "eighths",
    syncopated: "syncopated",
    offbeat: "offbeat",
    push: "push",
    tresillo: "tresillo",
    habanera: "habanera",
    clave: "clave",
    sparse: "sparse"
  };
  if (rhythmMap[rhythm]) {
    state.rhythm = rhythmMap[rhythm];
    if (rhythmSelect) rhythmSelect.value = state.rhythm;
  } else if (rhythm === "steady") {
    state.rhythm = "whole";
    if (rhythmSelect) rhythmSelect.value = state.rhythm;
  }

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

  const tonic = state.mode === "major" ? "I" : "i";
  if (picks.length > 0) {
    if (Math.random() < 0.5) picks[0] = tonic;
    else picks[picks.length - 1] = tonic;
  }

  const items = picks.map((token) => {
    let beats = 4;
    if (rhythm === "mixed") {
      const options = [1, 2, 3, 4];
      beats = options[Math.floor(Math.random() * options.length)];
    } else if (rhythm === "short") {
      beats = Math.random() < 0.6 ? 1 : 2;
    } else if (rhythm === "long") {
      const options = [4, 6, 8];
      beats = options[Math.floor(Math.random() * options.length)];
    }
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
    const item = createChordItem(degrees[idx], 4);
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
      const item = createChordItem(degree, 4, null, [ext]);
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
    const item = createChordItem(pick.token, 4, pick.roman);
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
    const beatLabel = item.beats !== 1 ? `<div class="beats">${formatBeatLabel(item.beats)}</div>` : "";
    itemEl.innerHTML = `<span>${description.label}</span><strong>${description.name}</strong>${beatLabel}<button class="remove-chord" aria-label="Remove">×</button>`;
    itemEl.title = "Click to select";
    itemEl.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-chord")) return;
      state.selectedChord = idx;
      state.editorPinned = true;
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

document.addEventListener("click", (event) => {
  if (!chordEditor || !progressionEl) return;
  const clickedChord = event.target.closest(".progression-item");
  const clickedEditor = event.target.closest(".chord-editor");
  if (clickedChord || clickedEditor) return;
  state.editorPinned = false;
  chordEditor.classList.add("hidden");
});

function formatBeatLabel(beats) {
  const bars = beats / 4;
  if (Number.isInteger(bars)) {
    return `${beats} beats · ${bars} bar${bars === 1 ? "" : "s"}`;
  }
  return `${beats} beats · ${bars.toFixed(1)} bars`;
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
  const { degree } = parsed;
  let { accidental } = parsed;
  // In minor keys, VI and VII are already flat relative to major.
  // Treat bVI/bVII as diatonic VI/VII so we don't double-flat them.
  if (state.mode === "minor" && accidental === -1 && (degree === 5 || degree === 6)) {
    accidental = 0;
  }
  const root = noteAt(state.key, scale[degree] + accidental, shouldUseFlatsForToken(token));
  let quality = MODE_DATA[state.mode].qualities[degree];
  const normalized = token.replace(/[^IViv°]/g, "");
  if (normalized.includes("°")) {
    quality = "dim";
  } else if (/[iv]/.test(normalized) && !/[IV]/.test(normalized)) {
    quality = "min";
  } else if (/[IV]/.test(normalized) && !/[iv]/.test(normalized)) {
    quality = "maj";
  }
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
  if (exts.includes("maj7")) addSeventh(11);
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
  state.guitarBusGain = state.audioCtx.createGain();
  state.pianoBusGain = state.audioCtx.createGain();
  state.bassBusGain = state.audioCtx.createGain();
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

  // Instrument buses
  state.guitarBusGain.gain.value = 0.05;
  state.pianoBusGain.gain.value = 0.5;
  state.bassBusGain.gain.value = state.bassLevel;
  state.guitarBusGain.connect(state.masterFilter);
  state.pianoBusGain.connect(state.masterFilter);
  state.bassBusGain.connect(state.masterFilter);

  state.drumBus = state.audioCtx.createGain();
  state.drumBus.gain.value = 0.55;
  state.drumBus.connect(state.audioCtx.destination);

  state.noiseBuffer = state.audioCtx.createBuffer(1, state.audioCtx.sampleRate, state.audioCtx.sampleRate);
  const data = state.noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }

  loadSamples();
  loadDrumSamples();
}

function startPlayback() {
  if (state.isPlaying || state.progression.length === 0) return;
  if (!state.audioCtx) initAudio();

  state.isPlaying = true;
  state.isPaused = false;
  state.currentChord = 0;
  state.uiChord = 0;
  state.selectedChord = 0;
  state.lastDrumBar = null;
  updateChordEditor();
  state.fretMode = "chord";
  buildFretboard();
  if (!state.sessionTimerId) startSession();
  beginCountIn();
}

function pausePlayback() {
  if (!state.isPlaying || state.isPaused) return;
  state.isPaused = true;
  state.pauseStartTime = Date.now();
  if (state.isCountingIn) {
    clearCountIn();
    state.isCountingIn = false;
  }
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
  state.uiTimeouts.forEach((id) => clearTimeout(id));
  state.uiTimeouts = [];
  updatePlayButton();
}

function resumePlayback() {
  if (!state.isPlaying || !state.isPaused) return;
  state.isPaused = false;
  if (state.pauseStartTime) {
    state.pausedTotalMs += Date.now() - state.pauseStartTime;
    state.pauseStartTime = null;
  }
  beginCountIn();
}

function beginCountIn() {
  if (!state.audioCtx) return;
  clearCountIn();
  state.isCountingIn = true;
  const beat = 60 / state.tempo;
  const startTime = state.audioCtx.currentTime + 0.05;
  const beats = 4;

  if (countInEl) {
    Array.from(countInEl.querySelectorAll("span")).forEach((span) => span.classList.remove("active"));
  }

  // count-in drums for one bar
  scheduleDrums(startTime, beats);

  for (let i = 0; i < beats; i += 1) {
    const delay = (startTime - state.audioCtx.currentTime + i * beat) * 1000;
    const timeout = setTimeout(() => {
      if (!countInEl) return;
      const spans = Array.from(countInEl.querySelectorAll("span"));
      spans.forEach((span) => span.classList.remove("active"));
      const active = countInEl.querySelector(`span[data-count="${i + 1}"]`);
      if (active) active.classList.add("active");
    }, Math.max(0, delay));
    state.countInTimeouts.push(timeout);
  }

  const afterCountIn = setTimeout(() => {
    if (!state.isPlaying || state.isPaused) return;
    state.isCountingIn = false;
    if (countInEl) {
      Array.from(countInEl.querySelectorAll("span")).forEach((span) => span.classList.remove("active"));
    }
    state.nextTime = startTime + beats * beat;
    state.lastDrumBar = null;
    state.lastCountBar = null;
    const firstItem = state.progression[0];
    if (firstItem) updateNowPlaying(firstItem, chordFromItem(firstItem), 0);
    state.timerId = setInterval(schedulePlayback, 25);
    updatePlayButton();
  }, (startTime - state.audioCtx.currentTime + beats * beat) * 1000);

  state.countInTimeouts.push(afterCountIn);
  updatePlayButton();
}

function clearCountIn() {
  state.countInTimeouts.forEach((id) => clearTimeout(id));
  state.countInTimeouts = [];
  if (countInEl) {
    Array.from(countInEl.querySelectorAll("span")).forEach((span) => span.classList.remove("active"));
  }
}

function togglePlayback() {
  if (!state.isPlaying) {
    startPlayback();
    return;
  }
  if (state.isPaused) resumePlayback();
  else pausePlayback();
}

function updatePlayButton() {
  if (!playBtn) return;
  if (!state.isPlaying) {
    playBtn.textContent = "Play";
    if (mobilePlay) mobilePlay.textContent = "Play";
    return;
  }
  if (state.isCountingIn && !state.isPaused) {
    playBtn.textContent = "Count-in…";
    if (mobilePlay) mobilePlay.textContent = "Count-in…";
  } else {
    playBtn.textContent = state.isPaused ? "Play" : "Pause";
    if (mobilePlay) mobilePlay.textContent = state.isPaused ? "Play" : "Pause";
  }
}

function schedulePlayback() {
  if (!state.isPlaying || !state.audioCtx) return;
  const lookAhead = 0.15;
  const beat = 60 / state.tempo;
  const barLength = beat * 4;
  while (state.nextTime < state.audioCtx.currentTime + lookAhead) {
    const index = state.currentChord;
    const item = state.progression[index];
    const chord = chordFromItem(item);
    scheduleChord(item, chord, state.nextTime, index, item.beats);
    const duration = (60 / state.tempo) * item.beats;
    if (state.drumsEnabled) {
      const startBar = Math.floor(state.nextTime / barLength);
      const endBar = Math.floor((state.nextTime + duration - 0.001) / barLength);
      for (let barIndex = startBar; barIndex <= endBar; barIndex += 1) {
        if (state.lastDrumBar === barIndex) continue;
        const barTime = barIndex * barLength;
        const fill = (barIndex + 1) % 8 === 0;
        scheduleDrums(barTime, 4, fill);
        state.lastDrumBar = barIndex;
      }
    }
    const startBar = Math.floor(state.nextTime / barLength);
    const endBar = Math.floor((state.nextTime + duration - 0.001) / barLength);
    for (let barIndex = startBar; barIndex <= endBar; barIndex += 1) {
      if (state.lastCountBar === barIndex) continue;
      const barTime = barIndex * barLength;
      scheduleBeatCount(barTime, beat);
      state.lastCountBar = barIndex;
    }
    state.nextTime += duration;
    state.currentChord = (state.currentChord + 1) % state.progression.length;
  }
}

function scheduleBeatCount(barTime, beat) {
  if (!countInEl) return;
  for (let i = 0; i < 4; i += 1) {
    const delay = (barTime - state.audioCtx.currentTime + i * beat) * 1000;
    const timeout = setTimeout(() => {
      const spans = Array.from(countInEl.querySelectorAll("span"));
      spans.forEach((span) => span.classList.remove("active"));
      const active = countInEl.querySelector(`span[data-count="${i + 1}"]`);
      if (active) active.classList.add("active");
    }, Math.max(0, delay));
    state.countInTimeouts.push(timeout);
  }
}

function scheduleChord(item, chord, time, index, beats) {
  const { root, intervals } = chord;
  const baseMidi = noteToMidi(root, 3);
  const baseNotes = intervals.map((interval) => baseMidi + interval);
  const notes = getVoiceLedNotes(baseNotes);
  const duration = (60 / state.tempo) * beats;
  const rhythm = getChordRhythm(beats);
  rhythm.forEach((beat) => {
    const hitTime = time + (60 / state.tempo) * beat;
    if (state.texture === "arp") {
      notes.forEach((midi, idx) => playNote(midi, hitTime + idx * 0.08, duration * 0.6));
    } else if (state.texture === "pulse") {
      const isUpstroke = Math.random() < 0.4;
      const offset = isUpstroke ? -0.02 : 0;
      notes.forEach((midi) => playNote(midi, hitTime + offset, duration * 0.35));
    } else {
      notes.forEach((midi, idx) => playNote(midi, hitTime + idx * 0.02, duration * 0.7));
    }
  });

  scheduleUiUpdate(item, chord, time, index);
  if (state.bassEnabled) {
    const beat = 60 / state.tempo;
    const barTime = Math.floor(time / (beat * 4)) * (beat * 4);
    scheduleBass(root, barTime);
  }
}

function getVoiceLedNotes(baseNotes) {
  if (!state.lastVoicing || state.lastVoicing.length !== baseNotes.length) {
    state.lastVoicing = baseNotes.slice();
    return baseNotes;
  }
  const prev = state.lastVoicing.slice().sort((a, b) => a - b);
  const target = baseNotes.slice().sort((a, b) => a - b);
  const voiced = target.map((note, idx) => {
    const prevNote = prev[idx] ?? prev[prev.length - 1];
    const candidates = [note - 12, note, note + 12];
    let best = candidates[0];
    let bestDist = Math.abs(prevNote - best);
    candidates.forEach((cand) => {
      const dist = Math.abs(prevNote - cand);
      if (dist < bestDist) {
        best = cand;
        bestDist = dist;
      }
    });
    return best;
  });

  // keep voicings in a comfortable mid range
  const minNote = Math.min(...voiced);
  const maxNote = Math.max(...voiced);
  let adjusted = voiced.slice();
  if (minNote < 48) adjusted = adjusted.map((n) => n + 12);
  if (maxNote > 80) adjusted = adjusted.map((n) => n - 12);

  state.lastVoicing = adjusted.slice().sort((a, b) => a - b);
  return adjusted;
}

function getChordRhythm(beats) {
  const base = (RHYTHMS[state.rhythm] || RHYTHMS.whole).filter((step) => step < beats);
  if (base.length <= 1) return base;
  const pattern = base.slice();
  if (Math.random() < 0.35) {
    const dropIndex = Math.floor(Math.random() * (pattern.length - 1)) + 1;
    pattern.splice(dropIndex, 1);
  }
  if (Math.random() < 0.25) {
    const target = pattern[Math.floor(Math.random() * pattern.length)];
    const extra = target + 0.25;
    if (extra < beats && !pattern.includes(extra)) pattern.push(extra);
  }
  pattern.sort((a, b) => a - b);
  return pattern;
}

function scheduleBass(root, time) {
  const beat = 60 / state.tempo;
  const baseMidi = noteToMidi(root, 2);
  const rhythm = BASS_RHYTHMS[state.bassRhythm] || BASS_RHYTHMS.steady;
  rhythm.forEach((step) => {
    const hitTime = time + step * beat;
    const dur = state.bassRhythm === "eighths" ? beat * 0.45 : beat * 0.85;
    playBassNote(baseMidi, hitTime, dur);
  });
}

function playBassNote(midi, time, duration) {
  if (!state.audioCtx || !state.bassBusGain) return;
  const osc = state.audioCtx.createOscillator();
  const osc2 = state.audioCtx.createOscillator();
  const filter = state.audioCtx.createBiquadFilter();
  const gain = state.audioCtx.createGain();
  const freq = midiToFrequency(midi);
  osc.type = "sawtooth";
  osc2.type = "triangle";
  osc.frequency.value = freq;
  osc2.frequency.value = freq * 0.5;
  filter.type = "lowpass";
  filter.frequency.value = 180;
  filter.Q.value = 0.7;

  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.6, time + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

  osc.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(state.bassBusGain);

  osc.start(time);
  osc2.start(time);
  osc.stop(time + duration + 0.05);
  osc2.stop(time + duration + 0.05);
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
  if (state.samplesLoaded) {
    playSample(midi, time, duration);
    return;
  }
  if (!state.synthEnabled) return;
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
  gain.connect(state.audioCtx.destination);
  oscA.start(time);
  oscB.start(time);
  oscC.start(time);
  oscA.stop(time + sustain + 0.3);
  oscB.stop(time + sustain + 0.3);
  oscC.stop(time + sustain + 0.3);
}

function loadSamples() {
  if (state.samplesLoading || !state.audioCtx) return;
  const sampleSet = SAMPLE_LIBRARY[state.sampleInstrument] || SAMPLE_LIBRARY.piano;
  state.samplesLoading = Promise.allSettled(
    sampleSet.map(async (sample) => {
      const response = await fetch(sample.url);
      if (!response.ok) throw new Error(`Fetch failed: ${sample.url}`);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await state.audioCtx.decodeAudioData(arrayBuffer);
      state.sampleBuffers[sample.midi] = buffer;
    })
  ).then((results) => {
    const failures = results.filter((result) => result.status === "rejected");
    state.samplesLoaded = failures.length === 0 && Object.keys(state.sampleBuffers).length > 0;
  });
}

function reloadSamples() {
  state.sampleBuffers = {};
  state.samplesLoaded = false;
  state.samplesLoading = null;
  loadSamples();
}

function selectDrumPattern() {
  const patterns = DRUM_PATTERN_BANK[state.drumStyle] || DRUM_PATTERN_BANK.pop;
  if (patterns.length <= 1) {
    state.drumPattern = patterns[0];
    return;
  }
  let next = patterns[Math.floor(Math.random() * patterns.length)];
  if (state.drumPattern) {
    for (let i = 0; i < 4 && next === state.drumPattern; i += 1) {
      next = patterns[Math.floor(Math.random() * patterns.length)];
    }
  }
  state.drumPattern = next;
}

function loadDrumSamples() {
  if (state.drumSamplesLoading || !state.audioCtx) return;
  const kits = Object.values(DRUM_KITS);
  const urls = Array.from(new Set(kits.flatMap((kit) => Object.values(kit))));
  state.drumSamplesLoading = Promise.allSettled(
    urls.map(async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Fetch failed: ${url}`);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await state.audioCtx.decodeAudioData(arrayBuffer);
      state.drumSampleBuffers[url] = buffer;
    })
  ).then((results) => {
    const failures = results.filter((result) => result.status === "rejected");
    state.drumSamplesLoaded = failures.length === 0 && Object.keys(state.drumSampleBuffers).length > 0;
  });
}

function playDrumSample(url, time, gainValue = 0.9) {
  const buffer = state.drumSampleBuffers[url];
  if (!buffer) return false;
  const source = state.audioCtx.createBufferSource();
  const gain = state.audioCtx.createGain();
  source.buffer = buffer;
  source.connect(gain);
  gain.gain.setValueAtTime(gainValue, time);
  gain.connect(state.drumBus);
  source.start(time);
  source.stop(time + Math.min(1.5, buffer.duration));
  return true;
}

function playSample(midi, time, duration) {
  const entries = Object.keys(state.sampleBuffers).map((key) => parseInt(key, 10)).filter((value) => !Number.isNaN(value));
  if (entries.length === 0) {
    state.samplesLoaded = false;
    return;
  }
  let nearest = entries[0];
  let bestDelta = Math.abs(midi - nearest);
  entries.forEach((value) => {
    const delta = Math.abs(midi - value);
    if (delta < bestDelta) {
      bestDelta = delta;
      nearest = value;
    }
  });

  const buffer = state.sampleBuffers[nearest];
  if (!buffer) return;

  const source = state.audioCtx.createBufferSource();
  const envGain = state.audioCtx.createGain();
  source.buffer = buffer;
  source.playbackRate.value = Math.pow(2, (midi - nearest) / 12);
  source.connect(envGain);

  if (state.sampleInstrument === "guitar") {
    const shaper = state.audioCtx.createWaveShaper();
    shaper.curve = createDriveCurve(6);
    shaper.oversample = "4x";
    const filter = state.audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 3800;
    const high = state.audioCtx.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = 120;
    envGain.connect(shaper);
    shaper.connect(filter);
    filter.connect(high);
    high.connect(state.guitarBusGain || state.masterFilter);
  } else {
    envGain.connect(state.pianoBusGain || state.masterFilter);
  }

  const hold = state.noteHold || 1;
  const sustain = duration * hold;
  const maxDuration = buffer.duration / source.playbackRate.value;
  const stopTime = time + Math.min(sustain + 0.1, maxDuration);

  if (state.sampleInstrument === "guitar" && state.guitarBusGain) {
    state.guitarBusGain.gain.setValueAtTime(state.guitarLevel, time);
  }
  envGain.gain.setValueAtTime(0, time);
  envGain.gain.linearRampToValueAtTime(1.0, time + 0.005);
  envGain.gain.linearRampToValueAtTime(0, stopTime);

  const offset = (state.sampleOffsetMs || 0) / 1000;
  const trim = Math.max(0, (state.sampleTrimMs || 0) / 1000);
  const startTime = Math.max(time + offset, state.audioCtx.currentTime + 0.002);
  const safeStop = Math.max(stopTime + offset, startTime + 0.05);
  const maxTrim = Math.max(0, buffer.duration - 0.05);
  const safeTrim = Math.min(trim, maxTrim);
  source.start(startTime, safeTrim);
  source.stop(safeStop);
}

function createDriveCurve(amount) {
  const samples = 44100;
  const curve = new Float32Array(samples);
  const k = amount * 20;
  for (let i = 0; i < samples; i += 1) {
    const x = (i * 2) / samples - 1;
    curve[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
  }
  return curve;
}

function scheduleDrums(barTime, beats = 4, fill = false) {
  if (!state.audioCtx || !state.drumBus || !state.drumsEnabled) return;
  const pattern = state.drumPattern || (DRUM_PATTERN_BANK[state.drumStyle] || DRUM_PATTERN_BANK.pop)[0];
  const sound = DRUM_SOUNDS[state.drumStyle] || DRUM_SOUNDS.pop;
  const beat = 60 / state.tempo;
  const kitName = DRUM_STYLE_KIT[state.drumStyle] || "pearl";
  const kit = DRUM_KITS[kitName];
  const useSamples = state.drumSamplesLoaded && kit;
  const barStart = barTime;

  pattern.kick.filter((step) => step < beats).forEach((step) => {
    const hitTime = barStart + step * beat;
    if (!(useSamples && playDrumSample(kit.kick, hitTime, 0.9))) playKick(hitTime, sound);
  });

  const fillSnare = fill ? [1.5, 2, 2.5, 3, 3.5] : [];
  const snareSteps = Array.from(new Set([1, 3, ...(pattern.snare || []), ...fillSnare])).filter((step) => step < beats);
  snareSteps.forEach((step) => {
    const hitTime = barStart + step * beat;
    const snareUrl = kit?.snareB && Math.random() < 0.35 ? kit.snareB : kit?.snareA;
    if (!(useSamples && snareUrl && playDrumSample(snareUrl, hitTime, 0.75))) playSnare(hitTime, sound);
  });

  pattern.hat.filter((step) => step < beats).forEach((step) => {
    const hitTime = barStart + step * beat;
    if (!(useSamples && kit?.hatClosed && playDrumSample(kit.hatClosed, hitTime, 0.35))) playHat(hitTime, sound);
  });

  if (pattern.hatOpen) {
    pattern.hatOpen.filter((step) => step < beats).forEach((step) => {
      const hitTime = barStart + step * beat;
      if (useSamples && kit?.hatOpen) playDrumSample(kit.hatOpen, hitTime, 0.5);
    });
  }

  if (pattern.perc) {
    const percUrl = kit?.perc || kit?.cowbell || kit?.rim || kit?.tamb;
    pattern.perc.filter((step) => step < beats).forEach((step) => {
      const hitTime = barStart + step * beat;
      if (useSamples && percUrl) playDrumSample(percUrl, hitTime, 0.5);
    });
  }
}

function playKick(time, sound) {
  const osc = state.audioCtx.createOscillator();
  const gain = state.audioCtx.createGain();
  osc.type = "sine";
  const base = (sound?.kick || 110) * (1 + (Math.random() - 0.5) * 0.02);
  osc.frequency.setValueAtTime(base, time);
  osc.frequency.exponentialRampToValueAtTime(Math.max(40, base * 0.45), time + 0.18);
  gain.gain.setValueAtTime(0.85, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
  osc.connect(gain).connect(state.drumBus);
  osc.start(time);
  osc.stop(time + 0.3);
}

function playSnare(time, sound) {
  const noise = state.audioCtx.createBufferSource();
  noise.buffer = state.noiseBuffer;
  const filter = state.audioCtx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = sound?.snareTone || 1800;
  const tone = state.audioCtx.createOscillator();
  const toneGain = state.audioCtx.createGain();
  tone.type = "triangle";
  tone.frequency.value = 200;
  const gain = state.audioCtx.createGain();
  gain.gain.setValueAtTime(0.35, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
  noise.connect(filter).connect(gain).connect(state.drumBus);
  tone.connect(toneGain).connect(state.drumBus);
  toneGain.gain.setValueAtTime(0.12, time);
  toneGain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
  noise.start(time);
  noise.stop(time + 0.2);
  tone.start(time);
  tone.stop(time + 0.16);
}

function playHat(time, sound) {
  const noise = state.audioCtx.createBufferSource();
  noise.buffer = state.noiseBuffer;
  const filter = state.audioCtx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = sound?.hatTone || 6000;
  const gain = state.audioCtx.createGain();
  gain.gain.setValueAtTime(0.16, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + (sound?.hatDecay || 0.08));
  noise.connect(filter).connect(gain).connect(state.drumBus);
  noise.start(time);
  noise.stop(time + (sound?.hatDecay || 0.08) + 0.02);
}

function scheduleUiUpdate(item, chord, time, index) {
  const delay = Math.max(0, (time - state.audioCtx.currentTime) * 1000);
  const timeout = setTimeout(() => {
    updateNowPlaying(item, chord, index);
  }, delay);
  state.uiTimeouts.push(timeout);
}

function downloadMidi() {
  if (!state.progression.length) return;
  const midiData = buildMidiFile();
  const blob = new Blob([midiData], { type: "audio/midi" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `gpl-progression-${state.key}-${state.mode}.mid`.replace(/\s+/g, "-").toLowerCase();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function buildMidiFile() {
  const ticksPerBeat = 480;
  const tempo = state.tempo || 100;
  const tempoUs = Math.round(60000000 / tempo);
  const rhythm = RHYTHMS[state.rhythm] || RHYTHMS.whole;

  const events = [];
  let currentBeat = 0;

  state.progression.forEach((item) => {
    const chord = chordFromItem(item);
    const baseMidi = noteToMidi(chord.root, 3);
    const notes = chord.intervals.map((interval) => baseMidi + interval);
    const beats = item.beats || 4;
    rhythm.filter((beat) => beat < beats).forEach((beat) => {
      const hitBeat = currentBeat + beat;
      const noteLen = Math.max(0.35, Math.min(0.9, beats - beat));
      const offBeat = hitBeat + noteLen;
      notes.forEach((note) => {
        events.push({ tick: Math.round(hitBeat * ticksPerBeat), type: "on", note, vel: 90 });
        events.push({ tick: Math.round(offBeat * ticksPerBeat), type: "off", note, vel: 0 });
      });
    });
    currentBeat += beats;
  });

  events.sort((a, b) => {
    if (a.tick !== b.tick) return a.tick - b.tick;
    if (a.type === b.type) return 0;
    return a.type === "off" ? -1 : 1;
  });

  const track = [];
  // Tempo meta event
  track.push(...writeVarLen(0), 0xff, 0x51, 0x03, (tempoUs >> 16) & 0xff, (tempoUs >> 8) & 0xff, tempoUs & 0xff);

  let lastTick = 0;
  events.forEach((event) => {
    const delta = event.tick - lastTick;
    lastTick = event.tick;
    track.push(...writeVarLen(delta));
    if (event.type === "on") {
      track.push(0x90, event.note & 0x7f, event.vel & 0x7f);
    } else {
      track.push(0x80, event.note & 0x7f, 0x00);
    }
  });

  // End of track
  track.push(...writeVarLen(0), 0xff, 0x2f, 0x00);

  const header = [
    0x4d, 0x54, 0x68, 0x64,
    0x00, 0x00, 0x00, 0x06,
    0x00, 0x00,
    0x00, 0x01,
    (ticksPerBeat >> 8) & 0xff,
    ticksPerBeat & 0xff
  ];

  const trackHeader = [
    0x4d, 0x54, 0x72, 0x6b,
    (track.length >> 24) & 0xff,
    (track.length >> 16) & 0xff,
    (track.length >> 8) & 0xff,
    track.length & 0xff
  ];

  return new Uint8Array([...header, ...trackHeader, ...track]);
}

function writeVarLen(value) {
  let buffer = value & 0x7f;
  const bytes = [];
  while ((value >>= 7)) {
    buffer <<= 8;
    buffer |= (value & 0x7f) | 0x80;
  }
  while (true) {
    bytes.push(buffer & 0xff);
    if (buffer & 0x80) buffer >>= 8;
    else break;
  }
  return bytes;
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
      const normalized = FLAT_EQUIV[note] || note;
      const cell = document.createElement("div");
      cell.className = "fret";
      cell.textContent = note;
      if (highlightSet.has(normalized)) cell.classList.add("active");
      if (overlaySet.has(normalized)) cell.classList.add("overlay");
      if (state.currentChordRoot) {
        const rootNorm = FLAT_EQUIV[state.currentChordRoot] || state.currentChordRoot;
        if (normalized === rootNorm) cell.classList.add("root");
      }
      fretboardGrid.appendChild(cell);
    }
  });
}

function getHighlightNotes() {
  const chordSet = state.currentChordNotes.size > 0 ? state.currentChordNotes : new Set();
  const normalize = (note) => FLAT_EQUIV[note] || note;
  const normalizedChord = new Set(Array.from(chordSet).map(normalize));
  if (state.fretMode === "scale") {
    if (!scaleSelect) return { highlightSet: chordSet, overlaySet: new Set() };
    const intervals = scales[scaleSelect.value];
    const overlaySet = new Set(intervals.map((interval) => normalize(noteAt(state.key, interval))));
    return { highlightSet: normalizedChord, overlaySet };
  }
  return { highlightSet: normalizedChord, overlaySet: new Set() };
}

function startSession() {
  if (state.sessionTimerId) return;
  state.sessionStartTime = Date.now();
  state.pausedTotalMs = 0;
  state.pauseStartTime = null;
  state.sessionLoggedMinutes = 0;
  bumpSessionCounters();
  state.sessionTimerId = setInterval(updateSessionTimer, 1000);
}

function updateSessionTimer() {
  if (!sessionTimer) return;
  const now = Date.now();
  const paused = state.pausedTotalMs + (state.isPaused && state.pauseStartTime ? now - state.pauseStartTime : 0);
  const elapsed = Math.floor((now - state.sessionStartTime - paused) / 1000);
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");
  sessionTimer.textContent = `${minutes}:${seconds}`;

  const elapsedMinutes = Math.floor(elapsed / 60);
  if (elapsedMinutes > state.sessionLoggedMinutes) {
    const diff = elapsedMinutes - state.sessionLoggedMinutes;
    state.sessionLoggedMinutes = elapsedMinutes;
    const data = JSON.parse(localStorage.getItem("fretflow_progress") || "{}");
    const totalMinutes = (data.totalMinutes || 0) + diff;
    const updated = { ...data, totalMinutes };
    localStorage.setItem("fretflow_progress", JSON.stringify(updated));
    if (totalMinutesEl) totalMinutesEl.textContent = totalMinutes;
    if (footerMinutes) footerMinutes.textContent = totalMinutes;
  }
}

function loadProgress() {
  const data = JSON.parse(localStorage.getItem("fretflow_progress") || "{}");
  if (totalMinutesEl) totalMinutesEl.textContent = data.totalMinutes || 0;
  if (sessionsLoggedEl) sessionsLoggedEl.textContent = data.sessions || 0;
  if (streakEl) streakEl.textContent = `${data.streak || 0} days`;
  if (footerMinutes) footerMinutes.textContent = data.totalMinutes || 0;
}

function loadSavedProgressions() {
  return JSON.parse(localStorage.getItem(SAVED_PROG_KEY) || "{}");
}

function refreshSavedProgressions() {}

function applyPreset({ tokens, beats = 4, mode = "major", exts = [] }) {
  const randomKey = NOTES[Math.floor(Math.random() * NOTES.length)];
  state.key = randomKey;
  state.mode = mode;
  if (keySelect) keySelect.value = randomKey;
  if (modeSelect) modeSelect.value = mode;
  updateKeyBanner();

  state.progression = tokens.map((token) => createChordItem(token, beats, null, exts));
  state.selectedChord = 0;
  updateChordEditor();
  renderProgression();
}

function bumpSessionCounters() {
  const data = JSON.parse(localStorage.getItem("fretflow_progress") || "{}");
  const today = new Date().toDateString();
  const lastDate = data.lastDate;
  let streak = data.streak || 0;
  if (lastDate !== today) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastDate === yesterday.toDateString()) streak += 1;
    else streak = 1;
  }

  const sessions = (data.sessions || 0) + 1;
  const updated = { ...data, sessions, streak, lastDate: today };
  localStorage.setItem("fretflow_progress", JSON.stringify(updated));
  loadProgress();
}

init();
