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
// --- 5. LÓGICA DAS BOLINHAS DO CARROSSEL ---
const dots = document.querySelectorAll('.dot');
const cards = document.querySelectorAll('.carousel-track .card');

if (track && dots.length > 0) {
    // Sincroniza a bolinha ativa com a rolagem (arrastar pelo touch)
    track.addEventListener('scroll', () => {
        // Pega a largura do card + os 30px de espaço (gap)
        const cardWidth = cards[0].offsetWidth + 30; 
        const scrollPosition = track.scrollLeft;
        
        // Descobre qual card está mais centralizado na tela
        let activeIndex = Math.round(scrollPosition / cardWidth);
        
        // Remove a classe 'active' de todas as bolinhas e coloca apenas na atual
        dots.forEach(dot => dot.classList.remove('active'));
        if(dots[activeIndex]) {
            dots[activeIndex].classList.add('active');
        }
    });

    // Faz o carrossel rolar até o card correspondente ao clicar na bolinha
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const cardWidth = cards[0].offsetWidth + 30;
            track.scrollTo({
                left: index * cardWidth,
                behavior: 'smooth'
            });
        });
    });
}

// ==========================================
// LÓGICA DA FERRAMENTA DE ANSIEDADE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    
    const btnAnsiedade = document.getElementById('btn-ansiedade');
    const overlay = document.getElementById('anxiety-overlay');
    const closeOverlay = document.getElementById('close-overlay');

    const startBtn = document.getElementById('start-btn');
    const animatedCircle = document.getElementById('animated-circle');
    const circleText = document.getElementById('circle-text');
    const timerDisplay = document.getElementById('timer-display');
    const reflectionBox = document.getElementById('reflection-box');

    let breathingInterval;
    let countdownInterval;
    let textTimeout; // Variável para controlar os 5 segundos do texto
    
    let timeLeft = 120; // O exercício continua com 120 segundos (2 minutos)
    let isExerciseActive = false;

    function updateTimerDisplay(seconds) {
        const min = Math.floor(seconds / 60).toString().padStart(2, '0');
        const sec = (seconds % 60).toString().padStart(2, '0');
        if (timerDisplay) timerDisplay.innerText = `${min}:${sec}`;
    }

    function runBreathingCycle() {
        if (circleText) circleText.innerText = "Inspire...";
        if (animatedCircle) {
            animatedCircle.classList.remove('exhale');
            animatedCircle.classList.add('inhale');
        }
        
        setTimeout(() => {
            if(!isExerciseActive) return;
            if (circleText) circleText.innerText = "Expire...";
            if (animatedCircle) {
                animatedCircle.classList.remove('inhale');
                animatedCircle.classList.add('exhale');
            }
        }, 4000); 
    }

    function resetExercise() {
        clearInterval(breathingInterval);
        clearInterval(countdownInterval);
        clearTimeout(textTimeout); // Cancela a aparição do texto se o usuário fechar antes
        
        isExerciseActive = false;
        if (animatedCircle) animatedCircle.classList.remove('inhale', 'exhale');
        if (circleText) circleText.innerText = "Começar";
        updateTimerDisplay(120); // Volta o relógio visual para 02:00
    }

    // 1. Abrir e Fechar o Painel
    if (btnAnsiedade && overlay) {
        btnAnsiedade.addEventListener('click', () => {
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        });

        if (closeOverlay) {
            closeOverlay.addEventListener('click', () => {
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto'; 
                resetExercise(); 
                if (reflectionBox) reflectionBox.style.display = 'none';
            });
        }
    }

    // 2. Iniciar o Exercício
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if(isExerciseActive) return; 
            
            isExerciseActive = true;
            timeLeft = 120;
            if (reflectionBox) reflectionBox.style.display = 'none'; 
            
            // Inicia o visual da bolinha
            runBreathingCycle(); 
            breathingInterval = setInterval(runBreathingCycle, 8000); 
            
            // CRONÔMETRO INDEPENDENTE: Mostra o texto após 5 segundos
            textTimeout = setTimeout(() => {
                if (isExerciseActive && reflectionBox) {
                    reflectionBox.style.display = 'block';
                    reflectionBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }, 5000); // 5000 milissegundos = 5 segundos
            
            // CRONÔMETRO PRINCIPAL: Conta os 120 segundos da bolinha
            countdownInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay(timeLeft);
                
                if (timeLeft <= 0) {
                    resetExercise(); // Para a bolinha
                    if (circleText) circleText.innerText = "Concluído";
                    // Não precisamos mandar o texto aparecer aqui, pois ele já apareceu aos 5 segundos!
                }
            }, 1000);
        });
    }
});