// Snake game Easter egg: show when user presses G-A-M-E in sequence
let gameKeySequence = '';
let quitKeySequence = '';
document.addEventListener('keydown', function(e) {
    const key = e.key.toLowerCase();
    // Snake game Easter egg
    if ('game'.includes(key)) {
        gameKeySequence += key;
        if (gameKeySequence.endsWith('game')) {
            showSnakeGame();
            gameKeySequence = '';
        }
        if (gameKeySequence.length > 4) gameKeySequence = gameKeySequence.slice(-4);
    } else {
        gameKeySequence = '';
    }
    // Quit Easter egg
    if ('quit'.includes(key)) {
        quitKeySequence += key;
        if (quitKeySequence.endsWith('quit')) {
            const overlay = document.getElementById('snakeGameOverlay');
            if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
            quitKeySequence = '';
        }
        if (quitKeySequence.length > 4) quitKeySequence = quitKeySequence.slice(-4);
    } else {
        quitKeySequence = '';
    }
});

function showSnakeGame() {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'snakeGameOverlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.98)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    document.body.appendChild(overlay);
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = Math.min(window.innerWidth * 0.7, 600);
    canvas.height = Math.min(window.innerHeight * 0.7, 600);
    canvas.style.background = '#222';
    canvas.style.border = '4px solid #e53935';
    overlay.appendChild(canvas);
    // Close on overlay click
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });
    // Snake game logic
    const ctx = canvas.getContext('2d');
    let snake = [{x:10, y:10}];
    let direction = 'right';
    let nextDirection = 'right';
    let food = {x: Math.floor(Math.random()*20), y: Math.floor(Math.random()*20)};
    let score = 0;
    let gameOver = false;
    function draw() {
        ctx.fillStyle = '#222';
        ctx.fillRect(0,0,canvas.width,canvas.height);
        // Draw red corners
        ctx.fillStyle = '#e53935';
        ctx.fillRect(0,0,28,28);
        ctx.fillRect(canvas.width-28,0,28,28);
        ctx.fillRect(0,canvas.height-28,28,28);
        ctx.fillRect(canvas.width-28,canvas.height-28,28,28);
        // Draw snake
        ctx.fillStyle = '#39ff14';
        snake.forEach(s => {
            ctx.fillRect(s.x*28, s.y*28, 26, 26);
        });
        // Draw food
        ctx.fillStyle = '#ffe066';
        ctx.fillRect(food.x*28, food.y*28, 26, 26);
        // Draw score
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 22px monospace';
        ctx.fillText('Score: '+score, 16, 32);
        if (gameOver) {
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 38px monospace';
            ctx.fillText('Game Over', canvas.width/2-110, canvas.height/2);
        }
    }
    function update() {
        if (gameOver) return;
        direction = nextDirection;
        let head = {...snake[0]};
        if (direction==='right') head.x++;
        if (direction==='left') head.x--;
        if (direction==='up') head.y--;
        if (direction==='down') head.y++;
        // Check collision
        if (head.x<0||head.x>=20||head.y<0||head.y>=20||snake.some(s=>s.x===head.x&&s.y===head.y)) {
            gameOver = true;
            draw();
            return;
        }
        snake.unshift(head);
        if (head.x===food.x&&head.y===food.y) {
            score++;
            food = {x: Math.floor(Math.random()*20), y: Math.floor(Math.random()*20)};
        } else {
            snake.pop();
        }
        draw();
    }
    function handleKey(e) {
        if (e.key==='ArrowUp'&&direction!=='down') nextDirection='up';
        if (e.key==='ArrowDown'&&direction!=='up') nextDirection='down';
        if (e.key==='ArrowLeft'&&direction!=='right') nextDirection='left';
        if (e.key==='ArrowRight'&&direction!=='left') nextDirection='right';
        if (e.key==='Escape') {
            if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        }
    }
    document.addEventListener('keydown', handleKey);
    let interval = setInterval(update, 120);
    draw();
    // Clean up listeners when overlay is removed
    overlay.addEventListener('transitionend', function() {
        clearInterval(interval);
        document.removeEventListener('keydown', handleKey);
    });
}
// Eject binary from mouse on click
document.addEventListener('click', function(e) {
    const ejectCanvas = document.createElement('canvas');
    ejectCanvas.width = window.innerWidth;
    ejectCanvas.height = window.innerHeight;
    ejectCanvas.style.position = 'fixed';
    ejectCanvas.style.top = '0';
    ejectCanvas.style.left = '0';
    ejectCanvas.style.pointerEvents = 'none';
    ejectCanvas.style.zIndex = '3000';
    document.body.appendChild(ejectCanvas);
    const ctx = ejectCanvas.getContext('2d');
    const binary = ['0', '1'];
    const particles = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
        const angle = (2 * Math.PI * i) / count + Math.random() * 0.3;
        particles.push({
            x: e.clientX,
            y: e.clientY,
            vx: Math.cos(angle) * (6 + Math.random() * 2),
            vy: Math.sin(angle) * (6 + Math.random() * 2),
            char: binary[Math.floor(Math.random() * 2)],
            alpha: 1
        });
    }
    let frame = 0;
    function animateEject() {
        ctx.clearRect(0, 0, ejectCanvas.width, ejectCanvas.height);
        particles.forEach(p => {
            ctx.font = 'bold 13px monospace';
            ctx.fillStyle = `rgba(57,255,20,${p.alpha})`;
            ctx.fillText(p.char, p.x, p.y);
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= 0.04;
        });
        frame++;
        if (frame < 32) {
            requestAnimationFrame(animateEject);
        } else {
            ejectCanvas.style.transition = 'opacity 0.3s';
            ejectCanvas.style.opacity = '0';
            setTimeout(() => {
                if (ejectCanvas.parentNode) ejectCanvas.parentNode.removeChild(ejectCanvas);
            }, 350);
        }
    }
    animateEject();
});
// Binary intro animation: codes flow from center to corners and fade out
window.addEventListener('DOMContentLoaded', () => {
    const introCanvas = document.createElement('canvas');
    introCanvas.id = 'binaryIntro';
    introCanvas.style.position = 'fixed';
    introCanvas.style.top = '0';
    introCanvas.style.left = '0';
    introCanvas.style.width = '100vw';
    introCanvas.style.height = '100vh';
    introCanvas.style.zIndex = '2000';
    introCanvas.style.pointerEvents = 'none';
    document.body.appendChild(introCanvas);
    const ctx = introCanvas.getContext('2d');
    function resizeIntro() {
        introCanvas.width = window.innerWidth;
        introCanvas.height = window.innerHeight;
    }
    resizeIntro();
    window.addEventListener('resize', resizeIntro);
    const binary = ['0', '1'];
    const fontSize = 32;
    const cols = Math.floor(window.innerWidth / fontSize);
    const rows = Math.floor(window.innerHeight / fontSize);
    let revealRadius = 0;
    const maxRadius = Math.sqrt(window.innerWidth**2 + window.innerHeight**2) / 2 + 80;
    function animateIntro() {
        ctx.clearRect(0, 0, introCanvas.width, introCanvas.height);
        ctx.save();
        // Draw dense binary wall
        ctx.font = 'bold 32px monospace';
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                ctx.fillStyle = '#39ff14';
                ctx.fillText(binary[Math.floor(Math.random() * 2)], c * fontSize + 8, r * fontSize + 28);
            }
        }
        // Reveal circle from center
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(window.innerWidth/2, window.innerHeight/2, revealRadius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        ctx.restore();
        if (revealRadius < maxRadius) {
            revealRadius += 14; // slower reveal
            requestAnimationFrame(animateIntro);
        } else {
            introCanvas.style.transition = 'opacity 0.7s';
            introCanvas.style.opacity = '0';
            setTimeout(() => {
                if (introCanvas.parentNode) introCanvas.parentNode.removeChild(introCanvas);
            }, 800);
        }
    }
    animateIntro();
});
// Profile photo enlarge-to-fullscreen effect
const profileImg = document.querySelector('.profile-img');
let fullscreenProfile = false;
if (profileImg) {
    profileImg.addEventListener('click', () => {
        fullscreenProfile = !fullscreenProfile;
        if (fullscreenProfile) {
            profileImg.style.transition = 'all 0.4s cubic-bezier(.4,2,.3,1)';
            profileImg.style.position = 'fixed';
            profileImg.style.left = '50%';
            profileImg.style.top = '50%';
            profileImg.style.transform = 'translate(-50%, -50%) scale(2.8)';
            profileImg.style.zIndex = '5000';
            profileImg.style.boxShadow = '0 0 80px 20px #0d8abc88';
            profileImg.style.cursor = 'zoom-out';
        } else {
            profileImg.style.transition = 'all 0.4s cubic-bezier(.4,2,.3,1)';
            profileImg.style.position = '';
            profileImg.style.left = '';
            profileImg.style.top = '';
            profileImg.style.transform = '';
            profileImg.style.zIndex = '';
            profileImg.style.boxShadow = '';
            profileImg.style.cursor = '';
        }
    });
}
// Skill tooltips
document.querySelectorAll('.skill').forEach(skill => {
    skill.addEventListener('mouseenter', function() {
        let infoBox = document.createElement('div');
        infoBox.className = 'centered-skill-info';
        infoBox.textContent = skill.getAttribute('data-info');
        document.body.appendChild(infoBox);
        setTimeout(() => { infoBox.style.opacity = '1'; infoBox.style.pointerEvents = 'auto'; }, 10);
    });
    skill.addEventListener('mouseleave', function() {
        const infoBox = document.querySelector('.centered-skill-info');
        if (infoBox) document.body.removeChild(infoBox);
    });
});
    // Binary rain effect for left and right sides
