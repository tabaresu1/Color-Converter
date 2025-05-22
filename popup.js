// ===== TOGGLE DARK MODE =====
const themeBtn = document.getElementById('themeBtn');
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeBtn.textContent = document.body.classList.contains('dark-mode') ? '🌞 Tema Claro' : '🌒 Tema Escuro';
});

// ===== CONTROLE DE ABAS =====
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn, .tab-content').forEach(el => {
            el.classList.remove('active');
        });
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// ===== FUNÇÕES DE CONVERSÃO =====
// RGBA → HEX
function rgbaToHex(r, g, b, a) {
    const toHex = (n) => Math.round(n).toString(16).padStart(2, '0').toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${a < 1 ? toHex(a * 255) : ''}`;
}

// CMYK → HEX
function cmykToHex(c, m, y, k) {
    const [r, g, b] = cmykToRgb(c, m, y, k);
    return rgbaToHex(r, g, b, 1);
}

// HEX → RGBA
function hexToRgba(hex) {
    hex = hex.replace(/^#/, '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const a = hex.length === 8 ? (parseInt(hex.substring(6, 8), 16) / 255 : 1;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// CMYK → RGBA
function cmykToRgba(c, m, y, k) {
    const [r, g, b] = cmykToRgb(c, m, y, k);
    return `rgba(${r}, ${g}, ${b}, 1)`;
}

// RGBA → CMYK
function rgbaToCmyk(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const k = 1 - Math.max(r, g, b);
    const c = ((1 - r - k) / (1 - k)) * 100 || 0;
    const m = ((1 - g - k) / (1 - k)) * 100 || 0;
    const y = ((1 - b - k) / (1 - k)) * 100 || 0;
    return `cmyk(${Math.round(c)}%, ${Math.round(m)}%, ${Math.round(y)}%, ${Math.round(k * 100)}%)`;
}

// HEX → CMYK
function hexToCmyk(hex) {
    const rgba = hexToRgba(hex);
    const [r, g, b] = rgba.match(/\d+/g).map(Number);
    return rgbaToCmyk(r, g, b);
}

// Função auxiliar: CMYK → RGB
function cmykToRgb(c, m, y, k) {
    c /= 100; m /= 100; y /= 100; k /= 100;
    return [
        Math.round(255 * (1 - c) * (1 - k)),
        Math.round(255 * (1 - m) * (1 - k)),
        Math.round(255 * (1 - y) * (1 - k))
    ];
}

// ===== ATUALIZAÇÃO EM TEMPO REAL =====
function updateAll() {
    // ABA HEX
    const r = document.getElementById('r').value;
    const g = document.getElementById('g').value;
    const b = document.getElementById('b').value;
    const a = document.getElementById('a').value;
    if (r && g && b && a) {
        document.getElementById('hexResult').value = rgbaToHex(r, g, b, a);
    }

    const cHex = document.getElementById('cHex').value;
    const mHex = document.getElementById('mHex').value;
    const yHex = document.getElementById('yHex').value;
    const kHex = document.getElementById('kHex').value;
    if (cHex && mHex && yHex && kHex) {
        document.getElementById('hexCmykResult').value = cmykToHex(cHex, mHex, yHex, kHex);
    }

    // ABA RGBA
    const hexToRgbaInput = document.getElementById('hexToRgba').value;
    if (hexToRgbaInput && /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(hexToRgbaInput)) {
        document.getElementById('rgbaResult').value = hexToRgba(hexToRgbaInput);
    }

    const cRgba = document.getElementById('cRgba').value;
    const mRgba = document.getElementById('mRgba').value;
    const yRgba = document.getElementById('yRgba').value;
    const kRgba = document.getElementById('kRgba').value;
    if (cRgba && mRgba && yRgba && kRgba) {
        document.getElementById('rgbaFromCmyk').value = cmykToRgba(cRgba, mRgba, yRgba, kRgba);
    }

    // ABA CMYK
    const hexToCmykInput = document.getElementById('hexToCmyk').value;
    if (hexToCmykInput && /^#?([A-Fa-f0-9]{6})$/.test(hexToCmykInput)) {
        document.getElementById('cmykResult').value = hexToCmyk(hexToCmykInput);
    }

    const rCmyk = document.getElementById('rCmyk').value;
    const gCmyk = document.getElementById('gCmyk').value;
    const bCmyk = document.getElementById('bCmyk').value;
    if (rCmyk && gCmyk && bCmyk) {
        document.getElementById('cmykFromRgba').value = rgbaToCmyk(rCmyk, gCmyk, bCmyk);
    }

    // Atualizar pré-visualização
    const activeHex = document.querySelector('.tab-content.active input[type="text"]').value;
    if (activeHex && activeHex.startsWith('#')) {
        document.getElementById('colorPreview').style.backgroundColor = activeHex;
    }
}

// ===== EVENT LISTENERS =====
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateAll);
});

document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        target.select();
        document.execCommand('copy');
    });
});

// Inicialização
updateAll();