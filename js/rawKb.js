// ── helpers ─────────────────────────────────────────────────────────
function el(tag, attrs = {}) {
  const e = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}

function addToSVG(e) { svg.appendChild(e); }

// ── draw keyboard body ───────────────────────────────────────────────
function drawBody() {
  // outer shell
  addToSVG(el("rect", {
    x: 12, y: 12,
    width: 1276, height: 516,
    rx: 18,
    class: "kb-body"
  }));

  // inner top bevel highlight
  addToSVG(el("rect", {
    x: 16, y: 16,
    width: 1268, height: 508,
    rx: 15,
    class: "kb-inner-bevel"
  }));

  // subtle bottom ledge shadow line
  const shadow = el("rect", {
    x: 12, y: 504,
    width: 1276, height: 24,
    rx: "0 0 18 18"
  });
  shadow.setAttribute("fill", "rgba(0,0,0,0.25)");
  addToSVG(shadow);
}

// ── draw a single key group ──────────────────────────────────────────
function drawKey(text, x, y, wu, codes) {
  const w = U * wu + G * (wu - 1);
  const h = U;
  const r = 7;

  const group = el("g");

  // shadow base (the "body" of the key, slightly taller)
  const shadow = el("rect", { x, y: y + 3, width: w, height: h - 1, rx: r });
  shadow.setAttribute("fill", "rgba(0,0,0,0.45)");
  group.appendChild(shadow);

  // outer key shell
  const rect = el("rect", { x, y, width: w, height: h, rx: r, class: "key" });
  group.appendChild(rect);

  // key face (slightly inset)
  const faceInset = 2;
  const face = el("rect", {
    x: x + faceInset,
    y: y + faceInset,
    width: w - faceInset * 2,
    height: h - faceInset - 1,
    rx: r - 1,
    class: "key-face"
  });
  group.appendChild(face);

  // top edge shine
  const shine = el("rect", {
    x: x + faceInset + 2,
    y: y + faceInset,
    width: w - (faceInset + 2) * 2,
    height: 3,
    rx: 2,
    class: "key-shine"
  });
  group.appendChild(shine);

  // label
  const display = {
    " ": "SPACE",
    "⌫": "⌫",
    "↵": "↵",
    "⇧": "⇧",
    "⊞": "⊞",
    "☰": "☰"
  };
  const lbl = el("text", {
    x: x + w / 2,
    y: y + h / 2 + 1,
    class: wu >= 2 ? "label small" : "label"
  });
  lbl.textContent = display[text] || text;
  group.appendChild(lbl);

  addToSVG(group);

  // register in map
  for (const code of codes) {
    keyMap[code] = { rect, face, shine, label: lbl };
  }

  return w;
}

// ── map logical labels to keyboard codes ─────────────────────────────
const LABEL_TO_CODES = {
  "Esc":   ["Escape"],
  "F1":    ["F1"],"F2":["F2"],"F3":["F3"],"F4":["F4"],
  "F5":    ["F5"],"F6":["F6"],"F7":["F7"],"F8":["F8"],
  "F9":    ["F9"],"F10":["F10"],"F11":["F11"],"F12":["F12"],
  "`":     ["Backquote"],
  "1":     ["Digit1"],"2":["Digit2"],"3":["Digit3"],"4":["Digit4"],
  "5":     ["Digit5"],"6":["Digit6"],"7":["Digit7"],"8":["Digit8"],
  "9":     ["Digit9"],"0":["Digit0"],
  "-":     ["Minus"],"=":["Equal"],
  "⌫":    ["Backspace"],
  "Tab":   ["Tab"],
  "Q":["KeyQ"],"W":["KeyW"],"E":["KeyE"],"R":["KeyR"],"T":["KeyT"],
  "Y":["KeyY"],"U":["KeyU"],"I":["KeyI"],"O":["KeyO"],"P":["KeyP"],
  "[":["BracketLeft"],"]":["BracketRight"],"\\":["Backslash"],
  "Caps":  ["CapsLock"],
  "A":["KeyA"],"S":["KeyS"],"D":["KeyD"],"F":["KeyF"],"G":["KeyG"],
  "H":["KeyH"],"J":["KeyJ"],"K":["KeyK"],"L":["KeyL"],
  ";":["Semicolon"],"'":["Quote"],
  "↵":     ["Enter"],
  "⇧":    ["ShiftLeft","ShiftRight"],
  "Z":["KeyZ"],"X":["KeyX"],"C":["KeyC"],"V":["KeyV"],
  "B":["KeyB"],"N":["KeyN"],"M":["KeyM"],
  ",":["Comma"],".":["Period"],"/":["Slash"],
  "Ctrl":  ["ControlLeft","ControlRight"],
  "⊞":    ["MetaLeft","MetaRight"],
  "Alt":   ["AltLeft","AltRight"],
  " ":     ["Space"],
  "Fn":    ["__fn__"],
  "☰":    ["ContextMenu"],
  // Nav
  "Ins":   ["Insert"],"Home":["Home"],"PgUp":["PageUp"],
  "Del":   ["Delete"],"End":["End"],"PgDn":["PageDown"],
  "↑":     ["ArrowUp"],"↓":["ArrowDown"],
  "←":    ["ArrowLeft"],"→":["ArrowRight"],
};

