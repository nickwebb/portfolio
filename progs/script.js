const legacyProgressions = Array.isArray(window.songProgressions) ? window.songProgressions : [];
const contemporaryProgressions = Array.isArray(window.contemporarySongProgressions)
  ? window.contemporarySongProgressions
  : [];

// Prefer modern songs more often while still mixing in the historical corpus.
const CONTEMPORARY_WEIGHT = 0.65;

const stageElement = document.getElementById('stage');
const keyElement = document.getElementById('key');
const progressionElement = document.getElementById('progression');

let lastSignature = '';

function pickPool() {
  if (legacyProgressions.length && contemporaryProgressions.length) {
    return Math.random() < CONTEMPORARY_WEIGHT ? contemporaryProgressions : legacyProgressions;
  }

  if (contemporaryProgressions.length) {
    return contemporaryProgressions;
  }

  return legacyProgressions;
}

function buildSignature(entry) {
  return `${entry.artist || ''}|${entry.title || ''}|${entry.key}|${entry.progression.join('-')}`;
}

function pickEntry() {
  const pool = pickPool();
  if (!pool.length) {
    return null;
  }

  let candidate = pool[Math.floor(Math.random() * pool.length)];
  let signature = buildSignature(candidate);

  if (pool.length > 1) {
    let attempts = 0;
    while (signature === lastSignature && attempts < 8) {
      candidate = pool[Math.floor(Math.random() * pool.length)];
      signature = buildSignature(candidate);
      attempts += 1;
    }
  }

  lastSignature = signature;
  return candidate;
}

function renderProgression() {
  const next = pickEntry();

  if (!next) {
    keyElement.textContent = 'Unavailable';
    progressionElement.textContent = 'No progressions loaded';
    progressionElement.title = '';
    return;
  }

  const details = [next.artist, next.title].filter(Boolean).join(' - ');
  const tooltip = next.year ? `${details} (${next.year})` : details || 'Song metadata unavailable';

  keyElement.textContent = next.key;
  progressionElement.textContent = next.progression.join(' - ');
  progressionElement.title = tooltip;
  progressionElement.setAttribute('aria-label', tooltip);

  progressionElement.classList.remove('fade-swap');
  requestAnimationFrame(() => {
    progressionElement.classList.add('fade-swap');
  });
}

progressionElement.addEventListener('click', renderProgression);
stageElement.addEventListener('click', (event) => {
  if (event.target === stageElement) {
    renderProgression();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    renderProgression();
  }
});

renderProgression();
