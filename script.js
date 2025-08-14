// ===============================
// VARIABLES GLOBALES
// ===============================
let snake = [];
let direction = { x: 1, y: 0 };
let food = {};
let gameRunning = false;
let canvas, ctx;

// ===============================
// INICIALIZACIÓN
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    handleImageErrors();
});

function handleImageErrors() {
    // Manejar errores de carga del logo
    const logoImg = document.querySelector('.logo-image');
    if (logoImg) {
        logoImg.addEventListener('error', function() {
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'logo-placeholder';
            placeholder.textContent = 'LOGO';
            placeholder.onclick = goToHomePage;
            this.parentNode.appendChild(placeholder);
        });
    }
    
    // Manejar errores de carga de productos
    const productImages = document.querySelectorAll('.product-img');
    productImages.forEach((img, index) => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.textContent = `[IMAGEN PRODUCTO ${index + 1}]`;
            placeholder.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 8px;
                color: #00ffff;
                text-align: center;
                width: 100%;
                height: 100%;
            `;
            this.parentNode.appendChild(placeholder);
        });
        
        // Verificar si la imagen existe
        img.addEventListener('load', function() {
            console.log(`Imagen cargada: ${this.src}`);
        });
    });
}

function initializeApp() {
    setupHamburgerMenu();
    initSnakeGame();
    addButtonEffects();
    setupModalHandlers();
    createRetroEffects();
    setupResponsiveHandlers();
}

// ===============================
// MENÚ HAMBURGUESA
// ===============================
function setupHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navButtons = document.getElementById('navButtons');
    
    if (hamburgerBtn && navButtons) {
        hamburgerBtn.addEventListener('click', function() {
            hamburgerBtn.classList.toggle('active');
            navButtons.classList.toggle('active');
            
            // Efecto de sonido simulado
            playRetroSound('menu');
        });
        
        // Cerrar menú al hacer clic en un enlace (móvil)
        const navLinks = navButtons.querySelectorAll('.btn');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    hamburgerBtn.classList.remove('active');
                    navButtons.classList.remove('active');
                }
            });
        });
        
        // Cerrar menú al redimensionar ventana
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburgerBtn.classList.remove('active');
                navButtons.classList.remove('active');
            }
        });
    }
}

// ===============================
// JUEGO DE LA SERPIENTE (SNAKE)
// ===============================
function initSnakeGame() {
    canvas = document.getElementById('snakeCanvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    
    // Ajustar tamaño según pantalla
    const size = window.innerWidth <= 480 ? 60 : window.innerWidth <= 768 ? 80 : 100;
    canvas.width = size;
    canvas.height = size;
    
    // Inicializar juego
    resetSnakeGame();
    startSnakeGame();
}

function resetSnakeGame() {
    const gridSize = 10;
    snake = [
        { x: 20, y: 20 },
        { x: 10, y: 20 },
        { x: 0, y: 20 }
    ];
    direction = { x: 1, y: 0 };
    food = generateFood();
}

function generateFood() {
    const gridSize = 10;
    const maxGrid = Math.floor(canvas.width / gridSize) - 1;
    return {
        x: Math.floor(Math.random() * maxGrid) * gridSize,
        y: Math.floor(Math.random() * maxGrid) * gridSize
    };
}

function startSnakeGame() {
    if (gameRunning) return;
    gameRunning = true;
    gameLoop();
}

function gameLoop() {
    if (!gameRunning) return;
    
    updateSnake();
    drawGame();
    
    setTimeout(() => {
        if (gameRunning) {
            requestAnimationFrame(gameLoop);
        }
    }, 300); // Velocidad del juego
}

function updateSnake() {
    const head = { ...snake[0] };
    head.x += direction.x * 10;
    head.y += direction.y * 10;
    
    // Colisión con bordes - reiniciar posición
    if (head.x >= canvas.width || head.x < 0 || head.y >= canvas.height || head.y < 0) {
        resetSnakeGame();
        return;
    }
    
    snake.unshift(head);
    
    // Verificar si comió comida
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        playRetroSound('eat');
    } else {
        snake.pop();
    }
    
    // Cambiar dirección aleatoriamente
    if (Math.random() < 0.1) {
        const directions = [
            { x: 0, y: -1 }, // arriba
            { x: 1, y: 0 },  // derecha
            { x: 0, y: 1 },  // abajo
            { x: -1, y: 0 }  // izquierda
        ];
        direction = directions[Math.floor(Math.random() * directions.length)];
    }
}

function drawGame() {
    // Limpiar canvas
    ctx.fillStyle = '#001122';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar serpiente
    ctx.fillStyle = '#00ffff';
    snake.forEach((segment, index) => {
        if (index === 0) {
            // Cabeza más brillante
            ctx.fillStyle = '#00ffff';
        } else {
            ctx.fillStyle = '#0088bb';
        }
        ctx.fillRect(segment.x, segment.y, 8, 8);
    });
    
    // Dibujar comida
    ctx.fillStyle = '#ff6666';
    ctx.fillRect(food.x, food.y, 8, 8);
    
    // Efecto de píxeles
    ctx.strokeStyle = '#003366';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 10) {
        for (let y = 0; y < canvas.height; y += 10) {
            ctx.strokeRect(x, y, 10, 10);
        }
    }
}

// ===============================
// EFECTOS RETRO ADICIONALES
// ===============================
function createRetroEffects() {
    createFloatingPixels();
    animateBatteryLevel();
    createGlitchEffect();
    addRetroLoadingEffect();
    createSubtleParticles();
    initGeekStatueEffects();
}

function initGeekStatueEffects() {
    const statue = document.querySelector('.geek-statue');
    if (!statue) return;
    
    // Efecto hover especial
    statue.addEventListener('mouseenter', function() {
        playRetroSound('hover');
        statue.style.opacity = '0.12';
        statue.style.transform = 'translate(-50%, -50%) scale(1.1)';
        
        // Animar píxeles individualmente
        const pixels = statue.querySelectorAll('.pixel:not(.empty)');
        pixels.forEach((pixel, index) => {
            setTimeout(() => {
                pixel.style.borderColor = 'rgba(0,255,255,0.4)';
                pixel.style.boxShadow = '0 0 3px rgba(0,255,255,0.3)';
            }, index * 50);
        });
    });
    
    statue.addEventListener('mouseleave', function() {
        statue.style.opacity = '0.04';
        statue.style.transform = 'translate(-50%, -50%) scale(1)';
        
        // Restaurar píxeles
        const pixels = statue.querySelectorAll('.pixel:not(.empty)');
        pixels.forEach(pixel => {
            pixel.style.borderColor = 'rgba(0,255,255,0.1)';
            pixel.style.boxShadow = 'none';
        });
    });
    
    // Efecto de click especial
    statue.addEventListener('click', function() {
        playRetroSound('click');
        activateGeekMode();
    });
}

function activateGeekMode() {
    const statue = document.querySelector('.geek-statue');
    if (!statue) return;
    
    // Efecto de "activación"
    statue.style.animation = 'none';
    statue.style.opacity = '0.2';
    statue.style.transform = 'translate(-50%, -50%) scale(1.2)';
    
    // Cambiar todos los píxeles a cian brillante
    const pixels = statue.querySelectorAll('.pixel:not(.empty)');
    pixels.forEach((pixel, index) => {
        setTimeout(() => {
            pixel.style.background = '#00ffff';
            pixel.style.borderColor = '#ffffff';
            pixel.style.boxShadow = '0 0 8px rgba(0,255,255,0.8)';
        }, index * 30);
    });
    
    // Mensaje especial
    setTimeout(() => {
        alert('🤓 ¡MODO GEEK ACTIVADO! 🕹️\n¡El maestro del retro-tech ha despertado!');
        
        // Restaurar después de 3 segundos
        setTimeout(() => {
            statue.style.animation = 'statueBreath 8s ease-in-out infinite';
            statue.style.opacity = '0.04';
            statue.style.transform = 'translate(-50%, -50%) scale(1)';
            
            pixels.forEach(pixel => {
                pixel.style.background = '#000000';
                pixel.style.borderColor = 'rgba(0,255,255,0.1)';
                pixel.style.boxShadow = 'none';
            });
            
            // Restaurar colores especiales
            const glassesPixels = statue.querySelectorAll('.pixel.glasses');
            glassesPixels.forEach(pixel => {
                pixel.style.background = '#333333';
            });
            
            const shirtPixels = statue.querySelectorAll('.pixel.shirt');
            shirtPixels.forEach(pixel => {
                pixel.style.background = '#111111';
            });
        }, 3000);
    }, 500);
}

function addRetroLoadingEffect() {
    // Crear efecto de "carga" inicial estilo Nokia
    const loadingBar = document.createElement('div');
    loadingBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #00ffff, #0088ff);
        z-index: 10000;
        transition: width 2s ease-out;
        box-shadow: 0 0 10px rgba(0,255,255,0.5);
    `;
    
    document.body.appendChild(loadingBar);
    
    // Animar barra de carga
    setTimeout(() => {
        loadingBar.style.width = '100%';
    }, 100);
    
    // Quitar barra después de completar
    setTimeout(() => {
        loadingBar.style.opacity = '0';
        setTimeout(() => {
            if (loadingBar.parentNode) {
                loadingBar.parentNode.removeChild(loadingBar);
            }
        }, 500);
    }, 2500);
}

function createSubtleParticles() {
    // Crear partículas sutiles que no afecten el rendimiento
    setInterval(() => {
        if (Math.random() < 0.1 && document.querySelectorAll('.subtle-particle').length < 5) {
            createSubtleParticle();
        }
    }, 5000);
}

function createSubtleParticle() {
    const particle = document.createElement('div');
    particle.classList.add('subtle-particle');
    particle.style.cssText = `
        position: fixed;
        width: 2px;
        height: 2px;
        background: #00ffff;
        opacity: 0.4;
        z-index: 0;
        pointer-events: none;
        border-radius: 50%;
        animation: subtleFloat 8s ease-in-out forwards;
    `;
    
    // Posicionar solo en los lados
    const isLeft = Math.random() < 0.5;
    particle.style.left = isLeft ? Math.random() * 100 + 'px' : (window.innerWidth - 100 + Math.random() * 100) + 'px';
    particle.style.top = Math.random() * window.innerHeight + 'px';
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 8000);
}