let mousePosLeft = null;
let mousePosRight = null;
function binaryRain(canvasId, wave = false) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 120;
    const h = canvas.height = window.innerHeight;
    const fontSize = 18;
    const columns = Math.floor(w / fontSize);
    const drops = Array(columns).fill(0).map(() => Math.random() * -h);
    function draw() {
        ctx.clearRect(0, 0, w, h);
        ctx.font = 'bold 18px monospace';
        ctx.fillStyle = '#39ff14';
        const time = Date.now() / 900;
        for (let i = 0; i < columns; i++) {
            let x = i * fontSize;
            if (wave) {
                x += Math.sin(time + i * 0.5) * 12;
            }
            // Mouse escape effect
            let mousePos = canvasId === 'binaryLeft' ? mousePosLeft : mousePosRight;
            if (mousePos) {
                // Only affect columns near mouse X
                const dx = x - mousePos.x;
                if (Math.abs(dx) < 40) {
                    x += dx > 0 ? 30 : -30;
                }
            }
            for (let j = 0; j < 8; j++) {
                const text = Math.random() > 0.5 ? '0' : '1';
                ctx.globalAlpha = 0.7 - j * 0.08;
                ctx.fillText(text, x, drops[i] - j * fontSize);
            }
            drops[i] += 1.2;
            if (drops[i] > h + fontSize * 8) {
                drops[i] = Math.random() * -100;
            }
        }
        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
    }
    draw();
    // Mouse tracking for escape effect
    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        if (canvasId === 'binaryLeft') {
            mousePosLeft = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        } else {
            mousePosRight = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        }
    });
    canvas.addEventListener('mouseleave', function() {
        if (canvasId === 'binaryLeft') mousePosLeft = null;
        else mousePosRight = null;
    });
}

