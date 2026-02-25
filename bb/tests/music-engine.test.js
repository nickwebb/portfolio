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
  getChordRhythm,
  buildMidiFile,
  getRhythmNameForSection,
  getDrumPatternForSection,
  getSequenceSectionAtBeat,
  getHighlightNotes,
  displayNoteForKey,
  getSpicySuggestions,
  generateBSectionFromCorpus,
  buildBorrowedChords,
  borrowedChords,
  scaleOnlyToggle,
  styleSelect,
  modeSelect,
  genLength
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

test("default mix levels start centered", () => {
  const { state } = loadEngine();
  assert.equal(state.pianoLevel, 0.5);
  assert.equal(state.guitarLevel, 0.5);
  assert.equal(state.drumLevel, 0.5);
  assert.equal(state.bassLevel, 0.5);
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

test("sequence section mapping resolves A/B and wraps correctly", () => {
  const { state, createChordItem, buildPlaybackSequence, getSequenceSectionAtBeat } = loadEngine();
  resetState(state);
  state.sectionA = [createChordItem("I", 4), createChordItem("V", 4)];
  state.sectionB = [createChordItem("vi", 4)];
  state.progression = state.sectionA;
  state.hasBSection = true;
  state.aRepeats = 1;
  state.bRepeats = 1;
  const sequence = buildPlaybackSequence();

  assert.equal(getSequenceSectionAtBeat(sequence, 0), "A");
  assert.equal(getSequenceSectionAtBeat(sequence, 7.99), "A");
  assert.equal(getSequenceSectionAtBeat(sequence, 8.01), "B");
  assert.equal(getSequenceSectionAtBeat(sequence, 11.99), "B");
  assert.equal(getSequenceSectionAtBeat(sequence, 12), "A");
});

test("B section generation preserves A total beats using 4 chords", () => {
  const { state, createChordItem, generateBSectionFromCorpus } = loadEngine();
  resetState(state);
  state.mode = "major";
  state.sectionA = [createChordItem("I", 8), createChordItem("V", 8)];
  state.progression = state.sectionA;

  generateBSectionFromCorpus();

  assert.equal(state.hasBSection, true);
  assert.equal(state.sectionB.length, 4);
  assert.equal(state.sectionB.reduce((sum, item) => sum + item.beats, 0), 16);
  assert.ok(state.sectionB.every((item) => item.beats === 4));
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

  assert.ok((totalByChannel.get(0) || 0) >= 18); // includes core chord form with optional phrase variation
  assert.ok((totalByChannel.get(1) || 0) >= 8); // includes core bass form with optional phrase variation
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

test("generateProgression uses 12-bar blues when blues style is selected", () => {
  const { state, generateProgression, styleSelect, modeSelect, genLength } = loadEngine();
  resetState(state);
  if (styleSelect) styleSelect.value = "blues";
  if (modeSelect) modeSelect.value = "minor";
  if (genLength) genLength.value = "4";

  generateProgression();

  const tokens = state.sectionA.map((item) => item.token);
  assert.equal(
    JSON.stringify(tokens),
    JSON.stringify(["I", "I", "I", "I", "IV", "IV", "I", "I", "V", "IV", "I", "V"])
  );
  assert.ok(state.sectionA.every((item) => item.beats === 4));
  assert.ok(state.sectionA.every((item) => Array.isArray(item.exts) && item.exts.includes("7")));
  assert.equal(state.mode, "major");
});

test("spicy suggestions expose categorized multi-chord ideas", () => {
  const { state, getSpicySuggestions } = loadEngine();
  resetState(state);
  state.mode = "major";
  state.key = "C";
  const majorSuggestions = getSpicySuggestions();
  assert.ok(majorSuggestions.length >= 6);
  assert.ok(majorSuggestions.every((entry) => typeof entry.category === "string" && entry.category.length > 0));
  assert.ok(majorSuggestions.some((entry) => entry.category === "Secondary Dominant"));
  assert.ok(majorSuggestions.some((entry) => Array.isArray(entry.items) && entry.items.length >= 2));
  assert.ok(
    majorSuggestions.some((entry) => entry.items.map((item) => item.roman).join(" -> ").includes("V/V -> V7"))
  );

  state.mode = "minor";
  const minorSuggestions = getSpicySuggestions();
  assert.ok(minorSuggestions.some((entry) => entry.category === "Neapolitan"));
  assert.ok(minorSuggestions.some((entry) => entry.category === "ii-V-i"));
});

test("borrowed chord palette can render structured spicy suggestions", () => {
  const { state, buildBorrowedChords, borrowedChords } = loadEngine();
  resetState(state);
  state.mode = "major";
  state.key = "C";

  assert.doesNotThrow(() => buildBorrowedChords());
  assert.ok(borrowedChords.children.length > 0);
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

test("form popup markup includes repeat controls and B section toggle", () => {
  const html = fs.readFileSync("/Users/nick/codex/portfolio/bb.html", "utf8");
  assert.ok(html.includes('id="formHasB"'));
  assert.ok(html.includes('id="formARepeats"'));
  assert.ok(html.includes('id="formBRepeats"'));
});

test("tempo pill markup supports inline tempo editing", () => {
  const html = fs.readFileSync("/Users/nick/codex/portfolio/bb.html", "utf8");
  assert.ok(html.includes('id="tempoLabel"'));
  assert.ok(html.includes('id="tempoInlineInput"'));
});

test("drum and bass synth routing avoids the old piano-ish dnb chord sample", () => {
  const source = fs.readFileSync("/Users/nick/codex/portfolio/bb/app.js", "utf8");
  assert.ok(source.includes("synth_dnb_v2"));
  assert.ok(!source.includes("bb/samples/synth/styles/dnb-chord.wav"));
});

test("grime synth routing avoids the old grime chord sample", () => {
  const source = fs.readFileSync("/Users/nick/codex/portfolio/bb/app.js", "utf8");
  assert.ok(source.includes("synth_grime_v2"));
  assert.ok(!source.includes("bb/samples/synth/styles/grime-chord.wav"));
});

test("grime synth routing no longer uses grime-tone sample", () => {
  const source = fs.readFileSync("/Users/nick/codex/portfolio/bb/app.js", "utf8");
  const block = source.match(/synth_grime_v2:\s*\[[\s\S]*?\],/);
  assert.ok(block);
  assert.ok(!block[0].includes("bb/samples/synth/styles/grime-tone.wav"));
});

test("garage synth routing avoids house/techno chord sources", () => {
  const source = fs.readFileSync("/Users/nick/codex/portfolio/bb/app.js", "utf8");
  const block = source.match(/synth_garage:\s*\[[\s\S]*?\],/);
  assert.ok(block);
  assert.ok(!block[0].includes("bb/samples/synth/styles/house-chord.wav"));
  assert.ok(!block[0].includes("bb/samples/synth/styles/techno-chord.wav"));
});

test("club synth routings avoid harsh shared stab/chord samples", () => {
  const source = fs.readFileSync("/Users/nick/codex/portfolio/bb/app.js", "utf8");
  const blocks = ["synth_grime_v2", "synth_bass_v2", "synth_dnb_v2"].map((name) => source.match(new RegExp(`${name}:\\s*\\[[\\s\\S]*?\\],`)));
  blocks.forEach((block) => assert.ok(block));
  blocks.forEach((block) => {
    assert.ok(!block[0].includes("bb/samples/synth/styles/grime-stab.wav"));
    assert.ok(!block[0].includes("bb/samples/synth/styles/bass-chord.wav"));
  });
});

test("club synth sets keep to per-genre allowlisted sources", () => {
  const source = fs.readFileSync("/Users/nick/codex/portfolio/bb/app.js", "utf8");
  const allowlists = {
    synth_garage: [
      "bb/samples/synth/styles/bass-tone.wav",
      "bb/samples/synth/passb/garage-organ-chop.wav",
      "bb/samples/synth/passb/uk-stab-crisp.wav"
    ],
    synth_grime_v2: [
      "bb/samples/synth/passb/grime-square-cold.wav"
    ],
    synth_bass_v2: [
      "bb/samples/synth/passb/bassline-warp-mid.wav"
    ],
    synth_dnb_v2: [
      "bb/samples/synth/passb/dnb-reese-lite.wav"
    ]
  };
  Object.entries(allowlists).forEach(([sampleSet, urls]) => {
    const block = source.match(new RegExp(`${sampleSet}:\\s*\\[[\\s\\S]*?\\],`));
    assert.ok(block);
    const matches = Array.from(block[0].matchAll(/url:\s*"([^"]+)"/g)).map((entry) => entry[1]);
    assert.ok(matches.length > 0);
    matches.forEach((url) => assert.ok(urls.includes(url)));
    assert.ok(!block[0].includes("bb/samples/synth/styles/grime-tone.wav"));
    assert.ok(!block[0].includes("bb/samples/synth/styles/grime-chord.wav"));
    assert.ok(!block[0].includes("bb/samples/synth/styles/grime-stab.wav"));
    if (sampleSet !== "synth_garage") {
      assert.ok(!block[0].includes("bb/samples/synth/passb/uk-stab-crisp.wav"));
    }
  });
});

test("pass B curated synth sample files exist on disk", () => {
  const files = [
    "/Users/nick/codex/portfolio/bb/samples/synth/passb/garage-organ-chop.wav",
    "/Users/nick/codex/portfolio/bb/samples/synth/passb/grime-square-cold.wav",
    "/Users/nick/codex/portfolio/bb/samples/synth/passb/bassline-warp-mid.wav",
    "/Users/nick/codex/portfolio/bb/samples/synth/passb/dnb-reese-lite.wav",
    "/Users/nick/codex/portfolio/bb/samples/synth/passb/trap-808-sub.wav",
    "/Users/nick/codex/portfolio/bb/samples/synth/passb/uk-stab-crisp.wav"
  ];
  files.forEach((file) => assert.ok(fs.existsSync(file), file));
});

test("bassline and trap drums use genre-typical kick/snare placement", () => {
  const { DRUM_PATTERN_BANK } = loadEngine();
  const bassPatterns = DRUM_PATTERN_BANK.bass || [];
  const trapPatterns = DRUM_PATTERN_BANK.trap || [];
  assert.ok(bassPatterns.length > 0);
  assert.ok(trapPatterns.length > 0);
  bassPatterns.forEach((pattern) => {
    assert.equal(JSON.stringify(pattern.kick), JSON.stringify([0, 1, 2, 3]));
  });
  trapPatterns.forEach((pattern) => {
    assert.equal(JSON.stringify(pattern.snare), JSON.stringify([2]));
  });
});

test("garage and dnb kits use genre-matched core drum samples", () => {
  const source = fs.readFileSync("/Users/nick/codex/portfolio/bb/app.js", "utf8");
  const garageKit = source.match(/libre_garage:\s*\{[\s\S]*?\},/);
  const dnbKit = source.match(/libre_dnb:\s*\{[\s\S]*?\},/);
  assert.ok(garageKit);
  assert.ok(dnbKit);
  assert.ok(garageKit[0].includes("bb/samples/drums/libre/garage/kick.wav"));
  assert.ok(garageKit[0].includes("bb/samples/drums/libre/garage/hat.wav"));
  assert.ok(dnbKit[0].includes("bb/samples/drums/libre/dnb/snare-b.wav"));
});

test("refresh button is mobile-only in stylesheet", () => {
  const css = fs.readFileSync("/Users/nick/codex/portfolio/bb/styles.css", "utf8");
  assert.match(css, /\.key-refresh\s*\{[^}]*display:\s*none;/s);
  assert.match(css, /@media\s*\(max-width:\s*900px\)\s*\{[\s\S]*?\.key-refresh\s*\{[^}]*display:\s*inline-flex;/s);
});

test("style dropdown labels bass as Bassline", () => {
  const html = fs.readFileSync("/Users/nick/codex/portfolio/bb.html", "utf8");
  assert.ok(html.includes('<option value="bass">Bassline</option>'));
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

test("chooseMusicalProgression with spice none stays diatonic in dorian", () => {
  const { chooseMusicalProgression, isDiatonicRomanToken } = loadEngine();
  for (let i = 0; i < 40; i += 1) {
    const tokens = chooseMusicalProgression(4, "dorian", "none");
    assert.equal(tokens.length, 4);
    assert.ok(tokens.every((token) => isDiatonicRomanToken(token, "dorian")));
    assert.ok(tokens[0] === "i" || tokens[tokens.length - 1] === "i");
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
  assert.equal(description.label, "Spicy (bIIadd9)");
  assert.ok(description.name.startsWith("Db"));
  assert.equal(chord.root, "Db");
  assert.ok(!description.name.toLowerCase().includes("bii"));
});

test("roman label displays extension suffix for edited chords", () => {
  const { state, createChordItem, describeItem } = loadEngine();
  resetState(state);
  state.mode = "major";
  state.key = "F#";
  const item = createChordItem("IV", 4, null, ["add9"]);
  const description = describeItem(item);
  assert.equal(description.label, "IVadd9");
});

test("inline chord token add9 adds the 9th interval", () => {
  const { state, createChordItem, chordFromItem } = loadEngine();
  resetState(state);
  state.mode = "major";
  state.key = "F#";
  const chord = chordFromItem(createChordItem("Badd9", 4));
  assert.ok(chord.intervals.includes(14));
});

test("whole-note rhythm repeats once per bar for long chords", () => {
  const { state, getChordRhythm } = loadEngine();
  resetState(state);
  state.rhythm = "whole";
  const hits = getChordRhythm(16, "A");
  assert.equal(JSON.stringify(hits), JSON.stringify([0, 4, 8, 12]));
});

function parseRomanForReference(token) {
  const cleaned = token.replace(/[^IViv°b#]/g, "");
  const match = cleaned.match(/^([b#]?)([IViv]+°?)$/);
  if (!match) return null;
  const acc = match[1] === "b" ? -1 : match[1] === "#" ? 1 : 0;
  let core = match[2];
  const isDim = core.endsWith("°");
  if (isDim) core = core.slice(0, -1);
  const degreeMap = { I: 0, II: 1, III: 2, IV: 3, V: 4, VI: 5, VII: 6 };
  const degree = degreeMap[core.toUpperCase()];
  if (degree == null) return null;
  return { degree, acc, core, isDim };
}

function qualityForReference(mode, token, degreeInfo) {
  const defaults = {
    major: ["maj", "min", "min", "maj", "maj", "min", "dim"],
    minor: ["min", "dim", "maj", "min", "min", "maj", "maj"]
  };
  let quality = defaults[mode][degreeInfo.degree];
  if (degreeInfo.isDim) return "dim";
  const roman = token.replace(/[^IViv]/g, "");
  if (/[iv]/.test(roman) && !/[IV]/.test(roman)) quality = "min";
  if (/[IV]/.test(roman) && !/[iv]/.test(roman)) quality = "maj";
  return quality;
}

test("100 random generated progressions resolve to musically valid roman chord tones", () => {
  const { state, chooseMusicalProgression, createChordItem, chordFromItem, NOTES } = loadEngine();
  const MAJOR = [0, 2, 4, 5, 7, 9, 11];
  const MINOR = [0, 2, 3, 5, 7, 8, 10];
  const FLAT_EQ = { Db: "C#", Eb: "D#", Gb: "F#", Ab: "G#", Bb: "A#" };
  const toPc = (note) => {
    const normalized = FLAT_EQ[note] || note;
    return NOTES.indexOf(normalized);
  };

  for (let run = 0; run < 100; run += 1) {
    resetState(state);
    state.mode = run % 2 === 0 ? "major" : "minor";
    state.key = ["C", "D", "E", "F", "G", "A", "B", "Eb", "Bb", "F#", "Db", "Ab"][run % 12];
    const spice = run % 3 === 0 ? "bold" : run % 3 === 1 ? "light" : "none";
    const length = 4 + (run % 5);
    const tokens = chooseMusicalProgression(length, state.mode, spice);
    assert.equal(tokens.length, length);
    const tonic = state.mode === "major" ? "I" : "i";
    assert.ok(tokens[0] === tonic || tokens[tokens.length - 1] === tonic);

    tokens.forEach((token) => {
      const parsed = parseRomanForReference(token);
      assert.ok(parsed, `token should parse as roman: ${token}`);
      const item = createChordItem(token, 4);
      const chord = chordFromItem(item);
      const rootPc = toPc(chord.root);
      assert.ok(rootPc >= 0, `root should map to pitch class: ${chord.root}`);

      const modeScale = state.mode === "major" ? MAJOR : MINOR;
      let accidental = parsed.acc;
      // Minor-mode bIII/bVI/bVII are treated as modal diatonic colors in app logic.
      if (state.mode === "minor" && accidental === -1 && (parsed.degree === 2 || parsed.degree === 5 || parsed.degree === 6)) {
        accidental = 0;
      }
      const keyPc = toPc(state.key);
      const expectedRoot = (keyPc + modeScale[parsed.degree] + accidental + 1200) % 12;
      assert.equal(rootPc, expectedRoot, `unexpected root for ${state.key} ${state.mode} ${token}`);

      const quality = qualityForReference(state.mode, token, parsed);
      const expectedTriad = quality === "maj" ? [0, 4, 7] : quality === "min" ? [0, 3, 7] : [0, 3, 6];
      expectedTriad.forEach((interval) => {
        assert.ok(chord.intervals.includes(interval), `missing interval ${interval} for ${token}`);
      });
    });
  }
});

test("scale-only mode follows key mode and includes spicy chord tones", () => {
  const { state, getHighlightNotes, chordFromItem, createChordItem, scaleOnlyToggle } = loadEngine();
  resetState(state);
  state.mode = "minor";
  state.key = "F#";
  if (scaleOnlyToggle) scaleOnlyToggle.checked = true;

  // Spicy chord in F# minor: bII => G major (G-B-D), includes out-of-scale tones.
  const spicy = chordFromItem(createChordItem("bII", 4));
  state.currentChordNotes = new Set(spicy.intervals.map((i) => {
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const keyPc = notes.indexOf(spicy.root);
    return notes[(keyPc + i + 1200) % 12];
  }));
  state.currentChordRoot = spicy.root;

  const { highlightSet } = getHighlightNotes();
  // F# natural minor contains A, not A#/Bb.
  assert.ok(highlightSet.has("A"));
  assert.ok(!highlightSet.has("A#"));
  // spicy bII chord tones should be represented.
  assert.ok(highlightSet.has("G"));
  assert.ok(highlightSet.has("B"));
  assert.ok(highlightSet.has("D"));
});

test("scale-only mode follows dorian scale tones", () => {
  const { state, getHighlightNotes, scaleOnlyToggle } = loadEngine();
  resetState(state);
  state.mode = "dorian";
  state.key = "F#";
  if (scaleOnlyToggle) scaleOnlyToggle.checked = true;
  state.currentChordNotes = new Set();

  const { highlightSet } = getHighlightNotes();
  assert.ok(highlightSet.has("D#"));
  assert.ok(!highlightSet.has("D"));
});

test("mode picker includes advanced modal options", () => {
  const html = fs.readFileSync("/Users/nick/codex/portfolio/bb.html", "utf8");
  assert.ok(html.includes('data-mode="dorian"'));
  assert.ok(html.includes('data-mode="mixolydian"'));
  assert.ok(html.includes('data-mode="lydian"'));
  assert.ok(html.includes('data-mode="phrygian"'));
});
