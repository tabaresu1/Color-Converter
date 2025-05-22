// ===== TOGGLE DARK MODE =====
const themeBtn = document.getElementById('themeBtn');
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeBtn.textContent = document.body.classList.contains('dark-mode') ? '🌞 Tema Claro' : '🌒 Tema Escuro';
});

// ===== CONTROLE DE ABAS =====
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove todas as classes 'active'
        document.querySelectorAll('.tab-btn, .tab-content').forEach(el => {
            el.classList.remove('active');
        });
        // Ativa a aba clicada
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
    c = c / 100; m = m / 100; y = y / 100; k = k / 100;
    const r = Math.round(255 * (1 - c) * (1 - k));
    const g = Math.round(255 * (1 - m) * (1 - k));
    const b = Math.round(255 * (1 - y) * (1 - k));
    return `#${rgbaToHex(r, g, b, 1)}`;
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

// ===== ATUALIZAÇÃO EM TEMPO REAL =====
function updateAll() {
    // ABA HEX: RGBA → HEX
    const r = document.getElementById('r').value;
    const g = document.getElementById('g').value;
    const b = document.getElementById('b').value;
    const a = document.getElementById('a').value;
    if (r && g && b && a) {
        document.getElementById('hexResult').value = rgbaToHex(r, g, b, a);
    }

    // ABA HEX: CMYK → HEX
    const cHex = document.getElementById('cHex').value;
    const mHex = document.getElementById('mHex').value;
    const yHex = document.getElementById('yHex').value;
    const kHex = document.getElementById('kHex').value;
    if (cHex && mHex && yHex && kHex) {
        document.getElementById('hexCmykResult').value = cmykToHex(cHex, mHex, yHex, kHex);
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