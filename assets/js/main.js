'use-strict'

window.onload = wrapTable();
window.onload = loadBaseTheme();

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

function loadBaseTheme() {
    setTheme(getNowTheme());
}

// get current theme
function getNowTheme() {
    let nowTheme = document.body.getAttribute('data-theme');
    if (nowTheme === 'auto') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else {
        return nowTheme === 'dark' ? 'dark' : 'light';
    }
}

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    document.getElementsByName("webring").forEach((el) => {
        el.setAttribute('theme', "/theme/"+theme+".json");
    });
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
        setTheme(nowTheme === 'light' ? 'dark' : 'light');
        localStorage.setItem('ateon_data-theme', nowTheme === 'light' ? 'dark' : 'light');
    } else if (domTheme === 'light') {
        // if now in user mode and light mode
        setTheme('dark');
        // if the theme want to switch is system theme
        localStorage.setItem('ateon_data-theme', systemTheme === 'dark' ? 'auto' : 'dark');
    } else {
        // if now in user mode and dark mode
        setTheme('light');
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