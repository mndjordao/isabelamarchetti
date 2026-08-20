// --- 1. HEADER DINÂMICO ---
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// --- 2. ANIMAÇÕES DE ROLAGEM (SCROLL REVEAL) ---
const animeElements = document.querySelectorAll('[data-anime]');

const animeScroll = () => {
    // Calcula a posição do scroll + uma margem para a animação começar antes de chegar no limite
    const windowTop = window.scrollY + window.innerHeight * 0.85; 
    
    animeElements.forEach(element => {
        if (windowTop > element.offsetTop) {
            element.classList.add('animate');
        }
    });
};

window.addEventListener('scroll', animeScroll);
animeScroll(); // Ativa uma vez ao carregar a página


// --- 3. CARROSSEL DE SERVIÇOS ---
const track = document.querySelector('.carousel-track');
const btnPrev = document.querySelector('.prev-btn');
const btnNext = document.querySelector('.next-btn');

// Verifica se os botões existem para evitar erros no console
if (btnNext && btnPrev && track) {
    const scrollCarousel = (direction) => {
        // Pega a largura do primeiro card + o gap (30px)
        const firstCard = track.querySelector('.card');
        const scrollAmount = firstCard.offsetWidth + 30; 
        
        if (direction === 'next') {
            track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        } else {
            track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    };

    btnNext.addEventListener('click', () => scrollCarousel('next'));
    btnPrev.addEventListener('click', () => scrollCarousel('prev'));
}

// --- 4. MENU MOBILE E ROLAGEM SUAVE ---
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') ? '✕' : '☰';
    });
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        // Fecha o menu mobile se estiver aberto
        if (navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            menuToggle.innerHTML = '☰';
        }

        const targetId = this.getAttribute('href');
        if (targetId !== '#') {
            const target = document.querySelector(targetId);
            if (target) {
                // Rola para a seção descontando a altura do header fixo
                const headerHeight = header.offsetHeight;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        }
    });
});