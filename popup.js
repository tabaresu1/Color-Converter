
function rgbaToHex(r, g, b) {
  return "#" + [r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join("").toUpperCase();
}

function hexToRgba(hex) {
  let r = parseInt(hex.slice(0, 2), 16);
  let g = parseInt(hex.slice(2, 4), 16);
  let b = parseInt(hex.slice(4, 6), 16);
  return `rgba(${r},${g},${b},1)`;
}

function rgbToCmyk(r, g, b) {
  let c = 1 - (r / 255);
  let m = 1 - (g / 255);
  let y = 1 - (b / 255);
  let k = Math.min(c, m, y);
  if (k === 1) return "CMYK(0%, 0%, 0%, 100%)";
  c = ((c - k) / (1 - k)) * 100;
  m = ((m - k) / (1 - k)) * 100;
  y = ((y - k) / (1 - k)) * 100;
  k = k * 100;
  return `CMYK(${c.toFixed(1)}%, ${m.toFixed(1)}%, ${y.toFixed(1)}%, ${k.toFixed(1)}%)`;
}

document.getElementById("rgba").addEventListener("input", function () {
  let match = this.value.match(/rgba?\((\d+),(\d+),(\d+)(?:,\d*\.?\d+)?\)/);
  if (match) {
    let [, r, g, b] = match.map(Number);
    document.getElementById("hex").value = rgbaToHex(r, g, b);
  } else {
    document.getElementById("hex").value = "";
  }
});

function copiarHEX() {
  const hex = document.getElementById("hex").value;
  navigator.clipboard.writeText(hex);
}

document.getElementById("hexInput").addEventListener("input", function () {
  let hex = this.value.replace(/[^0-9a-f]/gi, "").toUpperCase();
  this.value = hex;
  if (hex.length === 6) {
    document.getElementById("rgbaOutput").value = hexToRgba(hex);
  } else {
    document.getElementById("rgbaOutput").value = "";
  }
});

document.getElementById("toCMYK").addEventListener("input", function () {
  let match = this.value.match(/rgb?\((\d+),(\d+),(\d+)\)/);
  if (match) {
    let [, r, g, b] = match.map(Number);
    document.getElementById("cmykOutput").value = rgbToCmyk(r, g, b);
  } else {
    document.getElementById("cmykOutput").value = "";
  }
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log("Service Worker registrado"))
    .catch(err => console.error("Erro no Service Worker", err));
}
