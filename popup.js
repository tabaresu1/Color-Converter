// ===== DARK MODE =====
const themeBtn = document.getElementById('themeBtn');
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    themeBtn.textContent = isDark ? '🌞 Tema Claro' : '🌒 Tema Escuro';
    localStorage.setItem('darkMode', isDark);
});

// ===== ABAS =====
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn, .tab-content').forEach(el => {
            el.classList.remove('active');
        });
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
        updateAll();
    });
});

// ===== FUNÇÕES DE CONVERSÃO =====
// RGBA → HEX
function rgbaToHex(r, g, b, a = 1) {
    r = Math.max(0, Math.min(255, parseInt(r) || 0));
    g = Math.max(0, Math.min(255, parseInt(g) || 0));
    b = Math.max(0, Math.min(255, parseInt(b) || 0));
    a = Math.max(0, Math.min(1, parseFloat(a) || 1));
    
    const toHex = n => n.toString(16).padStart(2, '0').toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${a < 1 ? toHex(Math.round(a * 255)) : ''}`;
}

// CMYK → HEX
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
    
    // Expande formatos curtos (#RGB → #RRGGBB)
    if (hex.length === 3 || hex.length === 4) {
        hex = hex.split('').map(c => c + c).join('');
    }
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const a = hex.length === 8 ? (parseInt(hex.substring(6, 8), 16) / 255) : 1;
    
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
}

// RGB → CMYK
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

// ===== ATUALIZAÇÃO GERAL =====
function updateAll() {
    // RGBA → HEX
    const r = document.getElementById('r').value || 0;
    const g = document.getElementById('g').value || 0;
    const b = document.getElementById('b').value || 0;
    const a = document.getElementById('a').value || 1;
    document.getElementById('hexResult').value = rgbaToHex(r, g, b, a);

    // CMYK → HEX
    const cHex = document.getElementById('cHex').value || 0;
    const mHex = document.getElementById('mHex').value || 0;
    const yHex = document.getElementById('yHex').value || 0;
    const kHex = document.getElementById('kHex').value || 0;
    document.getElementById('hexCmykResult').value = cmykToHex(cHex, mHex, yHex, kHex);

    // HEX → RGBA
    const hexInput = document.getElementById('hexInput').value;
    if (hexInput) {
        document.getElementById('rgbaResult').value = hexToRgba(hexInput);
    }

    // RGB → CMYK
    const rCmyk = document.getElementById('rCmyk').value || 0;
    const gCmyk = document.getElementById('gCmyk').value || 0;
    const bCmyk = document.getElementById('bCmyk').value || 0;
    const [c, m, y, k] = rgbToCmyk(rCmyk, gCmyk, bCmyk);
    document.getElementById('cmykResult').value = `CMYK(${c}%, ${m}%, ${y}%, ${k}%)`;

    // Pré-visualização
    const activeHex = document.querySelector('.tab-content.active input[type="text"]')?.value;
    if (activeHex && /^#[0-9A-F]{6,8}$/i.test(activeHex)) {
        document.getElementById('colorPreview').style.backgroundColor = activeHex;
    }
}

// ===== EVENTOS =====
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateAll);
});

document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        target.select();
        document.execCommand('copy');
        btn.textContent = '✔ Copiado!';
        setTimeout(() => btn.textContent = '📋 Copiar', 2000);
    });
});

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Carrega tema salvo
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeBtn.textContent = '🌞 Tema Claro';
    }

    // Dispara eventos para processar valores iniciais
    document.querySelectorAll('input').forEach(input => {
        input.dispatchEvent(new Event('input'));
    });
});