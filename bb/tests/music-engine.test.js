const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

function makeClassList() {
  const classes = new Set();
  return {
    add: (...items) => items.forEach((item) => classes.add(item)),
    remove: (...items) => items.forEach((item) => classes.delete(item)),
    toggle: (item, force) => {
      if (force === true) {
        classes.add(item);
        return true;
      }
      if (force === false) {
        classes.delete(item);
        return false;
      }
      if (classes.has(item)) {
        classes.delete(item);
        return false;
      }
      classes.add(item);
      return true;
    },
    contains: (item) => classes.has(item)
  };
}

function makeElement() {
  return {
    value: "",
    checked: false,
    textContent: "",
    innerHTML: "",
    disabled: false,
    dataset: {},
    style: {},
    children: [],
    options: [],
    classList: makeClassList(),
    addEventListener() {},
    removeEventListener() {},
    setAttribute() {},
    removeAttribute() {},
    getBoundingClientRect() {
      return { left: 0, top: 0, bottom: 0, right: 0, width: 0, height: 0 };
    },
    scrollIntoView() {},
    appendChild(child) {
      this.children.push(child);
      this.options.push(child);
      return child;
    },
    removeChild(child) {
      this.children = this.children.filter((entry) => entry !== child);
      this.options = this.options.filter((entry) => entry !== child);
      return child;
    },
    querySelector() {
      return makeElement();
    },
    querySelectorAll() {
      return [];
    },
    closest() {
      return null;
    }
  };
}

function loadEngine() {
  const codePath = "/Users/nick/codex/portfolio/bb/app.js";
  let code = fs.readFileSync(codePath, "utf8");
  code = code.replace(/\ninit\(\);\s*$/, "\n");
  code += `
globalThis.__btgExports = {
  state,
  NOTES,
  FRIENDLY_KEYS,
  RHYTHMS,
  DRUM_PATTERN_BANK,
  BASS_RHYTHMS,
  createChordItem,
  buildPlaybackSequence,
  chordFromDegree,
  normalizeKeyDisplay,
  generateProgression,
  applyPreset,
  chooseMusicalProgression,
  isDiatonicRomanToken,
  chordFromItem,
  describeItem,
  buildMidiFile,
  getRhythmNameForSection,
  getDrumPatternForSection
};`;

  const nodes = new Map();
  const defaultValues = {
    keySelect: "C",
    modeSelect: "major",
    styleSelect: "clean",
    textureSelect: "pulse",
    rhythmSelect: "whole",
    drumStyleSelect: "pop",
    bassRhythmSelect: "steady",
    scaleSelect: "Major",
    arpSelect: "Maj7",
    triadSelect: "Major Triad",
    genLength: "4",
    genSpice: "light",
    genRhythm: "steady"
  };
  const getNode = (id) => {
    if (!nodes.has(id)) {
      const node = makeElement();
      if (Object.prototype.hasOwnProperty.call(defaultValues, id)) {
        node.value = defaultValues[id];
      }
      nodes.set(id, node);
    }
    return nodes.get(id);
  };

  const document = {
    body: makeElement(),
    getElementById: (id) => getNode(id),
    querySelector: () => makeElement(),
    querySelectorAll: () => [],
    createElement: () => makeElement(),
    addEventListener() {}
  };

  const storage = new Map();
  const localStorage = {
    getItem: (key) => (storage.has(key) ? storage.get(key) : null),
    setItem: (key, value) => storage.set(key, String(value)),
    removeItem: (key) => storage.delete(key)
  };

  const context = {
    console,
    Math,
    Date,
    JSON,
    Array,
    Object,
    Number,
    String,
    Boolean,
    RegExp,
    Uint8Array,
    ArrayBuffer,
    DataView,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    Blob,
    document,
    localStorage,
    window: {
      innerWidth: 1280,
      addEventListener() {},
      prompt: () => "",
      confirm: () => true,
      alert() {},
      AudioContext: function AudioContext() {},
      webkitAudioContext: function WebkitAudioContext() {}
    },
    navigator: { userAgent: "node-test" },
    URL: {
      createObjectURL: () => "blob:test",
      revokeObjectURL() {}
    },
    fetch: async () => {
      throw new Error("fetch disabled in tests");
    }
  };
  context.globalThis = context;
  vm.createContext(context);
  vm.runInContext(code, context, { filename: codePath });
  return context.__btgExports;
}