// Build a reverse map: code → keyMap entry
// Since ⇧ appears twice (ShiftLeft, ShiftRight), we accept duplicates
const codeMap = {};

// ── render rows ──────────────────────────────────────────────────────
const ROW_START_Y = 60;
const ROW_SPACING = 62;
const COL_START_X = 28;

// Row 0 (function row) gets a bit more top margin and smaller
drawBody();

ROWS.forEach((row, ri) => {
  let x = COL_START_X;
  const y = ROW_START_Y + ri * ROW_SPACING + (ri === 0 ? 0 : 10);
  // extra gap after Esc row
  const extraX = ri === 0 ? 22 : 0;

  row.forEach(([label, wu], ki) => {
    if (ri === 0 && ki === 0) {
      // Esc: draw then skip gap
    }
    if (ri === 0 && ki === 1) x += extraX;

    const codes = LABEL_TO_CODES[label] || [];
    const w = drawKey(label, x, y, wu, codes);

    // register in codeMap
    for (const code of codes) {
      // handle duplicate ⇧ keys: store as array
      if (!codeMap[code]) codeMap[code] = [];
      codeMap[code].push(keyMap[code]);
    }

    x += w + G;
  });
});

// ── nav cluster (right side) ─────────────────────────────────────────
const NAV_X = 1010;
const NAV_Y_START = 132;

function drawNavKey(label, x, y) {
  const codes = LABEL_TO_CODES[label] || [];
  drawKey(label, x, y, 1, codes);
  for (const code of codes) {
    if (!codeMap[code]) codeMap[code] = [];
    codeMap[code].push(keyMap[code]);
  }
}

// Media row
drawNavKey("⏮", NAV_X,        NAV_Y_START - 70);
drawNavKey("⏯", NAV_X + STEP, NAV_Y_START - 70);
drawNavKey("⏭", NAV_X + STEP * 2, NAV_Y_START - 70);

// Nav 3×3
drawNavKey("Ins",  NAV_X,             NAV_Y_START);
drawNavKey("Home", NAV_X + STEP,      NAV_Y_START);
drawNavKey("PgUp", NAV_X + STEP * 2,  NAV_Y_START);

drawNavKey("Del",  NAV_X,             NAV_Y_START + STEP);
drawNavKey("End",  NAV_X + STEP,      NAV_Y_START + STEP);
drawNavKey("PgDn", NAV_X + STEP * 2,  NAV_Y_START + STEP);

// Arrows (inverted-T)
drawNavKey("↑",  NAV_X + STEP,      NAV_Y_START + STEP * 2 + 14);
drawNavKey("←", NAV_X,              NAV_Y_START + STEP * 3 + 14);
drawNavKey("↓",  NAV_X + STEP,      NAV_Y_START + STEP * 3 + 14);
drawNavKey("→",  NAV_X + STEP * 2,  NAV_Y_START + STEP * 3 + 14);

// ── audio ─────────────────────────────────────────────────────────────
let audio;
function initAudio() {
  if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
}

function clickSound(freq = 1200) {
  if (!audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const filter = audio.createBiquadFilter();

  osc.type = "square";
  osc.frequency.setValueAtTime(freq, audio.currentTime);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.4, audio.currentTime + 0.04);

  filter.type = "lowpass";
  filter.frequency.value = 3000;

  gain.gain.setValueAtTime(0.04, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.06);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audio.destination);

  osc.start();
  osc.stop(audio.currentTime + 0.06);
}
    
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, {
  threshold: 0.2
});

window.addEventListener("load", () => {
  const elements = document.querySelectorAll(".fade-up");
  
  elements.forEach((el) => {
    observer.observe(el);
    
    // trigger if already visible
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add("show");
    }
  });
});
