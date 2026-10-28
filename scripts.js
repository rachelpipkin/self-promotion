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

// Effects: bubbles or sparkles follow the mouse. On touch, bubbles mode grows a bubble while
// held and pops it on release; sparkles mode bursts sparkles on tap.
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var lastBubble = 0;
var growing = null;
var growStart = 0;
var effect = 'sparkles';
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

var makeSparkles = function (x, y, count, distance, className) {
  var offset = Math.random() * 2 * Math.PI;
  for (var i = 0; i < count; i++) {
    var sparkle = document.createElement('span');
    var angle = (i / count) * 2 * Math.PI + offset;
    var reach = distance * (0.6 + Math.random() * 0.4);
    sparkle.className = 'sparkle' + (className ? ' ' + className : '');
    sparkle.textContent = '\u2726';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    sparkle.style.color = bubbleTints[Math.floor(Math.random() * bubbleTints.length)];
    sparkle.style.setProperty('--dx', Math.cos(angle) * reach + 'px');
    sparkle.style.setProperty('--dy', Math.sin(angle) * reach + 'px');
    document.body.appendChild(sparkle);
    removeAfterAnimation(sparkle);
  }
};

var popBubble = function (bubble) {
  var size = bubble.getBoundingClientRect().width;
  bubble.style.width = bubble.style.height = size + 'px';
  bubble.classList.remove('growing');
  bubble.classList.add('popping');
  removeAfterAnimation(bubble);
  makeSparkles(parseFloat(bubble.style.left), parseFloat(bubble.style.top), 8, size * 0.6 + 30);
};

if (!reduceMotion) {
  document.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    var now = Date.now();
    if (now - lastBubble < (effect === 'sparkles' ? 50 : 60)) return;
    lastBubble = now;
    if (effect === 'sparkles') {
      makeSparkles(e.clientX, e.clientY, 1, 20, 'trail');
    } else {
      removeAfterAnimation(makeBubble(e.clientX, e.clientY, 14 + Math.random() * 22, 'floating'));
    }
  });

  document.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse' || (e.target.closest && e.target.closest('.effect-toggle'))) return;
    if (effect === 'sparkles') {
      makeSparkles(e.clientX, e.clientY, 10, 60);
      return;
    }
    if (growing) popBubble(growing);
    growing = makeBubble(e.clientX, e.clientY, 20, 'growing');
    growStart = Date.now();
  });

  ['pointerup', 'pointercancel'].forEach(function (type) {
    document.addEventListener(type, function (e) {
      if (e.pointerType === 'mouse' || !growing) return;
      if (Date.now() - growStart < 250) {
        // Quick tap: just sparkles
        makeSparkles(parseFloat(growing.style.left), parseFloat(growing.style.top), 6, 40);
        growing.remove();
      } else {
        popBubble(growing);
      }
      growing = null;
    });
  });

  // Android shows a context menu on long press
  document.addEventListener('contextmenu', function (e) {
    if (growing) e.preventDefault();
  });
}

// Email: copy the address instead of opening a mail app; falls back to mailto if copying fails
var emailLink = document.querySelector('.email');
var emailResetTimer = null;

emailLink.addEventListener('click', function (e) {
  if (!navigator.clipboard) return;
  e.preventDefault();
  var address = emailLink.getAttribute('href').replace('mailto:', '');
  navigator.clipboard.writeText(address).then(function () {
    var icon = emailLink.querySelector('i');
    var label = emailLink.querySelector('span');
    icon.className = 'ti ti-check';
    label.textContent = 'Copied';
    clearTimeout(emailResetTimer);
    emailResetTimer = setTimeout(function () {
      icon.className = 'ti ti-mail';
      label.textContent = 'Email';
    }, 5000);
  }, function () {
    window.location.href = emailLink.getAttribute('href');
  });
});

// Effect toggle: switch between bubbles and sparkles
var effectButtons = document.querySelectorAll('.effect-toggle button');

effectButtons.forEach(function (button) {
  button.addEventListener('click', function () {
    effect = button.getAttribute('data-effect');
    effectButtons.forEach(function (b) {
      b.setAttribute('aria-pressed', b === button ? 'true' : 'false');
    });
  });
});