function resetState(state) {
  state.progression = [];
  state.sectionA = [];
  state.sectionB = [];
  state.hasBSection = false;
  state.activeSection = "A";
  state.playingSection = "A";
  state.aRepeats = 2;
  state.bRepeats = 2;
  state.rhythm = "whole";
  state.mode = "major";
  state.key = "C";
  state.bassRhythm = "steady";
  state.drumStyle = "pop";
  state.drumPattern = null;
}

function parseVarLen(bytes, offset) {
  let value = 0;
  let i = offset;
  while (i < bytes.length) {
    const b = bytes[i];
    value = (value << 7) | (b & 0x7f);
    i += 1;
    if ((b & 0x80) === 0) break;
  }
  return { value, next: i };
}

function parseMidi(midiBytes) {
  const bytes = midiBytes instanceof Uint8Array ? midiBytes : new Uint8Array(midiBytes);
  const readU16 = (o) => (bytes[o] << 8) | bytes[o + 1];
  const readU32 = (o) => ((bytes[o] << 24) >>> 0) | (bytes[o + 1] << 16) | (bytes[o + 2] << 8) | bytes[o + 3];
  assert.equal(String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3]), "MThd");
  const headerLen = readU32(4);
  const format = readU16(8);
  const tracks = readU16(10);
  const division = readU16(12);
  let cursor = 8 + headerLen;
  const trackChunks = [];
  for (let t = 0; t < tracks; t += 1) {
    assert.equal(String.fromCharCode(bytes[cursor], bytes[cursor + 1], bytes[cursor + 2], bytes[cursor + 3]), "MTrk");
    const len = readU32(cursor + 4);
    const start = cursor + 8;
    const end = start + len;
    trackChunks.push(bytes.slice(start, end));
    cursor = end;
  }
  return { format, tracks, division, trackChunks };
}

function countNoteOnsByChannel(trackBytes) {
  const counts = new Map();
  let i = 0;
  let runningStatus = null;
  while (i < trackBytes.length) {
    const delta = parseVarLen(trackBytes, i);
    i = delta.next;
    if (i >= trackBytes.length) break;
    let status = trackBytes[i];
    if (status < 0x80) {
      if (runningStatus == null) break;
      status = runningStatus;
    } else {
      i += 1;
      runningStatus = status;
    }

    if (status === 0xff) {
      const type = trackBytes[i];
      i += 1;
      const lenParsed = parseVarLen(trackBytes, i);
      i = lenParsed.next + lenParsed.value;
      if (type === 0x2f) break;
      continue;
    }
    if (status === 0xf0 || status === 0xf7) {
      const lenParsed = parseVarLen(trackBytes, i);
      i = lenParsed.next + lenParsed.value;
      continue;
    }

    const type = status & 0xf0;
    const channel = status & 0x0f;
    const data1 = trackBytes[i];
    i += 1;
    let data2 = 0;
    if (type !== 0xc0 && type !== 0xd0) {
      data2 = trackBytes[i];
      i += 1;
    }
    if (type === 0x90 && data2 > 0) {
      counts.set(channel, (counts.get(channel) || 0) + 1);
    }
  }
  return counts;
}

test("defaults A/B loops to 2", () => {
  const { state } = loadEngine();
  assert.equal(state.aRepeats, 2);
  assert.equal(state.bRepeats, 2);
});

