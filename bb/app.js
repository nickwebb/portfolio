const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const FLAT_NOTES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const FLAT_EQUIV = { "Db": "C#", "Eb": "D#", "Gb": "F#", "Ab": "G#", "Bb": "A#" };
const FRIENDLY_KEYS = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
const ENHARMONIC_DISPLAY_MAP = { "A#": "Bb", "D#": "Eb", "G#": "Ab" };
const MAJOR_SCALE = [0, 2, 4, 5, 7, 9, 11];
const MINOR_SCALE = [0, 2, 3, 5, 7, 8, 10];
const MODE_DATA = {
  major: {
    label: "Major",
    family: "major",
    scale: MAJOR_SCALE,
    tonic: "I",
    degrees: ["I", "ii", "iii", "IV", "V", "vi", "vii°"],
    qualities: ["maj", "min", "min", "maj", "maj", "min", "dim"]
  },
  minor: {
    label: "Minor",
    family: "minor",
    scale: MINOR_SCALE,
    tonic: "i",
    degrees: ["i", "ii°", "III", "iv", "v", "VI", "VII"],
    qualities: ["min", "dim", "maj", "min", "min", "maj", "maj"]
  },
  dorian: {
    label: "Dorian",
    family: "minor",
    scale: [0, 2, 3, 5, 7, 9, 10],
    tonic: "i",
    degrees: ["i", "ii", "bIII", "IV", "v", "vi°", "bVII"],
    qualities: ["min", "min", "maj", "maj", "min", "dim", "maj"]
  },
  mixolydian: {
    label: "Mixolydian",
    family: "major",
    scale: [0, 2, 4, 5, 7, 9, 10],
    tonic: "I",
    degrees: ["I", "ii", "iii°", "IV", "v", "vi", "bVII"],
    qualities: ["maj", "min", "dim", "maj", "min", "min", "maj"]
  },
  lydian: {
    label: "Lydian",
    family: "major",
    scale: [0, 2, 4, 6, 7, 9, 11],
    tonic: "I",
    degrees: ["I", "II", "iii", "#iv°", "V", "vi", "vii"],
    qualities: ["maj", "maj", "min", "dim", "maj", "min", "min"]
  },
  phrygian: {
    label: "Phrygian",
    family: "minor",
    scale: [0, 1, 3, 5, 7, 8, 10],
    tonic: "i",
    degrees: ["i", "bII", "bIII", "iv", "v°", "bVI", "bvii"],
    qualities: ["min", "maj", "maj", "min", "dim", "maj", "min"]
  }
};

const BASIC_MODE_OPTIONS = ["major", "minor"];

function getModeConfig(mode) {
  return MODE_DATA[mode] || MODE_DATA.major;
}

function getModeScale(mode) {
  return getModeConfig(mode).scale || MAJOR_SCALE;
}

function getModeFamily(mode) {
  return getModeConfig(mode).family || "major";
}

function getModeTonicToken(mode) {
  return getModeConfig(mode).tonic || "I";
}

function normalizeMode(mode) {
  return MODE_DATA[mode] ? mode : "major";
}

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
const mobileRewind = document.getElementById("mobileRewind");
const mobileMidi = document.getElementById("mobileMidi");
const mobileKey = document.getElementById("mobileKey");
const diatonicChords = document.getElementById("diatonicChords");
const progressionAEl = document.getElementById("progressionA");
const progressionBEl = document.getElementById("progressionB");
const progressionSectionBEl = document.getElementById("progressionSectionB");
const progInput = document.getElementById("progInput");
const applyProg = document.getElementById("applyProg");
const clearProg = document.getElementById("clearProg");
const shuffleProg = document.getElementById("shuffleProg");
const playBtn = document.getElementById("playBtn");
const rewindBtn = document.getElementById("rewindBtn");
const styleSelect = document.getElementById("styleSelect");
const textureSelect = document.getElementById("textureSelect");
const sizeSelect = document.getElementById("sizeSelect");
const rhythmSelect = document.getElementById("rhythmSelect");
const drumToggle = document.getElementById("drumToggle");
const toneSlider = document.getElementById("toneSlider");
const holdSlider = document.getElementById("holdSlider");
const sampleOffsetSlider = document.getElementById("sampleOffset");
const pianoTimingValue = document.getElementById("pianoTimingValue");
const sampleTrimSlider = document.getElementById("sampleTrim");
const drumStyleSelect = document.getElementById("drumStyleSelect");
const instrumentSelect = document.getElementById("instrumentSelect");
const realisticGuitarToggle = document.getElementById("realisticGuitarToggle");
const pianoLevelSlider = document.getElementById("pianoLevel");
const pianoLevelValue = document.getElementById("pianoLevelValue");
const guitarLevelSlider = document.getElementById("guitarLevel");
const guitarLevelValue = document.getElementById("guitarLevelValue");
const bassToggle = document.getElementById("bassToggle");
const bassLevelSlider = document.getElementById("bassLevel");
const bassTimingSlider = document.getElementById("bassTiming");
const bassTimingValue = document.getElementById("bassTimingValue");
const drumLevelSlider = document.getElementById("drumLevel");
const autoAlignSamplesBtn = document.getElementById("autoAlignSamples");
const resetSlidersBtn = document.getElementById("resetSliders");
const runLatencyTestBtn = document.getElementById("runLatencyTest");
const latencyResult = document.getElementById("latencyResult");

const SAMPLE_ALIGN_KEY = "gpl_sample_align";
const UI_PREFS_KEY = "btg_ui_prefs";
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
const scaleOnlyToggle = document.getElementById("scaleOnlyToggle");
const keyboardToggle = document.getElementById("keyboardToggle");
const fretboardMarkers = document.getElementById("fretboardMarkers");
const fretboardGrid = document.getElementById("fretboardGrid");
const keyboardWrap = document.getElementById("keyboardWrap");
const keyboardGrid = document.getElementById("keyboardGrid");

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
const beatButtons = document.getElementById("beatButtons");
const chordEditor = document.querySelector(".chord-editor");
const chordPopup = document.getElementById("chordPopup");
const chordPopupTitle = document.getElementById("chordPopupTitle");
const chordPopupToken = document.getElementById("chordPopupToken");
const chordPopupApply = document.getElementById("chordPopupApply");
const chordPopupDelete = document.getElementById("chordPopupDelete");
const chordPopupClose = document.getElementById("chordPopupClose");
const chordPopupBeats = document.getElementById("chordPopupBeats");
// chord slots are added by dragging chords into the progression
const footerMinutes = document.getElementById("footerMinutes");
const resetMinutes = document.getElementById("resetMinutes");
const currentKey = document.getElementById("currentKey");
const keyBanner = document.querySelector(".key-banner");
const keyPill = document.getElementById("keyPill");
const formChip = document.getElementById("formChip");
const formEditor = document.getElementById("formEditor");
const formARepeats = document.getElementById("formARepeats");
const formBRepeats = document.getElementById("formBRepeats");
const formHasB = document.getElementById("formHasB");
const keyPicker = document.getElementById("keyPicker");
const keyPickerNotes = document.getElementById("keyPickerNotes");
const refreshProgressionBtn = document.getElementById("refreshProgression");
const downloadMidiBtn = document.getElementById("downloadMidi");
const keyLockBtn = document.getElementById("keyLockBtn");
const countInEl = document.getElementById("countIn");
const currentRhythm = document.getElementById("currentRhythm");
const rhythmChip = document.getElementById("rhythmChip");
const rhythmEditor = document.getElementById("rhythmEditor");
const rhythmQuick = document.getElementById("rhythmQuick");
const saveProgressionBtn = document.getElementById("saveProgression");
const loadProgressionBtn = document.getElementById("loadProgression");
const deleteProgressionBtn = document.getElementById("deleteProgression");
const presetOneChord = document.getElementById("presetOneChord");
const presetBlues = document.getElementById("presetBlues");
const presetFamous = document.getElementById("presetFamous");
const presetIIVI = document.getElementById("presetIIVI");
const presetIIVIMinor = document.getElementById("presetIIVIMinor");
const presetAxisInverse = document.getElementById("presetAxisInverse");
const presetPopLift = document.getElementById("presetPopLift");
const presetAeolianRock = document.getElementById("presetAeolianRock");
const presetMinorCadence = document.getElementById("presetMinorCadence");
const presetClassicRock = document.getElementById("presetClassicRock");
const presetAndalusian = document.getElementById("presetAndalusian");
const presetDorianVamp = document.getElementById("presetDorianVamp");
const presetRow = document.getElementById("presetRow");
const presetPrev = document.getElementById("presetPrev");
const presetNext = document.getElementById("presetNext");
const editSectionABtn = document.getElementById("editSectionA");
const addBSectionBtn = document.getElementById("addBSection");
const editSectionBBtn = document.getElementById("editSectionB");
const aRepeatsSelect = document.getElementById("aRepeats");
const bRepeatsSelect = document.getElementById("bRepeats");

const scrollButtons = document.querySelectorAll("[data-scroll]");

function setFretboardVisibility(show) {
  if (fretboardGrid) fretboardGrid.classList.toggle("hidden", !show);
  if (fretboardMarkers) fretboardMarkers.classList.toggle("hidden", !show);
}

function setKeyboardVisibility(show) {
  if (keyboardWrap) keyboardWrap.classList.toggle("hidden", !show);
}

function loadUiPrefs() {
  try {
    return JSON.parse(localStorage.getItem(UI_PREFS_KEY) || "{}");
  } catch (error) {
    return {};
  }
}

function saveUiPrefs(partial = {}) {
  const existing = loadUiPrefs();
  const next = { ...existing, ...partial };
  localStorage.setItem(UI_PREFS_KEY, JSON.stringify(next));
}

function normalizeKeyDisplay(note) {
  return ENHARMONIC_DISPLAY_MAP[note] || note;
}

function displayNoteForKey(note, key = state.key) {
  const normalized = FLAT_EQUIV[note] || note;
  const idx = NOTES.indexOf(normalized);
  if (idx < 0) return normalizeKeyDisplay(note);
  return shouldPreferFlats(key) ? FLAT_NOTES[idx] : NOTES[idx];
}

function getRandomKeyName() {
  return FRIENDLY_KEYS[Math.floor(Math.random() * FRIENDLY_KEYS.length)];
}

function updateKeyLockButton() {
  if (!keyLockBtn) return;
  keyLockBtn.setAttribute("aria-pressed", String(state.keyLocked));
  if (state.keyLocked) {
    keyLockBtn.setAttribute("aria-label", "Key locked. Click to unlock key");
    keyLockBtn.setAttribute("title", "Key locked");
  } else {
    keyLockBtn.setAttribute("aria-label", "Key unlocked. Click to lock key");
    keyLockBtn.setAttribute("title", "Key unlocked");
  }
}

const state = {
  progression: [],
  sectionA: [],
  sectionB: [],
  hasBSection: false,
  activeSection: "A",
  playingSection: "A",
  activeDrumSection: "A",
  aRepeats: 2,
  bRepeats: 2,
  playbackSequence: [],
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
  masterCompressor: null,
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
  nextDrumTime: 0,
  timerId: null,
  drumBarCount: 0,
  lastCountBar: null,
  beatCounterRaf: null,
  beatCounterStartTime: null,
  beatCounterLastStep: -1,
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
  sampleOffsetMs: -7,
  sampleTrimMs: 280,
  sampleOnsetMs: {},
  synthEnabled: false,
  sampleInstrument: "piano",
  pianoLevel: 0.55,
  guitarLevel: 0.17,
  realisticGuitar: true,
  drumLevel: 0.6,
  bassLevel: 1,
  bassOffsetMs: -6,
  drumPattern: null,
  drumSampleBuffers: {},
  drumSamplesLoaded: false,
  drumSamplesLoading: null,
  keyLocked: false,
  isCountingIn: false,
  countInTimeouts: [],
  sampleStatusTimeout: null,
  isLoading: false,
  lastAutoScrollSection: null,
  selectionDirtyForPlayback: false,
  latencyProbe: null,
  latencyProbeReady: false,
  latencyProbeGain: null,
  latencyTest: {
    active: false,
    events: [],
    index: 0,
    results: []
  }
};

const SAVED_PROG_KEY = "gpl_saved_progressions";
const LAST_SESSION_KEY = "bb_last_session";
const LATENCY_COMP_KEY = "gpl_latency_comp";
const DEBUG_AUDIO = true;
const LOG_SAMPLE_MISS = true;
let isMobileLayout = window.innerWidth <= 900;
let sessionSaveTimer = null;

function scheduleSessionSave() {
  if (sessionSaveTimer) clearTimeout(sessionSaveTimer);
  sessionSaveTimer = setTimeout(saveLastSession, 120);
}

function serializeProgression(list = []) {
  return normalizeProgression(list).map((item) => ({
    token: item.token,
    beats: item.beats,
    roman: item.roman || null,
    exts: Array.isArray(item.exts) ? item.exts.slice() : []
  }));
}

function saveLastSession() {
  try {
    const payload = {
      version: 1,
      key: state.key,
      mode: state.mode,
      tempo: state.tempo,
      style: state.style,
      texture: state.texture,
      rhythm: state.rhythm,
      drumStyle: state.drumStyle,
      bassRhythm: state.bassRhythm,
      keyLocked: !!state.keyLocked,
      aRepeats: state.aRepeats,
      bRepeats: state.bRepeats,
      hasBSection: !!state.hasBSection,
      activeSection: state.activeSection,
      selectedChord: state.selectedChord,
      sectionA: serializeProgression(state.sectionA),
      sectionB: serializeProgression(state.sectionB),
      progression: serializeProgression(state.progression)
    };
    localStorage.setItem(LAST_SESSION_KEY, JSON.stringify(payload));
  } catch (error) {
    // best-effort persistence
  }
}

function restoreLastSession() {
  try {
    const raw = localStorage.getItem(LAST_SESSION_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data || typeof data !== "object") return false;

    state.key = normalizeKeyDisplay(data.key || state.key);
    state.mode = normalizeMode(data.mode || state.mode);
    state.tempo = Number.isFinite(data.tempo) ? Math.max(50, Math.min(200, Math.round(data.tempo))) : state.tempo;
    state.style = data.style || state.style;
    state.texture = data.texture || state.texture;
    state.rhythm = data.rhythm || state.rhythm;
    state.drumStyle = data.drumStyle || state.drumStyle;
    state.bassRhythm = data.bassRhythm || state.bassRhythm;
    state.keyLocked = !!data.keyLocked;
    state.aRepeats = Math.max(1, Math.min(16, Number(data.aRepeats) || state.aRepeats || 2));
    state.bRepeats = Math.max(1, Math.min(16, Number(data.bRepeats) || state.bRepeats || 2));
    state.hasBSection = !!data.hasBSection;
    state.activeSection = data.activeSection === "B" ? "B" : "A";
    state.selectedChord = Math.max(0, Number(data.selectedChord) || 0);

    const sectionA = normalizeProgression(data.sectionA || data.progression || []);
    const sectionB = normalizeProgression(data.sectionB || []);
    if (!sectionA.length) return false;

    state.sectionA = sectionA;
    state.sectionB = state.hasBSection ? sectionB : [];
    if (state.activeSection === "B" && !state.sectionB.length) state.activeSection = "A";
    state.progression = state.activeSection === "B" ? getSectionProgression("B") : getSectionProgression("A");

    if (keySelect) keySelect.value = FLAT_EQUIV[state.key] || state.key;
    if (modeSelect) modeSelect.value = state.mode;
    if (tempoSlider) tempoSlider.value = String(state.tempo);
    if (styleSelect) styleSelect.value = state.style;
    if (textureSelect) textureSelect.value = state.texture;
    if (rhythmSelect) rhythmSelect.value = state.rhythm;
    if (drumStyleSelect) drumStyleSelect.value = state.drumStyle;
    if (bassRhythmSelect) bassRhythmSelect.value = state.bassRhythm;
    return true;
  } catch (error) {
    return false;
  }
}

const scales = {
  "Major": MAJOR_SCALE,
  "Natural Minor": MINOR_SCALE,
  "Dorian": [0, 2, 3, 5, 7, 9, 10],
  "Phrygian": [0, 1, 3, 5, 7, 8, 10],
  "Lydian": [0, 2, 4, 6, 7, 9, 11],
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
  answer: [0, 1.5, 2, 3.5],
  split: [0, 0.75, 2, 2.75],
  chop: [0.5, 1.5, 2.5, 3.5],
  push: [0, 1.75, 2.75, 3.5],
  tresillo: [0, 1.5, 3],
  habanera: [0, 1.5, 2, 3],
  clave: [0, 1.5, 2.5, 3],
  sparse: [0, 2.5],
  rockStrum: [0, 0.5, 1.5, 2, 2.5, 3.5]
};

const B_SECTION_RHYTHM_VARIANTS = {
  whole: "halves",
  halves: "quarters",
  quarters: "offbeat",
  eighths: "syncopated",
  rockStrum: "answer",
  syncopated: "answer",
  offbeat: "syncopated",
  answer: "offbeat",
  split: "answer",
  chop: "push",
  push: "syncopated",
  tresillo: "habanera",
  habanera: "tresillo",
  clave: "habanera",
  sparse: "halves"
};

const STYLE_SWING_BEATS = {
  clean: 0.018,
  neosoul: 0.045,
  jazz: 0.055,
  cinematic: 0.01
};

const STYLE_GROOVE_MS = {
  clean: { piano: 4, bass: 2, hats: 0 },
  neosoul: { piano: 10, bass: 8, hats: 4 },
  jazz: { piano: 6, bass: 10, hats: 6 },
  cinematic: { piano: 14, bass: 6, hats: 2 }
};

const EXTENSION_OPTIONS = ["6", "maj7", "7", "9", "11", "13", "sus4", "add9"];

const SAMPLE_LIBRARY = {
  piano: [
    { midi: 48, url: "bb/samples/Piano.pp.C3.wav" },
    { midi: 60, url: "bb/samples/Piano.pp.C4.wav" },
    { midi: 72, url: "bb/samples/Piano.pp.C5.wav" }
  ],
  guitar: [
    { midi: 48, url: "bb/samples/guitar/Guitar.C3.wav" },
    { midi: 60, url: "bb/samples/guitar/Guitar.C4.wav" },
    { midi: 72, url: "bb/samples/guitar/Guitar.C5.wav" }
  ],
  synth: [
    { midi: 60, url: "bb/samples/synth/pad.wav" }
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

// Weighted corpus of common song-like loops used by the generator.
// These are encoded as roman numerals so they transpose cleanly by key.
const SONG_CORPUS = {
  major: [
    { name: "Axis Pop", tokens: ["I", "V", "vi", "IV"], weight: 18, tags: ["famous", "pop"] },
    { name: "Sensitive Pop", tokens: ["vi", "IV", "I", "V"], weight: 13, tags: ["famous", "pop"] },
    { name: "Classic Cadence Pop", tokens: ["I", "IV", "V", "IV"], weight: 10, tags: ["pop", "rock"] },
    { name: "Singer Songwriter", tokens: ["I", "vi", "IV", "V"], weight: 9, tags: ["pop"] },
    { name: "50s Loop", tokens: ["I", "vi", "ii", "V"], weight: 9, tags: ["famous", "oldies"] },
    { name: "Plagal Pop", tokens: ["I", "V", "IV", "IV"], weight: 8, tags: ["pop"] },
    { name: "Gospel Lift", tokens: ["I", "iii", "IV", "V"], weight: 7, tags: ["gospel", "pop"] },
    { name: "Rock Lift", tokens: ["I", "bVII", "IV", "I"], weight: 9, tags: ["famous", "rock"] },
    { name: "Jangle Rock", tokens: ["I", "IV", "I", "V"], weight: 8, tags: ["rock"] },
    { name: "Soul Turnaround", tokens: ["I", "IV", "ii", "V"], weight: 7, tags: ["soul", "pop"] }
  ],
  minor: [
    { name: "Minor Axis", tokens: ["i", "bVI", "bIII", "bVII"], weight: 16, tags: ["famous", "pop"] },
    { name: "Minor Pop Climb", tokens: ["i", "bVII", "bVI", "bVII"], weight: 10, tags: ["pop", "rock"] },
    { name: "Minor Anthem", tokens: ["i", "bVI", "III", "VII"], weight: 9, tags: ["pop"] },
    { name: "Aeolian Rock", tokens: ["i", "VII", "VI", "VII"], weight: 8, tags: ["rock"] },
    { name: "Minor Cadence", tokens: ["i", "iv", "V", "i"], weight: 9, tags: ["famous", "minor"] },
    { name: "Dark Pop", tokens: ["i", "bII", "bVI", "V"], weight: 7, tags: ["pop"] },
    { name: "Neo Soul Minor", tokens: ["i", "iv", "bVII", "III"], weight: 7, tags: ["neosoul"] },
    { name: "Minor Hook Loop", tokens: ["i", "bIII", "bVII", "bVI"], weight: 8, tags: ["pop"] }
  ]
};

const DIATONIC_ROMANS = Object.fromEntries(
  Object.entries(MODE_DATA).map(([mode, cfg]) => {
    const tokens = new Set(cfg.degrees);
    if (mode === "minor") {
      // Accept common Aeolian aliases in user/corpus input.
      tokens.add("bIII");
      tokens.add("bVI");
      tokens.add("bVII");
    }
    return [mode, tokens];
  })
);

function isDiatonicRomanToken(token, mode = state.mode) {
  const parsed = romanToDegree(token);
  if (!parsed) return false;
  const normalizedMode = normalizeMode(mode);
  return DIATONIC_ROMANS[normalizedMode]?.has(token) || false;
}

function toDiatonicRomanToken(token, mode = state.mode) {
  if (isDiatonicRomanToken(token, mode)) {
    if (normalizeMode(mode) === "minor") {
      if (token === "bIII") return "III";
      if (token === "bVI") return "VI";
      if (token === "bVII") return "VII";
    }
    return token;
  }
  const parsed = romanToDegree(token);
  if (parsed) {
    const config = getModeConfig(mode);
    return config.degrees[parsed.degree] || getModeTonicToken(mode);
  }
  return getModeTonicToken(mode);
}

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
    kick: "bb/samples/drums/pearl/kick-01.wav",
    snareA: "bb/samples/drums/pearl/snare-01.wav",
    snareB: "bb/samples/drums/pearl/snare-02.wav",
    hatClosed: "bb/samples/drums/pearl/hihat-closed.wav",
    hatOpen: "bb/samples/drums/pearl/hihat-open.wav"
  },
  cr78: {
    kick: "bb/samples/drums/cr78/kick.wav",
    snareA: "bb/samples/drums/cr78/snare.wav",
    hatClosed: "bb/samples/drums/cr78/hihat.wav",
    hatOpen: "bb/samples/drums/cr78/hihat-metal.wav",
    perc: "bb/samples/drums/cr78/conga-l.wav",
    cowbell: "bb/samples/drums/cr78/cowbell.wav",
    rim: "bb/samples/drums/cr78/rim.wav",
    tamb: "bb/samples/drums/cr78/tamb-short.wav"
  },
  tr505: {
    kick: "bb/samples/drums/tr505/kick.wav",
    snareA: "bb/samples/drums/tr505/snare.wav",
    hatClosed: "bb/samples/drums/tr505/hat.wav",
    hatOpen: "bb/samples/drums/tr505/hat.wav",
    rim: "bb/samples/drums/tr505/rim.wav",
    tom: "bb/samples/drums/tr505/tom.wav"
  },
  tr909: {
    kick: "bb/samples/drums/tr909/kick.wav",
    snareA: "bb/samples/drums/tr909/snare.wav",
    hatClosed: "bb/samples/drums/tr909/hat.wav",
    hatOpen: "bb/samples/drums/tr909/hat.wav",
    rim: "bb/samples/drums/tr909/rim.wav",
    tom: "bb/samples/drums/tr909/tom.wav"
  }
};

