const result = document.querySelector('#result');

const keys = ["C", "D♭", "D", "E♭", "E", "F", "F♯", "G", "A♭", "A", "B♭", "B"];
const scales = ["Major", "Minor"];
const shapes = ["Shape 1", "Shape 2", "Shape 3", "Shape 4", "Shape 5"];

// const commonkeys = ["C", "D", "E", "F", "G", "A", "B"];

const generateKey = () => {
  let randomKeyIndex = Math.floor(Math.random() * keys.length);
  let randomScaleIndex = Math.floor(Math.random() * scales.length);
  let randomScaleShape = Math.floor(Math.random() * shapes.length);
  let result = `${keys[randomKeyIndex]} ${scales[randomScaleIndex]} ${shapes[randomScaleShape]}`;
  document.querySelector("#result").textContent = result;
};

document.querySelector("#shuffleButton").addEventListener("click", generateKey);