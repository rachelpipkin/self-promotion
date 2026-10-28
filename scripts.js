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

// Bubbles: a trail that follows the mouse; on touch, hold to blow a bubble and let go to pop it
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var lastBubble = 0;
var growing = null;
var bubbleTints = ['#F8BBD0', '#FFCCBC', '#FFF59D', '#C8E6C9', '#BBDEFB', '#E1BEE7'];

var makeBubble = function (x, y, size, className) {
  var bubble = document.createElement('span');
  bubble.className = 'bubble ' + className;
  bubble.style.setProperty('--tint', bubbleTints[Math.floor(Math.random() * bubbleTints.length)]);
  bubble.style.left = x + 'px';
  bubble.style.top = y + 'px';
  bubble.style.width = bubble.style.height = size + 'px';
  document.body.appendChild(bubble);
  return bubble;
};

var removeAfterAnimation = function (bubble) {
  bubble.addEventListener('animationend', function () { bubble.remove(); });
};

var popBubble = function (bubble) {
  var size = bubble.getBoundingClientRect().width;
  bubble.style.width = bubble.style.height = size + 'px';
  bubble.classList.remove('growing');
  bubble.classList.add('popping');
  removeAfterAnimation(bubble);
};

if (!reduceMotion) {
  document.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    var now = Date.now();
    if (now - lastBubble < 60) return;
    lastBubble = now;
    removeAfterAnimation(makeBubble(e.clientX, e.clientY, 14 + Math.random() * 22, 'floating'));
  });

  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse') return;
    if (growing) popBubble(growing);
    growing = makeBubble(e.clientX, e.clientY, 20, 'growing');
  });

  ['pointerup', 'pointercancel'].forEach(function (type) {
    document.addEventListener(type, function (e) {
      if (e.pointerType === 'mouse' || !growing) return;
      popBubble(growing);
      growing = null;
    });
  });
}