const DRUM_STYLE_KIT = {
  pop: "pearl",
  bossa: "pearl",
  jazz: "pearl",
  cinematic: "pearl",
  electronic: "pearl",
  edm: "pearl",
  industrial: "pearl",
  african: "pearl",
  clave: "pearl"
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
  // Back-compat: remove stale cached controls from older markup versions.
  const staleCopyBtn = document.getElementById("copyProgression");
  if (staleCopyBtn && staleCopyBtn.parentNode) staleCopyBtn.parentNode.removeChild(staleCopyBtn);

  state.sampleInstrument = "piano";
  state.drumStyle = "pop";
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
  ensureRepeatOptions(formARepeats, 16);
  ensureRepeatOptions(formBRepeats, 16);
  if (formARepeats) formARepeats.value = String(state.aRepeats || 2);
  if (formBRepeats) formBRepeats.value = String(state.bRepeats || 2);
  buildChordPalette();
  updateScaleNotes();
  if (arpSelect) updateArpNotes();
  if (triadSelect) updateTriadNotes();
  buildFretboard();
  loadProgress();
  setStyle(state.style);
  updateSpicySuggestion();
  updateKeyBanner();
  const prefs = loadUiPrefs();
  if (fretToggle) fretToggle.checked = !!prefs.showFretboard;
  if (scaleOnlyToggle) scaleOnlyToggle.checked = !!prefs.showScaleOnly;
  if (keyboardToggle) keyboardToggle.checked = !!prefs.showKeyboard;
  setFretboardVisibility(!!fretToggle?.checked);
  setKeyboardVisibility(!!keyboardToggle?.checked);
  initProgressionLibrary();
  buildFretMarkers();
  updateChordEditor();
  updatePlayButton();
  syncRhythmQuickOptions();
  applySavedSampleAlignment();
  if (window.innerWidth <= 900 && chordEditor) {
    state.editorPinned = false;
    chordEditor.classList.add("hidden");
  }
  keySelect.addEventListener("change", () => {
    state.key = keySelect.value;
    buildChordPalette();
    updateScaleNotes();
    if (arpSelect) updateArpNotes();
    if (triadSelect) updateTriadNotes();
    buildFretboard();
    updateSpicySuggestion();
    updateKeyBanner();
    scheduleSessionSave();
  });

  modeSelect.addEventListener("change", () => {
    if (modeSelect.value === "random") {
      const pick = BASIC_MODE_OPTIONS[Math.floor(Math.random() * BASIC_MODE_OPTIONS.length)];
      state.mode = pick;
    } else {
      state.mode = normalizeMode(modeSelect.value);
      modeSelect.value = state.mode;
    }
    buildChordPalette();
    updateScaleNotes();
    if (arpSelect) updateArpNotes();
    if (triadSelect) updateTriadNotes();
    buildFretboard();
    updateSpicySuggestion();
    updateKeyBanner();
    scheduleSessionSave();
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
  if (mobileRewind) {
    mobileRewind.addEventListener("click", rewindToStart);
  }
  if (mobileMidi) {
    mobileMidi.addEventListener("click", downloadMidi);
  }
  if (rhythmChip) {
    rhythmChip.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleRhythmEditor();
    });
  }
  if (rhythmQuick) {
    rhythmQuick.addEventListener("change", () => {
      applyRhythmSelection(rhythmQuick.value);
      closeRhythmEditor();
    });
  }

  if (editSectionABtn) {
    editSectionABtn.addEventListener("click", () => {
      switchActiveSection("A");
    });
  }
  if (editSectionBBtn) {
    editSectionBBtn.addEventListener("click", () => {
      switchActiveSection("B");
    });
  }
  if (addBSectionBtn) {
    addBSectionBtn.addEventListener("click", () => {
      addOrFocusBSection({ regenerate: true });
    });
  }
  if (aRepeatsSelect) {
    aRepeatsSelect.addEventListener("change", () => {
      state.aRepeats = Math.max(1, parseInt(aRepeatsSelect.value, 10) || 2);
      state.playbackSequence = buildPlaybackSequence();
      updateSectionControls();
      scheduleSessionSave();
    });
  }
  if (bRepeatsSelect) {
    bRepeatsSelect.addEventListener("change", () => {
      state.bRepeats = Math.max(1, parseInt(bRepeatsSelect.value, 10) || 2);
      state.playbackSequence = buildPlaybackSequence();
      updateSectionControls();
      scheduleSessionSave();
    });
  }
  if (formChip) {
    formChip.addEventListener("click", (event) => {
      event.stopPropagation();
      closeRhythmEditor();
      toggleFormEditor();
    });
  }
  if (formARepeats) {
    formARepeats.addEventListener("change", () => {
      state.aRepeats = Math.max(1, parseInt(formARepeats.value, 10) || 2);
      if (aRepeatsSelect) aRepeatsSelect.value = String(state.aRepeats);
      state.playbackSequence = buildPlaybackSequence();
      updateSectionControls();
      scheduleSessionSave();
    });
  }
  if (formBRepeats) {
    formBRepeats.addEventListener("change", () => {
      state.bRepeats = Math.max(1, parseInt(formBRepeats.value, 10) || 2);
      if (bRepeatsSelect) bRepeatsSelect.value = String(state.bRepeats);
      state.playbackSequence = buildPlaybackSequence();
      updateSectionControls();
      scheduleSessionSave();
    });
  }
  if (formHasB) {
    formHasB.addEventListener("change", () => {
      syncActiveSectionFromProgression();
      if (formHasB.checked) {
        if (!state.hasBSection || getSectionProgression("B").length === 0) {
          generateBSectionFromCorpus();
        }
      } else {
        removeBSection();
        return;
      }
      state.playbackSequence = buildPlaybackSequence();
      updateSectionControls();
      renderProgression();
      scheduleSessionSave();
    });
  }
  document.addEventListener("click", (event) => {
    if (!formEditor || !formChip) return;
    if (event.target.closest("#formEditor") || event.target.closest("#formChip")) return;
    closeFormEditor();
  });
  document.addEventListener("click", (event) => {
    if (!rhythmEditor || !rhythmChip) return;
    if (event.target.closest("#rhythmEditor") || event.target.closest("#rhythmChip")) return;
    closeRhythmEditor();
  });
  document.addEventListener("keydown", (event) => {
    if (event.code !== "Space") return;
    if (event.repeat) return;
    const target = event.target;
    if (target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName))) {
      return;
    }
    event.preventDefault();
    togglePlayback();
  });
  document.addEventListener("keydown", (event) => {
    if (event.repeat) return;
    const target = event.target;
    if (target && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(target.tagName))) {
      return;
    }
    if (event.code === "KeyR") {
      event.preventDefault();
      refreshProgression();
      return;
    }
    if (event.code === "KeyM") {
      event.preventDefault();
      downloadMidi();
      return;
    }
    if (event.code === "KeyB") {
      event.preventDefault();
      toggleBSectionShortcut();
      return;
    }
  });
  if (chordPopupClose) chordPopupClose.addEventListener("click", closeChordPopup);
  if (chordPopupApply) {
    chordPopupApply.addEventListener("click", () => {
      const applied = applyPopupChordToken();
      if (applied) closeChordPopup();
    });
  }
  if (chordPopupToken) {
    chordPopupToken.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const applied = applyPopupChordToken();
        if (applied) closeChordPopup();
      }
    });
  }
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeChordPopup();
    closeFormEditor();
    closeRhythmEditor();
  });
  if (chordPopupDelete) {
    chordPopupDelete.addEventListener("click", () => {
      if (!state.progression.length) return;
      state.progression.splice(state.selectedChord, 1);
      if (state.selectedChord >= state.progression.length) {
        state.selectedChord = Math.max(0, state.progression.length - 1);
      }
      if (state.progression.length === 0) {
        if (state.activeSection === "B") state.sectionB = [];
        else state.sectionA = [];
        closeChordPopup();
      }
      persistSelectedChordChange();
    });
  }
  document.addEventListener("click", (event) => {
    if (!chordPopup || chordPopup.classList.contains("hidden")) return;
    if (event.target.closest("#chordPopup") || event.target.closest(".progression-item")) return;
    closeChordPopup();
  });
  window.addEventListener("resize", () => {
    positionChordPopup();
    const mobileNow = window.innerWidth <= 900;
    if (mobileNow !== isMobileLayout) {
      isMobileLayout = mobileNow;
      renderProgression();
    }
  });

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
  if (rewindBtn) rewindBtn.addEventListener("click", rewindToStart);
  if (downloadMidiBtn) downloadMidiBtn.addEventListener("click", downloadMidi);
  if (refreshProgressionBtn) refreshProgressionBtn.addEventListener("click", refreshProgression);

  styleSelect.addEventListener("change", () => {
    setStyle(styleSelect.value);
    if (state.audioCtx) {
      loadDrumSamplesForStyle(state.drumStyle);
    }
  });

  textureSelect.addEventListener("change", () => {
    state.texture = textureSelect.value;
  });

  sizeSelect.addEventListener("change", () => {
    state.chordSize = sizeSelect.value;
    buildChordPalette();
  });

  rhythmSelect.addEventListener("change", () => {
    applyRhythmSelection(rhythmSelect.value);
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
      if (pianoTimingValue) pianoTimingValue.textContent = `${state.sampleOffsetMs}ms`;
      saveSampleAlignment(state.sampleTrimMs || 0, state.sampleOffsetMs || 0);
    });
  }

  if (sampleTrimSlider) {
    sampleTrimSlider.addEventListener("input", () => {
      state.sampleTrimMs = parseInt(sampleTrimSlider.value, 10);
      saveSampleAlignment(state.sampleTrimMs || 0, state.sampleOffsetMs || 0);
    });
  }

  if (pianoLevelSlider) {
    pianoLevelSlider.addEventListener("input", () => {
      state.pianoLevel = Math.max(0, parseInt(pianoLevelSlider.value, 10) / 100);
      if (state.pianoBusGain) {
        state.pianoBusGain.gain.setValueAtTime(state.pianoLevel, state.audioCtx?.currentTime || 0);
      }
      if (pianoLevelValue) pianoLevelValue.textContent = `${Math.round(state.pianoLevel * 100)}%`;
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

  if (bassTimingSlider) {
    bassTimingSlider.addEventListener("input", () => {
      state.bassOffsetMs = parseInt(bassTimingSlider.value, 10);
      if (bassTimingValue) bassTimingValue.textContent = `${state.bassOffsetMs}ms`;
      saveLatencyCompensation();
    });
  }

  if (drumToggle) {
    drumToggle.addEventListener("change", () => {
      state.drumsEnabled = drumToggle.checked;
      if (state.drumsEnabled) {
        state.drumBarCount = 0;
        state.nextDrumTime = state.audioCtx ? state.audioCtx.currentTime + 0.05 : 0;
      }
    });
  }

  if (instrumentSelect) {
    instrumentSelect.addEventListener("change", () => {
      state.sampleInstrument = instrumentSelect.value;
      if (state.sampleInstrument.startsWith("guitar")) {
        const levelMap = {
          guitar_clean: 0.17,
          guitar_crunch: 0.17,
          guitar_heavy: 0.17
        };
        state.guitarLevel = levelMap[state.sampleInstrument] ?? state.guitarLevel;
        if (guitarLevelSlider) guitarLevelSlider.value = Math.round(state.guitarLevel * 100);
        if (guitarLevelValue) guitarLevelValue.textContent = `${Math.round(state.guitarLevel * 100)}%`;
        if (state.guitarBusGain) {
          state.guitarBusGain.gain.setValueAtTime(state.guitarLevel, state.audioCtx?.currentTime || 0);
        }
      }
      if (state.sampleInstrument === "synth") {
        state.samplesLoaded = false;
        state.samplesLoading = null;
        state.sampleBuffers = {};
      } else {
        reloadSamples();
      }
    });
  }
  if (realisticGuitarToggle) {
    realisticGuitarToggle.addEventListener("change", () => {
      state.realisticGuitar = realisticGuitarToggle.checked;
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
  if (drumLevelSlider) {
    drumLevelSlider.addEventListener("input", () => {
      state.drumLevel = Math.max(0, parseInt(drumLevelSlider.value, 10) / 100);
      if (state.drumBus) {
        state.drumBus.gain.setValueAtTime(state.drumLevel, state.audioCtx?.currentTime || 0);
      }
    });
  }
  if (resetSlidersBtn) {
    resetSlidersBtn.addEventListener("click", () => {
      const defaults = {
        tone: 1200,
        hold: 1.4,
        offset: -7,
        trim: 280,
        pianoLevel: 0.55,
        guitarLevel: 0.3,
        drumLevel: 0.6,
        bassLevel: 1,
        bassOffset: -6
      };
      if (toneSlider) toneSlider.value = defaults.tone;
      if (state.masterFilter) state.masterFilter.frequency.setValueAtTime(defaults.tone, state.audioCtx?.currentTime || 0);
      if (holdSlider) holdSlider.value = defaults.hold;
      state.noteHold = defaults.hold;
      if (sampleOffsetSlider) sampleOffsetSlider.value = defaults.offset;
      if (sampleTrimSlider) sampleTrimSlider.value = defaults.trim;
      state.sampleOffsetMs = defaults.offset;
      state.sampleTrimMs = defaults.trim;
      if (pianoTimingValue) pianoTimingValue.textContent = `${state.sampleOffsetMs}ms`;
      saveSampleAlignment(state.sampleTrimMs || 0, state.sampleOffsetMs || 0);
      if (pianoLevelSlider) pianoLevelSlider.value = Math.round(defaults.pianoLevel * 100);
      state.pianoLevel = defaults.pianoLevel;
      if (state.pianoBusGain) state.pianoBusGain.gain.setValueAtTime(state.pianoLevel, state.audioCtx?.currentTime || 0);
      if (pianoLevelValue) pianoLevelValue.textContent = `${Math.round(state.pianoLevel * 100)}%`;
      if (guitarLevelSlider) guitarLevelSlider.value = Math.round(defaults.guitarLevel * 100);
      state.guitarLevel = defaults.guitarLevel;
      if (state.guitarBusGain) state.guitarBusGain.gain.setValueAtTime(state.guitarLevel, state.audioCtx?.currentTime || 0);
      if (guitarLevelValue) guitarLevelValue.textContent = `${Math.round(state.guitarLevel * 100)}%`;
      if (drumLevelSlider) drumLevelSlider.value = Math.round(defaults.drumLevel * 100);
      state.drumLevel = defaults.drumLevel;
      if (state.drumBus) state.drumBus.gain.setValueAtTime(state.drumLevel, state.audioCtx?.currentTime || 0);
      if (bassLevelSlider) bassLevelSlider.value = Math.round(defaults.bassLevel * 100);
      state.bassLevel = defaults.bassLevel;
      if (state.bassBusGain) state.bassBusGain.gain.setValueAtTime(state.bassLevel, state.audioCtx?.currentTime || 0);
      if (bassTimingSlider) bassTimingSlider.value = defaults.bassOffset;
      state.bassOffsetMs = defaults.bassOffset;
      if (bassTimingValue) bassTimingValue.textContent = `${state.bassOffsetMs}ms`;
      saveLatencyCompensation();
    });
  }
  if (runLatencyTestBtn) {
    runLatencyTestBtn.addEventListener("click", async () => {
      if (!state.audioCtx) initAudio();
      if (state.audioCtx.state === "suspended") await state.audioCtx.resume();
      if (state.isPlaying && !state.isPaused) pausePlayback();
      await ensureSamplesReady();
      await setupLatencyProbe();
      if (!state.latencyProbe) return;
      state.latencyTest.active = true;
      state.latencyTest.results = [];
      state.latencyTest.index = 0;
      const start = state.audioCtx.currentTime + 0.25;
      state.latencyTest.events = [
        { label: "Drum", time: start },
        { label: "Piano", time: start + 1.0 },
        { label: "Bass", time: start + 2.0 },
        { label: "Drum", time: start + 3.0 },
        { label: "Piano", time: start + 4.0 },
        { label: "Bass", time: start + 5.0 }
      ].map((e) => ({ ...e, matched: false }));
      state.latencyProbe.port.postMessage({ reset: true, threshold: 0.008 });
      if (latencyResult) latencyResult.textContent = "Latency test: running…";
      const kitName = DRUM_STYLE_KIT[state.drumStyle] || "pearl";
      const kit = DRUM_KITS[kitName];
      const playDrumHit = (time) => {
        if (state.drumSamplesLoaded && kit?.kick) {
          playDrumSample(kit.kick, time, 1.0);
        } else {
          playKick(time, DRUM_SOUNDS[state.drumStyle] || DRUM_SOUNDS.pop);
        }
      };
      playDrumHit(start);
      playDrumHit(start + 3.0);
      const pianoMidi = noteToMidi("C", 4);
      playNote(pianoMidi, start + 1.0, 0.8, 1.2);
      playNote(pianoMidi, start + 4.0, 0.8, 1.2);
      playBassNote(noteToMidi("C", 2), start + 2.0, 0.8);
      playBassNote(noteToMidi("C", 2), start + 5.0, 0.8);
      setTimeout(() => {
        if (!state.latencyProbe) return;
        state.latencyProbe.port.postMessage({ requestPeak: true });
      }, 500);
      setTimeout(() => {
        if (!state.latencyTest.active) return;
        finalizeLatencyTest(true);
      }, 7000);
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
      if (!names.length) return;
      const choice = window.prompt(`Load which progression?\n${names.join(", ")}`);
      if (!choice || !saved[choice]) return;
      const data = saved[choice];
      state.sectionA = normalizeProgression(data.progression);
      state.sectionB = [];
      state.hasBSection = false;
      state.activeSection = "A";
      state.progression = state.sectionA;
      state.key = data.key || state.key;
      state.mode = normalizeMode(data.mode || state.mode);
      state.tempo = data.tempo || state.tempo;
      updateKeyBanner();
      if (tempoSlider) {
        tempoSlider.value = state.tempo;
        updateTempo();
      }
      updateSectionControls();
      renderProgression();
      updateChordEditor();
    });
  }

  if (deleteProgressionBtn) {
    deleteProgressionBtn.addEventListener("click", () => {
      const saved = loadSavedProgressions();
      const names = Object.keys(saved);
      if (!names.length) return;
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
      const famousMajor = SONG_CORPUS.major.filter((entry) => entry.tags?.includes("famous"));
      const famousMinor = SONG_CORPUS.minor.filter((entry) => entry.tags?.includes("famous"));
      const all = [
        ...famousMajor.map((entry) => ({ mode: "major", tokens: entry.tokens })),
        ...famousMinor.map((entry) => ({ mode: "minor", tokens: entry.tokens }))
      ];
      const pick = all[Math.floor(Math.random() * all.length)] || { mode: "major", tokens: ["I", "V", "vi", "IV"] };
      applyPreset({
        tokens: pick.tokens,
        beats: 4,
        mode: pick.mode
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

  if (presetIIVIMinor) {
    presetIIVIMinor.addEventListener("click", () => {
      applyPreset({
        tokens: ["ii°", "V", "i"],
        beats: 4,
        mode: "minor"
      });
    });
  }

  if (presetAxisInverse) {
    presetAxisInverse.addEventListener("click", () => {
      applyPreset({
        tokens: ["vi", "IV", "I", "V"],
        beats: 4,
        mode: "major"
      });
    });
  }

  if (presetPopLift) {
    presetPopLift.addEventListener("click", () => {
      applyPreset({
        tokens: ["I", "V", "ii", "IV"],
        beats: 4,
        mode: "major"
      });
    });
  }

  if (presetAeolianRock) {
    presetAeolianRock.addEventListener("click", () => {
      applyPreset({
        tokens: ["i", "bVII", "bVI", "bVII"],
        beats: 4,
        mode: "minor"
      });
    });
  }

  if (presetMinorCadence) {
    presetMinorCadence.addEventListener("click", () => {
      applyPreset({
        tokens: ["i", "iv", "V", "i"],
        beats: 4,
        mode: "minor"
      });
    });
  }

  if (presetClassicRock) {
    presetClassicRock.addEventListener("click", () => {
      applyPreset({
        tokens: ["I", "bVII", "IV", "I"],
        beats: 4,
        mode: "major"
      });
    });
  }

  if (presetAndalusian) {
    presetAndalusian.addEventListener("click", () => {
      applyPreset({
        tokens: ["i", "bVII", "bVI", "V"],
        beats: 4,
        mode: "minor"
      });
    });
  }

  if (presetDorianVamp) {
    presetDorianVamp.addEventListener("click", () => {
      applyPreset({
        tokens: ["i", "IV"],
        beats: 4,
        mode: "minor"
      });
    });
  }
  initPresetCarousel();

  if (keyLockBtn) {
    keyLockBtn.addEventListener("click", () => {
      state.keyLocked = !state.keyLocked;
      updateKeyLockButton();
      scheduleSessionSave();
    });
  }

  if (keyPill) {
    keyPill.addEventListener("click", (event) => {
      event.stopPropagation();
      toggleKeyPicker();
    });
  }

  document.addEventListener("click", (event) => {
    if (!keyPicker || !keyPill) return;
    if (event.target.closest("#keyPicker") || event.target.closest("#keyPill")) return;
    closeKeyPicker();
  });

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
  if (fretToggle) {
    fretToggle.addEventListener("change", () => {
      setFretboardVisibility(fretToggle.checked);
      saveUiPrefs({ showFretboard: fretToggle.checked });
    });
  }
  if (scaleOnlyToggle) {
    scaleOnlyToggle.addEventListener("change", () => {
      buildFretboard();
      saveUiPrefs({ showScaleOnly: scaleOnlyToggle.checked });
    });
  }
  if (keyboardToggle) {
    keyboardToggle.addEventListener("change", () => {
      setKeyboardVisibility(keyboardToggle.checked);
      buildFretboard();
      saveUiPrefs({ showKeyboard: keyboardToggle.checked });
    });
  }

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
  if (autoAlignSamplesBtn) {
    autoAlignSamplesBtn.addEventListener("click", async () => {
      await autoAlignSamples(false);
    });
  }

  const attachProgressionDrop = (element, section) => {
    if (!element) return;
    element.addEventListener("dragover", (event) => event.preventDefault());
    element.addEventListener("drop", (event) => {
      const data = event.dataTransfer.getData("application/json");
      if (!data) return;
      const targetItem = event.target.closest(".progression-item");
      if (targetItem) return;
      event.preventDefault();
      const item = normalizeProgression([JSON.parse(data)])[0];
      switchActiveSection(section);
      state.progression.push(item);
      state.selectedChord = state.progression.length - 1;
      updateChordEditor();
      renderProgression();
    });
  };
  attachProgressionDrop(progressionAEl, "A");
  attachProgressionDrop(progressionBEl, "B");

  // chord slots are added by dragging chords into the progression

  if (resetMinutes) {
    resetMinutes.addEventListener("click", () => {
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

  if (!state.sectionA.length) {
    state.sectionA = normalizeProgression(state.progression);
  }
  state.progression = state.activeSection === "B" ? getSectionProgression("B") : getSectionProgression("A");
  updateSectionControls();

  if (instrumentSelect) instrumentSelect.value = state.sampleInstrument;
  if (pianoLevelSlider) pianoLevelSlider.value = Math.round(state.pianoLevel * 100);
  if (pianoLevelValue) pianoLevelValue.textContent = `${Math.round(state.pianoLevel * 100)}%`;
  if (guitarLevelSlider) guitarLevelSlider.value = Math.round(state.guitarLevel * 100);
  if (guitarLevelValue) guitarLevelValue.textContent = `${Math.round(state.guitarLevel * 100)}%`;
  if (drumLevelSlider) drumLevelSlider.value = Math.round(state.drumLevel * 100);
  if (realisticGuitarToggle) realisticGuitarToggle.checked = state.realisticGuitar;
  if (drumStyleSelect) drumStyleSelect.value = state.drumStyle;
  if (bassToggle) bassToggle.checked = state.bassEnabled;
  if (bassRhythmSelect) bassRhythmSelect.value = state.bassRhythm;
  if (bassLevelSlider) bassLevelSlider.value = Math.round(state.bassLevel * 100);
  if (sampleOffsetSlider) sampleOffsetSlider.value = String(state.sampleOffsetMs);
  if (pianoTimingValue) pianoTimingValue.textContent = `${state.sampleOffsetMs}ms`;
  if (sampleTrimSlider) sampleTrimSlider.value = String(state.sampleTrimMs);
  if (bassTimingSlider) bassTimingSlider.value = String(state.bassOffsetMs);
  if (bassTimingValue) bassTimingValue.textContent = `${state.bassOffsetMs}ms`;
  if (rhythmSelect) rhythmSelect.value = state.rhythm;
  if (textureSelect) textureSelect.value = state.texture;
  selectDrumPattern();
  if (state.audioCtx) {
    loadDrumSamplesForStyle(state.drumStyle);
  }
  applyInstrumentDefaults(false);
  if (state.guitarBusGain) {
    state.guitarBusGain.gain.value = state.guitarLevel;
  }
  if (state.pianoBusGain) {
    state.pianoBusGain.gain.value = state.pianoLevel;
  }
  if (state.bassBusGain) {
    state.bassBusGain.gain.value = state.bassLevel;
  }
  updateKeyLockButton();

  refreshSavedProgressions();
  if (chordEditor) chordEditor.classList.add("hidden");
  renderProgression();
  updateKeyBanner();
  if (tempoSlider) updateTempo();
  collapseMobileDetails();
  refreshKeyPicker();
  loadLatencyCompensation();
}

function ensureRepeatOptions(selectEl, max = 16) {
  if (!selectEl || selectEl.options.length > 0) return;
  for (let i = 1; i <= max; i += 1) {
    const option = document.createElement("option");
    option.value = String(i);
    option.textContent = String(i);
    selectEl.appendChild(option);
  }
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
  if (drumStyleSelect) drumStyleSelect.value = "pop";
  state.drumStyle = "pop";
  if (drumToggle) {
    drumToggle.checked = true;
    state.drumsEnabled = true;
  }
  if (instrumentSelect) instrumentSelect.value = "piano";
  state.sampleInstrument = "piano";
  if (genLength) genLength.value = "4";
  if (genRhythm) {
    const starters = ["steady", "split", "answer", "chop"];
    genRhythm.value = starters[Math.floor(Math.random() * starters.length)];
  }
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
  textureSelect.value = state.texture;
  rhythmSelect.value = state.rhythm;
  syncRhythmQuickOptions();
  updateRhythmReadout(state.activeSection);
  if (drumToggle) {
    state.drumsEnabled = drumToggle.checked;
  }
  if (toneSlider) toneSlider.value = preset.filter;
  if (state.masterFilter) state.masterFilter.frequency.setValueAtTime(preset.filter, state.audioCtx.currentTime);
}

function applyInstrumentDefaults(randomize = false) {
  if (!state.sampleInstrument.startsWith("guitar") && state.sampleInstrument !== "piano") return;
  state.texture = state.sampleInstrument.startsWith("guitar") ? "block" : "pulse";
  if (randomize) {
    const options = ["rockStrum", "syncopated", "offbeat", "push", "tresillo", "answer", "chop", "split"];
    state.rhythm = options[Math.floor(Math.random() * options.length)];
    if (["split", "answer", "chop"].includes(state.rhythm)) {
      state.texture = "split";
    }
  } else if (state.sampleInstrument.startsWith("guitar")) {
    state.rhythm = "rockStrum";
  }
  if (textureSelect) textureSelect.value = state.texture;
  if (rhythmSelect) rhythmSelect.value = state.rhythm;
  syncRhythmQuickOptions();
  updateRhythmReadout(state.activeSection);
}

function updateChordEditor() {
  if (!selectedChordLabel || !beatButtons) return;
  state.progression = normalizeProgression(state.progression);
  if (!state.progression.length) {
    selectedChordLabel.textContent = "Select a chord";
    beatButtons.innerHTML = "";
    if (chordEditor) chordEditor.classList.add("hidden");
    return;
  }
  if (chordEditor) {
    if (state.editorPinned) chordEditor.classList.remove("hidden");
    else chordEditor.classList.add("hidden");
  }
  const selectedIndex = Math.min(Math.max(0, state.selectedChord || 0), state.progression.length - 1);
  state.selectedChord = selectedIndex;
  const item = state.progression[selectedIndex];
  const description = describeItem(item);
  selectedChordLabel.textContent = `${description.label} • ${description.name}`;
  if (!state.isPlaying) {
    const chord = chordFromItem(item);
    state.currentChordNotes = new Set(chord.intervals.map((interval) => noteAt(chord.root, interval)));
    state.currentChordRoot = chord.root;
    buildFretboard();
  }

  beatButtons.innerHTML = "";
  [1, 2, 3, 4, 6, 8, 16].forEach((beat) => {
    const btn = document.createElement("button");
    btn.className = "btn ghost small";
    btn.textContent = beat;
    if (item.beats === beat) btn.classList.add("active");
    btn.addEventListener("click", () => {
      const current = state.progression[state.selectedChord];
      if (!current) return;
      current.beats = beat;
      if (state.activeSection === "B") state.sectionB = normalizeProgression(state.progression);
      else state.sectionA = normalizeProgression(state.progression);
      state.playbackSequence = buildPlaybackSequence();
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
  scheduleSessionSave();
}

function updateKeyBanner() {
  if (!currentKey) return;
  const modeLabel = getModeConfig(state.mode).label;
  currentKey.textContent = `${state.key} ${modeLabel}`;
  if (keyBanner) {
    keyBanner.classList.remove("pulse");
    void keyBanner.offsetWidth;
    keyBanner.classList.add("pulse");
  }
  if (mobileKey) mobileKey.textContent = `Key: ${state.key} ${modeLabel}`;
  refreshKeyPicker();
}

function toggleKeyPicker() {
  if (!keyPicker || !keyPill) return;
  const isOpen = keyPicker.classList.contains("open");
  if (isOpen) {
    closeKeyPicker();
  } else {
    openKeyPicker();
  }
}

function openKeyPicker() {
  if (!keyPicker || !keyPill) return;
  keyPicker.classList.add("open");
  keyPicker.setAttribute("aria-hidden", "false");
  keyPill.setAttribute("aria-expanded", "true");
}

function closeKeyPicker() {
  if (!keyPicker || !keyPill) return;
  keyPicker.classList.remove("open");
  keyPicker.setAttribute("aria-hidden", "true");
  keyPill.setAttribute("aria-expanded", "false");
}

function refreshKeyPicker() {
  if (!keyPickerNotes) return;
  if (!keyPickerNotes.children.length) {
    FRIENDLY_KEYS.forEach((note) => {
      const btn = document.createElement("button");
      btn.textContent = note;
      btn.addEventListener("click", () => {
        state.key = normalizeKeyDisplay(note);
        if (keySelect) keySelect.value = FLAT_EQUIV[state.key] || state.key;
        updateKeyBanner();
        buildChordPalette();
        updateScaleNotes();
        buildFretboard();
        renderProgression();
        scheduleSessionSave();
      });
      keyPickerNotes.appendChild(btn);
    });

    if (keyPicker) {
      keyPicker.querySelectorAll("[data-mode]").forEach((button) => {
        button.addEventListener("click", () => {
          state.mode = normalizeMode(button.dataset.mode);
          if (modeSelect) modeSelect.value = state.mode;
          updateKeyBanner();
          buildChordPalette();
          updateScaleNotes();
          buildFretboard();
          renderProgression();
          scheduleSessionSave();
        });
      });
    }
  }

  Array.from(keyPickerNotes.children).forEach((btn) => {
    btn.classList.toggle("active", btn.textContent === state.key);
  });

  if (keyPicker) {
    keyPicker.querySelectorAll("[data-mode]").forEach((button) => {
      button.classList.toggle("active", button.dataset.mode === state.mode);
    });
  }
}

function updateSpicySuggestion() {
  const suggestions = getSpicySuggestions();
  const pick = suggestions[Math.floor(Math.random() * suggestions.length)];
  spicySuggestion.textContent = `${pick.roman} • ${pick.token}`;
  spicySuggestion.dataset.token = pick.token;
  spicySuggestion.dataset.roman = pick.roman;
}

function getSpicySuggestions() {
  const rootIndex = NOTES.indexOf(FLAT_EQUIV[state.key] || state.key);
  const buildToken = (interval, quality, preferFlats = false) => {
    const root = preferFlats ? FLAT_NOTES[(rootIndex + interval + 1200) % 12] : NOTES[(rootIndex + interval + 1200) % 12];
    if (quality === "min") return `${root}m`;
    if (quality === "dom7") return `${root}7`;
    if (quality === "maj7") return `${root}maj7`;
    if (quality === "m7") return `${root}m7`;
    if (quality === "dim") return `${root}dim`;
    return `${root}`;
  };

  if (getModeFamily(state.mode) === "major") {
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
    state.sectionA = selected.tokens.map((token) => createChordItem(token));
    state.sectionB = [];
    state.hasBSection = false;
    state.activeSection = "A";
    state.progression = state.sectionA;
    state.selectedChord = 0;
    updateSectionControls();
    updateChordEditor();
    renderProgression();
  });
}

function syncActiveSectionFromProgression() {
  const normalized = normalizeProgression(state.progression);
  if (state.activeSection === "B") {
    state.sectionB = normalized;
  } else {
    state.sectionA = normalized;
  }
  state.progression = normalized;
}

function getSectionProgression(section) {
  if (section === "B") return normalizeProgression(state.sectionB);
  return normalizeProgression(state.sectionA.length ? state.sectionA : state.progression);
}

function switchActiveSection(section) {
  syncActiveSectionFromProgression();
  if (section === "B" && !state.hasBSection) return;
  state.activeSection = section === "B" ? "B" : "A";
  state.progression = state.activeSection === "B" ? getSectionProgression("B") : getSectionProgression("A");
  state.selectedChord = 0;
  updateChordEditor();
  renderProgression();
  updateSectionControls();
}

function syncFormEditorControls() {
  if (formARepeats) formARepeats.value = String(state.aRepeats || 2);
  if (formHasB) formHasB.checked = !!state.hasBSection;
  if (formBRepeats) {
    formBRepeats.value = String(state.bRepeats || 2);
    formBRepeats.disabled = !state.hasBSection;
  }
}

function openFormEditor() {
  if (!formEditor || !formChip) return;
  formEditor.classList.remove("hidden");
  formEditor.setAttribute("aria-hidden", "false");
  formChip.setAttribute("aria-expanded", "true");
  syncFormEditorControls();
}

function closeFormEditor() {
  if (!formEditor || !formChip) return;
  formEditor.classList.add("hidden");
  formEditor.setAttribute("aria-hidden", "true");
  formChip.setAttribute("aria-expanded", "false");
}

function toggleFormEditor() {
  if (!formEditor) return;
  if (formEditor.classList.contains("hidden")) openFormEditor();
  else closeFormEditor();
}

function updateSectionControls() {
  if (editSectionABtn) editSectionABtn.classList.toggle("active", state.activeSection === "A");
  if (editSectionBBtn) editSectionBBtn.classList.toggle("active", state.activeSection === "B");
  if (editSectionBBtn) editSectionBBtn.disabled = !state.hasBSection;
  if (bRepeatsSelect) bRepeatsSelect.disabled = !state.hasBSection;
  if (progressionSectionBEl) progressionSectionBEl.classList.toggle("hidden", !state.hasBSection);
  if (addBSectionBtn) addBSectionBtn.textContent = state.hasBSection ? "Regenerate B Section" : "Add B Section";
  if (aRepeatsSelect) aRepeatsSelect.value = String(state.aRepeats || 2);
  if (bRepeatsSelect) bRepeatsSelect.value = String(state.bRepeats || 2);
  if (formChip) {
    const formText = state.hasBSection
      ? `Form: A x ${state.aRepeats || 2} • B x ${state.bRepeats || 2}`
      : `Form: A x ${state.aRepeats || 2}`;
    formChip.textContent = formText;
  }
  syncFormEditorControls();
  updateRhythmReadout(state.activeSection);
}

function getSelectedPlaybackTarget() {
  const section = state.activeSection === "B" && state.hasBSection ? "B" : "A";
  const pool = getSectionProgression(section);
  const maxIndex = Math.max(0, pool.length - 1);
  const sectionIndex = Math.min(Math.max(0, state.selectedChord || 0), maxIndex);
  return { section, sectionIndex };
}

function getPlaybackStartIndex(sequence, section, sectionIndex) {
  if (!sequence || sequence.length === 0) return 0;
  const idx = sequence.findIndex((entry) => entry.section === section && entry.sectionIndex === sectionIndex);
  return idx >= 0 ? idx : 0;
}

function primePlaybackFromSelectedChord() {
  const sequence = state.playbackSequence && state.playbackSequence.length ? state.playbackSequence : buildPlaybackSequence();
  state.playbackSequence = sequence;
  const target = getSelectedPlaybackTarget();
  const startIndex = getPlaybackStartIndex(sequence, target.section, target.sectionIndex);
  state.currentChord = startIndex;
  state.uiChord = target.sectionIndex;
  state.playingSection = target.section;
  state.activeDrumSection = target.section;
  state.selectedChord = target.sectionIndex;
  state.lastVoicing = null;
  state.lastCountBar = null;
  state.drumBarCount = 0;
  state.nextDrumTime = 0;
  state.selectionDirtyForPlayback = false;
}

function formatRhythmLabel(rhythmName) {
  const map = {
    whole: "Whole",
    halves: "Halves",
    quarters: "Quarter Pulse",
    eighths: "Eighth Drive",
    syncopated: "Syncopated",
    offbeat: "Offbeat",
    answer: "Call + Answer",
    split: "High/Low Comp",
    chop: "Backbeat Chop",
    push: "Push Accents",
    tresillo: "Tresillo",
    habanera: "Habanera",
    clave: "Clave",
    sparse: "Sparse",
    rockStrum: "Rock Strum"
  };
  return map[rhythmName] || rhythmName;
}

function updateRhythmReadout(section = state.activeSection) {
  if (!currentRhythm) return;
  currentRhythm.textContent = formatRhythmLabel(getRhythmNameForSection(section));
}

function syncRhythmQuickOptions() {
  if (!rhythmQuick || !rhythmSelect) return;
  if (rhythmQuick.options.length === 0) {
    Array.from(rhythmSelect.options).forEach((option) => {
      const quick = document.createElement("option");
      quick.value = option.value;
      quick.textContent = option.textContent;
      rhythmQuick.appendChild(quick);
    });
  }
  rhythmQuick.value = state.rhythm;
}

function applyRhythmSelection(value) {
  if (!value) return;
  state.rhythm = value;
  if (rhythmSelect) rhythmSelect.value = value;
  if (rhythmQuick) rhythmQuick.value = value;
  if (["split", "answer", "chop"].includes(state.rhythm)) {
    state.texture = "split";
    if (textureSelect) textureSelect.value = "split";
  }
  updateRhythmReadout(state.activeSection);
  scheduleSessionSave();
}

function openRhythmEditor() {
  if (!rhythmEditor || !rhythmChip) return;
  closeFormEditor();
  syncRhythmQuickOptions();
  rhythmEditor.classList.remove("hidden");
  rhythmEditor.setAttribute("aria-hidden", "false");
  rhythmChip.setAttribute("aria-expanded", "true");
}

function closeRhythmEditor() {
  if (!rhythmEditor || !rhythmChip) return;
  rhythmEditor.classList.add("hidden");
  rhythmEditor.setAttribute("aria-hidden", "true");
  rhythmChip.setAttribute("aria-expanded", "false");
}

function toggleRhythmEditor() {
  if (!rhythmEditor) return;
  if (rhythmEditor.classList.contains("hidden")) openRhythmEditor();
  else closeRhythmEditor();
}

function rewindToStart() {
  syncActiveSectionFromProgression();
  state.activeSection = "A";
  state.progression = getSectionProgression("A");
  state.selectedChord = 0;
  state.selectionDirtyForPlayback = true;
  state.editorPinned = false;
  closeChordPopup();
  updateChordEditor();
  renderProgression();
  updateRhythmReadout("A");

  if (!state.isPlaying) {
    updatePlayButton();
    return;
  }
  if (!state.isPaused) pausePlayback();
  resetTransportTimeline();
  primePlaybackFromSelectedChord();
  state.lastAutoScrollSection = null;
  scrollToSectionOnMobile("A", true);
  updatePlayButton();
}

function getSelectedChordElement() {
  return document.querySelector(`.progression-item[data-section="${state.activeSection}"][data-index="${state.selectedChord}"]`);
}

function positionChordPopup(anchor = null) {
  if (!chordPopup || chordPopup.classList.contains("hidden")) return;
  const mobile = window.innerWidth <= 900;
  chordPopup.style.top = "";
  chordPopup.style.left = "";
  chordPopup.style.right = "";
  chordPopup.style.bottom = "";
  chordPopup.style.width = "";
  if (mobile) {
    chordPopup.style.left = "12px";
    chordPopup.style.right = "12px";
    chordPopup.style.bottom = "12px";
    return;
  }
  const target = anchor || getSelectedChordElement();
  const rect = target ? target.getBoundingClientRect() : { left: 20, top: 120, bottom: 160 };
  const pad = 12;
  const panelWidth = Math.min(340, window.innerWidth - pad * 2);
  chordPopup.style.width = `${panelWidth}px`;
  let left = Math.max(pad, Math.min(rect.left, window.innerWidth - panelWidth - pad));
  const panelHeight = chordPopup.offsetHeight || 260;
  let top = rect.bottom + 10;
  if (top + panelHeight > window.innerHeight - pad) top = Math.max(pad, rect.top - panelHeight - 10);
  chordPopup.style.left = `${left}px`;
  chordPopup.style.top = `${top}px`;
}

function syncChordPopup() {
  if (!chordPopup || chordPopup.classList.contains("hidden")) return;
  const item = state.progression[state.selectedChord];
  if (!item) {
    closeChordPopup();
    return;
  }
  const description = describeItem(item);
  if (chordPopupTitle) chordPopupTitle.textContent = `${description.label} • ${description.name}`;
  if (chordPopupToken && document.activeElement !== chordPopupToken) {
    chordPopupToken.value = buildChordTokenDisplay(item.token, item.exts);
  }

  if (chordPopupBeats) {
    chordPopupBeats.innerHTML = "";
    [1, 2, 3, 4, 6, 8, 16].forEach((beat) => {
      const btn = document.createElement("button");
      btn.className = "btn ghost small";
      btn.type = "button";
      btn.textContent = String(beat);
      if (item.beats === beat) btn.classList.add("active");
      btn.addEventListener("click", () => {
        const current = state.progression[state.selectedChord];
        if (!current) return;
        current.beats = beat;
        persistSelectedChordChange();
      });
      chordPopupBeats.appendChild(btn);
    });
  }
}

function openChordPopup(anchor = null) {
  if (!chordPopup) return;
  chordPopup.classList.remove("hidden");
  chordPopup.setAttribute("aria-hidden", "false");
  syncChordPopup();
  positionChordPopup(anchor);
  if (chordPopupToken) {
    setTimeout(() => {
      if (!chordPopup || chordPopup.classList.contains("hidden")) return;
      chordPopupToken.focus();
      chordPopupToken.select();
    }, 0);
  }
}

function closeChordPopup() {
  if (!chordPopup) return;
  chordPopup.classList.add("hidden");
  chordPopup.setAttribute("aria-hidden", "true");
}

function persistSelectedChordChange() {
  if (state.activeSection === "B") state.sectionB = normalizeProgression(state.progression);
  else state.sectionA = normalizeProgression(state.progression);
  state.playbackSequence = buildPlaybackSequence();
  state.selectionDirtyForPlayback = true;
  updateChordEditor();
  renderProgression();
  syncChordPopup();
  positionChordPopup();
  scheduleSessionSave();
}

function applyPopupChordToken() {
  if (!chordPopupToken) return;
  const raw = chordPopupToken.value.trim();
  if (!raw) return false;
  const current = state.progression[state.selectedChord];
  if (!current) return false;
  const { core, beats } = parseTokenBeat(raw);
  const romanParsed = parseRomanToken(core);
  if (romanParsed) {
    current.token = romanParsed.token;
    current.exts = romanParsed.exts;
  } else {
    const parsedName = parseChordName(core);
    if (parsedName) {
      const romanToken = findModeRomanTokenForRoot(parsedName.root);
      if (romanToken) {
        current.token = romanToken;
        current.exts = parsedName.exts || [];
      } else {
        current.token = core;
        current.exts = parsedName.exts || [];
      }
    } else {
      current.token = core;
      current.exts = [];
    }
  }
  if (raw.includes(":")) current.beats = beats;
  persistSelectedChordChange();
  return true;
}

function generateBSectionFromCorpus() {
  const a = getSectionProgression("A");
  const targetLen = Math.max(4, a.length || 4);
  const spice = genSpice?.value || "light";
  const beatsPattern = a.length ? a.map((item) => item.beats || 4) : [4, 4, 4, 4];
  let candidate = chooseMusicalProgression(targetLen, state.mode, spice);
  const aTokens = a.map((item) => item.token).join("|");
  for (let tries = 0; tries < 5; tries += 1) {
    if (candidate.join("|") !== aTokens) break;
    candidate = chooseMusicalProgression(targetLen, state.mode, spice);
  }
  state.sectionB = candidate.map((token, idx) => {
    const beats = beatsPattern[idx % beatsPattern.length] || 4;
    const exts = getExtensionForToken(token, state.mode, spice);
    return createChordItem(token, beats, null, exts);
  });
  state.hasBSection = state.sectionB.length > 0;
}

function removeBSection() {
  syncActiveSectionFromProgression();
  state.sectionB = [];
  state.hasBSection = false;
  if (state.activeSection === "B") {
    state.activeSection = "A";
    state.progression = getSectionProgression("A");
    state.selectedChord = Math.min(state.selectedChord || 0, Math.max(0, state.progression.length - 1));
  }
  state.playbackSequence = buildPlaybackSequence();
  updateSectionControls();
  renderProgression();
  updateChordEditor();
  scheduleSessionSave();
}

function addOrFocusBSection({ regenerate = false } = {}) {
  syncActiveSectionFromProgression();
  const shouldGenerate = regenerate || !state.hasBSection || getSectionProgression("B").length === 0;
  if (shouldGenerate) generateBSectionFromCorpus();
  state.playbackSequence = buildPlaybackSequence();
  switchActiveSection("B");
  scheduleSessionSave();
}

function toggleBSectionShortcut() {
  if (state.hasBSection) {
    removeBSection();
  } else {
    addOrFocusBSection({ regenerate: false });
  }
}

function buildPlaybackSequence() {
  syncActiveSectionFromProgression();
  const a = getSectionProgression("A");
  const b = state.hasBSection ? getSectionProgression("B") : [];
  const sequence = [];
  const aLoops = Math.max(1, state.aRepeats || 2);
  const bLoops = Math.max(1, state.bRepeats || 2);
  for (let loop = 0; loop < aLoops; loop += 1) {
    a.forEach((item, idx) => sequence.push({ item, section: "A", sectionIndex: idx }));
  }
  if (state.hasBSection && b.length > 0) {
    for (let loop = 0; loop < bLoops; loop += 1) {
      b.forEach((item, idx) => sequence.push({ item, section: "B", sectionIndex: idx }));
    }
  }
  if (sequence.length === 0) {
    const fallback = normalizeProgression(state.progression);
    fallback.forEach((item, idx) => sequence.push({ item, section: state.activeSection, sectionIndex: idx }));
  }
  return sequence;
}

function getRhythmNameForSection(section = "A") {
  if (section !== "B" || !state.hasBSection) return state.rhythm;
  return B_SECTION_RHYTHM_VARIANTS[state.rhythm] || state.rhythm;
}

function getDrumPatternForSection(section = "A") {
  const patterns = DRUM_PATTERN_BANK[state.drumStyle] || DRUM_PATTERN_BANK.pop;
  const active = state.drumPattern || patterns[0];
  if (section !== "B" || !state.hasBSection || patterns.length < 2) return active;
  const activeIndex = patterns.indexOf(active);
  if (activeIndex < 0) return patterns[1] || active;
  return patterns[(activeIndex + 1) % patterns.length];
}

function getPhraseRoleForBar(barIndex = 0) {
  const slot = ((barIndex % 4) + 4) % 4;
  if (slot === 2) return "lift";
  if (slot === 3) return "turnaround";
  return "steady";
}

function getStyleSwingBeats(section = "A", rhythmName = state.rhythm) {
  if (!rhythmName || rhythmName === "whole" || rhythmName === "halves") return 0;
  let swing = STYLE_SWING_BEATS[state.style] ?? STYLE_SWING_BEATS.clean;
  if (section === "B" && state.hasBSection) swing += 0.007;
  if (state.tempo >= 140) swing *= 0.55;
  else if (state.tempo >= 120) swing *= 0.75;
  return Math.max(0, Math.min(0.085, swing));
}

function applySwingToBeatStep(step, beatWindow = 4, swingBeats = 0) {
  if (!Number.isFinite(step) || swingBeats <= 0) return step;
  const fractional = ((step % 1) + 1) % 1;
  if (Math.abs(fractional - 0.5) > 0.03) return step;
  return Math.min(Math.max(0, beatWindow - 0.02), step + swingBeats);
}

function getStyleGrooveMs(section = "A") {
  const base = STYLE_GROOVE_MS[state.style] || STYLE_GROOVE_MS.clean;
  if (section === "B" && state.hasBSection) {
    return {
      piano: base.piano + 2,
      bass: base.bass + 2,
      hats: base.hats + 1
    };
  }
  return base;
}

function getBarIndexAtTime(time, beatDuration = 0.6) {
  const barDuration = beatDuration * 4;
  if (!Number.isFinite(time) || barDuration <= 0) return 0;
  return Math.max(0, Math.floor((time + 0.0001) / barDuration));
}

function uniqSortedNumeric(values = []) {
  return Array.from(new Set(values.filter((value) => Number.isFinite(value)))).sort((a, b) => a - b);
}

function weightedPick(items, weightFn = (item) => item.weight || 1) {
  if (!items || items.length === 0) return null;
  const total = items.reduce((sum, item) => sum + Math.max(0, weightFn(item)), 0);
  if (total <= 0) return items[Math.floor(Math.random() * items.length)];
  let cursor = Math.random() * total;
  for (const item of items) {
    cursor -= Math.max(0, weightFn(item));
    if (cursor <= 0) return item;
  }
  return items[items.length - 1];
}

function buildTransitionMap(mode, corpusEntries = null) {
  const map = {};
  const corpus = corpusEntries || getCorpusForMode(mode);
  corpus.forEach((entry) => {
    const tokens = entry.tokens || [];
    const weight = entry.weight || 1;
    for (let i = 0; i < tokens.length - 1; i += 1) {
      const from = tokens[i];
      const to = tokens[i + 1];
      if (!map[from]) map[from] = [];
      map[from].push({ token: to, weight });
    }
    if (tokens.length > 1) {
      const last = tokens[tokens.length - 1];
      const first = tokens[0];
      if (!map[last]) map[last] = [];
      map[last].push({ token: first, weight: weight * 0.35 });
    }
  });
  return map;
}

const MODAL_PROGRESSIONS = {
  dorian: [
    ["i", "IV", "i", "bVII"],
    ["i", "ii", "i", "IV"],
    ["i", "bIII", "IV", "i"],
    ["i", "v", "IV", "i"]
  ],
  mixolydian: [
    ["I", "bVII", "IV", "I"],
    ["I", "v", "IV", "I"],
    ["I", "bVII", "v", "IV"],
    ["I", "IV", "bVII", "I"]
  ],
  lydian: [
    ["I", "II", "V", "I"],
    ["I", "V", "II", "I"],
    ["I", "II", "vii", "I"],
    ["I", "II", "V", "II"]
  ],
  phrygian: [
    ["i", "bII", "i", "bVII"],
    ["i", "bII", "bVII", "i"],
    ["i", "bVI", "bII", "i"],
    ["i", "v°", "bII", "i"]
  ]
};

function getCorpusForMode(mode) {
  if (SONG_CORPUS[mode]?.length) return SONG_CORPUS[mode];
  const family = getModeFamily(mode);
  return SONG_CORPUS[family] || SONG_CORPUS.major;
}

function getBorrowedPool(mode) {
  const family = getModeFamily(mode);
  if (mode === "dorian") return ["I", "bII", "V", "VI"];
  if (mode === "mixolydian") return ["V", "vi", "II", "bVI"];
  if (mode === "lydian") return ["IV", "vi", "bVII", "ii"];
  if (mode === "phrygian") return ["V", "iv", "VI", "bIII"];
  if (family === "major") {
    return ["bVII", "bVI", "iv", "bIII", "bII"];
  }
  return ["V", "bII", "bVI", "bVII"];
}

function suggestNextTokenFromCorpus(previousToken, mode = state.mode) {
  const modalTemplates = MODAL_PROGRESSIONS[mode];
  const tonic = getModeTonicToken(mode);
  if (modalTemplates?.length) {
    const prev = previousToken && romanToDegree(previousToken) ? previousToken : tonic;
    const options = [];
    modalTemplates.forEach((tokens) => {
      for (let i = 0; i < tokens.length; i += 1) {
        if (tokens[i] !== prev) continue;
        options.push(tokens[(i + 1) % tokens.length]);
      }
    });
    if (options.length > 0) {
      return options[Math.floor(Math.random() * options.length)];
    }
    return modalTemplates[0][0] || tonic;
  }

  const corpus = getCorpusForMode(mode);
  const prev = previousToken && romanToDegree(previousToken) ? previousToken : tonic;
  const transitions = buildTransitionMap(mode);
  const options = transitions[prev] || [];
  if (options.length > 0) {
    const pick = weightedPick(options, (option) => option.weight || 1);
    if (pick?.token) return pick.token;
  }
  const seed = weightedPick(corpus, (entry) => entry.weight || 1);
  if (seed?.tokens?.length) {
    const idx = seed.tokens.lastIndexOf(prev);
    if (idx >= 0 && idx < seed.tokens.length - 1) return seed.tokens[idx + 1];
    return seed.tokens[0];
  }
  return tonic;
}

function chooseMusicalProgression(length, mode, spice) {
  const normalizedMode = normalizeMode(mode);
  if (MODAL_PROGRESSIONS[normalizedMode]?.length) {
    return chooseModalProgression(length, normalizedMode, spice);
  }

  const source = getCorpusForMode(normalizedMode);
  let corpus = source;
  if (spice === "none") {
    const filtered = source.filter((entry) => (entry.tokens || []).every((token) => isDiatonicRomanToken(token, normalizedMode)));
    if (filtered.length > 0) corpus = filtered;
  }
  const transitionMap = buildTransitionMap(normalizedMode, corpus);
  const tonic = getModeTonicToken(normalizedMode);
  const seed = weightedPick(corpus, (entry) => entry.weight || 1) || { tokens: [tonic] };
  let picks = [];
  if (length <= seed.tokens.length) {
    picks = seed.tokens.slice(0, length);
  } else {
    picks = seed.tokens.slice();
    while (picks.length < length) {
      const prev = picks[picks.length - 1];
      const options = transitionMap[prev] || [];
      let nextToken = null;
      if (options.length > 0) {
        const filtered = options.filter((opt) => opt.token !== prev);
        const pool = filtered.length > 0 ? filtered : options;
        const next = weightedPick(pool, (opt) => opt.weight || 1);
        nextToken = next?.token || null;
      }
      if (!nextToken) {
        const fallback = weightedPick(corpus, (entry) => entry.weight || 1) || { tokens: [tonic] };
        nextToken = fallback.tokens[Math.floor(Math.random() * fallback.tokens.length)] || tonic;
      }
      picks.push(nextToken);
    }
  }

  const spiceChance = spice === "bold" ? 0.45 : spice === "light" ? 0.2 : 0;
  const spiceCap = spice === "bold" ? Math.max(1, Math.floor(length / 3)) : spice === "light" ? 1 : 0;
  const borrowedPool = getBorrowedPool(normalizedMode);
  let replaced = 0;
  for (let i = 1; i < picks.length - 1 && replaced < spiceCap; i += 1) {
    if (Math.random() >= spiceChance) continue;
    if (!isDiatonicRomanToken(picks[i], normalizedMode)) continue;
    picks[i] = borrowedPool[Math.floor(Math.random() * borrowedPool.length)];
    replaced += 1;
  }

  if (picks.length > 0 && picks[0] !== tonic && picks[picks.length - 1] !== tonic) {
    if (Math.random() < 0.5) picks[0] = tonic;
    else picks[picks.length - 1] = tonic;
  }

  if (spice === "none") {
    picks = picks.map((token) => toDiatonicRomanToken(token, normalizedMode));
  }

  return picks.slice(0, length);
}

function chooseModalProgression(length, mode, spice) {
  const templates = MODAL_PROGRESSIONS[mode] || [];
  const tonic = getModeTonicToken(mode);
  let picks = [];

  if (templates.length > 0) {
    const seed = templates[Math.floor(Math.random() * templates.length)];
    if (length <= seed.length) {
      picks = seed.slice(0, length);
    } else {
      picks = seed.slice();
      while (picks.length < length) {
        picks.push(seed[picks.length % seed.length] || tonic);
      }
    }
  } else {
    const degrees = getModeConfig(mode).degrees || [tonic];
    const pool = degrees.filter((token) => token !== tonic);
    picks = [tonic];
    while (picks.length < length) {
      picks.push(pool[Math.floor(Math.random() * Math.max(1, pool.length))] || tonic);
    }
  }

  const spiceChance = spice === "bold" ? 0.35 : spice === "light" ? 0.15 : 0;
  const spiceCap = spice === "bold" ? Math.max(1, Math.floor(length / 4)) : spice === "light" ? 1 : 0;
  const borrowedPool = getBorrowedPool(mode);
  let replaced = 0;
  for (let i = 1; i < picks.length - 1 && replaced < spiceCap; i += 1) {
    if (Math.random() >= spiceChance) continue;
    if (!isDiatonicRomanToken(picks[i], mode)) continue;
    picks[i] = borrowedPool[Math.floor(Math.random() * borrowedPool.length)];
    replaced += 1;
  }

  if (picks.length > 0 && picks[0] !== tonic && picks[picks.length - 1] !== tonic) {
    if (Math.random() < 0.5) picks[0] = tonic;
    else picks[picks.length - 1] = tonic;
  }

  if (spice === "none") {
    picks = picks.map((token) => toDiatonicRomanToken(token, mode));
  }

  return picks.slice(0, length);
}

function getExtensionForToken(token, mode, spice) {
  const intensity = spice === "bold" ? 0.38 : spice === "light" ? 0.18 : 0.08;
  if (Math.random() > intensity) return [];
  if (token === "V" || token === "v" || token === "bVII") {
    return Math.random() < 0.6 ? ["7"] : ["9"];
  }
  const tonic = getModeTonicToken(mode);
  if (token === tonic) {
    return getModeFamily(mode) === "major" ? ["maj7"] : ["7"];
  }
  const options = [["7"], ["9"], ["add9"], ["sus4"], ["maj7"]];
  return options[Math.floor(Math.random() * options.length)];
}

function generateProgression() {
  const length = parseInt(genLength?.value || "4", 10);
  const spice = genSpice?.value || "light";
  const rhythm = genRhythm?.value || "steady";

  const randomTempo = Math.floor(90 + Math.random() * 41);
  state.tempo = randomTempo;
  if (tempoSlider) tempoSlider.value = randomTempo;
  if (tempoLabel) tempoLabel.textContent = `${randomTempo} bpm`;
  if (tempoLabelMobile) tempoLabelMobile.textContent = `${randomTempo} bpm`;

  const randomKey = getRandomKeyName();
  const chosenKey = state.keyLocked ? state.key : randomKey;
  state.key = normalizeKeyDisplay(chosenKey);
  if (keySelect) keySelect.value = FLAT_EQUIV[state.key] || state.key;

  const selectedMode = modeSelect?.value || "major";
  const chosenMode = selectedMode === "random"
    ? BASIC_MODE_OPTIONS[Math.floor(Math.random() * BASIC_MODE_OPTIONS.length)]
    : normalizeMode(selectedMode);
  state.mode = chosenMode;
  if (modeSelect && selectedMode !== "random") {
    modeSelect.value = chosenMode;
  }

  const styleOptions = ["clean", "neosoul", "jazz", "cinematic"];
  const chosenStyle = styleSelect?.value === "random" ? styleOptions[Math.floor(Math.random() * styleOptions.length)] : styleSelect?.value || "clean";
  setStyle(chosenStyle);
  applyInstrumentDefaults(true);

  const drumOptions = Object.keys(DRUM_PATTERN_BANK);
  const chosenDrum = drumStyleSelect?.value === "random" ? drumOptions[Math.floor(Math.random() * drumOptions.length)] : drumStyleSelect?.value || "pop";
  state.drumStyle = chosenDrum;
  if (drumStyleSelect) drumStyleSelect.value = chosenDrum;
  selectDrumPattern();
  if (state.audioCtx) {
    loadDrumSamplesForStyle(state.drumStyle);
  }

  const rhythmMap = {
    pulse: "quarters",
    drive: "eighths",
    syncopated: "syncopated",
    offbeat: "offbeat",
    answer: "answer",
    split: "split",
    chop: "chop",
    push: "push",
    tresillo: "tresillo",
    habanera: "habanera",
    clave: "clave",
    sparse: "sparse"
  };
  if (rhythmMap[rhythm]) {
    state.rhythm = rhythmMap[rhythm];
    if (rhythmSelect) rhythmSelect.value = state.rhythm;
    if (["split", "answer", "chop"].includes(state.rhythm)) {
      state.texture = "split";
      if (textureSelect) textureSelect.value = state.texture;
    }
  } else if (rhythm === "steady") {
    state.rhythm = "whole";
    if (rhythmSelect) rhythmSelect.value = state.rhythm;
  }

  buildChordPalette();
  updateScaleNotes();
  buildFretboard();
  updateSpicySuggestion();
  updateKeyBanner();

  const picks = chooseMusicalProgression(length, state.mode, spice);

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
    const exts = getExtensionForToken(token, state.mode, spice);
    return createChordItem(token, beats, null, exts);
  });

  state.sectionA = normalizeProgression(items);
  state.sectionB = [];
  state.hasBSection = false;
  state.activeSection = "A";
  state.progression = state.sectionA;
  state.selectedChord = 0;
  updateSectionControls();
  updateChordEditor();
  renderProgression();
  scheduleSessionSave();
}

function refreshProgression() {
  if (state.isPlaying || state.isCountingIn || state.isPaused) {
    if (!state.isPaused) pausePlayback();
    clearCountIn();
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
    state.uiTimeouts.forEach((id) => clearTimeout(id));
    state.uiTimeouts = [];
    state.isPlaying = false;
    state.isPaused = false;
    state.isCountingIn = false;
    state.pauseStartTime = null;
    state.lastAutoScrollSection = null;
    resetTransportTimeline();
    updatePlayButton();
  }
  generateProgression();
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
  const modeConfig = getModeConfig(state.mode);
  const scale = getModeScale(state.mode);
  const { degrees, qualities } = modeConfig;
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
  const { degrees, qualities } = getModeConfig(state.mode);
  degrees.forEach((degree, idx) => {
    const quality = qualities[idx];
    const exts = quality === "dim" ? ["7", "9"] : ["6", "7", "9"];
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
  syncActiveSectionFromProgression();
  const sectionA = getSectionProgression("A");
  const sectionB = getSectionProgression("B");
  const renderSection = (container, section, items) => {
    if (!container) return;
    container.innerHTML = "";
    let lastChordEl = null;
    items.forEach((item, idx) => {
      const itemEl = document.createElement("div");
      const description = describeItem(item);
      itemEl.className = "progression-item";
      if (state.isPlaying && state.playingSection === section && idx === state.uiChord) itemEl.classList.add("playing");
      if (state.activeSection === section && idx === state.selectedChord) itemEl.classList.add("selected");
      itemEl.draggable = true;
      itemEl.dataset.index = idx;
      itemEl.dataset.section = section;
      const beatLabel = item.beats !== 1 ? `<div class="beats">${formatBeatLabel(item.beats)}</div>` : "";
      itemEl.innerHTML = `<span>${description.label}</span><strong>${description.name}</strong>${beatLabel}<button class="remove-chord" aria-label="Remove">×</button>`;
      itemEl.title = "Click to select";
      itemEl.addEventListener("click", (event) => {
        if (event.target.classList.contains("remove-chord")) return;
        switchActiveSection(section);
        state.selectedChord = idx;
        state.selectionDirtyForPlayback = true;
        state.editorPinned = false;
        if (chordEditor) chordEditor.classList.add("hidden");
        updateChordEditor();
        renderProgression();
        openChordPopup();
      });
      itemEl.querySelector(".remove-chord").addEventListener("click", (event) => {
        event.stopPropagation();
        switchActiveSection(section);
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
      container.appendChild(itemEl);
      lastChordEl = itemEl;
    });

    const addChord = () => {
      switchActiveSection(section);
      const last = state.progression[state.progression.length - 1];
      const token = suggestNextTokenFromCorpus(last?.token, state.mode);
      const beats = typeof last?.beats === "number" ? last.beats : 4;
      state.progression.push(createChordItem(token, beats));
      state.selectedChord = state.progression.length - 1;
      state.selectionDirtyForPlayback = true;
      updateChordEditor();
      renderProgression();
    };

    const useMobileAdd = window.innerWidth <= 900;
    if (lastChordEl) {
      if (useMobileAdd) {
        const mobileAddBtn = document.createElement("button");
        mobileAddBtn.className = "progression-mobile-add";
        mobileAddBtn.type = "button";
        mobileAddBtn.dataset.section = section;
        mobileAddBtn.setAttribute("aria-label", `Add chord to ${section} section`);
        mobileAddBtn.textContent = "+";
        mobileAddBtn.addEventListener("click", addChord);
        container.appendChild(mobileAddBtn);
      } else {
        const inlineAddBtn = document.createElement("button");
        inlineAddBtn.className = "progression-inline-add";
        inlineAddBtn.type = "button";
        inlineAddBtn.dataset.section = section;
        inlineAddBtn.setAttribute("aria-label", `Add chord to ${section} section`);
        inlineAddBtn.textContent = "+";
        inlineAddBtn.addEventListener("click", (event) => {
          event.stopPropagation();
          addChord();
        });
        lastChordEl.appendChild(inlineAddBtn);
      }
    } else {
      const emptyAddBtn = document.createElement("button");
      emptyAddBtn.className = useMobileAdd ? "progression-mobile-add" : "progression-add";
      emptyAddBtn.type = "button";
      emptyAddBtn.dataset.section = section;
      emptyAddBtn.setAttribute("aria-label", `Add chord to ${section} section`);
      if (useMobileAdd) emptyAddBtn.textContent = "+";
      else emptyAddBtn.innerHTML = "<span>+</span>";
      emptyAddBtn.addEventListener("click", addChord);
      container.appendChild(emptyAddBtn);
    }
  };

  renderSection(progressionAEl, "A", sectionA);
  renderSection(progressionBEl, "B", sectionB);
  if (state.activeSection === "A") state.progression = sectionA;
  else state.progression = sectionB;
  updateSectionControls();
  syncProgressionInput();
  if (chordPopup && !chordPopup.classList.contains("hidden")) {
    syncChordPopup();
    positionChordPopup();
  }
}

document.addEventListener("click", (event) => {
  if (!chordEditor) return;
  const clickedChord = event.target.closest(".progression-item");
  const clickedEditor = event.target.closest(".chord-editor");
  const clickedPopup = event.target.closest("#chordPopup");
  if (clickedChord || clickedEditor || clickedPopup) return;
  state.editorPinned = false;
  chordEditor.classList.add("hidden");
  closeChordPopup();
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
      const parsed = parseChordName(core);
      if (parsed && parsed.exts.length) {
        return createChordItem(core, beats, null, parsed.exts);
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

function parseExtensionSuffix(extPart = "") {
  const suffix = String(extPart || "").toLowerCase();
  if (!suffix) return [];
  const exts = [];
  if (suffix.includes("sus4")) exts.push("sus4");
  if (suffix.includes("add9")) exts.push("add9");
  if (suffix.includes("maj7")) exts.push("maj7");
  if (suffix.includes("13")) exts.push("13");
  if (suffix.includes("11")) exts.push("11");
  if (suffix.includes("9") && !suffix.includes("add9")) exts.push("9");
  if (suffix.includes("6") && !suffix.includes("16")) exts.push("6");
  if (suffix.includes("7") && !suffix.includes("maj7")) exts.push("7");
  return exts;
}

function buildChordTokenDisplay(token, exts = []) {
  if (!exts || exts.length === 0) return token;
  if (exts.length === 1) {
    const ext = exts[0];
    if (["6", "7", "9", "11", "13"].includes(ext)) return `${token}${ext}`;
    if (ext === "maj7") return `${token}maj7`;
    if (ext === "add9") return `${token}add9`;
    if (ext === "sus4") return `${token}sus4`;
  }
  return `${token}(${exts.join(",")})`;
}

function parseRomanToken(token) {
  const match = token.match(/^([b#]?[ivIV]+°?)(.*)$/);
  if (!match) return null;
  const roman = match[1];
  if (!romanToDegree(roman)) return null;
  return { token: roman, exts: parseExtensionSuffix(match[2]) };
}

function parseTokenBeat(token) {
  const match = token.match(/^(.*?)(?::([0-9.]+))?$/);
  const core = match ? match[1] : token;
  const beats = match && match[2] ? Math.max(0.5, parseFloat(match[2])) : 4;
  return { core, beats };
}

let dragData = null;

function handleDragStart(event) {
  dragData = {
    index: parseInt(event.currentTarget.dataset.index, 10),
    section: event.currentTarget.dataset.section || state.activeSection
  };
  event.dataTransfer.effectAllowed = "move";
}

function handleDragOver(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
}

function handleDrop(event) {
  event.preventDefault();
  const dropIndex = parseInt(event.currentTarget.dataset.index, 10);
  const dropSection = event.currentTarget.dataset.section || state.activeSection;
  const data = event.dataTransfer.getData("application/json");
  if (data) {
    const item = normalizeProgression([JSON.parse(data)])[0];
    if (Number.isNaN(dropIndex)) return;
    switchActiveSection(dropSection);
    state.progression[dropIndex] = item;
    state.selectedChord = dropIndex;
    updateChordEditor();
    renderProgression();
    return;
  }
  if (!dragData || Number.isNaN(dragData.index) || Number.isNaN(dropIndex) || dragData.index === dropIndex) return;
  if (dragData.section !== dropSection) return;
  switchActiveSection(dropSection);
  const updated = state.progression.slice();
  const [moved] = updated.splice(dragData.index, 1);
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

function noteToPitchClass(note) {
  const normalized = FLAT_EQUIV[note] || note;
  return NOTES.indexOf(normalized);
}

function caseRomanForDegreeIndex(degreeIndex) {
  const degreeToken = getModeConfig(state.mode).degrees[degreeIndex] || "I";
  const lower = degreeToken.replace(/[^iv]/g, "").length > 0;
  const base = ["I", "II", "III", "IV", "V", "VI", "VII"][degreeIndex] || "I";
  return lower ? base.toLowerCase() : base;
}

function findModeRomanTokenForRoot(rootNote) {
  const tonicPc = noteToPitchClass(state.key);
  const targetPc = noteToPitchClass(rootNote);
  if (tonicPc < 0 || targetPc < 0) return null;
  const scale = getModeScale(state.mode);
  const modeConfig = getModeConfig(state.mode);
  for (let degree = 0; degree < scale.length; degree += 1) {
    const naturalPc = (tonicPc + scale[degree] + 1200) % 12;
    if (naturalPc === targetPc) return modeConfig.degrees[degree];
    if ((naturalPc + 1) % 12 === targetPc) return `#${caseRomanForDegreeIndex(degree)}`;
    if ((naturalPc + 11) % 12 === targetPc) return `b${caseRomanForDegreeIndex(degree)}`;
  }
  return null;
}

function romanToDegree(token) {
  const normalized = token.replace(/[^IViv°b#]/g, "");
  const match = normalized.match(/^([b#]?)([IViv]+°?)$/);
  if (!match) return null;
  const accidentalToken = match[1];
  let stripped = match[2];
  const accidental = accidentalToken === "b" ? -1 : accidentalToken === "#" ? 1 : 0;
  if (stripped.endsWith("°")) stripped = stripped.slice(0, -1);
  const degreeMap = {
    "I": 0,
    "II": 1,
    "III": 2,
    "IV": 3,
    "V": 4,
    "VI": 5,
    "VII": 6
  };
  const degree = degreeMap[stripped.toUpperCase()] ?? null;
  if (degree === null) return null;
  return { degree, accidental };
}

function chordFromDegree(token) {
  const parsed = romanToDegree(token);
  if (!parsed) return { root: "C", intervals: [0, 4, 7], quality: "maj" };
  const scale = getModeScale(state.mode);
  const modeConfig = getModeConfig(state.mode);
  const { degree } = parsed;
  let { accidental } = parsed;
  // In natural minor, III/VI/VII are already flat relative to major.
  // Treat bIII/bVI/bVII as diatonic to avoid double-flatting.
  if (state.mode === "minor" && accidental === -1 && (degree === 2 || degree === 5 || degree === 6)) {
    accidental = 0;
  }
  const root = noteAt(state.key, scale[degree] + accidental, shouldUseFlatsForToken(token));
  let quality = modeConfig.qualities[degree];
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
  const rawSuffix = match[3] || "";
  const suffix = rawSuffix.toLowerCase();
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

  return { root, intervals, name: `${root}${suffix}`, quality, exts: parseExtensionSuffix(suffix) };
}

function chordFromItem(item) {
  if (romanToDegree(item.token)) {
    const chord = chordFromDegree(item.token);
    const intervals = applyExtensions(chord.intervals, chord.quality, item.exts);
    return { root: chord.root, intervals, quality: chord.quality };
  }
  const parsed = parseChordName(item.token);
  if (parsed) {
    const mergedExts = Array.from(new Set([...(parsed.exts || []), ...(item.exts || [])]));
    const intervals = applyExtensions(parsed.intervals, parsed.quality, mergedExts);
    return { root: parsed.root, intervals, quality: parsed.quality, name: parsed.name };
  }
  return { root: "C", intervals: [0, 4, 7], quality: "maj" };
}

function describeItem(item) {
  const roman = romanToDegree(item.token);
  if (roman) {
    const chord = chordFromDegree(item.token);
    const base = formatChordName(chord.root, chord.quality, state.chordSize);
    const chordToken = buildChordTokenDisplay(item.token, item.exts);
    const label = isDiatonicRomanToken(item.token, state.mode) ? chordToken : `Spicy (${chordToken})`;
    return { label, name: buildChordName(base, item.exts) };
  }
  const parsed = parseChordName(item.token);
  if (parsed) {
    const spicyToken = item.roman
      ? buildChordTokenDisplay(item.roman, item.exts)
      : buildChordTokenDisplay(item.token, item.exts);
    const label = `Spicy (${spicyToken})`;
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
  const hasTertianExt = exts.includes("9") || exts.includes("11") || exts.includes("13");
  const addSeventh = (value) => set.add(value);
  if (exts.includes("maj7")) addSeventh(11);
  if (exts.includes("7")) {
    addSeventh(10);
  } else if (hasTertianExt && !exts.includes("maj7")) {
    // Chords labeled 9/11/13 imply a 7th by convention unless explicitly maj7.
    addSeventh(10);
  }
  if (exts.includes("9") || exts.includes("add9") || exts.includes("11") || exts.includes("13")) set.add(14);
  if (exts.includes("6")) set.add(9);
  if (exts.includes("11") || exts.includes("13")) set.add(17);
  if (exts.includes("13")) set.add(21);
  return Array.from(set).sort((a, b) => a - b);
}

function buildChordName(baseName, exts = []) {
  const extras = exts.filter((ext) => !baseName.toLowerCase().includes(ext));
  if (extras.length === 0) return baseName;
  if (extras.length === 1) {
    const ext = extras[0];
    if (["6", "7", "9", "11", "13"].includes(ext)) return `${baseName}${ext}`;
    if (ext === "maj7") return `${baseName}maj7`;
    if (ext === "add9") return `${baseName}add9`;
    if (ext === "sus4") return `${baseName}sus4`;
  }
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
  state.masterCompressor = compressor;
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
  setupLatencyProbe();

  // Instrument buses
  state.guitarBusGain.gain.value = state.guitarLevel;
  state.pianoBusGain.gain.value = state.pianoLevel;
  state.bassBusGain.gain.value = state.bassLevel;
  state.guitarBusGain.connect(state.masterCompressor);
  state.pianoBusGain.connect(state.masterFilter);
  state.bassBusGain.connect(state.masterFilter);

  state.drumBus = state.audioCtx.createGain();
  state.drumBus.gain.value = state.drumLevel;
  state.drumBus.connect(state.audioCtx.destination);

  state.noiseBuffer = state.audioCtx.createBuffer(1, state.audioCtx.sampleRate, state.audioCtx.sampleRate);
  const data = state.noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }

  loadSamples();
  loadDrumSamples();
}

async function setupLatencyProbe() {
  if (!state.audioCtx || !state.audioCtx.audioWorklet || state.latencyProbeReady) return;
  const processorCode = `
    class LatencyProbeProcessor extends AudioWorkletProcessor {
      constructor() {
        super();
        this.threshold = 0.08;
        this.cooldown = 0;
        this.cooldownFrames = 2400;
        this.lastPeak = 0;
        this.port.onmessage = (event) => {
          if (event.data && typeof event.data.threshold === 'number') {
            this.threshold = event.data.threshold;
          }
          if (event.data && event.data.reset) {
            this.cooldown = 0;
            this.lastPeak = 0;
          }
          if (event.data && event.data.requestPeak) {
            this.port.postMessage({ peak: this.lastPeak });
          }
        };
      }
      process(inputs) {
        const input = inputs[0];
        if (!input || !input[0]) return true;
        const channel = input[0];
        let peak = 0;
        for (let i = 0; i < channel.length; i++) {
          const v = Math.abs(channel[i]);
          if (v > peak) peak = v;
        }
        this.lastPeak = Math.max(this.lastPeak, peak);
        if (this.cooldown > 0) {
          this.cooldown -= channel.length;
        } else if (peak >= this.threshold) {
          const time = currentFrame / sampleRate;
          this.port.postMessage({ time, peak });
          this.cooldown = this.cooldownFrames;
        }
        return true;
      }
    }
    registerProcessor('latency-probe', LatencyProbeProcessor);
  `;
  const blob = new Blob([processorCode], { type: "application/javascript" });
  const url = URL.createObjectURL(blob);
  await state.audioCtx.audioWorklet.addModule(url);
  URL.revokeObjectURL(url);
  state.latencyProbe = new AudioWorkletNode(state.audioCtx, "latency-probe");
  state.latencyProbeGain = state.audioCtx.createGain();
  state.latencyProbeGain.gain.value = 0;
  state.latencyProbe.port.onmessage = (event) => {
    const data = event.data;
    if (!data) return;
    // Detection events include both { time, peak }.
    if (typeof data.time !== "number") {
      if (typeof data.peak === "number" && DEBUG_AUDIO) {
        console.log("[GPL] latency peak", data.peak);
      }
      return;
    }
    if (!state.latencyTest.active) return;
    while (state.latencyTest.index < state.latencyTest.events.length) {
      const current = state.latencyTest.events[state.latencyTest.index];
      if (data.time > current.time + 0.45) {
        if (!current.matched) {
          current.matched = true;
          state.latencyTest.results.push({ label: current.label, delay: null });
        }
        state.latencyTest.index += 1;
        continue;
      }
      if (data.time < current.time - 0.03) return;
      const delay = (data.time - current.time) * 1000;
      current.matched = true;
      state.latencyTest.results.push({ label: current.label, delay });
      state.latencyTest.index += 1;
      break;
    }
    if (state.latencyTest.index >= state.latencyTest.events.length) {
      finalizeLatencyTest(false);
    }
  };
  if (state.masterCompressor) {
    state.masterCompressor.connect(state.latencyProbe);
  } else {
    state.masterGain.connect(state.latencyProbe);
  }
  if (state.drumBus) {
    state.drumBus.connect(state.latencyProbe);
  }
  state.latencyProbe.connect(state.latencyProbeGain);
  state.latencyProbeGain.connect(state.audioCtx.destination);
  state.latencyProbeReady = true;
}

function finalizeLatencyTest(markMissing = false) {
  if (markMissing) {
    state.latencyTest.events.forEach((eventItem) => {
      if (!eventItem.matched) {
        state.latencyTest.results.push({ label: eventItem.label, delay: null });
        eventItem.matched = true;
      }
    });
  }
  state.latencyTest.active = false;
  const labels = ["Drum", "Piano", "Bass"];
  const medians = {};
  const lines = labels.map((label) => {
    const values = state.latencyTest.results
      .filter((entry) => entry.label === label && typeof entry.delay === "number")
      .map((entry) => entry.delay)
      .sort((a, b) => a - b);
    if (values.length === 0) return `${label}: —`;
    const median = values[Math.floor(values.length / 2)];
    medians[label] = median;
    return `${label}: ${Math.round(median)}ms`;
  });
  if (latencyResult) {
    let recommend = "";
    if (typeof medians.Drum === "number") {
      const suggestions = [];
      if (typeof medians.Piano === "number") {
        const next = Math.round(state.sampleOffsetMs - (medians.Piano - medians.Drum));
        suggestions.push(`piano ${next}ms`);
      }
      if (typeof medians.Bass === "number") {
        const next = Math.round(state.bassOffsetMs - (medians.Bass - medians.Drum));
        suggestions.push(`bass ${next}ms`);
      }
      if (suggestions.length > 0) {
        recommend = ` | suggested -> ${suggestions.join(", ")}`;
      }
    }
    latencyResult.textContent = `Latency test: ${lines.join(" · ")} | offsets -> piano: ${state.sampleOffsetMs}ms, bass: ${state.bassOffsetMs}ms${recommend}`;
  }
}

function saveLatencyCompensation() {
  try {
    const payload = { bassOffsetMs: state.bassOffsetMs || 0 };
    localStorage.setItem(LATENCY_COMP_KEY, JSON.stringify(payload));
  } catch (error) {
    // best-effort persistence; ignore storage failures
  }
}

function loadLatencyCompensation() {
  try {
    const raw = localStorage.getItem(LATENCY_COMP_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (typeof parsed.bassOffsetMs === "number") {
      state.bassOffsetMs = Math.max(-120, Math.min(120, parsed.bassOffsetMs));
      if (bassTimingSlider) bassTimingSlider.value = String(state.bassOffsetMs);
      if (bassTimingValue) bassTimingValue.textContent = `${state.bassOffsetMs}ms`;
    }
  } catch (error) {
    // ignore malformed storage
  }
}

async function startPlayback() {
  syncActiveSectionFromProgression();
  state.playbackSequence = buildPlaybackSequence();
  if (state.isPlaying || state.playbackSequence.length === 0) return;
  if (!state.audioCtx) initAudio();
  state.isLoading = true;
  updatePlayButton();
  await ensureSamplesReady();
  state.isLoading = false;
  updatePlayButton();

  state.isPlaying = true;
  state.isPaused = false;
  state.lastAutoScrollSection = null;
  primePlaybackFromSelectedChord();
  updateChordEditor();
  state.fretMode = "chord";
  buildFretboard();
  if (!state.sessionTimerId) startSession();
  const firstSection = state.playingSection || state.activeSection || "A";
  scrollToSectionOnMobile(firstSection, true);
  beginCountIn();
}

function scrollToSectionOnMobile(section = "A", force = false) {
  if (window.innerWidth > 900) return;
  if (!force && state.lastAutoScrollSection === section) return;
  const heading = document.querySelector(`.progression-section[data-section="${section}"] .progression-section-head`);
  const fallback = section === "B" ? progressionBEl : progressionAEl;
  const target = heading || fallback;
  if (!target || typeof target.scrollIntoView !== "function") return;
  const run = () => target.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  state.lastAutoScrollSection = section;
  if (typeof requestAnimationFrame === "function") requestAnimationFrame(run);
  else setTimeout(run, 0);
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
  stopBeatCounterLoop();
  updatePlayButton();
}

function resumePlayback() {
  if (!state.isPlaying || !state.isPaused) return;
  if (state.pauseStartTime) {
    state.pausedTotalMs += Date.now() - state.pauseStartTime;
    state.pauseStartTime = null;
  }
  state.isPaused = false;
  if (state.selectionDirtyForPlayback) {
    syncActiveSectionFromProgression();
    state.playbackSequence = buildPlaybackSequence();
    primePlaybackFromSelectedChord();
    state.lastAutoScrollSection = null;
    scrollToSectionOnMobile(state.playingSection || "A", true);
  }
  beginCountIn();
}

function beginCountIn() {
  if (!state.audioCtx) return;
  if (state.audioCtx.state === "suspended") state.audioCtx.resume();
  stopBeatCounterLoop();
  clearCountIn();
  state.isCountingIn = true;
  const beat = 60 / state.tempo;
  const startTime = state.audioCtx.currentTime + 0.05;
  const beats = 4;

  if (DEBUG_AUDIO) {
    console.log("[GPL] count-in start", {
      tempo: state.tempo,
      startTime,
      audioTime: state.audioCtx.currentTime,
      drumsEnabled: state.drumsEnabled,
      drumSamplesLoaded: state.drumSamplesLoaded
    });
  }

  if (countInEl) {
    Array.from(countInEl.querySelectorAll("span")).forEach((span) => span.classList.remove("active"));
  }

  // count-in drums for one bar (explicit hits so it never drops)
  scheduleCountInDrums(startTime);

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
    state.drumBarCount = 0;
    state.nextDrumTime = state.nextTime;
    state.lastCountBar = null;
    startBeatCounterLoop(state.nextDrumTime);
    const firstEntry = state.playbackSequence[state.currentChord % state.playbackSequence.length];
    if (firstEntry?.item) {
      updateNowPlaying(
        firstEntry.item,
        chordFromItem(firstEntry.item),
        firstEntry.sectionIndex,
        firstEntry.section
      );
    }
    state.timerId = setInterval(schedulePlayback, 25);
    updatePlayButton();
  }, (startTime - state.audioCtx.currentTime + beats * beat) * 1000);

  state.countInTimeouts.push(afterCountIn);
  updatePlayButton();
}

function resetTransportTimeline() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
  clearCountIn();
  stopBeatCounterLoop();
  state.isCountingIn = false;
  state.uiTimeouts.forEach((id) => clearTimeout(id));
  state.uiTimeouts = [];
  state.currentChord = 0;
  state.uiChord = 0;
  state.playbackSequence = buildPlaybackSequence();
  state.playingSection = state.playbackSequence[0]?.section || "A";
  state.nextTime = state.audioCtx ? state.audioCtx.currentTime + 0.05 : 0;
  state.nextDrumTime = state.nextTime;
  state.drumBarCount = 0;
  state.lastCountBar = null;
  state.lastVoicing = null;
}

function scheduleCountInDrums(startTime) {
  if (!state.drumsEnabled) return;
  const beat = 60 / state.tempo;
  const sound = DRUM_SOUNDS[state.drumStyle] || DRUM_SOUNDS.pop;
  const kitName = DRUM_STYLE_KIT[state.drumStyle] || "pearl";
  const kit = DRUM_KITS[kitName];
  const useSamples = state.drumSamplesLoaded && kit;
  const kickSteps = [0, 2];
  const snareSteps = [1, 3];
  kickSteps.forEach((step) => {
    const hitTime = startTime + step * beat;
    if (DEBUG_AUDIO) console.log("[GPL] count-in kick", { hitTime, useSamples });
    if (!(useSamples && playDrumSample(kit.kick, hitTime, 0.9))) playKick(hitTime, sound);
  });
  snareSteps.forEach((step) => {
    const hitTime = startTime + step * beat;
    const snareUrl = kit?.snareA;
    if (DEBUG_AUDIO) console.log("[GPL] count-in snare", { hitTime, useSamples });
    if (!(useSamples && snareUrl && playDrumSample(snareUrl, hitTime, 0.8))) playSnare(hitTime, sound);
  });
}

function clearCountIn() {
  state.countInTimeouts.forEach((id) => clearTimeout(id));
  state.countInTimeouts = [];
  if (countInEl) {
    Array.from(countInEl.querySelectorAll("span")).forEach((span) => span.classList.remove("active"));
  }
}

function stopBeatCounterLoop() {
  if (state.beatCounterRaf !== null) {
    if (typeof cancelAnimationFrame === "function") cancelAnimationFrame(state.beatCounterRaf);
    else clearTimeout(state.beatCounterRaf);
    state.beatCounterRaf = null;
  }
  state.beatCounterStartTime = null;
  state.beatCounterLastStep = -1;
  if (countInEl) {
    Array.from(countInEl.querySelectorAll("span")).forEach((span) => span.classList.remove("active"));
  }
}

function startBeatCounterLoop(startTime) {
  if (!countInEl || !state.audioCtx || !Number.isFinite(startTime)) return;
  stopBeatCounterLoop();
  state.beatCounterStartTime = startTime;
  state.beatCounterLastStep = -1;

  const requestFrame = typeof requestAnimationFrame === "function"
    ? requestAnimationFrame
    : (cb) => setTimeout(cb, 16);

  const tick = () => {
    if (!state.isPlaying || state.isPaused || state.isCountingIn || !state.audioCtx || !Number.isFinite(state.beatCounterStartTime)) {
      state.beatCounterRaf = null;
      return;
    }
    const beat = 60 / state.tempo;
    const elapsed = state.audioCtx.currentTime - state.beatCounterStartTime;
    if (elapsed >= 0) {
      const step = ((Math.floor(elapsed / beat) % 4) + 4) % 4;
      if (step !== state.beatCounterLastStep) {
        state.beatCounterLastStep = step;
        const spans = Array.from(countInEl.querySelectorAll("span"));
        spans.forEach((span) => span.classList.remove("active"));
        const active = countInEl.querySelector(`span[data-count="${step + 1}"]`);
        if (active) active.classList.add("active");
      }
    }
    state.beatCounterRaf = requestFrame(tick);
  };

  state.beatCounterRaf = requestFrame(tick);
}

async function togglePlayback() {
  if (!state.isPlaying) {
    await startPlayback();
    return;
  }
  if (state.isPaused) resumePlayback();
  else pausePlayback();
}

function updatePlayButton() {
  if (!playBtn) return;
  if (state.isLoading) {
    playBtn.textContent = "Loading…";
    if (mobilePlay) mobilePlay.textContent = "Loading…";
    return;
  }
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
  const sequence = state.playbackSequence && state.playbackSequence.length ? state.playbackSequence : buildPlaybackSequence();
  state.playbackSequence = sequence;
  if (!sequence.length) return;
  const earliestOffset = Math.min(0, (state.sampleOffsetMs || 0) / 1000, (state.bassOffsetMs || 0) / 1000);
  const offsetPad = Math.max(0, -earliestOffset);
  const lookAhead = Math.max(0.15, offsetPad + 0.05);
  const barLength = (60 / state.tempo) * 4;
  while (state.nextTime < state.audioCtx.currentTime + lookAhead) {
    const index = state.currentChord % sequence.length;
    const entry = sequence[index];
    const item = entry.item;
    const chord = chordFromItem(item);
    scheduleChord(item, chord, state.nextTime, entry.sectionIndex, item.beats, entry.section, index);
    const duration = (60 / state.tempo) * item.beats;
    state.nextTime += duration;
    state.currentChord = (state.currentChord + 1) % sequence.length;
  }

  // Drum scheduling must run independently from chord scheduling, otherwise
  // long-duration chords (e.g. 16 beats) only trigger drums for the first bar.
  if (state.drumsEnabled) {
    const section = state.activeDrumSection || state.playingSection || state.activeSection || "A";
    while (state.nextDrumTime < state.audioCtx.currentTime + lookAhead) {
      const fill = (state.drumBarCount + 1) % 8 === 0;
      scheduleDrums(state.nextDrumTime, 4, fill, section);
      state.nextDrumTime += barLength;
      state.drumBarCount += 1;
    }
  }
}

function getSplitCompGroups(notes) {
  const ordered = notes.slice().sort((a, b) => a - b);
  if (ordered.length === 0) return { low: [], high: [] };
  if (ordered.length === 1) return { low: [ordered[0]], high: [ordered[0] + 12] };
  if (ordered.length === 2) return { low: [ordered[0]], high: [ordered[1]] };
  if (ordered.length === 3) return { low: [ordered[0], ordered[1]], high: [ordered[1], ordered[2]] };
  return { low: ordered.slice(0, 2), high: ordered.slice(-2) };
}

function scheduleChord(item, chord, time, index, beats, section = state.activeSection, sequenceIndex = 0) {
  state.activeDrumSection = section;
  const { root, intervals } = chord;
  const baseMidi = noteToMidi(root, 3);
  const baseNotes = intervals.map((interval) => baseMidi + interval);
  const notes = getVoiceLedNotes(baseNotes, chord, baseMidi);
  const duration = (60 / state.tempo) * beats;
  const rhythmName = getRhythmNameForSection(section);
  const rhythm = getChordRhythm(beats, section, time);
  const isGuitar = state.sampleInstrument.startsWith("guitar");
  const isPiano = state.sampleInstrument === "piano";
  const useRealistic = isGuitar && state.realisticGuitar;
  const strumSpread = useRealistic ? 0.06 : 0.02;
  const pianoSpread = isPiano ? 0.006 : 0;
  const pianoJitter = () => (isPiano ? (Math.random() - 0.5) * 0.004 : 0);
  const isWhole = rhythmName === "whole";
  const beatDur = 60 / state.tempo;
  const hitTimes = rhythm.map((beat) => time + beatDur * beat);
  const splitGroups = getSplitCompGroups(notes);
  const groove = getStyleGrooveMs(section);
  const chordLagSec = isPiano ? groove.piano / 1000 : 0;
  const lowRootMidi = noteToMidi(root, 2);
  const lowFifthMidi = lowRootMidi + 7;
  const getHoldUntilNext = (idx, baseDuration) => {
    const next = hitTimes[idx + 1];
    if (!next) return baseDuration;
    const maxHold = Math.max(0.1, next - hitTimes[idx] - 0.01);
    return Math.min(baseDuration, maxHold);
  };
  const getCompVelocity = (base, hitTime, beatInBar = 0) => {
    const barIndex = getBarIndexAtTime(hitTime, beatDur);
    const phraseRole = getPhraseRoleForBar(barIndex);
    let factor = 1;
    if (Math.abs(beatInBar) < 0.01) factor *= 1.06;
    else if (Math.abs(beatInBar - 2) < 0.01) factor *= 1.02;
    else if (Math.abs(beatInBar - 0.5) < 0.01 || Math.abs(beatInBar - 1.5) < 0.01 || Math.abs(beatInBar - 2.5) < 0.01 || Math.abs(beatInBar - 3.5) < 0.01) factor *= 0.95;
    if (phraseRole === "lift") factor *= 1.03;
    if (phraseRole === "turnaround") factor *= 1.06;
    factor *= 0.95 + Math.random() * 0.1;
    return Math.max(0.45, Math.min(1.15, base * factor));
  };
  rhythm.forEach((beat, idx) => {
    const hitTime = time + (60 / state.tempo) * beat + chordLagSec;
    const beatInBar = ((beat % 4) + 4) % 4;
    const isStrongBeat = Math.abs(beatInBar) < 0.01 || Math.abs(beatInBar - 2) < 0.01;
    if (isPiano && isStrongBeat && Math.random() < 0.9) {
      const lowDur = Math.min(duration * 0.8, beatDur * (isWhole ? 2.2 : 1.5));
      const lowTime = hitTime + pianoJitter() * 0.4;
      playNote(lowRootMidi, lowTime, lowDur, getCompVelocity(0.54, lowTime, beatInBar));
      if (Math.random() < 0.33) {
        const fifthTime = lowTime + 0.01;
        playNote(lowFifthMidi, fifthTime, Math.min(lowDur, beatDur * 1.1), getCompVelocity(0.4, fifthTime, beatInBar));
      }
    }
    if (state.texture === "arp") {
      const noteDur = isWhole ? duration : getHoldUntilNext(idx, duration * 0.6);
      notes.forEach((midi, noteIdx) => {
        const noteTime = hitTime + noteIdx * 0.08;
        playNote(midi, noteTime, noteDur, getCompVelocity(0.85, noteTime, beatInBar));
      });
    } else if (state.texture === "split") {
      const noteDur = isWhole ? duration : getHoldUntilNext(idx, duration * 0.55);
      const group = idx % 2 === 0 ? splitGroups.low : splitGroups.high;
      const spread = isPiano ? pianoSpread : (useRealistic ? strumSpread * 0.55 : 0.01);
      const baseVelocity = idx % 2 === 0 ? 0.82 : 0.9;
      group.forEach((midi, groupIdx) => {
        const humanize = useRealistic ? (Math.random() - 0.5) * 0.01 : pianoJitter();
        const noteTime = hitTime + groupIdx * spread + humanize;
        const velocity = Math.max(0.55, baseVelocity - groupIdx * 0.07);
        playNote(midi, noteTime, noteDur, getCompVelocity(velocity, noteTime, beatInBar));
      });
      if (idx % 4 === 3 && Math.random() < 0.28) {
        const accentDur = isWhole ? duration * 0.4 : noteDur * 0.5;
        notes.forEach((midi, noteIdx) => {
          const accentSpread = isPiano ? noteIdx * (pianoSpread * 0.5) : noteIdx * 0.012;
          const accentTime = hitTime + 0.02 + accentSpread;
          playNote(midi, accentTime, accentDur, getCompVelocity(0.62, accentTime, beatInBar));
        });
      }
    } else if (state.texture === "pulse") {
      if (useRealistic) {
        const downstroke = Math.random() < 0.65;
        const ordered = downstroke ? notes.slice() : notes.slice().reverse();
        ordered.forEach((midi, idx) => {
          const humanize = (Math.random() - 0.5) * 0.01;
          const velocity = (downstroke ? 0.9 : 0.7) * (1 - idx * 0.05);
          const noteDur = isWhole ? duration : getHoldUntilNext(idx, duration * 0.4);
          const noteTime = hitTime + idx * (strumSpread * 0.7) + humanize;
          playNote(midi, noteTime, noteDur, getCompVelocity(velocity, noteTime, beatInBar));
        });
      } else {
        const isUpstroke = Math.random() < 0.4;
        const offset = isPiano ? pianoJitter() : (isUpstroke ? -0.02 : 0);
        const noteDur = isWhole ? duration : getHoldUntilNext(idx, duration * 0.35);
        notes.forEach((midi, noteIdx) => {
          const noteTime = hitTime + offset + (isPiano ? noteIdx * (pianoSpread * 0.4) : 0);
          playNote(midi, noteTime, noteDur, getCompVelocity(0.75, noteTime, beatInBar));
        });
      }
    } else {
      if (useRealistic) {
        const downstroke = Math.random() < 0.75;
        const ordered = downstroke ? notes.slice() : notes.slice().reverse();
        const mutedIndex = Math.random() < 0.18 ? Math.floor(Math.random() * ordered.length) : -1;
        ordered.forEach((midi, idx) => {
          if (idx === mutedIndex) return;
          const orderIdx = idx;
          const humanize = (Math.random() - 0.5) * 0.01;
          const velocity = (downstroke ? 0.95 : 0.8) * (1 - idx * 0.06);
          const noteDur = isWhole ? duration : getHoldUntilNext(idx, duration * 0.7);
          const noteTime = hitTime + orderIdx * strumSpread + humanize;
          playNote(midi, noteTime, noteDur, getCompVelocity(velocity, noteTime, beatInBar));
        });
      } else {
        const noteDur = isWhole ? duration : getHoldUntilNext(idx, duration * 0.7);
        notes.forEach((midi, noteIdx) => {
          const spread = isPiano ? noteIdx * pianoSpread : noteIdx * 0.02;
          const noteTime = hitTime + spread + pianoJitter();
          playNote(midi, noteTime, noteDur, getCompVelocity(0.9, noteTime, beatInBar));
        });
      }
    }

    if (isPiano && isWhole && beats >= 4) {
      const answerTime = hitTime + beatDur * 2 + pianoJitter();
      const chordEnd = time + duration;
      if (answerTime + 0.06 < chordEnd && Math.random() < 0.75) {
        const answerDur = Math.max(beatDur * 1.1, duration * 0.34);
        const answerNotes = notes.slice(-Math.min(3, notes.length));
        answerNotes.forEach((midi, noteIdx) => {
          const t = answerTime + noteIdx * (pianoSpread * 0.55);
          playNote(midi, t, answerDur, getCompVelocity(0.6, t, 2));
        });
      }
    }
  });

  scheduleUiUpdate(item, chord, time, index, section);
  if (state.bassEnabled) {
    scheduleBass(chord, time, item.beats, section, sequenceIndex);
  }
}

function buildGuitarVoicing(chord, baseMidi) {
  const intervals = chord.intervals.slice().sort((a, b) => a - b);
  const third = intervals.find((i) => i === 3 || i === 4);
  const fifth = intervals.find((i) => i === 7 || i === 6 || i === 8) ?? 7;
  const seventh = intervals.find((i) => i === 10 || i === 11);
  const tones = [0];
  if (third !== undefined) tones.push(third);
  if (fifth !== undefined) tones.push(fifth);
  if (seventh !== undefined) tones.push(seventh);
  while (tones.length < 4) tones.push(12);
  let rootMidi = baseMidi;
  while (rootMidi < 40) rootMidi += 12;
  while (rootMidi > 52) rootMidi -= 12;
  let notes = tones.map((interval) => rootMidi + interval);
  notes = notes.sort((a, b) => a - b);
  for (let i = 1; i < notes.length; i += 1) {
    while (notes[i] - notes[i - 1] < 3) {
      notes[i] += 12;
    }
  }
  while (Math.max(...notes) > 76) notes = notes.map((n) => n - 12);
  return notes;
}

function getVoiceLedNotes(baseNotes, chord, baseMidi) {
  const isGuitar = state.sampleInstrument.startsWith("guitar");
  const useRealistic = isGuitar && state.realisticGuitar;
  if (useRealistic && chord) {
    let voicing = buildGuitarVoicing(chord, baseMidi);
    if (state.lastVoicing) {
      const prev = state.lastVoicing.slice().sort((a, b) => a - b);
      voicing = voicing
        .slice()
        .sort((a, b) => a - b)
        .map((note, idx) => {
          const prevNote = prev[idx] ?? prev[prev.length - 1];
          const candidates = [note - 12, note, note + 12];
          return candidates.reduce((best, cand) => {
            const dist = Math.abs(prevNote - cand);
            return dist < Math.abs(prevNote - best) ? cand : best;
          }, candidates[0]);
        })
        .sort((a, b) => a - b);
    }
    state.lastVoicing = voicing.slice();
    return voicing;
  }

  const rangeMin = 48;
  const rangeMax = 84;
  const sorted = baseNotes.slice().sort((a, b) => a - b);
  const prev = state.lastVoicing ? state.lastVoicing.slice().sort((a, b) => a - b) : sorted;
  const candidates = [];
  const shifts = [-12, 0, 12];
  function build(idx, current) {
    if (idx >= sorted.length) {
      const ordered = current.slice().sort((a, b) => a - b);
      const min = ordered[0];
      const max = ordered[ordered.length - 1];
      if (min < rangeMin || max > rangeMax) return;
      candidates.push(ordered);
      return;
    }
    shifts.forEach((shift) => {
      build(idx + 1, current.concat(sorted[idx] + shift));
    });
  }
  build(0, []);
  if (candidates.length === 0) {
    const fallback = sorted.map((n) => (n < rangeMin ? n + 12 : n));
    state.lastVoicing = fallback;
    return fallback;
  }

  let best = candidates[0];
  let bestScore = Number.POSITIVE_INFINITY;
  candidates.forEach((cand) => {
    const spread = cand[cand.length - 1] - cand[0];
    let motion = 0;
    cand.forEach((note, idx) => {
      const prevNote = prev[idx] ?? prev[prev.length - 1];
      motion += Math.abs(note - prevNote);
    });
    const score = motion + spread * 0.35;
    if (score < bestScore) {
      best = cand;
      bestScore = score;
    }
  });

  state.lastVoicing = best.slice();
  return best;
}

function getChordRhythm(beats, section = "A", startTime = 0) {
  const rhythmName = getRhythmNameForSection(section);
  const pattern = RHYTHMS[rhythmName] || RHYTHMS.whole;
  const beatDur = 60 / state.tempo;
  const swingBeats = getStyleSwingBeats(section, rhythmName);
  const hits = [];
  // Rhythm patterns are bar-based. Build each bar and apply tiny phrase variation.
  for (let barStart = 0; barStart < beats; barStart += 4) {
    const windowBeats = Math.min(4, beats - barStart);
    let barHits = pattern.filter((step) => step < windowBeats).map((step) => barStart + step);
    if (rhythmName !== "whole" && windowBeats > 1) {
      const barTime = startTime + barStart * beatDur;
      const phraseRole = getPhraseRoleForBar(getBarIndexAtTime(barTime, beatDur));
      if (phraseRole === "steady" && barHits.length > 2 && Math.random() < 0.16) {
        const candidates = barHits.filter((step) => Math.abs((step % 4)) > 0.01);
        if (candidates.length > 0) {
          const drop = candidates[Math.floor(Math.random() * candidates.length)];
          barHits = barHits.filter((step) => step !== drop);
        }
      }
      if (phraseRole === "lift" && windowBeats >= 4 && barHits.length < 7 && Math.random() < 0.55) {
        barHits.push(barStart + 3.5);
      }
      if (phraseRole === "turnaround" && windowBeats >= 4) {
        if (Math.random() < 0.72) barHits.push(barStart + 3.5);
        if (Math.random() < 0.32) barHits.push(barStart + 3.75);
      }
    }
    hits.push(...barHits.filter((hit) => hit < beats));
  }
  return uniqSortedNumeric(
    hits
      .map((hit) => applySwingToBeatStep(hit, beats, swingBeats))
      .filter((hit) => hit < beats)
  );
}

function scheduleBass(chord, time, beats = 4, section = "A", sequenceIndex = 0) {
  if (!chord || !chord.root) return;
  const beat = 60 / state.tempo;
  const baseMidi = noteToMidi(chord.root, 2);
  const rhythm = BASS_RHYTHMS[state.bassRhythm] || BASS_RHYTHMS.steady;
  const sequence = state.playbackSequence || [];
  const groove = getStyleGrooveMs(section);
  const bassLag = groove.bass / 1000;
  const intervals = Array.isArray(chord.intervals) ? chord.intervals.slice() : [0, 7];
  const thirdInterval = intervals.find((interval) => interval === 3 || interval === 4);
  const fifthInterval = intervals.find((interval) => interval === 6 || interval === 7 || interval === 8);
  const seventhInterval = intervals.find((interval) => interval === 10 || interval === 11);
  const chordTones = [0, thirdInterval, fifthInterval, seventhInterval]
    .filter((interval) => Number.isFinite(interval))
    .map((interval) => baseMidi + interval);
  let nextRootMidi = baseMidi;
  if (sequence.length > 1) {
    const nextEntry = sequence[(sequenceIndex + 1) % sequence.length];
    if (nextEntry?.item) {
      const nextChord = chordFromItem(nextEntry.item);
      nextRootMidi = noteToMidi(nextChord.root, 2);
    }
  }
  const clampBassMidi = (midi) => {
    let out = midi;
    while (out < 28) out += 12;
    while (out > 60) out -= 12;
    return out;
  };
  const clampedChordTones = chordTones.map((midi) => clampBassMidi(midi));
  const pickChordTone = (preferColor = false) => {
    if (!clampedChordTones.length) return baseMidi;
    const pool = preferColor
      ? clampedChordTones.filter((midi) => midi !== clampBassMidi(baseMidi))
      : clampedChordTones;
    const source = pool.length ? pool : clampedChordTones;
    return source[Math.floor(Math.random() * source.length)];
  };
  const getApproachMidi = () => {
    if (nextRootMidi === baseMidi) return clampBassMidi(baseMidi + 7);
    const direction = nextRootMidi >= baseMidi ? 1 : -1;
    const semitone = nextRootMidi - direction;
    return clampBassMidi(semitone);
  };
  const totalBeats = Math.max(1, beats || 4);
  const swingBeats = getStyleSwingBeats(section, getRhythmNameForSection(section)) * 0.9;
  let cursor = 0;
  while (cursor < totalBeats) {
    const windowBeats = Math.min(4, totalBeats - cursor);
    const windowStart = time + cursor * beat;
    const phraseRole = getPhraseRoleForBar(getBarIndexAtTime(windowStart, beat));
    let barSteps = rhythm.filter((step) => step < windowBeats);
    if (phraseRole === "steady" && barSteps.length > 2 && Math.random() < 0.16) {
      const candidates = barSteps.filter((step) => step > 0.01 && step < windowBeats - 0.01);
      if (candidates.length > 0) {
        const drop = candidates[Math.floor(Math.random() * candidates.length)];
        barSteps = barSteps.filter((step) => step !== drop);
      }
    }
    if (windowBeats >= 4 && phraseRole === "lift" && Math.random() < 0.45) {
      barSteps.push(3.5);
    }
    if (windowBeats >= 4 && phraseRole === "turnaround") {
      barSteps.push(3.5);
    }
    barSteps = uniqSortedNumeric(
      barSteps.map((step) => applySwingToBeatStep(step, windowBeats, swingBeats))
    );
    barSteps.forEach((step, hitIdx) => {
      let noteMidi = baseMidi;
      const isPickup = step >= 3.25 && windowBeats >= 4;
      if (isPickup && (phraseRole === "turnaround" || (phraseRole === "lift" && Math.random() < 0.7))) {
        noteMidi = getApproachMidi();
      } else if (hitIdx === 0) {
        noteMidi = baseMidi;
      } else if (state.bassRhythm === "walking") {
        if (Math.random() < 0.4) {
          const direction = nextRootMidi >= baseMidi ? 1 : -1;
          noteMidi = baseMidi + direction * (Math.random() < 0.6 ? 2 : 1);
        } else {
          noteMidi = pickChordTone(true);
        }
      } else if (step >= 1.5 && step < 2.5 && Math.random() < 0.5) {
        noteMidi = pickChordTone(true);
      } else if (step >= 2.5 && Math.random() < 0.3) {
        noteMidi = pickChordTone(true);
      }
      noteMidi = clampBassMidi(noteMidi);
      const jitter = (Math.random() - 0.5) * (state.bassRhythm === "walking" ? 0.008 : 0.005);
      const hitTime = windowStart + step * beat + jitter + bassLag;
      const durBase = state.bassRhythm === "eighths" ? 0.45 : state.bassRhythm === "walking" ? 0.65 : 0.85;
      const dur = beat * (isPickup ? 0.34 : durBase);
      const roleBoost = phraseRole === "turnaround" ? 1.06 : phraseRole === "lift" ? 1.03 : 1;
      const velocity = Math.max(0.55, Math.min(1, (0.82 + Math.random() * 0.16) * roleBoost * (hitIdx === 0 ? 1.05 : 1)));
      playBassNote(noteMidi, hitTime, dur, velocity);
    });
    cursor += windowBeats;
  }
}

function playBassNote(midi, time, duration, velocity = 1) {
  if (!state.audioCtx || !state.bassBusGain) return;
  const offset = (state.bassOffsetMs || 0) / 1000;
  const startTime = Math.max(time + offset, state.audioCtx.currentTime + 0.002);
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

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.7 * Math.max(0.45, velocity), startTime + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(state.bassBusGain);

  osc.start(startTime);
  osc2.start(startTime);
  osc.stop(startTime + duration + 0.05);
  osc2.stop(startTime + duration + 0.05);
}

function previewChord(item) {
  if (!state.audioCtx) initAudio();
  const chord = chordFromItem(item);
  const duration = (60 / state.tempo) * 1.2;
  const baseMidi = noteToMidi(chord.root, 3);
  chord.intervals.forEach((interval, idx) => {
    playNote(baseMidi + interval, state.audioCtx.currentTime + idx * 0.02, duration, 0.9);
  });
}

function playNote(midi, time, duration, velocity = 1) {
  if (!state.audioCtx) return;
  if (state.sampleInstrument === "synth") {
    if (state.samplesLoaded) playSample(midi, time, duration, velocity);
    else playSynthPad(midi, time, duration, velocity);
    return;
  }
  if (state.samplesLoaded) {
    playSample(midi, time, duration, velocity);
    return;
  }
  if (LOG_SAMPLE_MISS && state.sampleInstrument.startsWith("guitar")) {
    console.warn("[GPL] playNote fallback to synth", { instrument: state.sampleInstrument, samplesLoaded: state.samplesLoaded });
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
  gain.gain.linearRampToValueAtTime(0.16 * velocity, time + 0.08);
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

function playSynthPad(midi, time, duration, velocity = 1) {
  const ctx = state.audioCtx;
  if (!ctx) return;
  const freq = midiToFrequency(midi);
  const oscA = ctx.createOscillator();
  const oscB = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  oscA.type = "sawtooth";
  oscB.type = "triangle";
  oscA.frequency.value = freq;
  oscB.frequency.value = freq * 0.5;
  filter.type = "lowpass";
  filter.frequency.value = 1400;
  filter.Q.value = 0.4;
  const hold = state.noteHold || 1;
  const sustain = duration * hold;
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(0.35 * velocity, time + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, time + sustain + 0.2);
  oscA.connect(filter);
  oscB.connect(filter);
  filter.connect(gain);
  gain.connect(state.masterFilter || ctx.destination);
  oscA.start(time);
  oscB.start(time);
  oscA.stop(time + sustain + 0.3);
  oscB.stop(time + sustain + 0.3);
}

function loadSamples() {
  if (state.samplesLoading || !state.audioCtx) return;
  const baseInstrument = state.sampleInstrument.startsWith("guitar") ? "guitar" : state.sampleInstrument;
  if (baseInstrument === "synth") return;
  const sampleSet = SAMPLE_LIBRARY[baseInstrument] || SAMPLE_LIBRARY.piano;
  state.sampleOnsetMs = {};
  state.samplesLoading = Promise.allSettled(
    sampleSet.map(async (sample) => {
      const response = await fetch(sample.url);
      if (!response.ok) throw new Error(`Fetch failed: ${sample.url}`);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await state.audioCtx.decodeAudioData(arrayBuffer);
      state.sampleBuffers[sample.midi] = buffer;
      const threshold = baseInstrument === "guitar" ? 0.05 : 0.08;
      state.sampleOnsetMs[sample.midi] = detectSampleOnsetMs(buffer, threshold);
    })
  ).then(async (results) => {
    const failures = results.filter((result) => result.status === "rejected");
    const loadedCount = Object.keys(state.sampleBuffers).length;
    if (failures.length && DEBUG_AUDIO) {
      console.warn("[GPL] sample load failures", failures.map((f) => f.reason?.message || f.reason));
    }
    state.samplesLoaded = loadedCount > 0;
    if (state.samplesLoaded && !applySavedSampleAlignment()) {
      await autoAlignSamples(true);
    }
  });
}

function ensureSamplesReady() {
  if (!state.audioCtx) initAudio();
  const tasks = [];
  if (!state.samplesLoaded) {
    loadSamples();
    if (state.samplesLoading) tasks.push(state.samplesLoading);
  }
  if (!state.drumSamplesLoaded) {
    loadDrumSamplesForStyle(state.drumStyle);
  }
  if (state.drumSamplesLoading && state.drumSamplesLoading.length > 0) {
    tasks.push(...state.drumSamplesLoading);
  }
  if (tasks.length === 0) return Promise.resolve();
  return Promise.allSettled(tasks);
}

function reloadSamples() {
  state.sampleBuffers = {};
  state.sampleOnsetMs = {};
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

function loadDrumSamplesForStyle(style) {
  if (!state.audioCtx) return Promise.resolve();
  const kitName = DRUM_STYLE_KIT[style] || "pearl";
  const kit = DRUM_KITS[kitName];
  if (!kit) return Promise.resolve();
  const urls = Array.from(new Set(Object.values(kit)));
  const toLoad = urls.filter((url) => !state.drumSampleBuffers[url]);
  if (toLoad.length === 0) {
    state.drumSamplesLoaded = Object.keys(state.drumSampleBuffers).length > 0;
    return Promise.resolve();
  }
  if (!state.drumSamplesLoading) state.drumSamplesLoading = [];
  const task = Promise.allSettled(
    toLoad.map(async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Fetch failed: ${url}`);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await state.audioCtx.decodeAudioData(arrayBuffer);
      state.drumSampleBuffers[url] = buffer;
    })
  ).then((results) => {
    const failures = results.filter((result) => result.status === "rejected");
    if (failures.length && DEBUG_AUDIO) {
      console.warn("[GPL] drum sample load failures", failures.map((f) => f.reason?.message || f.reason));
    }
    state.drumSamplesLoaded = Object.keys(state.drumSampleBuffers).length > 0;
  });
  state.drumSamplesLoading.push(task);
  return task;
}

function loadDrumSamples() {
  if (state.drumSamplesLoading && state.drumSamplesLoading.length > 0) return;
  return loadDrumSamplesForStyle("pop");
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

function playSample(midi, time, duration, velocity = 1) {
  const entries = Object.keys(state.sampleBuffers).map((key) => parseInt(key, 10)).filter((value) => !Number.isNaN(value));
  if (entries.length === 0) {
    state.samplesLoaded = false;
    if (LOG_SAMPLE_MISS) console.warn("[GPL] playSample skipped: no sample buffers", { instrument: state.sampleInstrument });
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
  if (!buffer) {
    if (LOG_SAMPLE_MISS) console.warn("[GPL] playSample skipped: missing buffer", { instrument: state.sampleInstrument, midi, nearest });
    return;
  }

  const source = state.audioCtx.createBufferSource();
  const envGain = state.audioCtx.createGain();
  source.buffer = buffer;
  source.playbackRate.value = Math.pow(2, (midi - nearest) / 12);
  source.connect(envGain);

  if (state.sampleInstrument.startsWith("guitar")) {
    const high = state.audioCtx.createBiquadFilter();
    high.type = "highpass";
    high.frequency.value = 80;
    const low = state.audioCtx.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.value = 5200;
    const guitarMode = state.sampleInstrument;
    const driveAmount = guitarMode === "guitar_heavy" ? 24 : guitarMode === "guitar_crunch" ? 12 : 0;
    if (driveAmount > 0) {
      const shaper = state.audioCtx.createWaveShaper();
      shaper.curve = createDriveCurve(driveAmount);
      shaper.oversample = "4x";
      const post = state.audioCtx.createGain();
      post.gain.value = guitarMode === "guitar_heavy" ? 0.5 : 0.7;
      envGain.connect(shaper);
      shaper.connect(high);
      high.connect(low);
      low.connect(post);
      post.connect(state.guitarBusGain || state.masterCompressor || state.masterFilter);
    } else {
      envGain.connect(high);
      high.connect(low);
      low.connect(state.guitarBusGain || state.masterCompressor || state.masterFilter);
    }
  } else {
    envGain.connect(state.pianoBusGain || state.masterFilter);
  }

  const offset = (state.sampleOffsetMs || 0) / 1000;
  const trim = Math.max(0, (state.sampleTrimMs || 0) / 1000);
  const startTime = Math.max(time + offset, state.audioCtx.currentTime + 0.002);
  const maxTrim = Math.max(0, buffer.duration - 0.05);
  const safeTrim = Math.min(trim, maxTrim);
  const hold = state.noteHold || 1;
  const sustain = duration * hold;
  const maxDuration = (buffer.duration - safeTrim) / source.playbackRate.value;
  const stopTime = startTime + Math.min(sustain + 0.1, maxDuration);

  if (state.sampleInstrument.startsWith("guitar") && state.guitarBusGain) {
    state.guitarBusGain.gain.setValueAtTime(state.guitarLevel, startTime);
  }
  const isGuitar = state.sampleInstrument.startsWith("guitar");
  const peak = (isGuitar ? 1.2 : 1.0) * velocity;
  const attack = isGuitar ? 0.003 : 0.005;
  const decay = isGuitar ? 0.06 : 0.12;
  const sustainLevel = isGuitar ? 0.35 * velocity : 0.7 * velocity;
  envGain.gain.setValueAtTime(0, startTime);
  envGain.gain.linearRampToValueAtTime(peak, startTime + attack);
  envGain.gain.exponentialRampToValueAtTime(Math.max(0.001, sustainLevel), startTime + attack + decay);
  envGain.gain.exponentialRampToValueAtTime(0.001, stopTime);

  source.start(startTime, safeTrim);
  source.stop(stopTime);
  if (LOG_SAMPLE_MISS && state.sampleInstrument.startsWith("guitar")) {
    console.log("[GPL] playSample", { instrument: state.sampleInstrument, midi, nearest, startTime, stopTime, trimMs: state.sampleTrimMs, offsetMs: state.sampleOffsetMs, duration });
  }
  if (DEBUG_AUDIO && state.sampleInstrument === "piano") {
    console.log("[GPL] piano sample", { midi, nearest, startTime, time, offsetMs: state.sampleOffsetMs, trimMs: state.sampleTrimMs });
  }
}

function detectSampleOnsetMs(buffer, thresholdFactor = 0.08) {
  if (!buffer || buffer.numberOfChannels < 1) return 0;
  const data = buffer.getChannelData(0);
  if (!data || data.length === 0) return 0;
  let max = 0;
  for (let i = 0; i < data.length; i += 1) {
    const abs = Math.abs(data[i]);
    if (abs > max) max = abs;
  }
  if (max <= 0) return 0;
  const threshold = Math.max(0.004, max * thresholdFactor);
  const minSamples = Math.floor(buffer.sampleRate * 0.0015);
  for (let i = minSamples; i < data.length; i += 1) {
    if (Math.abs(data[i]) >= threshold) {
      return Math.round((i / buffer.sampleRate) * 1000);
    }
  }
  return 0;
}

function getSuggestedTrimMs(baseInstrument) {
  const onsets = Object.values(state.sampleOnsetMs || {}).filter((value) => typeof value === "number" && value >= 0);
  if (onsets.length === 0) return baseInstrument === "piano" ? 280 : 0;
  onsets.sort((a, b) => a - b);
  const median = onsets[Math.floor(onsets.length / 2)];
  if (baseInstrument === "guitar") {
    return Math.max(0, Math.min(180, median - 12));
  }
  return Math.max(0, Math.min(300, median));
}

function getSampleAlignStore() {
  try {
    return JSON.parse(localStorage.getItem(SAMPLE_ALIGN_KEY) || "{}");
  } catch (error) {
    return {};
  }
}

function saveSampleAlignment(trimMs, offsetMs) {
  const store = getSampleAlignStore();
  const key = state.sampleInstrument.startsWith("guitar") ? "guitar" : state.sampleInstrument;
  store[key] = { trimMs, offsetMs };
  localStorage.setItem(SAMPLE_ALIGN_KEY, JSON.stringify(store));
}

function applySavedSampleAlignment() {
  const store = getSampleAlignStore();
  const key = state.sampleInstrument.startsWith("guitar") ? "guitar" : state.sampleInstrument;
  const saved = store[key];
  if (!saved) return false;
  const maxTrim = state.sampleInstrument.startsWith("guitar") ? 180 : 300;
  const trim = Math.min(maxTrim, Math.max(0, saved.trimMs || 0));
  const offset = Math.max(-600, Math.min(200, saved.offsetMs || 0));
  state.sampleTrimMs = trim;
  state.sampleOffsetMs = offset;
  if (sampleTrimSlider) sampleTrimSlider.value = String(trim);
  if (sampleOffsetSlider) sampleOffsetSlider.value = String(offset);
  if (pianoTimingValue) pianoTimingValue.textContent = `${offset}ms`;
  return true;
}

function autoAlignSamples(silent = false) {
  if (!state.audioCtx) initAudio();
  const baseInstrument = state.sampleInstrument.startsWith("guitar") ? "guitar" : state.sampleInstrument;
  if (baseInstrument === "synth") return Promise.resolve(false);
  if (baseInstrument === "piano") {
    const trimMs = getSuggestedTrimMs("piano");
    state.sampleTrimMs = trimMs;
    state.sampleOffsetMs = -7;
    if (sampleTrimSlider) sampleTrimSlider.value = String(trimMs);
    if (sampleOffsetSlider) sampleOffsetSlider.value = "-7";
    if (pianoTimingValue) pianoTimingValue.textContent = "-7ms";
    saveSampleAlignment(trimMs, -7);
    return Promise.resolve(true);
  }
  const sampleSet = SAMPLE_LIBRARY[baseInstrument] || SAMPLE_LIBRARY.piano;
  const ensureLoaded = state.samplesLoaded ? Promise.resolve() : loadSamples();
  return ensureLoaded.then(() => {
    if (!state.samplesLoaded) return false;
    const target = sampleSet.find((sample) => sample.midi === 60) || sampleSet[0];
    if (!target) return false;
    const buffer = state.sampleBuffers[target.midi];
    if (!buffer) return false;
    const data = buffer.getChannelData(0);
    let max = 0;
    for (let i = 0; i < data.length; i += 1) {
      const abs = Math.abs(data[i]);
      if (abs > max) max = abs;
    }
    if (max === 0) return false;
    const thresholdFactor = state.sampleInstrument.startsWith("guitar") ? 0.08 : 0.2;
    const threshold = Math.max(0.02, max * thresholdFactor);
    let onset = 0;
    const minSamples = Math.floor(buffer.sampleRate * 0.002);
    for (let i = minSamples; i < data.length; i += 1) {
      if (Math.abs(data[i]) >= threshold) {
        onset = i;
        break;
      }
    }
    const maxTrim = state.sampleInstrument.startsWith("guitar") ? 180 : 300;
    let trimMs = Math.min(maxTrim, Math.round((onset / buffer.sampleRate) * 1000));
    if (state.sampleInstrument.startsWith("guitar")) {
      trimMs = Math.max(0, trimMs - 12);
    }
    if (trimMs > maxTrim * 0.9) {
      trimMs = Math.max(0, Math.round(maxTrim * 0.35));
    }
    state.sampleTrimMs = trimMs;
    state.sampleOffsetMs = state.sampleInstrument === "piano" ? -20 : 0;
    if (sampleTrimSlider) sampleTrimSlider.value = String(trimMs);
    if (sampleOffsetSlider) sampleOffsetSlider.value = String(state.sampleOffsetMs);
    saveSampleAlignment(trimMs, state.sampleOffsetMs);
    return true;
  });
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

function scheduleDrums(barTime, beats = 4, fill = false, section = "A") {
  if (!state.audioCtx || !state.drumBus || !state.drumsEnabled) return;
  const pattern = getDrumPatternForSection(section);
  const sound = DRUM_SOUNDS[state.drumStyle] || DRUM_SOUNDS.pop;
  const beat = 60 / state.tempo;
  const kitName = DRUM_STYLE_KIT[state.drumStyle] || "pearl";
  const kit = DRUM_KITS[kitName];
  const useSamples = state.drumSamplesLoaded && kit;
  const barStart = barTime;
  const barIndex = getBarIndexAtTime(barStart, beat);
  const phraseRole = getPhraseRoleForBar(barIndex);
  const groove = getStyleGrooveMs(section);
  const hatLag = groove.hats / 1000;
  const swingBeats = getStyleSwingBeats(section, getRhythmNameForSection(section));
  const hitTimeForStep = (step, ms = 0, allowSwing = true) => {
    const swungStep = allowSwing ? applySwingToBeatStep(step, beats, swingBeats) : step;
    return barStart + swungStep * beat + (Math.random() - 0.5) * ((ms * 2) / 1000);
  };
  if (DEBUG_AUDIO) {
    console.log("[GPL] scheduleDrums", { barStart, beats, fill, useSamples, style: state.drumStyle, phraseRole });
  }

  let kickSteps = pattern.kick.filter((step) => step < beats);
  if (phraseRole === "lift" && beats >= 4 && Math.random() < 0.24) kickSteps.push(2.75);
  if (phraseRole === "turnaround" && beats >= 4 && Math.random() < 0.18) kickSteps.push(3.25);
  kickSteps = uniqSortedNumeric(kickSteps).filter((step) => step < beats);
  kickSteps.forEach((step) => {
    const hitTime = hitTimeForStep(step, step % 1 === 0 ? 2 : 5, true);
    const gain = (step === 0 ? 0.92 : 0.84) * (phraseRole === "turnaround" ? 1.05 : phraseRole === "lift" ? 1.02 : 1) * (0.94 + Math.random() * 0.12);
    if (!(useSamples && playDrumSample(kit.kick, hitTime, gain))) playKick(hitTime, sound);
  });

  const fillSnare = fill ? [1.5, 2, 2.5, 3, 3.5] : [];
  let ghostSnareSteps = [];
  if (!fill && phraseRole === "lift" && Math.random() < 0.45) ghostSnareSteps = [2.75];
  if (!fill && phraseRole === "turnaround" && Math.random() < 0.52) {
    const ghostPool = [0.75, 1.75, 2.75, 3.75];
    ghostSnareSteps = [ghostPool[Math.floor(Math.random() * ghostPool.length)]];
  }
  const snareSteps = uniqSortedNumeric([1, 3, ...(pattern.snare || []), ...fillSnare]).filter((step) => step < beats);
  snareSteps.forEach((step) => {
    const hitTime = hitTimeForStep(step, 3, false);
    const snareUrl = kit?.snareB && Math.random() < 0.35 ? kit.snareB : kit?.snareA;
    const gain = 0.74 * (0.94 + Math.random() * 0.14);
    if (!(useSamples && snareUrl && playDrumSample(snareUrl, hitTime, gain))) playSnare(hitTime, sound);
  });
  ghostSnareSteps.filter((step) => step < beats).forEach((step) => {
    const hitTime = hitTimeForStep(step, 6, false);
    const ghostUrl = kit?.snareA || kit?.snareB;
    if (!(useSamples && ghostUrl && playDrumSample(ghostUrl, hitTime, 0.22))) playSnare(hitTime, sound);
  });

  let hatSteps = pattern.hat.filter((step) => step < beats);
  if (phraseRole === "lift" && beats >= 4 && Math.random() < 0.5) hatSteps.push(3.75);
  if (phraseRole === "turnaround" && beats >= 4 && Math.random() < 0.35) hatSteps.push(3.25);
  hatSteps = uniqSortedNumeric(hatSteps).filter((step) => step < beats);
  hatSteps.forEach((step) => {
    const hitTime = hitTimeForStep(step, 8, true) + hatLag;
    const accent = Math.abs((step % 1) - 0.5) < 0.01 ? 1.07 : 0.95;
    const gain = 0.33 * accent * (0.9 + Math.random() * 0.22);
    if (!(useSamples && kit?.hatClosed && playDrumSample(kit.hatClosed, hitTime, gain))) playHat(hitTime, sound);
  });

  const openHatSteps = uniqSortedNumeric([
    ...(pattern.hatOpen || []),
    ...((phraseRole === "turnaround" && beats >= 4 && !fill) ? [3.5] : [])
  ]).filter((step) => step < beats);
  openHatSteps.forEach((step) => {
    const hitTime = hitTimeForStep(step, 7, true) + hatLag;
    if (useSamples && kit?.hatOpen) playDrumSample(kit.hatOpen, hitTime, 0.46 * (0.92 + Math.random() * 0.14));
  });

  if (pattern.perc || phraseRole === "turnaround") {
    const percUrl = kit?.perc || kit?.cowbell || kit?.rim || kit?.tamb || kit?.tom;
    const percSteps = uniqSortedNumeric([
      ...(pattern.perc || []),
      ...((phraseRole === "turnaround" && !fill) ? [3.5] : [])
    ]).filter((step) => step < beats);
    percSteps.forEach((step) => {
      const hitTime = hitTimeForStep(step, 9, true) + hatLag;
      if (useSamples && percUrl) playDrumSample(percUrl, hitTime, 0.46 * (0.9 + Math.random() * 0.2));
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

function scheduleUiUpdate(item, chord, time, index, section = state.activeSection) {
  const delay = Math.max(0, (time - state.audioCtx.currentTime) * 1000);
  const timeout = setTimeout(() => {
    updateNowPlaying(item, chord, index, section);
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
  const keyPart = `${state.key}-${state.mode}`;
  const tempoPart = `${state.tempo || 100}bpm`;
  const progressionPart = buildProgressionFilenamePart();
  const rawName = `backing-buddy-${keyPart}-${tempoPart}-${progressionPart}`.toLowerCase();
  link.download = `${sanitizeFilenamePart(rawName, 180)}.mid`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

function buildProgressionFilenamePart() {
  const toToken = (item) => {
    const beatLabel = item.beats && item.beats !== 4 ? `${item.beats}` : "";
    return `${item.token}${beatLabel}`;
  };
  const sectionA = getSectionProgression("A").map(toToken).join("-");
  if (!state.hasBSection) return `a-${sectionA || "progression"}`;
  const sectionB = getSectionProgression("B").map(toToken).join("-");
  return `a-${sectionA || "progression"}-b-${sectionB || "progression"}`;
}

function sanitizeFilenamePart(value, maxLength = 180) {
  const normalized = value
    .replace(/#/g, "sharp")
    .replace(/[^a-z0-9-]+/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (normalized.length <= maxLength) return normalized;
  return normalized.slice(0, maxLength).replace(/-+$/g, "");
}

function buildMidiFile() {
  const ticksPerBeat = 480;
  const tempo = state.tempo || 100;
  const tempoUs = Math.round(60000000 / tempo);
  const bassRhythm = BASS_RHYTHMS[state.bassRhythm] || BASS_RHYTHMS.steady;
  const sequence = buildPlaybackSequence();

  const chordEvents = [];
  const bassEvents = [];
  const drumEvents = [];
  const sectionTimeline = [];
  let currentBeat = 0;

  sequence.forEach((entry) => {
    const item = entry.item;
    const beats = item.beats || 4;
    sectionTimeline.push({ startBeat: currentBeat, endBeat: currentBeat + beats, section: entry.section });
    const chord = chordFromItem(item);
    const baseMidi = noteToMidi(chord.root, 3);
    const notes = chord.intervals.map((interval) => baseMidi + interval);
    const chordRhythm = RHYTHMS[getRhythmNameForSection(entry.section)] || RHYTHMS.whole;

    chordRhythm.filter((step) => step < beats).forEach((step) => {
      const hitBeat = currentBeat + step;
      const noteLen = Math.max(0.35, Math.min(0.9, beats - step));
      const offBeat = hitBeat + noteLen;
      notes.forEach((note) => {
        chordEvents.push({ tick: Math.round(hitBeat * ticksPerBeat), type: "on", note, vel: 92 });
        chordEvents.push({ tick: Math.round(offBeat * ticksPerBeat), type: "off", note, vel: 0 });
      });
    });

    const bassRoot = noteToMidi(chord.root, 2);
    let cursor = 0;
    while (cursor < beats) {
      const windowBeats = Math.min(4, beats - cursor);
      const windowStart = currentBeat + cursor;
      bassRhythm.forEach((step) => {
        if (step >= windowBeats) return;
        const hitBeat = windowStart + step;
        const dur = state.bassRhythm === "eighths" ? 0.45 : 0.85;
        const offBeat = hitBeat + dur;
        bassEvents.push({ tick: Math.round(hitBeat * ticksPerBeat), type: "on", note: bassRoot, vel: 84 });
        bassEvents.push({ tick: Math.round(offBeat * ticksPerBeat), type: "off", note: bassRoot, vel: 0 });
      });
      cursor += windowBeats;
    }

    currentBeat += beats;
  });

  const totalBeats = currentBeat;
  const totalBars = Math.ceil(totalBeats / 4);
  const getSectionAtBeat = (beatTime) => {
    const match = sectionTimeline.find((item) => beatTime >= item.startBeat && beatTime < item.endBeat);
    return match?.section || "A";
  };
  for (let bar = 0; bar < totalBars; bar += 1) {
    const barStart = bar * 4;
    const section = getSectionAtBeat(barStart);
    const drumPattern = getDrumPatternForSection(section);
    const fill = (bar + 1) % 8 === 0;
    const fillSnare = fill ? [1.5, 2, 2.5, 3, 3.5] : [];
    const snareSteps = Array.from(new Set([1, 3, ...(drumPattern.snare || []), ...fillSnare]));
    const addDrumNote = (step, note, velocity, length = 0.12) => {
      const beatTime = barStart + step;
      if (beatTime >= totalBeats) return;
      const startTick = Math.round(beatTime * ticksPerBeat);
      const endTick = Math.round((beatTime + length) * ticksPerBeat);
      drumEvents.push({ tick: startTick, type: "on", note, vel: velocity });
      drumEvents.push({ tick: endTick, type: "off", note, vel: 0 });
    };
    (drumPattern.kick || []).forEach((step) => addDrumNote(step, 36, 108)); // C1 kick
    snareSteps.forEach((step) => addDrumNote(step, 38, 96)); // D1 snare
    (drumPattern.hat || []).forEach((step) => addDrumNote(step, 42, 70, 0.06)); // F#1 closed hat
    (drumPattern.hatOpen || []).forEach((step) => addDrumNote(step, 46, 76, 0.14)); // A#1 open hat
    (drumPattern.perc || []).forEach((step) => addDrumNote(step, 75, 78, 0.1)); // D#2 clave-ish perc
  }

  const tempoTrack = buildTempoTrack(tempoUs);
  const chordTrack = buildNoteTrack(chordEvents, 0);
  const bassTrack = buildNoteTrack(bassEvents, 1);
  const drumTrack = buildNoteTrack(drumEvents, 9);

  const header = [
    0x4d, 0x54, 0x68, 0x64,
    0x00, 0x00, 0x00, 0x06,
    0x00, 0x01, // format 1, parallel tracks
    0x00, 0x04, // tempo + chords + bass + drums
    (ticksPerBeat >> 8) & 0xff,
    ticksPerBeat & 0xff
  ];

  return new Uint8Array([
    ...header,
    ...encodeTrackChunk(tempoTrack),
    ...encodeTrackChunk(chordTrack),
    ...encodeTrackChunk(bassTrack),
    ...encodeTrackChunk(drumTrack)
  ]);
}

function buildTempoTrack(tempoUs) {
  return [
    ...writeVarLen(0),
    0xff, 0x51, 0x03,
    (tempoUs >> 16) & 0xff,
    (tempoUs >> 8) & 0xff,
    tempoUs & 0xff,
    ...writeVarLen(0),
    0xff, 0x2f, 0x00
  ];
}

function buildNoteTrack(events, channel) {
  const sorted = events.slice().sort((a, b) => {
    if (a.tick !== b.tick) return a.tick - b.tick;
    if (a.type === b.type) return 0;
    return a.type === "off" ? -1 : 1;
  });
  const bytes = [];
  let lastTick = 0;
  sorted.forEach((event) => {
    const delta = Math.max(0, event.tick - lastTick);
    lastTick = event.tick;
    bytes.push(...writeVarLen(delta));
    if (event.type === "on") {
      bytes.push((0x90 | (channel & 0x0f)), event.note & 0x7f, event.vel & 0x7f);
    } else {
      bytes.push((0x80 | (channel & 0x0f)), event.note & 0x7f, 0x00);
    }
  });
  bytes.push(...writeVarLen(0), 0xff, 0x2f, 0x00);
  return bytes;
}

function encodeTrackChunk(trackBytes) {
  return [
    0x4d, 0x54, 0x72, 0x6b,
    (trackBytes.length >> 24) & 0xff,
    (trackBytes.length >> 16) & 0xff,
    (trackBytes.length >> 8) & 0xff,
    trackBytes.length & 0xff,
    ...trackBytes
  ];
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

function updateNowPlaying(item, chord, index, section = state.activeSection) {
  scrollToSectionOnMobile(section);
  updateRhythmReadout(section);
  if (state.hasBSection && state.activeSection !== section && !state.editorPinned) {
    state.activeSection = section;
    state.progression = section === "B" ? getSectionProgression("B") : getSectionProgression("A");
    updateSectionControls();
  }
  state.currentChordNotes = new Set(chord.intervals.map((interval) => noteAt(chord.root, interval)));
  state.currentChordRoot = chord.root;
  state.uiChord = index;
  state.playingSection = section;
  if (state.activeSection === section && state.selectedChord !== index) {
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
  if (!fretboardGrid) return;
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
      cell.textContent = displayNoteForKey(note, state.key);
      if (highlightSet.has(normalized)) cell.classList.add("active");
      if (overlaySet.has(normalized)) cell.classList.add("overlay");
      if (state.currentChordRoot) {
        const rootNorm = FLAT_EQUIV[state.currentChordRoot] || state.currentChordRoot;
        if (normalized === rootNorm) cell.classList.add("root");
      }
      fretboardGrid.appendChild(cell);
    }
  });
  buildKeyboardMap();
}

function getHighlightNotes() {
  const chordSet = state.currentChordNotes.size > 0 ? state.currentChordNotes : new Set();
  const normalize = (note) => FLAT_EQUIV[note] || note;
  const normalizedChord = new Set(Array.from(chordSet).map(normalize));
  const scaleOnly = !!scaleOnlyToggle?.checked;
  const modeScale = getModeScale(state.mode);
  const scaleIntervals = scaleOnly ? modeScale : (scales[scaleSelect?.value] || MAJOR_SCALE);
  const scaleSet = new Set(scaleIntervals.map((interval) => normalize(noteAt(state.key, interval))));
  if (scaleOnly) {
    // In scale-only view, fold in current out-of-scale chord tones so spicy chords
    // are still represented on the map.
    const spicyChordTones = new Set(
      Array.from(normalizedChord).filter((note) => !scaleSet.has(note))
    );
    const highlightSet = new Set([...scaleSet, ...spicyChordTones]);
    return { highlightSet, overlaySet: new Set(), scaleOnly: true };
  }
  if (state.fretMode === "scale") {
    if (!scaleSelect) return { highlightSet: normalizedChord, overlaySet: new Set(), scaleOnly: false };
    const intervals = scales[scaleSelect.value];
    const overlaySet = new Set(intervals.map((interval) => normalize(noteAt(state.key, interval))));
    return { highlightSet: normalizedChord, overlaySet, scaleOnly: false };
  }
  return { highlightSet: normalizedChord, overlaySet: new Set(), scaleOnly: false };
}

function buildKeyboardMap() {
  if (!keyboardGrid) return;
  keyboardGrid.innerHTML = "";
  const totalSemitones = 24; // Two octaves: C to B
  const whiteCount = 14;
  const whiteWidth = 100 / whiteCount;
  const blackSemitones = new Set([1, 3, 6, 8, 10]);
  const { highlightSet, overlaySet } = getHighlightNotes();
  const keys = [];
  let whiteIndex = 0;

  for (let semitoneOffset = 0; semitoneOffset < totalSemitones; semitoneOffset += 1) {
    const note = noteAt("C", semitoneOffset);
    const normalized = FLAT_EQUIV[note] || note;
    const semitoneInOctave = semitoneOffset % 12;
    const isBlack = blackSemitones.has(semitoneInOctave);
    let left = 0;
    let width = whiteWidth;
    if (isBlack) {
      width = whiteWidth * 0.64;
      left = whiteIndex * whiteWidth - width * 0.5;
      if (left < 0) left = 0;
      if (left + width > 100) left = 100 - width;
    } else {
      left = whiteIndex * whiteWidth;
      whiteIndex += 1;
    }
    keys.push({ note, normalized, isBlack, left, width });
  }

  const rootNorm = state.currentChordRoot ? (FLAT_EQUIV[state.currentChordRoot] || state.currentChordRoot) : null;
  keys
    .sort((a, b) => Number(a.isBlack) - Number(b.isBlack))
    .forEach((entry) => {
      const key = document.createElement("div");
      key.className = `keyboard-key ${entry.isBlack ? "black" : "white"}`;
      key.style.left = `${entry.left}%`;
      key.style.width = `${entry.width}%`;
      if (entry.isBlack) key.textContent = "";
      else key.textContent = displayNoteForKey(entry.note, state.key);
      if (highlightSet.has(entry.normalized)) key.classList.add("active");
      if (overlaySet.has(entry.normalized)) key.classList.add("overlay");
      if (rootNorm && entry.normalized === rootNorm) key.classList.add("root");
      keyboardGrid.appendChild(key);
    });
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

function initPresetCarousel() {
  if (!presetRow || !presetPrev || !presetNext) return;
  const updateNavState = () => {
    const max = Math.max(0, presetRow.scrollWidth - presetRow.clientWidth);
    presetPrev.disabled = presetRow.scrollLeft <= 2;
    presetNext.disabled = presetRow.scrollLeft >= max - 2;
  };
  const pageWidth = () => Math.max(180, Math.floor(presetRow.clientWidth * 0.9));
  presetPrev.addEventListener("click", () => {
    presetRow.scrollBy({ left: -pageWidth(), behavior: "smooth" });
  });
  presetNext.addEventListener("click", () => {
    presetRow.scrollBy({ left: pageWidth(), behavior: "smooth" });
  });
  presetRow.addEventListener("scroll", updateNavState, { passive: true });
  window.addEventListener("resize", updateNavState);
  setTimeout(updateNavState, 0);
}

function applyPreset({ tokens, beats = 4, mode = "major", exts = [] }) {
  if (!state.keyLocked) {
    const randomKey = getRandomKeyName();
    state.key = normalizeKeyDisplay(randomKey);
    if (keySelect) keySelect.value = FLAT_EQUIV[state.key] || state.key;
  }
  state.mode = normalizeMode(mode);
  if (modeSelect) modeSelect.value = state.mode;
  updateKeyBanner();

  state.sectionA = tokens.map((token) => createChordItem(token, beats, null, exts));
  state.sectionB = [];
  state.hasBSection = false;
  state.activeSection = "A";
  state.progression = state.sectionA;
  state.selectedChord = 0;
  state.selectionDirtyForPlayback = true;
  state.playbackSequence = buildPlaybackSequence();

  if (state.isPlaying) {
    if (!state.isPaused) pausePlayback();
    resetTransportTimeline();
    primePlaybackFromSelectedChord();
    state.lastAutoScrollSection = null;
    scrollToSectionOnMobile("A", true);
  }

  updateSectionControls();
  updateChordEditor();
  renderProgression();
  scheduleSessionSave();
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