function createFloatingPixels() {
    const main = document.querySelector('.main');
    if (!main) return;
    
    setInterval(() => {
        if (Math.random() < 0.3) {
            createRandomPixel();
        }
    }, 2000);
}

function createRandomPixel() {
    const pixel = document.createElement('div');
    pixel.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: #00ffff;
        opacity: 0.6;
        z-index: 0;
        pointer-events: none;
        left: ${Math.random() * 100}vw;
        top: ${Math.random() * 100}vh;
        animation: fadeOut 3s ease-out forwards;
    `;
    
    document.body.appendChild(pixel);
    
    setTimeout(() => {
        if (pixel.parentNode) {
            pixel.parentNode.removeChild(pixel);
        }
    }, 3000);
}

function animateBatteryLevel() {
    const batteryLevel = document.querySelector('.battery-level');
    if (!batteryLevel) return;
    
    let level = 80;
    setInterval(() => {
        level = Math.max(20, level - Math.random() * 5);
        if (level <= 20) level = 80; // Recarga
        batteryLevel.style.width = level + '%';
        
        if (level <= 30) {
            batteryLevel.style.background = 'linear-gradient(90deg, #ff4444, #ff6666)';
        } else {
            batteryLevel.style.background = 'linear-gradient(90deg, #00ff88, #00ffff)';
        }
    }, 3000);
}

function createGlitchEffect() {
    const elements = document.querySelectorAll('.product-title, .logo-placeholder');
    
    elements.forEach(element => {
        setInterval(() => {
            if (Math.random() < 0.1) {
                element.style.textShadow = '2px 0 #ff00ff, -2px 0 #00ffff';
                setTimeout(() => {
                    element.style.textShadow = '0 0 10px rgba(0,255,255,0.5)';
                }, 100);
            }
        }, 2000);
    });
}

// ===============================
// EFECTOS DE BOTONES
// ===============================
function addButtonEffects() {
    const buttons = document.querySelectorAll('.btn, .download-btn, .customize-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            playRetroSound('hover');
            createButtonSparkles(this);
        });
        
        button.addEventListener('click', function() {
            playRetroSound('click');
            createClickEffect(this);
        });
    });
}

function createButtonSparkles(button) {
    for (let i = 0; i < 3; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: #00ffff;
                pointer-events: none;
                border-radius: 50%;
                animation: sparkle 0.6s ease-out forwards;
            `;
            
            const rect = button.getBoundingClientRect();
            sparkle.style.left = (rect.left + Math.random() * rect.width) + 'px';
            sparkle.style.top = (rect.top + Math.random() * rect.height) + 'px';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.parentNode.removeChild(sparkle);
                }
            }, 600);
        }, i * 100);
    }
}

