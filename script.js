let snake = [];
let direction = { x: 1, y: 0 };
let food = {};
let gameRunning = false;
let canvas, ctx;

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    handleImageErrors();
});

function handleImageErrors() {
    const logoImg = document.querySelector('.logo-image');
    if (logoImg) {
        logoImg.addEventListener('error', function() {
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'logo-placeholder';
            placeholder.textContent = 'LA FIL';
            placeholder.onclick = goToHomePage;
            placeholder.style.cssText = `
                width: 60px;
                height: 60px;
                border: 2px solid #00ffff;
                display: flex;
                align-items: center;
                justify-content: center;
                background: linear-gradient(45deg, #00ffff, #0088ff);
                color: #000000;
                font-size: 8px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                animation: glow 3s ease-in-out infinite;
            `;
            this.parentNode.appendChild(placeholder);
        });
    }

    const productImages = document.querySelectorAll('.product-img');
    productImages.forEach((img, index) => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.textContent = `PRODUCTO ${index + 1}`;
            placeholder.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 8px;
                color: #00ffff;
                text-align: center;
                width: 100%;
                height: 100%;
                border: 1px dashed rgba(0,255,255,0.3);
                background: rgba(0,255,255,0.05);
            `;
            this.parentNode.appendChild(placeholder);
        });
        
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
    setupAccessibilityFeatures();
}

function setupAccessibilityFeatures() {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDarkMode) {
        document.body.style.setProperty('--text-contrast', '1.2');
    }
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            const focusedElement = document.activeElement;
            if (focusedElement && (focusedElement.classList.contains('btn') || 
                focusedElement.classList.contains('download-btn') ||
                focusedElement.classList.contains('link-btn') ||
                focusedElement.classList.contains('customize-btn'))) {
                event.preventDefault();
                focusedElement.click();
            }
        }
    });
}

function setupHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navButtons = document.getElementById('navButtons');
    
    if (hamburgerBtn && navButtons) {
        hamburgerBtn.addEventListener('click', function() {
            const isActive = hamburgerBtn.classList.toggle('active');
            navButtons.classList.toggle('active');
            hamburgerBtn.setAttribute('aria-expanded', isActive);
            navButtons.setAttribute('aria-hidden', !isActive);
            
            playRetroSound('menu');
        });

        const navLinks = navButtons.querySelectorAll('.btn');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    hamburgerBtn.classList.remove('active');
                    navButtons.classList.remove('active');
                    hamburgerBtn.setAttribute('aria-expanded', false);
                    navButtons.setAttribute('aria-hidden', true);
                }
            });
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                hamburgerBtn.classList.remove('active');
                navButtons.classList.remove('active');
                hamburgerBtn.setAttribute('aria-expanded', false);
                navButtons.setAttribute('aria-hidden', false);
            }
        });
    }
}

function initSnakeGame() {
    canvas = document.getElementById('snakeCanvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    const size = window.innerWidth <= 480 ? 60 : window.innerWidth <= 768 ? 80 : 100;
    canvas.width = size;
    canvas.height = size;
    canvas.setAttribute('aria-label', 'Juego Snake decorativo en segundo plano');
    
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
    }, 300); 
}

function updateSnake() {
    const head = { ...snake[0] };
    head.x += direction.x * 10;
    head.y += direction.y * 10;

    if (head.x >= canvas.width || head.x < 0 || head.y >= canvas.height || head.y < 0) {
        resetSnakeGame();
        return;
    }
    
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        playRetroSound('eat');
    } else {
        snake.pop();
    }
    if (Math.random() < 0.1) {
        const directions = [
            { x: 0, y: -1 }, 
            { x: 1, y: 0 },  
            { x: 0, y: 1 }, 
            { x: -1, y: 0 } 
        ];
        direction = directions[Math.floor(Math.random() * directions.length)];
    }
}

function drawGame() {
    ctx.fillStyle = '#001122';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00ffff';
    snake.forEach((segment, index) => {
        if (index === 0) {
            ctx.fillStyle = '#00ffff';
        } else {
            ctx.fillStyle = '#0088bb';
        }
        ctx.fillRect(segment.x, segment.y, 8, 8);
    });

    ctx.fillStyle = '#ff6666';
    ctx.fillRect(food.x, food.y, 8, 8);
    
    ctx.strokeStyle = '#003366';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 10) {
        for (let y = 0; y < canvas.height; y += 10) {
            ctx.strokeRect(x, y, 10, 10);
        }
    }
}

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

    statue.addEventListener('mouseenter', function() {
        playRetroSound('hover');
        statue.style.opacity = '0.12';
        statue.style.transform = 'translate(-50%, -50%) scale(1.1)';

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

        const pixels = statue.querySelectorAll('.pixel:not(.empty)');
        pixels.forEach(pixel => {
            pixel.style.borderColor = 'rgba(0,255,255,0.1)';
            pixel.style.boxShadow = 'none';
        });
    });

    statue.addEventListener('click', function() {
        playRetroSound('click');
        activateGeekMode();
    });
}

function activateGeekMode() {
    const statue = document.querySelector('.geek-statue');
    if (!statue) return;

    statue.style.animation = 'none';
    statue.style.opacity = '0.2';
    statue.style.transform = 'translate(-50%, -50%) scale(1.2)';

    const pixels = statue.querySelectorAll('.pixel:not(.empty)');
    pixels.forEach((pixel, index) => {
        setTimeout(() => {
            pixel.style.background = '#00ffff';
            pixel.style.borderColor = '#ffffff';
            pixel.style.boxShadow = '0 0 8px rgba(0,255,255,0.8)';
        }, index * 30);
    });

    setTimeout(() => {
        showNotification('MODO GEEK ACTIVADO', 'El maestro del retro-tech ha despertado', 'success');

        setTimeout(() => {
            statue.style.animation = 'statueBreath 8s ease-in-out infinite';
            statue.style.opacity = '0.04';
            statue.style.transform = 'translate(-50%, -50%) scale(1)';
            
            pixels.forEach(pixel => {
                pixel.style.background = '#000000';
                pixel.style.borderColor = 'rgba(0,255,255,0.1)';
                pixel.style.boxShadow = 'none';
            });

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

function showNotification(title, message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(145deg, #001122, #002233);
        border: 2px solid ${type === 'success' ? '#00ff88' : '#00ffff'};
        color: ${type === 'success' ? '#00ff88' : '#00ffff'};
        padding: 15px 20px;
        font-family: 'Press Start 2P', cursive;
        font-size: 8px;
        z-index: 10000;
        animation: notificationSlide 0.5s ease-out;
        box-shadow: 0 0 20px rgba(${type === 'success' ? '0,255,136' : '0,255,255'},0.3);
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'notificationFadeOut 0.5s ease-in forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 3000);
}

function createSubtleParticles() {
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
        if (level <= 20) level = 80; 
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

function addButtonEffects() {
    const buttons = document.querySelectorAll('.btn, .download-btn, .customize-btn, .link-btn');
    
    buttons.forEach(button => {
        if (!button.hasAttribute('tabindex')) {
            button.setAttribute('tabindex', '0');
        }
        
        button.addEventListener('mouseenter', function() {
            playRetroSound('hover');
            createButtonSparkles(this);
        });
        
        button.addEventListener('click', function() {
            playRetroSound('click');
            createClickEffect(this);
        });
        button.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
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

function playRetroSound(type) {
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

function goToHomePage() {
    playRetroSound('click');
    console.log('Redirigiendo a la página principal de La Fil...');
    document.body.style.transform = 'scale(0.95)';
    document.body.style.transition = 'transform 0.3s ease-in-out';
    
    setTimeout(() => {
        window.location.href = 'https://lafilec.github.io/LAFILec/';
    }, 300);
}

function goBack() {
    playRetroSound('click');
    console.log('Redirigiendo hacia atrás...');
    
    document.body.style.transform = 'translateX(-100%)';
    document.body.style.transition = 'transform 0.3s ease-in-out';
    
    setTimeout(() => {
        window.location.href = 'https://lafilec.github.io/LAFILec/';
    }, 300);
}

function downloadFile(filename) {
    playRetroSound('click');
    
    const downloadLink = document.createElement('a');
    downloadLink.href = filename;
    downloadLink.download = filename;
    downloadLink.style.display = 'none';
    downloadLink.setAttribute('aria-label', `Descargar archivo ${filename}`);
    document.body.appendChild(downloadLink);

    const downloadEffect = document.createElement('div');
    downloadEffect.setAttribute('role', 'status');
    downloadEffect.setAttribute('aria-live', 'polite');
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
        text-align: center;
        min-width: 200px;
        box-shadow: 0 0 20px rgba(0,255,136,0.3);
    `;
    
    downloadEffect.innerHTML = `
        <div>DESCARGANDO ARCHIVO...</div>
        <div style="margin-top: 10px; font-size: 6px;">${filename}</div>
        <div style="margin-top: 15px;">
            <div style="width: 100%; height: 4px; background: #003366; border: 1px solid #00ff88;">
                <div style="width: 0%; height: 100%; background: #00ff88; animation: progressBar 1.5s ease-out forwards;"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(downloadEffect);

    setTimeout(() => {
        downloadLink.click();
        console.log(`Iniciando descarga: ${filename}`);
        showNotification('DESCARGA INICIADA', `Archivo ${filename} descargándose`, 'success');
    }, 500);

    setTimeout(() => {
        if (downloadEffect.parentNode) {
            downloadEffect.parentNode.removeChild(downloadEffect);
        }
        if (downloadLink.parentNode) {
            downloadLink.parentNode.removeChild(downloadLink);
        }
    }, 2000);
}

function openExternalLink(url) {
    playRetroSound('click');
    
    const linkEffect = document.createElement('div');
    linkEffect.setAttribute('role', 'status');
    linkEffect.setAttribute('aria-live', 'polite');
    linkEffect.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(145deg, #001122, #002233);
        border: 2px solid #00aaff;
        color: #00aaff;
        padding: 20px;
        font-family: 'Press Start 2P', cursive;
        font-size: 8px;
        z-index: 9999;
        animation: linkPulse 1.5s ease-in-out;
        text-align: center;
        min-width: 200px;
        box-shadow: 0 0 20px rgba(0,170,255,0.3);
    `;
    
    linkEffect.innerHTML = `
        <div>ABRIENDO EXPERIENCIA...</div>
        <div style="margin-top: 15px; font-size: 6px; word-break: break-all;">Redirigiendo a contenido externo</div>
    `;
    
    document.body.appendChild(linkEffect);

    setTimeout(() => {
        window.open(url, '_blank', 'noopener,noreferrer');
        console.log(`Abriendo experiencia en: ${url}`);
        showNotification('EXPERIENCIA ABIERTA', 'Nueva pestaña iniciada correctamente', 'success');
    }, 800);

    setTimeout(() => {
        if (linkEffect.parentNode) {
            linkEffect.parentNode.removeChild(linkEffect);
        }
    }, 1500);
}

function setupModalHandlers() {
    const modal = document.getElementById('customModal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeCustomModal);
        closeBtn.setAttribute('tabindex', '0');
        closeBtn.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                closeCustomModal();
            }
        });
    }

    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeCustomModal();
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal && modal.style.display === 'block') {
            closeCustomModal();
        }
    });

    const whatsappBtn = document.querySelector('.whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('mouseenter', function() {
            playRetroSound('hover');
            createButtonSparkles(this);
        });
        
        whatsappBtn.addEventListener('click', function() {
            playRetroSound('click');
            createClickEffect(this);
            
            const whatsappEffect = document.createElement('div');
            whatsappEffect.setAttribute('role', 'status');
            whatsappEffect.setAttribute('aria-live', 'polite');
            whatsappEffect.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(145deg, #25D366, #128C7E);
                border: 2px solid #25D366;
                color: #ffffff;
                padding: 15px 20px;
                font-family: 'Press Start 2P', cursive;
                font-size: 8px;
                z-index: 10000;
                animation: whatsappPulse 1s ease-out;
                text-align: center;
                box-shadow: 0 0 20px rgba(37, 211, 102, 0.5);
            `;
            whatsappEffect.innerHTML = `
                <div>ABRIENDO WHATSAPP...</div>
                <div style="margin-top: 8px; font-size: 6px;">Contactando desarrollador</div>
            `;
            
            document.body.appendChild(whatsappEffect);
            
            setTimeout(() => {
                if (whatsappEffect.parentNode) {
                    whatsappEffect.parentNode.removeChild(whatsappEffect);
                }
            }, 1000);
        });
    }
}

function openCustomModal() {
    playRetroSound('click');
    const modal = document.getElementById('customModal');
    if (modal) {
        modal.style.display = 'block';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            const closeBtn = modal.querySelector('.close');
            if (closeBtn) closeBtn.focus();
        }, 100);

        createModalPixels();
    }
}

function closeCustomModal() {
    playRetroSound('click');
    const modal = document.getElementById('customModal');
    if (modal) {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
        const customizeBtn = document.querySelector('.customize-btn');
        if (customizeBtn) customizeBtn.focus();
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
                pointer-events: none;
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

function setupResponsiveHandlers() {
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
}

function handleResize() {
    if (canvas) {
        const size = window.innerWidth <= 480 ? 60 : window.innerWidth <= 768 ? 80 : 100;
        canvas.width = size;
        canvas.height = size;
    }
    if (window.innerWidth <= 768) {
        gameRunning = false;
    } else {
        if (!gameRunning) {
            resetSnakeGame();
            startSnakeGame();
        }
    }
}

function handleOrientationChange() {
    setTimeout(() => {
        handleResize();
        const hamburgerBtn = document.getElementById('hamburgerBtn');
        const navButtons = document.getElementById('navButtons');
        
        if (hamburgerBtn && navButtons) {
            hamburgerBtn.classList.remove('active');
            navButtons.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            navButtons.setAttribute('aria-hidden', 'false');
        }
    }, 100);
}

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
            50% { transform: translate(-50%, -50%) scale(1.05); }
        }
        
        @keyframes linkPulse {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.05); }
        }
        
        @keyframes whatsappPulse {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
            50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
        
        @keyframes progressBar {
            0% { width: 0%; }
            100% { width: 100%; }
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
        
        @keyframes notificationSlide {
            0% { 
                transform: translateX(100%); 
                opacity: 0; 
            }
            100% { 
                transform: translateX(0); 
                opacity: 1; 
            }
        }
        
        @keyframes notificationFadeOut {
            0% { 
                transform: translateX(0); 
                opacity: 1; 
            }
            100% { 
                transform: translateX(100%); 
                opacity: 0; 
            }
        }
        
        .background-elements * {
            will-change: transform;
        }
        
        @media (prefers-reduced-motion: reduce) {
            .background-elements {
                opacity: 0.3;
            }
            
            .background-elements * {
                animation-duration: 0.1s !important;
                animation-iteration-count: 1 !important;
            }
        }
    `;
    
    document.head.appendChild(style);
}

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

const debouncedResize = debounce(handleResize, 250);
window.addEventListener('resize', debouncedResize);

window.addEventListener('beforeunload', function() {
    gameRunning = false;

    const particles = document.querySelectorAll('.subtle-particle');
    particles.forEach(particle => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    });
});

document.addEventListener('DOMContentLoaded', addDynamicStyles);