test("buildPlaybackSequence honors A/B repeats", () => {
  const { state, createChordItem, buildPlaybackSequence } = loadEngine();
  resetState(state);
  state.sectionA = [createChordItem("I", 4), createChordItem("V", 4)];
  state.sectionB = [createChordItem("vi", 4)];
  state.progression = state.sectionA;
  state.hasBSection = true;
  state.aRepeats = 2;
  state.bRepeats = 2;

  const seq = buildPlaybackSequence();
  assert.equal(seq.length, 6);
  assert.equal(JSON.stringify(seq.slice(0, 4).map((s) => s.section)), JSON.stringify(["A", "A", "A", "A"]));
  assert.equal(JSON.stringify(seq.slice(4).map((s) => s.section)), JSON.stringify(["B", "B"]));
});

test("B section uses a subtle alternate rhythm and drum pattern", () => {
  const { state, getRhythmNameForSection, getDrumPatternForSection, DRUM_PATTERN_BANK } = loadEngine();
  resetState(state);
  state.hasBSection = true;
  state.rhythm = "whole";
  state.drumStyle = "pop";
  state.drumPattern = DRUM_PATTERN_BANK.pop[0];

  assert.equal(getRhythmNameForSection("A"), "whole");
  assert.equal(getRhythmNameForSection("B"), "halves");
  assert.notEqual(getDrumPatternForSection("A"), getDrumPatternForSection("B"));
});

test("MIDI export includes full A/B form plus bass and drums", () => {
  const { state, createChordItem, buildMidiFile } = loadEngine();
  resetState(state);
  state.sectionA = [createChordItem("I", 4)];
  state.sectionB = [createChordItem("V", 4)];
  state.progression = state.sectionA;
  state.hasBSection = true;
  state.aRepeats = 2;
  state.bRepeats = 2;
  state.rhythm = "whole";
  state.bassRhythm = "steady";
  state.drumStyle = "pop";

  const midi = buildMidiFile();
  const parsed = parseMidi(midi);
  assert.equal(parsed.format, 1);
  assert.equal(parsed.tracks, 4);

  const noteOnsByTrack = parsed.trackChunks.map((track) => countNoteOnsByChannel(track));
  const totalByChannel = new Map();
  noteOnsByTrack.forEach((counts) => {
    counts.forEach((count, channel) => {
      totalByChannel.set(channel, (totalByChannel.get(channel) || 0) + count);
    });
  });

  assert.equal(totalByChannel.get(0), 18); // A whole + B subtle variation (halves)
  assert.equal(totalByChannel.get(1), 8); // 4 bars * 2 bass hits
  assert.ok((totalByChannel.get(9) || 0) > 0); // drum channel present
});

test("normalizeKeyDisplay prefers flat enharmonic spellings", () => {
  const { normalizeKeyDisplay } = loadEngine();
  assert.equal(normalizeKeyDisplay("A#"), "Bb");
  assert.equal(normalizeKeyDisplay("D#"), "Eb");
  assert.equal(normalizeKeyDisplay("G#"), "Ab");
  assert.equal(normalizeKeyDisplay("F#"), "F#");
});

test("minor bIII resolves correctly without double-flatting", () => {
  const { state, chordFromDegree } = loadEngine();
  resetState(state);
  state.mode = "minor";
  state.key = "Bb";
  const chord = chordFromDegree("bIII");
  assert.equal(chord.root, "Db");
});

test("minor bVI and bVII resolve to diatonic Aeolian tones", () => {
  const { state, chordFromDegree } = loadEngine();
  resetState(state);
  state.mode = "minor";
  state.key = "B";
  assert.equal(chordFromDegree("bVI").root, "G");
  assert.equal(chordFromDegree("bVII").root, "A");
});

test("generateProgression preserves key when key lock is enabled", () => {
  const { state, generateProgression } = loadEngine();
  resetState(state);
  state.key = "F";
  state.keyLocked = true;
  generateProgression();
  assert.equal(state.key, "F");
});

