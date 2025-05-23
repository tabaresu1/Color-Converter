// ===== DARK MODE =====
document.getElementById('themeBtn').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// ===== VARIÁVEIS GLOBAIS =====
let activeConverter = null;
const converterGroups = {
    'hex': ['rgba-hex', 'cmyk-hex'],
    'rgba': ['hex-rgba', 'cmyk-rgba'],
    'cmyk': ['rgb-cmyk', 'hex-cmyk']
};

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

// ===== CONTROLE DE CONVERSORES =====
function resetCompetingConverters(currentConverter) {
    const group = Object.entries(converterGroups).find(([_, converters]) => 
        converters.includes(currentConverter)
    )?.[0];

    if (!group) return;

    converterGroups[group].forEach(converter => {
        if (converter !== currentConverter) {
            switch(converter) {
                case 'rgba-hex':
                    ['r', 'g', 'b'].forEach(id => document.getElementById(id).value = '');
                    document.getElementById('hexResult').value = '';
                    break;
                case 'cmyk-hex':
                    ['cHex', 'mHex', 'yHex', 'kHex'].forEach(id => document.getElementById(id).value = '');
                    document.getElementById('hexCmykResult').value = '';
                    break;
                case 'hex-rgba':
                    document.getElementById('hexInput').value = '';
                    document.getElementById('rgbaResult').value = '';
                    break;
                case 'cmyk-rgba':
                    ['cRgba', 'mRgba', 'yRgba', 'kRgba'].forEach(id => document.getElementById(id).value = '');
                    document.getElementById('rgbaCmykResult').value = '';
                    break;
                case 'rgb-cmyk':
                    ['rCmyk', 'gCmyk', 'bCmyk'].forEach(id => document.getElementById(id).value = '');
                    document.getElementById('cmykResult').value = '';
                    break;
                case 'hex-cmyk':
                    document.getElementById('hexCmykInput').value = '';
                    document.getElementById('cmykHexResult').value = '';
                    break;
            }
        }
    });
    activeConverter = currentConverter;
}

function updatePreview(hex) {
    if (/^#?[0-9A-F]{6}$/i.test(hex?.replace('#', ''))) {
        const fullHex = hex.startsWith('#') ? hex : `#${hex}`;
        document.getElementById('colorPreview').style.backgroundColor = fullHex;
    }
}

// ===== ATUALIZAÇÃO DE ABA =====
function resetAll() {
    // Limpa todos os inputs
    document.querySelectorAll('input[type="number"]').forEach(input => input.value = '');
    document.querySelectorAll('input[type="text"]').forEach(input => input.value = '');
    
    // Reseta preview
    document.getElementById('colorPreview').style.backgroundColor = '#000000';
    activeConverter = null;
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Controle de abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            resetAll();
            document.querySelectorAll('.tab-btn, .tab-content').forEach(el => {
                el.classList.remove('active');
            });
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // HEX
    document.getElementById('r').addEventListener('input', () => {
        resetCompetingConverters('rgba-hex');
        const hex = rgbaToHex(
            document.getElementById('r').value || 0,
            document.getElementById('g').value || 0,
            document.getElementById('b').value || 0
        );
        document.getElementById('hexResult').value = hex;
        updatePreview(hex);
    });

    document.getElementById('cHex').addEventListener('input', () => {
        resetCompetingConverters('cmyk-hex');
        const hex = cmykToHex(
            document.getElementById('cHex').value || 0,
            document.getElementById('mHex').value || 0,
            document.getElementById('yHex').value || 0,
            document.getElementById('kHex').value || 0
        );
        document.getElementById('hexCmykResult').value = hex;
        updatePreview(hex);
    });

    // RGBA
    document.getElementById('hexInput').addEventListener('input', function() {
        resetCompetingConverters('hex-rgba');
        let value = this.value.replace(/[^0-9A-F]/gi, '').toUpperCase();
        if (!value.startsWith('#')) value = '#' + value;
        this.value = value.slice(0, 7);
        
        if (/^#?[0-9A-F]{6}$/i.test(value.replace('#', ''))) {
            const rgba = hexToRgba(value);
            document.getElementById('rgbaResult').value = rgba;
            updatePreview(value);
        }
    });

    document.getElementById('cRgba').addEventListener('input', () => {
        resetCompetingConverters('cmyk-rgba');
        const hex = cmykToHex(
            document.getElementById('cRgba').value || 0,
            document.getElementById('mRgba').value || 0,
            document.getElementById('yRgba').value || 0,
            document.getElementById('kRgba').value || 0
        );
        document.getElementById('rgbaCmykResult').value = hexToRgba(hex);
        updatePreview(hex);
    });

    // CMYK
    document.getElementById('rCmyk').addEventListener('input', () => {
        resetCompetingConverters('rgb-cmyk');
        const [c, m, y, k] = rgbToCmyk(
            document.getElementById('rCmyk').value || 0,
            document.getElementById('gCmyk').value || 0,
            document.getElementById('bCmyk').value || 0
        );
        document.getElementById('cmykResult').value = `CMYK(${c}%, ${m}%, ${y}%, ${k}%)`;
        updatePreview(rgbaToHex(
            document.getElementById('rCmyk').value || 0,
            document.getElementById('gCmyk').value || 0,
            document.getElementById('bCmyk').value || 0
        ));
    });

    document.getElementById('hexCmykInput').addEventListener('input', function() {
        resetCompetingConverters('hex-cmyk');
        let value = this.value.replace(/[^0-9A-F]/gi, '').toUpperCase();
        if (!value.startsWith('#')) value = '#' + value;
        this.value = value.slice(0, 7);
        
        if (/^#?[0-9A-F]{6}$/i.test(value.replace('#', ''))) {
            const rgba = hexToRgba(value).match(/\d+/g);
            const [c, m, y, k] = rgbToCmyk(rgba[0], rgba[1], rgba[2]);
            document.getElementById('cmykHexResult').value = `CMYK(${c}%, ${m}%, ${y}%, ${k}%)`;
            updatePreview(value);
        }
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
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
    
    setupEventListeners();
    resetAll();
});