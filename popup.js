// ===== DARK MODE =====
document.getElementById('themeBtn').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});

// ===== VARIÁVEIS GLOBAIS =====
let activeConverter = null;

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
    if (currentConverter === 'rgba-hex') {
        // Limpa CMYK→HEX
        document.getElementById('cHex').value = '';
        document.getElementById('mHex').value = '';
        document.getElementById('yHex').value = '';
        document.getElementById('kHex').value = '';
        document.getElementById('hexCmykResult').value = '';
    } else if (currentConverter === 'cmyk-hex') {
        // Limpa RGBA→HEX
        document.getElementById('r').value = '';
        document.getElementById('g').value = '';
        document.getElementById('b').value = '';
        document.getElementById('hexResult').value = '';
    } else if (currentConverter === 'hex-rgba') {
        // Limpa CMYK→RGBA
        document.getElementById('cRgba').value = '';
        document.getElementById('mRgba').value = '';
        document.getElementById('yRgba').value = '';
        document.getElementById('kRgba').value = '';
        document.getElementById('rgbaCmykResult').value = '';
    } else if (currentConverter === 'cmyk-rgba') {
        // Limpa HEX→RGBA
        document.getElementById('hexInput').value = '';
        document.getElementById('rgbaResult').value = '';
    } else if (currentConverter === 'rgb-cmyk') {
        // Limpa HEX→CMYK
        document.getElementById('hexCmykInput').value = '';
        document.getElementById('cmykHexResult').value = '';
    } else if (currentConverter === 'hex-cmyk') {
        // Limpa RGBA→CMYK
        document.getElementById('rCmyk').value = '';
        document.getElementById('gCmyk').value = '';
        document.getElementById('bCmyk').value = '';
        document.getElementById('cmykResult').value = '';
    }
    activeConverter = currentConverter;
}

// ===== ATUALIZAÇÃO DE ABA =====
function resetOnTabChange() {
    // Reseta a pré-visualização
    document.getElementById('colorPreview').style.backgroundColor = '#000000';
    // Reseta o conversor ativo
    activeConverter = null;
    // Limpa todos os resultados (mas mantém os valores de entrada)
    document.querySelectorAll('.result input').forEach(input => {
        input.value = '';
    });
}

// ===== ATUALIZAÇÃO GERAL =====
function updateAll() {
    const activeTab = document.querySelector('.tab-content.active').id;
    
    if (activeTab === 'hex') {
        // Atualiza apenas o conversor ativo na aba HEX
        if (activeConverter === 'rgba-hex') {
            const r = document.getElementById('r').value || 0;
            const g = document.getElementById('g').value || 0;
            const b = document.getElementById('b').value || 0;
            const hex = rgbaToHex(r, g, b);
            document.getElementById('hexResult').value = hex;
            updatePreview(hex);
        } else if (activeConverter === 'cmyk-hex') {
            const c = document.getElementById('cHex').value || 0;
            const m = document.getElementById('mHex').value || 0;
            const y = document.getElementById('yHex').value || 0;
            const k = document.getElementById('kHex').value || 0;
            const hex = cmykToHex(c, m, y, k);
            document.getElementById('hexCmykResult').value = hex;
            updatePreview(hex);
        }
    }
    else if (activeTab === 'rgba') {
        // Atualiza apenas o conversor ativo na aba RGBA
        if (activeConverter === 'hex-rgba') {
            const hex = document.getElementById('hexInput').value;
            if (hex && /^#?[0-9A-F]{6}$/i.test(hex.replace('#', ''))) {
                document.getElementById('rgbaResult').value = hexToRgba(hex);
                updatePreview(hex);
            }
        } else if (activeConverter === 'cmyk-rgba') {
            const c = document.getElementById('cRgba').value || 0;
            const m = document.getElementById('mRgba').value || 0;
            const y = document.getElementById('yRgba').value || 0;
            const k = document.getElementById('kRgba').value || 0;
            const hex = cmykToHex(c, m, y, k);
            document.getElementById('rgbaCmykResult').value = hexToRgba(hex);
            updatePreview(hex);
        }
    }
    else if (activeTab === 'cmyk') {
        // Atualiza apenas o conversor ativo na aba CMYK
        if (activeConverter === 'rgb-cmyk') {
            const r = document.getElementById('rCmyk').value || 0;
            const g = document.getElementById('gCmyk').value || 0;
            const b = document.getElementById('bCmyk').value || 0;
            const [c, m, y, k] = rgbToCmyk(r, g, b);
            document.getElementById('cmykResult').value = `CMYK(${c}%, ${m}%, ${y}%, ${k}%)`;
            updatePreview(rgbaToHex(r, g, b));
        } else if (activeConverter === 'hex-cmyk') {
            const hex = document.getElementById('hexCmykInput').value;
            if (hex && /^#?[0-9A-F]{6}$/i.test(hex.replace('#', ''))) {
                const rgba = hexToRgba(hex).match(/\d+/g);
                const [c, m, y, k] = rgbToCmyk(rgba[0], rgba[1], rgba[2]);
                document.getElementById('cmykHexResult').value = `CMYK(${c}%, ${m}%, ${y}%, ${k}%)`;
                updatePreview(hex);
            }
        }
    }
}

