// Animação de linhas no fundo do site - ATUALIZADO PARA SUPORTAR TEMA E MOVIMENTO FLUIDO
class BackgroundAnimation {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.lines = [];
        this.animationId = null;
        this.isAnimating = false;
        this.currentTheme = 'dark';
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createLines();
        this.startAnimation();
        
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.resizeCanvas();
                this.createLines();
            }, 250);
        });
    }
    
    createCanvas() {
        const existingCanvas = document.getElementById('background-animation');
        if (existingCanvas) {
            existingCanvas.remove();
        }
        
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'background-animation';
        
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '-9999';
        this.canvas.style.pointerEvents = 'none';
        
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createLines() {
        this.lines = [];
        const numLines = Math.floor(window.innerWidth / 35);
        
        for (let i = 0; i < numLines; i++) {
            this.lines.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                length: Math.random() * 100 + 60,
                thickness: Math.random() * 1.5 + 0.5,
                speed: Math.random() * 1.2 + 0.3,
                opacity: Math.random() * 0.4 + 0.2,
                color: this.getRandomLineColor(),
                angle: Math.random() * Math.PI * 2,
                waveFrequency: Math.random() * 0.01 + 0.002,
                waveAmplitude: Math.random() * 4 + 2,
                angleChange: (Math.random() - 0.5) * 0.015 // <-- MUDANÇA: Adiciona uma velocidade de curva
            });
        }
    }
    
    getRandomLineColor() {
        const darkColors = [
            'rgba(230, 57, 70, OPACITY)',
            'rgba(200, 40, 50, OPACITY)',
            'rgba(255, 80, 90, OPACITY)',
            'rgba(169, 50, 38, OPACITY)'
        ];
        
        const lightColors = [
            'rgba(77, 171, 247, OPACITY)',
            'rgba(51, 154, 240, OPACITY)',
            'rgba(34, 139, 230, OPACITY)',
            'rgba(28, 126, 214, OPACITY)'
        ];
        
        const colors = this.currentTheme === 'dark' ? darkColors : lightColors;
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    updateThemeColors(theme) {
        this.currentTheme = theme;
        
        // Atualizar cores das linhas existentes
        this.lines.forEach(line => {
            line.color = this.getRandomLineColor();
        });
    }
    
    startAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.animate();
    }
    
    stopAnimation() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    animate() {
        if (!this.isAnimating) return;
        
        // LIMPAR COMPLETAMENTE o canvas a cada frame
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Fundo baseado no tema
        const bgColor = this.currentTheme === 'dark' ? '#0d0d0d' : '#f8f9fa';
        this.ctx.fillStyle = bgColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Atualizar e desenhar linhas
        this.lines.forEach(line => {
            this.updateLine(line);
            this.drawLine(line);
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    updateLine(line) {
        // Movimento base
        line.x += Math.cos(line.angle) * line.speed;
        line.y += Math.sin(line.angle) * line.speed;
        
        // Movimento de onda suave
        line.y += Math.sin(line.x * line.waveFrequency) * line.waveAmplitude * 0.1;
        
        // <-- MUDANÇA: Substituído o tremor por uma curva suave
        // Mudança de direção gradual
        // line.angle += (Math.random() - 0.5) * 0.02; // <-- Linha antiga que causava o tremor
        
        // Aplica a velocidade da curva atual
        line.angle += line.angleChange; 
        
        // Chance pequena (2% por frame) de mudar a direção da curva
        if (Math.random() < 0.02) { 
            line.angleChange = (Math.random() - 0.5) * 0.015;
        }
        // Fim da mudança -->
        
        // Reposicionar quando sair da tela
        const margin = 100;
        if (line.x < -margin) {
            line.x = this.canvas.width + margin;
            line.y = Math.random() * this.canvas.height;
        }
        if (line.x > this.canvas.width + margin) {
            line.x = -margin;
            line.y = Math.random() * this.canvas.height;
        }
        if (line.y < -margin) {
            line.y = this.canvas.height + margin;
            line.x = Math.random() * this.canvas.width;
        }
        if (line.y > this.canvas.height + margin) {
            line.y = -margin;
            line.x = Math.random() * this.canvas.width;
        }
    }
    
    drawLine(line) {
        const endX = line.x + Math.cos(line.angle) * line.length;
        const endY = line.y + Math.sin(line.angle) * line.length;
        
        const color = line.color.replace('OPACITY', line.opacity);
        
        this.ctx.beginPath();
        this.ctx.moveTo(line.x, line.y);
        this.ctx.lineTo(endX, endY);
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = line.thickness;
        this.ctx.lineCap = 'round';
        this.ctx.stroke();
    }
}

// Inicialização (sem mudanças aqui)
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.backgroundAnimation = new BackgroundAnimation();
    }, 100);
});