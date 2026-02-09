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
    classList: makeClassList(),
    addEventListener() {},
    removeEventListener() {},
    setAttribute() {},
    removeAttribute() {},
    appendChild() {},
    removeChild() {},
    querySelector() {
      return null;
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
  const codePath = "/Users/nick/codex/portfolio/backing-track-generator/app.js";
  let code = fs.readFileSync(codePath, "utf8");
  code = code.replace(/\ninit\(\);\s*$/, "\n");
  code += `
globalThis.__btgExports = {
  state,
  RHYTHMS,
  DRUM_PATTERN_BANK,
  BASS_RHYTHMS,
  createChordItem,
  buildPlaybackSequence,
  buildMidiFile,
  getRhythmNameForSection,
  getDrumPatternForSection
};`;

  const nodes = new Map();
  const getNode = (id) => {
    if (!nodes.has(id)) nodes.set(id, makeElement());
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
