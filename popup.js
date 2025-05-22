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
        updateAll(); // Atualiza ao trocar de aba
    });
});

// ===== FUNÇÕES DE CONVERSÃO =====
// RGBA → HEX (Corrigido)
function rgbaToHex(r, g, b, a = 1) {
    r = Math.max(0, Math.min(255, parseInt(r) || 0));
    g = Math.max(0, Math.min(255, parseInt(g) || 0));
    b = Math.max(0, Math.min(255, parseInt(b) || 0));
    a = Math.max(0, Math.min(1, parseFloat(a) || 1));
    
    const toHex = (n) => n.toString(16).padStart(2, '0').toUpperCase();
    const alphaHex = a < 1 ? toHex(Math.round(a * 255)) : '';
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`;
}

// CMYK → HEX (Corrigido)
function cmykToHex(c, m, y, k) {
    c = Math.max(0, Math.min(100, parseInt(c) || 0)) / 100;
    m = Math.max(0, Math.min(100, parseInt(m) || 0)) / 100;
    y = Math.max(0, Math.min(100, parseInt(y) || 0)) / 100;
    k = Math.max(0, Math.min(100, parseInt(k) || 0)) / 100;
    
    const r = Math.round(255 * (1 - c) * (1 - k));
    const g = Math.round(255 * (1 - m) * (1 - k));
    const b = Math.round(255 * (1 - y) * (1 - k));
    return rgbaToHex(r, g, b);
}

// HEX → RGBA (Corrigido)
function hexToRgba(hex) {
    hex = hex.replace(/^#/, '').trim();
    if (!/^([0-9A-F]{3}){1,2}$/i.test(hex) && !/^([0-9A-F]{4}){1,2}$/i.test(hex)) return 'rgba(0, 0, 0, 1)';
    
    // Expande formato curto (ex: #RGB → #RRGGBB)
    if (hex.length === 3 || hex.length === 4) {
        hex = hex.split('').map(c => c + c).join('');
    }
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const a = hex.length === 8 ? (parseInt(hex.substring(6, 8), 16) / 255 : 1;
    
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
}

// RGB → CMYK (Nova função)
function rgbToCmyk(r, g, b) {
    r = parseInt(r) / 255;
    g = parseInt(g) / 255;
    b = parseInt(b) / 255;
    
    const k = 1 - Math.max(r, g, b);
    if (k === 1) return [0, 0, 0, 100]; // Preto puro
    
    const c = ((1 - r - k) / (1 - k)) * 100;
    const m = ((1 - g - k) / (1 - k)) * 100;
    const y = ((1 - b - k) / (1 - k)) * 100;
    
    return [
        Math.round(c),
        Math.round(m),
        Math.round(y),
        Math.round(k * 100)
    ];
}

// ===== ATUALIZAÇÃO EM TEMPO REAL =====
function updateAll() {
    // ABA HEX: RGBA → HEX
    const r = document.getElementById('r').value;
    const g = document.getElementById('g').value;
    const b = document.getElementById('b').value;
    const a = document.getElementById('a').value;
    document.getElementById('hexResult').value = rgbaToHex(r, g, b, a);

    // ABA HEX: CMYK → HEX
    const cHex = document.getElementById('cHex').value;
    const mHex = document.getElementById('mHex').value;
    const yHex = document.getElementById('yHex').value;
    const kHex = document.getElementById('kHex').value;
    document.getElementById('hexCmykResult').value = cmykToHex(cHex, mHex, yHex, kHex);

    // ABA RGBA: HEX → RGBA
    const hexInput = document.getElementById('hexInput').value;
    if (hexInput) {
        document.getElementById('rgbaResult').value = hexToRgba(hexInput);
    }

    // ABA CMYK: RGB → CMYK
    const rCmyk = document.getElementById('rCmyk').value;
    const gCmyk = document.getElementById('gCmyk').value;
    const bCmyk = document.getElementById('bCmyk').value;
    if (rCmyk && gCmyk && bCmyk) {
        const [c, m, y, k] = rgbToCmyk(rCmyk, gCmyk, bCmyk);
        document.getElementById('cmykResult').value = `CMYK