
    // Función para mostrar u ocultar el menú y ajustar la visibilidad de las imágenes del menú-bar
    function toggleMenu() {
        var menu = document.querySelector('.main-menu');
        var menuBarImages = document.querySelectorAll('.menu-bar-line img');
        var menuBar = document.querySelector('.menu-bar');
        var menuBarLine = document.querySelector('.menu-bar-line');

        if (menu.classList.contains('show-menu')) {
            // Ajustes específicos cuando el menú está siendo mostrado
            menuBarImages.forEach(img => img.style.display = 'block');
            menuBar.style.width = menuBarWidth; // Usa el ancho por defecto o el último conocido
            menuBarLine.style.width = menuBarLineWidth; // Usa el ancho por defecto o el último conocido
        } else {
            // Ajustes específicos cuando el menú está siendo ocultado
            menuBarImages.forEach(img => img.style.display = 'none');
            menuBarWidth = getComputedStyle(menuBar).width; // Actualiza el ancho por defecto antes de cambiarlo
            menuBarLineWidth = getComputedStyle(menuBarLine).width; // Actualiza el ancho por defecto antes de cambiarlo
            menuBar.style.width = '0px'; // Establece el ancho en 0px
            menuBarLine.style.width = '0px'; // Establece el ancho en 0px
        }

        menu.classList.toggle('show-menu');
    }

    // Función para mostrar u ocultar un submenú
    function toggleSubMenu(submenuId) {
        var submenu = document.getElementById(submenuId);
        submenu.classList.toggle('show-submenu');
    }

    // Función para mostrar u ocultar el formulario de agregar
    function toggleAddForm() {
        var addForm = document.getElementById('add_form');
        addForm.style.display = addForm.style.display === 'none' ? 'block' : 'none';
    }

    // Resalta el enlace cuando se pasa el cursor sobre él
    window.addEventListener('DOMContentLoaded', () => {
        const links = document.querySelectorAll('.main-menu a');

        links.forEach(link => {
            link.addEventListener('mouseover', () => {
                const submenu = link.closest('.submenu');
                const submenuWidth = submenu.offsetWidth;
                const highlight = document.createElement('div');
                highlight.classList.add('highlight');
                highlight.style = `position: absolute; background-color: rgb(209, 176, 95); width: ${submenuWidth + 10}px; height: 25px; bottom: 0; z-index: -1;`;
                link.appendChild(highlight);
            });

            link.addEventListener('mouseout', () => {
                const highlight = link.querySelector('.highlight');
                if (highlight) {
                    link.removeChild(highlight);
                }
            });
        });
    });

    // Variables para mantener el ancho del menú bar y menú bar line
    let menuBarWidth = 'auto';
    let menuBarLineWidth = 'auto';
