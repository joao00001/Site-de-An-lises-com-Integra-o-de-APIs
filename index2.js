document.querySelectorAll('.nav-links .nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        const section = link.dataset.section; // Usa data-section para associar links às seções
        document.querySelectorAll('.menu-section').forEach(menu => {
            menu.classList.remove('open');
            menu.style.height = '0';
        });

        const menu = document.getElementById(`menu-${section}`);
        if (menu) {
            menu.classList.add('open');
            let height = 0;
            menu.style.height = `${height}px`;

            const interval = setInterval(() => {
                if (height < 200) {
                    height += 5;
                    menu.style.height = `${height}px`;
                } else {
                    clearInterval(interval);
                }
            }, 5);
        }
    });
});

document.querySelectorAll('.nav-links li').forEach(menuItem => {
    menuItem.addEventListener('mouseleave', () => {
        const section = menuItem.querySelector('.nav-link')?.dataset.section;
        const menu = document.getElementById(`menu-${section}`);

        if (menu) {
            let height = 200;
            const interval = setInterval(() => {
                if (height > 0) {
                    height -= 5;
                    menu.style.height = `${height}px`;
                } else {
                    menu.classList.remove('open');
                    clearInterval(interval);
                }
            }, 5);
        }
    });
});

document.addEventListener('click', (e) => {
    const menuSections = document.querySelectorAll('.menu-section');
    if (!e.target.closest('.nav-links .nav-link') && !e.target.closest('.menu-section')) {
        menuSections.forEach(menu => {
            menu.classList.remove('open');
            menu.style.height = '0';
        });
    }
});