function createClickEffect(element) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(0,255,255,0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (rect.left + rect.width / 2 - size / 2) + 'px';
    ripple.style.top = (rect.top + rect.height / 2 - size / 2) + 'px';
    
    document.body.appendChild(ripple);
    
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 600);
}

// ===============================
// SONIDOS RETRO SIMULADOS
// ===============================
function playRetroSound(type) {
    // En una implementación real, aquí reproducirías archivos de sonido
    // Por ahora, solo agregamos una vibración visual
    
    const soundEffects = {
        'menu': () => flashScreen('#00ffff', 0.1),
        'hover': () => flashScreen('#0088ff', 0.05),
        'click': () => flashScreen('#00ff88', 0.15),
        'eat': () => flashScreen('#ff6666', 0.1)
    };
    
    if (soundEffects[type]) {
        soundEffects[type]();
    }
}

function flashScreen(color, opacity) {
    const flash = document.createElement('div');
    flash.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: ${color};
        opacity: ${opacity};
        pointer-events: none;
        z-index: 9999;
        animation: flashFade 0.2s ease-out forwards;
    `;
    
    document.body.appendChild(flash);
    
    setTimeout(() => {
        if (flash.parentNode) {
            flash.parentNode.removeChild(flash);
        }
    }, 200);
}

// ===============================
// FUNCIONES DE NAVEGACIÓN
// ===============================
function goToHomePage() {
    playRetroSound('click');
    console.log('Navegando a página principal...');
    
    // Efecto visual de transición
    document.body.style.transform = 'scale(0.95)';
    document.body.style.transition = 'transform 0.3s ease-in-out';
    
    setTimeout(() => {
        document.body.style.transform = 'scale(1)';
        alert('Ir a Página Principal\nAquí pondrías tu URL: /home o /index');
        // window.location.href = '/home'; // Descomenta para usar
    }, 300);
}

function goBack() {
    playRetroSound('click');
    // Simular navegación hacia atrás
    console.log('Navegando hacia atrás...');
    
    // Efecto visual de transición
    document.body.style.transform = 'translateX(-100%)';
    document.body.style.transition = 'transform 0.3s ease-in-out';
    
    setTimeout(() => {
        document.body.style.transform = 'translateX(0)';
        alert('Función RETORNAR - Aquí irías a la página principal');
    }, 300);
}

function openNewTab(platform) {
    playRetroSound('click');
    
    const urls = {
        'crowdfunding': 'https://tu-crowdfunding-url.com',
        'instagram': 'https://instagram.com/tu-usuario'
    };
    
    if (platform === 'crowdfunding') {
        alert('Abrir pestaña de Crowdfunding\nAquí pondrías tu URL real: ' + urls.crowdfunding);
        // window.open(urls.crowdfunding, '_blank');
    } else if (platform === 'instagram') {
        alert('Abrir Instagram\nAquí pondrías tu URL real: ' + urls.instagram);
        // window.open(urls.instagram, '_blank');
    }
}

function downloadFile(filename) {
    playRetroSound('click');
    
    // Efecto de descarga simulado
    const downloadEffect = document.createElement('div');
    downloadEffect.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(145deg, #001122, #002233);
        border: 2px solid #00ff88;
        color: #00ff88;
        padding: 20px;
        font-family: 'Press Start 2P', cursive;
        font-size: 8px;
        z-index: 9999;
        animation: downloadPulse 2s ease-in-out;
    `;
    downloadEffect.textContent = `Descargando ${filename}...`;
    
    document.body.appendChild(downloadEffect);
    
    setTimeout(() => {
        if (downloadEffect.parentNode) {
            downloadEffect.parentNode.removeChild(downloadEffect);
        }
        alert(`Archivo ${filename} descargado\nAquí conectarías con tu archivo real`);
    }, 2000);
}

