// ===== TEMA ESCURO =====
/*
document.getElementById('themeBtn').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});
*/

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
    const resetMap = {
        'rgba-hex': ['cHex', 'mHex', 'yHex', 'kHex', 'hexCmykResult'],
        'cmyk-hex': ['r', 'g', 'b', 'hexResult'],
        'hex-rgba': ['cRgba', 'mRgba', 'yRgba', 'kRgba', 'rgbaCmykResult'],
        'cmyk-rgba': ['hexInput', 'rgbaResult'],
        'rgb-cmyk': ['hexCmykInput', 'cmykHexResult'],
        'hex-cmyk': ['rCmyk', 'gCmyk', 'bCmyk', 'cmykResult']
    };

    resetMap[currentConverter]?.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });

    activeConverter = currentConverter;
}

// ===== ATUALIZAÇÃO DE PREVIEW =====
function updatePreview(hex) {
    const preview = document.getElementById('colorPreview');
    if (/^#?[0-9A-F]{6}$/i.test(hex?.replace('#', ''))) {
        preview.style.backgroundColor = hex.startsWith('#') ? hex : `#${hex}`;
    } else {
        preview.style.backgroundColor = '#FFFFFF';
    }
}

// ===== ATUALIZAÇÃO GERAL =====
function updateConversions() {
    const activeTab = document.querySelector('.tab-content.active').id;

    if (activeTab === 'hex') {
        handleHexTab();
    } else if (activeTab === 'rgba') {
        handleRgbaTab();
    } else if (activeTab === 'cmyk') {
        handleCmykTab();
    }
}

function handleHexTab() {
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

function handleRgbaTab() {
    if (activeConverter === 'hex-rgba') {
        const hex = document.getElementById('hexInput').value;
        if (hex && /^#?[0-9A-F]{6}$/i.test(hex.replace('#', ''))) {
            const rgba = hexToRgba(hex);
            document.getElementById('rgbaResult').value = rgba;
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

function handleCmykTab() {
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

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // ===== LIXEIRA =====
    const recycleBin = document.getElementById('recycle-bin');
    const recycleBinWindow = document.getElementById('recycleBinWindow');
    const closeRecycleBin = document.getElementById('closeRecycleBin');
    if (recycleBin && recycleBinWindow && closeRecycleBin) {
        recycleBin.addEventListener('dblclick', () => {
            recycleBinWindow.style.display = 'block';
            recycleBinWindow.style.zIndex = 200;
            addTaskbarButton('recycleBinWindow', 'assets/icons/recycle-bin-2.png', 'Lixeira');
        });
        closeRecycleBin.addEventListener('click', () => {
            recycleBinWindow.style.display = 'none';
            removeTaskbarButton('recycleBinWindow');
        });
    }

    // ===== GATO =====
    const catIcon = document.getElementById('cat-icon');
    const catWindow = document.getElementById('catWindow');
    const closeCatWindow = document.getElementById('closeCatWindow');
    if (catIcon && catWindow && closeCatWindow) {
        catIcon.addEventListener('dblclick', () => {
            catWindow.style.display = 'block';
            catWindow.style.zIndex = 200;
            addTaskbarButton('catWindow', 'assets/icons/cat.ico', 'Sobre Mim');
        });
        closeCatWindow.addEventListener('click', () => {
            catWindow.style.display = 'none';
            removeTaskbarButton('catWindow');
        });
    }

    // ===== ABAS =====
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn, .tab-content').forEach(el => {
                el.classList.remove('active');
            });
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
            activeConverter = null;
            updatePreview('#FFFFFF');
        });
    });

    // ===== INPUTS DA ABA HEX =====
    ['r', 'g', 'b'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            resetCompetingConverters('rgba-hex');
            updateConversions();
        });
    });
    ['cHex', 'mHex', 'yHex', 'kHex'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            resetCompetingConverters('cmyk-hex');
            updateConversions();
        });
    });

    // ===== INPUTS DA ABA RGBA =====
    document.getElementById('hexInput').addEventListener('input', function() {
        resetCompetingConverters('hex-rgba');
        this.value = this.value.replace(/[^0-9A-F]/gi, '').toUpperCase().slice(0, 6);
        if (this.value && !this.value.startsWith('#')) this.value = '#' + this.value;
        updateConversions();
    });
    ['cRgba', 'mRgba', 'yRgba', 'kRgba'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            resetCompetingConverters('cmyk-rgba');
            updateConversions();
        });
    });

    // ===== INPUTS DA ABA CMYK =====
    ['rCmyk', 'gCmyk', 'bCmyk'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            resetCompetingConverters('rgb-cmyk');
            updateConversions();
        });
    });
    document.getElementById('hexCmykInput').addEventListener('input', function() {
        resetCompetingConverters('hex-cmyk');
        this.value = this.value.replace(/[^0-9A-F]/gi, '').toUpperCase().slice(0, 6);
        if (this.value && !this.value.startsWith('#')) this.value = '#' + this.value;
        updateConversions();
    });

    // ===== BOTÕES DE COPIAR =====
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            target.select();
            document.execCommand('copy');
            const originalText = btn.innerHTML;
            btn.innerHTML = '✔ Copiado!';
            setTimeout(() => btn.innerHTML = originalText, 2000);
        });
    });

    // ===== ATUALIZAÇÃO INICIAL =====
    updateConversions();

    // ===== RELÓGIO DA TASKBAR =====
    function updateTaskbarClock() {
        const clock = document.getElementById('taskbarClock');
        if (clock) {
            const now = new Date();
            const h = now.getHours().toString().padStart(2, '0');
            const m = now.getMinutes().toString().padStart(2, '0');
            clock.textContent = `${h}:${m}`;
        }
    }
    setInterval(updateTaskbarClock, 1000);
    updateTaskbarClock();

    // ===== SELEÇÃO DE ÍCONES NA ÁREA DE TRABALHO =====
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('click', function (e) {
            // Remove seleção de todos
            document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
            // Seleciona o clicado
            this.classList.add('selected');
            e.stopPropagation();
        });
    });

    // Remove seleção ao clicar fora dos ícones
    document.addEventListener('click', function () {
        document.querySelectorAll('.desktop-icon').forEach(i => i.classList.remove('selected'));
    });

    document.getElementById('openDoom').addEventListener('click', function() {
        const doomContainer = document.getElementById('doom-container');
        doomContainer.style.display = 'block';
        Dos(doomContainer).run('https://js-dos.com/cdn/upload/DOOM.EXE');
    });

    // Se quiser fechar depois, adicione um botão de fechar e esconda o doom-container
});

function addTaskbarButton(windowId, iconSrc, label) {
    const taskbar = document.getElementById('taskbarWindows');
    if (document.getElementById('taskbar-btn-' + windowId)) return; // já existe

    const btn = document.createElement('button');
    btn.className = 'taskbar-window-btn active';
    btn.id = 'taskbar-btn-' + windowId;
    btn.innerHTML = `<img src="${iconSrc}" style="width:16px;height:16px;margin-right:4px;">${label}`;
    btn.onclick = () => {
        const win = document.getElementById(windowId);
        if (win.style.display === 'none') win.style.display = 'block';
        win.style.zIndex = 200;
    };
    taskbar.appendChild(btn);
}

function removeTaskbarButton(windowId) {
    const btn = document.getElementById('taskbar-btn-' + windowId);
    if (btn) btn.remove();
}