test("generateProgression uses friendly key spellings when unlocked", () => {
  const { state, generateProgression, FRIENDLY_KEYS } = loadEngine();
  resetState(state);
  state.keyLocked = false;
  const seen = new Set();
  for (let i = 0; i < 60; i += 1) {
    generateProgression();
    seen.add(state.key);
    assert.ok(FRIENDLY_KEYS.includes(state.key));
    assert.notEqual(state.key, "A#");
    assert.notEqual(state.key, "D#");
    assert.notEqual(state.key, "G#");
  }
  assert.ok(seen.size >= 6);
});

test("applyPreset clears B section and rebuilds playback sequence from A only", () => {
  const { state, createChordItem, buildPlaybackSequence, applyPreset } = loadEngine();
  resetState(state);
  state.sectionA = [createChordItem("I", 4), createChordItem("V", 4)];
  state.sectionB = [createChordItem("vi", 4), createChordItem("IV", 4)];
  state.progression = state.sectionA;
  state.hasBSection = true;
  state.aRepeats = 2;
  state.bRepeats = 2;
  state.playbackSequence = buildPlaybackSequence();
  state.isPlaying = true;
  state.isPaused = false;

  applyPreset({ tokens: ["I"], beats: 16, mode: "major" });

  assert.equal(state.hasBSection, false);
  assert.equal(state.activeSection, "A");
  assert.equal(state.sectionB.length, 0);
  assert.equal(state.sectionA.length, 1);
  assert.equal(state.sectionA[0].token, "I");
  assert.equal(state.sectionA[0].beats, 16);
  assert.ok(state.playbackSequence.length > 0);
  assert.ok(state.playbackSequence.every((entry) => entry.section === "A"));
  assert.ok(state.playbackSequence.every((entry) => entry.item.token === "I"));
});

test("form popup markup is simplified to B section checkbox only", () => {
  const html = fs.readFileSync("/Users/nick/codex/portfolio/bb.html", "utf8");
  assert.ok(html.includes('id="formHasB"'));
  assert.ok(html.includes(">B Section<"));
  assert.ok(!html.includes('id="formARepeats"'));
  assert.ok(!html.includes('id="formBRepeats"'));
});

test("refresh button is mobile-only in stylesheet", () => {
  const css = fs.readFileSync("/Users/nick/codex/portfolio/bb/styles.css", "utf8");
  assert.match(css, /\.key-refresh\s*\{[^}]*display:\s*none;/s);
  assert.match(css, /@media\s*\(max-width:\s*900px\)\s*\{[\s\S]*?\.key-refresh\s*\{[^}]*display:\s*inline-flex;/s);
});

test("major bIII is treated as spicy in displayed label", () => {
  const { state, createChordItem, describeItem } = loadEngine();
  resetState(state);
  state.mode = "major";
  state.key = "F#";
  const item = createChordItem("bIII", 4);
  const description = describeItem(item);
  assert.equal(description.label, "Spicy (bIII)");
});

test("chooseMusicalProgression with spice none stays diatonic in major", () => {
  const { chooseMusicalProgression, isDiatonicRomanToken } = loadEngine();
  for (let i = 0; i < 80; i += 1) {
    const tokens = chooseMusicalProgression(4, "major", "none");
    assert.equal(tokens.length, 4);
    assert.ok(tokens.every((token) => isDiatonicRomanToken(token, "major")));
  }
});

test("in C major, spicy bII resolves to Db root", () => {
  const { state, chordFromDegree } = loadEngine();
  resetState(state);
  state.mode = "major";
  state.key = "C";
  const chord = chordFromDegree("bII");
  assert.equal(chord.root, "Db");
});

test("in C major, spicy bIIadd9 is labeled with Db spelling (not Bii)", () => {
  const { state, createChordItem, describeItem, chordFromItem } = loadEngine();
  resetState(state);
  state.mode = "major";
  state.key = "C";
  const item = createChordItem("bII", 4, null, ["add9"]);
  const description = describeItem(item);
  const chord = chordFromItem(item);
  assert.equal(description.label, "Spicy (bII)");
  assert.ok(description.name.startsWith("Db"));
  assert.equal(chord.root, "Db");
  assert.ok(!description.name.toLowerCase().includes("bii"));
});
