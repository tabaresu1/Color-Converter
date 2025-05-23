function convertHexToRGBA() {
  const hex = document.getElementById('hexInput').value;
  const result = document.getElementById('rgbaOutput');

  if (!/^#?[0-9A-Fa-f]{6}$/.test(hex)) {
    result.textContent = 'HEX inválido!';
    return;
  }

  const normalizedHex = hex.replace('#', '');
  const r = parseInt(normalizedHex.substring(0, 2), 16);
  const g = parseInt(normalizedHex.substring(2, 4), 16);
  const b = parseInt(normalizedHex.substring(4, 6), 16);
  result.textContent = `rgba(${r}, ${g}, ${b}, 1)`;
}

function convertRGBAToHex() {
  const r = parseInt(document.getElementById('r').value);
  const g = parseInt(document.getElementById('g').value);
  const b = parseInt(document.getElementById('b').value);
  const a = parseFloat(document.getElementById('a').value);
  const result = document.getElementById('hexOutput');

  if ([r, g, b].some(n => isNaN(n) || n < 0 || n > 255) || isNaN(a) || a < 0 || a > 1) {
    result.textContent = 'Valores inválidos!';
    return;
  }

  const toHex = x => x.toString(16).padStart(2, '0');
  result.textContent = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function convertHexToCMYK() {
  const hex = document.getElementById('hexCmykInput').value;
  const result = document.getElementById('cmykOutput');

  if (!/^#?[0-9A-Fa-f]{6}$/.test(hex)) {
    result.textContent = 'HEX inválido!';
    return;
  }

  const normalizedHex = hex.replace('#', '');
  const r = parseInt(normalizedHex.substring(0, 2), 16) / 255;
  const g = parseInt(normalizedHex.substring(2, 4), 16) / 255;
  const b = parseInt(normalizedHex.substring(4, 6), 16) / 255;

  const k = 1 - Math.max(r, g, b);
  const c = (1 - r - k) / (1 - k) || 0;
  const m = (1 - g - k) / (1 - k) || 0;
  const y = (1 - b - k) / (1 - k) || 0;

  result.textContent = `CMYK(${(c*100).toFixed(1)}%, ${(m*100).toFixed(1)}%, ${(y*100).toFixed(1)}%, ${(k*100).toFixed(1)}%)`;
}

// Tab switching
document.querySelectorAll('.tab').forEach((tab, index) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.tab-panel').forEach(p => p.setAttribute('aria-hidden', 'true'));

    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    const panelId = tab.getAttribute('aria-controls');
    document.getElementById(panelId).setAttribute('aria-hidden', 'false');
  });
});