function updatePreview(hex) {
    if (/^#?[0-9A-F]{6}$/i.test(hex?.replace('#', ''))) {
        const fullHex = hex.startsWith('#') ? hex : `#${hex}`;
        document.getElementById('colorPreview').style.backgroundColor = fullHex;
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Controle de abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn, .tab-content').forEach(el => {
                el.classList.remove('active');
            });
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
            resetOnTabChange();
        });
    });

    // HEX
    document.getElementById('r').addEventListener('input', () => {
        resetCompetingConverters('rgba-hex');
        updateAll();
    });
    document.getElementById('g').addEventListener('input', () => {
        if (activeConverter === 'rgba-hex') updateAll();
    });
    document.getElementById('b').addEventListener('input', () => {
        if (activeConverter === 'rgba-hex') updateAll();
    });

    document.getElementById('cHex').addEventListener('input', () => {
        resetCompetingConverters('cmyk-hex');
        updateAll();
    });
    document.getElementById('mHex').addEventListener('input', () => {
        if (activeConverter === 'cmyk-hex') updateAll();
    });
    document.getElementById('yHex').addEventListener('input', () => {
        if (activeConverter === 'cmyk-hex') updateAll();
    });
    document.getElementById('kHex').addEventListener('input', () => {
        if (activeConverter === 'cmyk-hex') updateAll();
    });

    // RGBA
    document.getElementById('hexInput').addEventListener('input', function() {
        resetCompetingConverters('hex-rgba');
        let value = this.value.replace(/[^0-9A-F]/gi, '').toUpperCase();
        if (!value.startsWith('#')) value = '#' + value;
        this.value = value.slice(0, 7);
        updateAll();
    });

    document.getElementById('cRgba').addEventListener('input', () => {
        resetCompetingConverters('cmyk-rgba');
        updateAll();
    });
    document.getElementById('mRgba').addEventListener('input', () => {
        if (activeConverter === 'cmyk-rgba') updateAll();
    });
    document.getElementById('yRgba').addEventListener('input', () => {
        if (activeConverter === 'cmyk-rgba') updateAll();
    });
    document.getElementById('kRgba').addEventListener('input', () => {
        if (activeConverter === 'cmyk-rgba') updateAll();
    });

    // CMYK
    document.getElementById('rCmyk').addEventListener('input', () => {
        resetCompetingConverters('rgb-cmyk');
        updateAll();
    });
    document.getElementById('gCmyk').addEventListener('input', () => {
        if (activeConverter === 'rgb-cmyk') updateAll();
    });
    document.getElementById('bCmyk').addEventListener('input', () => {
        if (activeConverter === 'rgb-cmyk') updateAll();
    });

    document.getElementById('hexCmykInput').addEventListener('input', function() {
        resetCompetingConverters('hex-cmyk');
        let value = this.value.replace(/[^0-9A-F]/gi, '').toUpperCase();
        if (!value.startsWith('#')) value = '#' + value;
        this.value = value.slice(0, 7);
        updateAll();
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
});

// Efeito sonoro ao clicar (opcional)
function playClickSound() {
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-classic-click-alert-1117.mp3');
    audio.volume = 0.2;
    audio.play().catch(e => console.log("Som bloqueado pelo navegador"));
}

document.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('mousedown', playClickSound);
});