// ===============================
// MODAL DE PERSONALIZACIÓN
// ===============================
function setupModalHandlers() {
    const modal = document.getElementById('customModal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCustomModal);
    }
    
    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeCustomModal();
        }
    });
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal && modal.style.display === 'block') {
            closeCustomModal();
        }
    });
}

function openCustomModal() {
    playRetroSound('click');
    const modal = document.getElementById('customModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevenir scroll
        
        // Efecto de aparición con píxeles
        createModalPixels();
    }
}

function closeCustomModal() {
    playRetroSound('click');
    const modal = document.getElementById('customModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restaurar scroll
    }
}

function createModalPixels() {
    const modal = document.querySelector('.modal-content');
    if (!modal) return;
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const pixel = document.createElement('div');
            pixel.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: #00ffff;
                opacity: 0.8;
                animation: modalPixelFloat 2s ease-out forwards;
            `;
            
            const rect = modal.getBoundingClientRect();
            pixel.style.left = Math.random() * rect.width + 'px';
            pixel.style.top = Math.random() * rect.height + 'px';
            
            modal.appendChild(pixel);
            
            setTimeout(() => {
                if (pixel.parentNode) {
                    pixel.parentNode.removeChild(pixel);
                }
            }, 2000);
        }, i * 100);
    }
}

// ===============================
// MANEJADORES RESPONSIVE
// ===============================
function setupResponsiveHandlers() {
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
}

function handleResize() {
    // Reajustar canvas de Snake
    if (canvas) {
        const size = window.innerWidth <= 480 ? 60 : window.innerWidth <= 768 ? 80 : 100;
        canvas.width = size;
        canvas.height = size;
    }
    
    // Reajustar efectos según el tamaño de pantalla
    if (window.innerWidth <= 768) {
        // Reducir efectos en móvil para mejor rendimiento
        gameRunning = false;
    } else {
        // Reactivar efectos en desktop
        if (!gameRunning) {
            resetSnakeGame();
            startSnakeGame();
        }
    }
}

function handleOrientationChange() {
    setTimeout(() => {
        handleResize();
        
        // Cerrar menú hamburguesa si está abierto
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const navButtons = document.getElementById('navButtons');
        
        if (hamburgerBtn && navButtons) {
            hamburgerBtn.classList.remove('active');
            navButtons.classList.remove('active');
        }
    }, 100);
}

// ===============================
// ANIMACIONES CSS ADICIONALES
// ===============================
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes flashFade {
            from { opacity: var(--flash-opacity, 0.1); }
            to { opacity: 0; }
        }
        
        @keyframes ripple {
            to { transform: scale(4); opacity: 0; }
        }
        
        @keyframes downloadPulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.1); }
        }
        
        @keyframes modalPixelFloat {
            0% { 
                opacity: 0.8; 
                transform: translateY(0) rotate(0deg); 
            }
            100% { 
                opacity: 0; 
                transform: translateY(-50px) rotate(360deg); 
            }
        }
        
        @keyframes fadeOut {
            0% { opacity: 0.6; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
            100% { opacity: 0; transform: scale(0); }
        }
        
        @keyframes subtleFloat {
            0% { 
                opacity: 0.4; 
                transform: translateY(0) translateX(0); 
            }
            25% { 
                opacity: 0.6; 
                transform: translateY(-20px) translateX(10px); 
            }
            50% { 
                opacity: 0.4; 
                transform: translateY(-10px) translateX(-5px); 
            }
            75% { 
                opacity: 0.2; 
                transform: translateY(-30px) translateX(15px); 
            }
            100% { 
                opacity: 0; 
                transform: translateY(-50px) translateX(0); 
            }
        }
        
        /* Mejoras de rendimiento */
        .background-elements * {
            will-change: transform;
        }
        
        /* Suavizar animaciones en dispositivos de bajo rendimiento */
        @media (prefers-reduced-motion: reduce) {
            .background-elements {
                display: none;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Agregar estilos dinámicos al cargar
document.addEventListener('DOMContentLoaded', addDynamicStyles);

// ===============================
// UTILIDADES
// ===============================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimizar eventos de resize
const debouncedResize = debounce(handleResize, 250);
window.addEventListener('resize', debouncedResize);

// Limpiar recursos al salir de la página
window.addEventListener('beforeunload', function() {
    gameRunning = false;
});