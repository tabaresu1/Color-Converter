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
    c = (Math.max(0, Math.min(100, c || 0)) / 100;
    m = (Math.max(0, Math.min(100, m || 0)) / 100;
    y = (Math.max(0, Math.min(100, y || 0)) / 100;
    k = (Math.max(0, Math.min(100, k || 0)) / 100;
    
    const r = Math.round(255 * (1 - c) * (1 - k));
    const g = Math.round(255 * (1 - m) * (1 - k));
    const b = Math.round(255 * (1 - y) * (1 - k));
    return rgbaToHex(r, g, b);
}

function hexToRgba(hex) {
    hex = hex.replace(/^#/, '');
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

// ===== CONTROLE DE CAMPOS =====
function resetCompetingFields(activeConverter) {
    const converters = {
        'rgba-hex': () => {
            document.getElementById('cHex').value = 0;
            document.getElementById('mHex').value = 0;
            document.getElementById('yHex').value = 0;
            document.getElementById('kHex').value = 0;
            document.getElementById('hexCmykResult').value = '';
        },
        'cmyk-hex': () => {
            document.getElementById('r').value = 0;
            document.getElementById('g').value = 0;
            document.getElementById('b').value = 0;
            document.getElementById('hexResult').value = '';
        }
    };
    if (converters[activeConverter]) converters[activeConverter]();
}

// ===== EVENTOS =====
// HEX
document.getElementById('hexInput').addEventListener('input', function() {
    const hex = this.value;
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
        document.getElementById('rgbaResult').value = hexToRgba(hex);
        updatePreview(hex);
    }
});

document.getElementById('hexCmykInput').addEventListener('input', function() {
    const hex = this.value;
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
        const [c, m, y, k] = rgbToCmyk(...hexToRgba(hex).match(/\d+/g).slice(0, 3));
        document.getElementById('cmykHexResult').value = `CMYK(${c}%, ${m}%, ${y}%, ${k}%)`;
        updatePreview(hex);
    }
});

// RGBA
document.getElementById('r').addEventListener('input', function() {
    resetCompetingFields('rgba-hex');
    const hex = rgbaToHex(this.value, document.getElementById('g').value, document.getElementById('b').value);
    document.getElementById('hexResult').value = hex;
    updatePreview(hex);
});

// CMYK
document.getElementById('cHex').addEventListener('input', function() {
    resetCompetingFields('cmyk-hex');
    const hex = cmykToHex(this.value, document.getElementById('mHex').value, document.getElementById('yHex').value, document.getElementById('kHex').value);
    document.getElementById('hexCmykResult').value = hex;
    updatePreview(hex);
});

// ===== FUNÇÕES AUXILIARES =====
function updatePreview(hex) {
    if (/^#[0-9A-F]{6}$/i.test(hex)) {
        document.getElementById('colorPreview').style.backgroundColor = hex;
    }
}

// Inicialização
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}