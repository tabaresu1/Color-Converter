// Funções de Conversão
function componentToHex(c) {
    const hex = parseInt(c).toString(16).padStart(2, '0');
    return hex.toUpperCase();
}

// RGBA para HEX
function rgbaToHex(r, g, b, a) {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}${a < 1 ? componentToHex(Math.round(a * 255)) : ''}`;
}

// CMYK para HEX
function cmykToHex(c, m, y, k) {
    c = c / 100;
    m = m / 100;
    y = y / 100;
    k = k / 100;
    const r = 255 * (1 - c) * (1 - k);
    const g = 255 * (1 - m) * (1 - k);
    const b = 255 * (1 - y) * (1 - k);
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

// Atualizar Tudo
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
    const kVal = document.getElementById('k').value;
    if (c && m && y && kVal) {
        const hexCmyk = cmykToHex(c, m, y, kVal);
        document.getElementById('hexFromCmyk').value = hexCmyk;
    }

    // Atualizar pré-visualização (usa o HEX do RGBA por padrão)
    const activeHex = document.getElementById('hexResult').value || document.getElementById('hexFromCmyk').value;
    document.getElementById('colorPreview').style.backgroundColor = activeHex;
}

// Event Listeners
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateAll);
});

document.getElementById('copyHex').addEventListener('click', () => {
    const hexToCopy = document.getElementById('hexResult').value;
    navigator.clipboard.writeText(hexToCopy);
});

// Abas
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remover classe 'active' de todos
        document.querySelectorAll('.tab-btn, .tab-content').forEach(el => {
            el.classList.remove('active');
        });
        // Ativar aba clicada
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// Inicializar
updateAll();