window.addEventListener('DOMContentLoaded', () => {
    if (window.innerWidth > 900) {
        binaryRain('binaryLeft', true); // left side with wave
        binaryRain('binaryRight', false); // right side normal
    }
});
// Binary code animation around profile image
let mousePos = null;
function binaryAnimation() {
    const canvas = document.getElementById('binaryCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = 200;
    canvas.width = size;
    canvas.height = size;
    ctx.clearRect(0, 0, size, size);
    const binary = ['0', '1'];
    const count = 40;
    for (let i = 0; i < count; i++) {
        const angle = (2 * Math.PI * i) / count;
        let radius = 85 + Math.sin(Date.now() / 700 + i) * 16;
        let x = size / 2 + Math.cos(angle) * radius;
        let y = size / 2 + Math.sin(angle) * radius;
        // If mouse is near, push binary away
        if (mousePos) {
            const dx = x - mousePos.x;
            const dy = y - mousePos.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 60) {
                const push = 60 - dist;
                x += dx / dist * push * 1.2;
                y += dy / dist * push * 1.2;
            }
        }
        ctx.font = 'bold 22px monospace';
        ctx.fillStyle = '#39ff14';
        ctx.globalAlpha = 0.85;
        ctx.fillText(binary[Math.floor(Math.random() * 2)], x, y);
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(binaryAnimation);
}
window.addEventListener('DOMContentLoaded', () => {
    binaryAnimation();
    const profileBg = document.querySelector('.profile-bg');
    if (profileBg) {
        profileBg.addEventListener('mousemove', function(e) {
            const rect = profileBg.getBoundingClientRect();
            mousePos = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
        });
        profileBg.addEventListener('mouseleave', function() {
            mousePos = null;
        });
    }
});
function fonk(){

    Date = new Date();
    
    window.alert(Date);

}
// Smooth scroll for navigation
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const section = document.querySelector(href);
            section.scrollIntoView({ behavior: 'smooth', block: 'center' });
            section.classList.add('section-highlight');
            setTimeout(() => {
                section.classList.remove('section-highlight');
            }, 700);
        }
    });
});

// Contact form handler
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        formMessage.textContent = 'Sending...';
        setTimeout(() => {
            formMessage.textContent = 'Thank you for reaching out! I will get back to you soon.';
            contactForm.reset();
        }, 1200);
    });
}

