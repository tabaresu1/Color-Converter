// ===== DARK MODE =====
document.getElementById('themeBtn').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
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
function rgbaToHex(r, g, b) {
    r = Math.max(0, Math.min(255, parseInt(r) || 0));
    g = Math.max(0, Math.min(255, parseInt(g) || 0));
    b = Math.max(0, Math.min(255, parseInt(b) || 0));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}

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

function hexToRgba(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 1)`;
}

function rgbToCmyk(r, g, b) {
    r = r / 255; g = g / 255; b = b / 255;
    const k = 1 - Math.max(r, g, b);
    if (k === 1) return [0, 0, 0, 100];
    return [
        Math.round(((1 - r - k) / (1 - k)) * 100),
        Math.round(((1 - g - k) / (1 - k)) * 100),
        Math.round(((1 - b - k) / (1 - k)) * 100),
        Math.round(k * 100)
    ];
}

// ===== ATUALIZAÇÃO GERAL =====
function updateAll() {
    // RGBA → HEX
    const r = document.getElementById('r').value || 0;
    const g = document.getElementById('g').value || 0;
    const b = document.getElementById('b').value || 0;
    document.getElementById('hexResult').value = rgbaToHex(r, g, b);

    // CMYK → HEX
    const cHex = document.getElementById('cHex').value || 0;
    const mHex = document.getElementById('mHex').value || 0;
    const yHex = document.getElementById('yHex').value || 0;
    const kHex = document.getElementById('kHex').value || 0;
    document.getElementById('hexCmykResult').value = cmykToHex(cHex, mHex, yHex, kHex);

    // HEX → RGBA
    const hexInput = document.getElementById('hexInput').value;
    if (hexInput && /^#?[0-9A-F]{6}$/i.test(hexInput.replace('#', ''))) {
        document.getElementById('rgbaResult').value = hexToRgba(hexInput);
    }

    // CMYK → RGBA
    const cRgba = document.getElementById('cRgba').value || 0;
    const mRgba = document.getElementById('mRgba').value || 0;
    const yRgba = document.getElementById('yRgba').value || 0;
    const kRgba = document.getElementById('kRgba').value || 0;
    document.getElementById('rgbaCmykResult').value = hexToRgba(cmykToHex(cRgba, mRgba, yRgba, kRgba));

    // RGBA → CMYK
    const rCmyk = document.getElementById('rCmyk').value || 0;
    const gCmyk = document.getElementById('gCmyk').value || 0;
    const bCmyk = document.getElementById('bCmyk').value || 0;
    const [c, m, y, k] = rgbToCmyk(rCmyk, gCmyk, bCmyk);
    document.getElementById('cmykResult').value = `CMYK(${c}%, ${m}%, ${y}%, ${k}%)`;

    // HEX → CMYK
    const hexCmykInput = document.getElementById('hexCmykInput').value;
    if (hexCmykInput && /^#?[0-9A-F]{6}$/i.test(hexCmykInput.replace('#', ''))) {
        const rgba = hexToRgba(hexCmykInput).match(/\d+/g);
        const [c, m, y, k] = rgbToCmyk(rgba[0], rgba[1], rgba[2]);
        document.getElementById('cmykHexResult').value = `CMYK(${c}%, ${m}%, ${y}%, ${k}%)`;
    }

    // Atualiza preview
    const activeHex = document.querySelector('.tab-content.active input[type="text"]')?.value;
    if (activeHex && /^#?[0-9A-F]{6}$/i.test(activeHex.replace('#', ''))) {
        document.getElementById('colorPreview').style.backgroundColor = 
            activeHex.startsWith('#') ? activeHex : `#${activeHex}`;
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Todos os inputs numéricos
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', updateAll);
    });

    // Todos os inputs de texto (HEX)
    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('input', function() {
            // Formata automaticamente
            let value = this.value.replace(/[^0-9A-F]/gi, '').toUpperCase();
            if (!value.startsWith('#')) value = '#' + value;
            this.value = value.slice(0, 7);
            updateAll();
        });
    });

    // Botões de copiar
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            target.select();
            document.execCommand('copy');
            btn.textContent = '✔ Copiado!';
            setTimeout(() => btn.textContent = '📋 Copiar', 2000);
        });
    });
}

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
    // Tema
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    // Eventos
    setupEventListeners();
    
    // Atualização inicial
    updateAll();
});