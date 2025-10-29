// Sistema de Tema Claro/Escuro
class ThemeToggle {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'dark';
        this.toggleButton = null;
        this.init();
    }
    
    init() {
        this.createToggleButton();
        this.applyTheme(this.theme);
        this.setupEventListeners();
    }
    
    createToggleButton() {
        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'theme-toggle';
        this.toggleButton.innerHTML = `
            <span class="theme-icon">🌙</span>
            <span class="theme-text">Modo Escuro</span>
        `;
        
        // CORREÇÃO: Inserir o botão após o campo de habilidades
        const skillsSection = document.querySelector('.skills');
        if (skillsSection) {
            skillsSection.parentNode.insertBefore(this.toggleButton, skillsSection.nextSibling);
        }
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Atualizar texto e ícone do botão
        this.updateButton(theme);
        
        // Atualizar cores da animação de fundo
        this.updateBackgroundAnimation(theme);
    }
    
    updateButton(theme) {
        if (!this.toggleButton) return;
        
        const icon = this.toggleButton.querySelector('.theme-icon');
        const text = this.toggleButton.querySelector('.theme-text');
        
        if (theme === 'light') {
            icon.textContent = '☀️';
            text.textContent = 'Modo Claro';
        } else {
            icon.textContent = '🌙';
            text.textContent = 'Modo Escuro';
        }
    }
    
    updateBackgroundAnimation(theme) {
        if (window.backgroundAnimation) {
            // Atualizar cores das linhas baseado no tema
            window.backgroundAnimation.updateThemeColors(theme);
        }
    }
    
    setupEventListeners() {
        this.toggleButton.addEventListener('click', () => {
            this.toggleTheme();
        });
    }
    
    toggleTheme() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.theme);
    }
    
    getCurrentTheme() {
        return this.theme;
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    window.themeToggle = new ThemeToggle();
});