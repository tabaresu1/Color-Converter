// ===== TOGGLE DARK MODE =====
const themeBtn = document.getElementById('themeBtn');
themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeBtn.textContent = document.body.classList.contains('dark-mode') ? '🌞 Tema Claro' : '🌒 Tema Escuro';
});

// ===== CONTROLE DE ABAS =====
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover classe ativa de todas as abas
        document.querySelectorAll('.tab-btn, .tab-content').forEach(el => {
            el.classList.remove('active');
        });
        
        // Ativar aba clicada
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// ===== FUNÇÕES DE CONVERSÃO =====
// RGBA para HEX
function rgbaToHex(r, g, b, a) {
    const toHex = (n) => Math.round(n).toString(16).padStart(2, '0').toUpperCase();
    const alphaHex = a < 1 ? toHex(a * 255) : '';
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`;
}

// CMYK para HEX
function cmykToHex(c, m, y, k) {
    c = c / 100;
    m = m / 100;
    y = y / 100;
    k = k / 100;
    
    const r = Math.round(255 * (1 - c) * (1 - k));
    const g = Math.round(255 * (1 - m) * (1 - k));
    const b = Math.round(255 * (1 - y) * (1 - k));
    
    return `#${rgbaToHex(r, g, b, 1)}`;
}

// ===== ATUALIZAÇÃO EM TEMPO REAL =====
function updateAll() {
    // RGBA → HEX
    const r = document.getElementById('r').value;
    const g = document.getElementById('g').value;
    const b = document.getElementById('b').value;
    const a = document.getElementById('a').value;
    
    if (r && g && b && a) {
        const hex = rgbaToHex(r, g, b, a);
        document.getElementById('hexResult').value = hex;
    }

    // CMYK → HEX
    const c = document.getElementById('c').value;
    const m = document.getElementById('m').value;
    const y = document.getElementById('y').value;
    const k = document.getElementById('k').value;
    
    if (c && m && y && k) {
        const hexCmyk = cmykToHex(c, m, y, k);
        document.getElementById('hexCmykResult').value = hexCmyk;
    }

    // Atualizar pré-visualização
    const activeHex = document.getElementById('hexResult').value || document.getElementById('hexCmykResult').value;
    document.getElementById('colorPreview').style.backgroundColor = activeHex;
}

// ===== EVENT LISTENERS =====
// Atualizar ao digitar
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateAll);
});

// Botões de copiar
document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        target.select();
        document.execCommand('copy');
    });
});

// Inicialização
updateAll();