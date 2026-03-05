/**
 * theme.js — 다크/라이트 테마 관리
 */
const ThemeManager = {
    /** SVG icons (static, safe content) */
    _sunIcon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    _moonIcon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',

    init() {
        const saved = localStorage.getItem('theme');
        const preferred = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
        this.set(saved || preferred);

        matchMedia('(prefers-color-scheme:dark)')
            .addEventListener('change', e => {
                if (!localStorage.getItem('theme')) this.set(e.matches ? 'dark' : 'light');
            });
    },

    get() {
        return document.documentElement.getAttribute('data-theme') || 'light';
    },

    set(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this._updateToggleIcon();
    },

    toggle() {
        this.set(this.get() === 'dark' ? 'light' : 'dark');
    },

    isDark() {
        return this.get() === 'dark';
    },

    /** Update the toggle button icon — uses static SVG strings only (no user input) */
    _updateToggleIcon() {
        const btn = document.querySelector('#theme-toggle');
        if (!btn) return;
        const isDark = this.isDark();
        btn.setAttribute('aria-label', isDark ? '라이트 모드로 전환' : '다크 모드로 전환');
        // Safe: innerHTML only receives hardcoded SVG icon strings defined above
        btn.innerHTML = isDark ? this._sunIcon : this._moonIcon;
    },
};
