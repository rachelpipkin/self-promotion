var colors = [
  { name: 'red', value: '#F48FB1' },
  { name: 'orange', value: '#FFAB91' },
  { name: 'yellow', value: '#FFE082' },
  { name: 'green' , value: '#A5D6A7' },
  { name: 'blue', value: '#90CAF9' },
  { name: 'purple', value: '#CE93D8' }
];

var setRainbowColor = function () {
  document.body.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)].value;
};

var setRandomColor = function () {
  document.body.style.backgroundColor = '#' + Math.random().toString(16).substr(2,6);
};

setRainbowColor();

setInterval(function () {
  setRainbowColor();
}, 7000);
