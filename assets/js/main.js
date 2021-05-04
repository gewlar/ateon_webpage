'use-strict'

window.onload = wrapTable();

// Wrap tables in a div so that they scroll responsively. 
function wrapTable() {
    const tables = document.querySelectorAll('table');
    tables.forEach((table) => {
        const tableWrapper = document.createElement('div');
        tableWrapper.className = 'table-wrapper';
        table.parentElement.replaceChild(tableWrapper, table);
        tableWrapper.appendChild(table);
    });
};

// get current theme
function getNowTheme() {
    let nowTheme = document.body.getAttribute('data-theme');
    if (nowTheme === 'auto') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
        return nowTheme === 'dark' ? 'dark' : 'light';
    }
}

// to-top button
document.querySelector('.btn .btn-scroll-top').addEventListener('click', () => {
    document.documentElement.scrollTop = 0;
});

// theme switch button
document.querySelector('.btn .btn-toggle-mode').addEventListener('click', () => {
    let nowTheme = getNowTheme();
    let domTheme = document.body.getAttribute('data-theme');
    let systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  
    if (domTheme === 'auto') {
        // if now in auto mode, switch to user mode
        document.body.setAttribute('data-theme', nowTheme === 'light' ? 'dark' : 'light');
        localStorage.setItem('ateon_data-theme', nowTheme === 'light' ? 'dark' : 'light');
    } else if (domTheme === 'light') {
        // if now in user mode and light mode
        document.body.setAttribute('data-theme', 'dark');
        // if the theme want to switch is system theme
        localStorage.setItem('ateon_data-theme', systemTheme === 'dark' ? 'auto' : 'dark');
    } else {
        // if now in user mode and dark mode
        document.body.setAttribute('data-theme', 'light');
        // if the theme want to switch is system theme
        localStorage.setItem('ateon_data-theme', systemTheme === 'light' ? 'auto' : 'light');
    }
});

/* mobile menu  */
const openMenu = document.getElementById('btn-menu');
if (openMenu) {
    openMenu.addEventListener('click', () => {
        const menu = document.querySelector('.sidebar-mobile');
        if (menu) {
            if (menu.style.display === 'none') {
                menu.setAttribute('style', 'display: flex;');
            } else {
                menu.setAttribute('style', 'display: none;');
            }
        }
    });
}