const progressions = Array.isArray(window.songProgressions) ? window.songProgressions : [];

const stageElement = document.getElementById('stage');
const keyElement = document.getElementById('key');
const progressionElement = document.getElementById('progression');

let lastIndex = -1;

function randomIndex() {
  if (progressions.length < 2) {
    return 0;
  }

  let next = Math.floor(Math.random() * progressions.length);
  while (next === lastIndex) {
    next = Math.floor(Math.random() * progressions.length);
  }

  return next;
}

function renderProgression() {
  if (!progressions.length) {
    keyElement.textContent = 'Unavailable';
    progressionElement.textContent = 'No progressions loaded';
    progressionElement.title = '';
    return;
  }

  const nextIndex = randomIndex();
  const next = progressions[nextIndex];
  const tooltip = next.artist && next.title ? `${next.artist} - ${next.title}` : 'Song metadata unavailable';

  keyElement.textContent = next.key;
  progressionElement.textContent = next.progression.join(' - ');
  progressionElement.title = tooltip;
  progressionElement.setAttribute('aria-label', tooltip);

  progressionElement.classList.remove('fade-swap');
  requestAnimationFrame(() => {
    progressionElement.classList.add('fade-swap');
  });

  lastIndex = nextIndex;
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
