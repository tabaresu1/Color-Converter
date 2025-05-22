// Funções de conversão
function componentToHex(c) {
    const hex = parseInt(c).toString(16).padStart(2, '0');
    return hex.toUpperCase();
}

function rgbaToHex(r, g, b, a) {
    return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}${a < 1 ? componentToHex(Math.round(a * 255)) : ''}`;
}

function hexToRgba(hex) {
    hex = hex.replace(/^#/, '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const a = hex.length === 8 ? (parseInt(hex.substring(6, 8), 16) / 255).toFixed(2) : 1;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// Atualizar resultados em tempo real
function updateConversions() {
    // RGBA → HEX
    const r = document.getElementById('r').value;
    const g = document.getElementById('g').value;
    const b = document.getElementById('b').value;
    const a = document.getElementById('a').value;
    
    if (r && g && b && a) {
        const hex = rgbaToHex(r, g, b, a);
        document.getElementById('hexResult').value = hex;
        document.getElementById('previewBox').style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    // HEX → RGBA
    const hexInput = document.getElementById('hexInput').value;
    if (hexInput && /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(hexInput)) {
        const rgba = hexToRgba(hexInput);
        document.getElementById('rgbaResult').value = rgba;
        document.getElementById('previewHex').style.backgroundColor = rgba;
    }
}

// Event Listeners
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateConversions);
});

document.getElementById('copyBtn').addEventListener('click', () => {
    const hexResult = document.getElementById('hexResult');
    hexResult.select();
    document.execCommand('copy');
});

// Inicialização
updateConversions();