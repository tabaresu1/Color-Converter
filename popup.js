// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // Dark Mode
    const themeBtn = document.getElementById('themeBtn');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        themeBtn.textContent = document.body.classList.contains('dark-mode') ? '🌞 Tema Claro' : '🌒 Tema Escuro';
    });

    // Controle de Abas
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn, .tab-content').forEach(el => {
                el.classList.remove('active');
            });
            this.classList.add('active');
            document.getElementById(this.dataset.tab).classList.add('active');
        });
    });

    // ===== FUNÇÕES DE CONVERSÃO =====
    function rgbaToHex(r, g, b, a = 1) {
        r = Math.max(0, Math.min(255, parseInt(r) || 0));
        g = Math.max(0, Math.min(255, parseInt(g) || 0));
        b = Math.max(0, Math.min(255, parseInt(b) || 0));
        a = Math.max(0, Math.min(1, parseFloat(a) || 1));
        
        const toHex = n => n.toString(16).padStart(2, '0').toUpperCase();
        return `#${toHex(r)}${toHex(g)}${toHex(b)}${a < 1 ? toHex(Math.round(a * 255)) : ''}`;
    }

    function cmykToHex(c, m, y, k) {
        c = (Math.max(0, Math.min(100, parseInt(c) || 0))) / 100;
        m = (Math.max(0, Math.min(100, parseInt(m) || 0))) / 100;
        y = (Math.max(0, Math.min(100, parseInt(y) || 0))) / 100;
        k = (Math.max(0, Math.min(100, parseInt(k) || 0))) / 100;
        
        const r = Math.round(255 * (1 - c) * (1 - k));
        const g = Math.round(255 * (1 - m) * (1 - k));
        const b = Math.round(255 * (1 - y) * (1 - k));
        return rgbaToHex(r, g, b);
    }

    // ===== EVENTOS =====
    function handleInputEvents() {
        // RGBA → HEX
        document.getElementById('r').addEventListener('input', function() {
            updateHexFromRgba();
        });
        
        // CMYK → HEX
        document.getElementById('cHex').addEventListener('input', function() {
            updateHexFromCmyk();
        });
    }

    function updateHexFromRgba() {
        const r = document.getElementById('r').value || 0;
        const g = document.getElementById('g').value || 0;
        const b = document.getElementById('b').value || 0;
        const a = document.getElementById('a').value || 1;
        
        const hex = rgbaToHex(r, g, b, a);
        document.getElementById('hexResult').value = hex;
        document.getElementById('colorPreview').style.backgroundColor = hex;
    }

    function updateHexFromCmyk() {
        const c = document.getElementById('cHex').value || 0;
        const m = document.getElementById('mHex').value || 0;
        const y = document.getElementById('yHex').value || 0;
        const k = document.getElementById('kHex').value || 0;
        
        const hex = cmykToHex(c, m, y, k);
        document.getElementById('hexCmykResult').value = hex;
        document.getElementById('colorPreview').style.backgroundColor = hex;
    }

    // Inicialização
    handleInputEvents();
    updateHexFromRgba(); // Atualiza valores iniciais
});