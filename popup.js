// ===== DEBUG INIT =====
console.log("Script iniciado!");

// ===== DARK MODE =====
document.addEventListener('DOMContentLoaded', () => {
  // Dark Mode
  const themeBtn = document.getElementById('themeBtn');
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    themeBtn.textContent = document.body.classList.contains('dark-mode') ? 
      '🌞 Tema Claro' : '🌒 Tema Escuro';
  });

  // ===== CONVERSORES =====
  function rgbaToHex(r, g, b, a = 1) {
    r = Math.max(0, Math.min(255, parseInt(r) || 0));
    g = Math.max(0, Math.min(255, parseInt(g) || 0));
    b = Math.max(0, Math.min(255, parseInt(b) || 0));
    a = Math.max(0, Math.min(1, parseFloat(a) || 1));
    
    const toHex = n => n.toString(16).padStart(2, '0').toUpperCase();
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${a < 1 ? toHex(Math.round(a * 255)) : ''}`;
  }

  // ===== EVENTOS =====
  document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', updateAll);
  });

  // Campo Alpha (A) especial
  document.getElementById('a').addEventListener('input', (e) => {
    let value = parseFloat(e.target.value);
    if (isNaN(value)) value = 1;
    e.target.value = Math.max(0, Math.min(1, value));
    updateAll();
  });

  // ===== EXECUÇÃO INICIAL =====
  updateAll();
});

function updateAll() {
  console.log("Atualizando...");
  
  // RGBA → HEX
  const r = document.getElementById('r').value || 0;
  const g = document.getElementById('g').value || 0;
  const b = document.getElementById('b').value || 0;
  const a = document.getElementById('a').value || 1;
  
  const hexValue = rgbaToHex(r, g, b, a);
  document.getElementById('hexResult').value = hexValue;
  document.getElementById('colorPreview').style.backgroundColor = hexValue;
}