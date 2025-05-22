// Alternar modo claro/escuro
document.getElementById('themeSwitch').addEventListener('change', function () {
  document.body.classList.toggle('dark', this.checked);
});

// Alternar abas
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// HEX para CMYK
document.getElementById('hexInput').addEventListener('input', function () {
  const hex = this.value;
  if (hex.length === 6) {
    const cmyk = hexToCMYK('#' + hex);
    document.getElementById('cmykFromHex').value = `C:${cmyk.c}% M:${cmyk.m}% Y:${cmyk.y}% K:${cmyk.k}%`;
    document.getElementById('previewHex').style.backgroundColor = '#' + hex;
  }
});

// HEX para RGBA
document.getElementById('hexInputRGBA').addEventListener('input', function () {
  const hex = this.value;
  if (hex.length === 6) {
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const rgba = `rgba(${r}, ${g}, ${b}, 1)`;
    document.getElementById('rgbaFromHex').value = rgba;
    document.getElementById('previewRGBA').style.backgroundColor = rgba;
  }
});

// CMYK para HEX
document.querySelectorAll('#c, #m, #y, #k').forEach(input => {
  input.addEventListener('input', () => {
    const c = parseFloat(document.getElementById('c').value) || 0;
    const m = parseFloat(document.getElementById('m').value) || 0;
    const y = parseFloat(document.getElementById('y').value) || 0;
    const k = parseFloat(document.getElementById('k').value) || 0;
    const hex = cmykToHex(c, m, y, k);
    document.getElementById('hexFromCmyk').value = hex;
    document.getElementById('previewCmyk').style.backgroundColor = hex;
  });
});

// Função copiar
function copyToClipboard(id) {
  const el = document.getElementById(id);
  el.select();
  document.execCommand('copy');
}

// HEX → CMYK
function hexToCMYK(hex) {
  hex = hex.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const k = 1 - Math.max(r, g, b);
  const c = (1 - r - k) / (1 - k) || 0;
  const m = (1 - g - k) / (1 - k) || 0;
  const y = (1 - b - k) / (1 - k) || 0;

  return {
    c: Math.round(c * 100),
    m: Math.round(m * 100),
    y: Math.round(y * 100),
    k: Math.round(k * 100)
  };
}

// CMYK → HEX
function cmykToHex(c, m, y, k) {
  c /= 100;
  m /= 100;
  y /= 100;
  k /= 100;

  const r = 255 * (1 - c) * (1 - k);
  const g = 255 * (1 - m) * (1 - k);
  const b = 255 * (1 - y) * (1 - k);

  return (
    '#' +
    [r, g, b]
      .map(x => Math.round(x).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}
