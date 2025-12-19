// ============ Hamburger Menu Toggle ============
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    }
}

function closeMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
}

// Close menu when clicking on a nav link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (navbar && !navbar.contains(e.target)) {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// ============ Smooth Scrolling & Navigation ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
            updateActiveNav();
        }
    });
});

// ============ Language Toggle ============
let currentLanguage = localStorage.getItem('language') || 'en';

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'tr' : 'en';
    localStorage.setItem('language', currentLanguage);
    updateLanguage();
}

function updateLanguage() {
    const langToggle = document.querySelector('.language-toggle .lang-text');
    if (langToggle) {
        langToggle.textContent = currentLanguage === 'en' ? 'TR' : 'EN';
    }
    
    document.querySelectorAll('[data-en][data-tr]').forEach(element => {
        const text = currentLanguage === 'en' ? element.getAttribute('data-en') : element.getAttribute('data-tr');
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            if (element.hasAttribute('data-placeholder-en') && element.hasAttribute('data-placeholder-tr')) {
                element.placeholder = currentLanguage === 'en' ? element.getAttribute('data-placeholder-en') : element.getAttribute('data-placeholder-tr');
            }
        } else {
            element.textContent = text;
        }
    });
}

// Initialize language on page load
document.addEventListener('DOMContentLoaded', updateLanguage);

// ============ Typing Animation for About Section ============
let typingInProgress = false;
let typingTimeout = null;

const typingObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('typing-done') && !typingInProgress) {
            animateTyping(entry.target);
            entry.target.classList.add('typing-done');
            typingObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

function animateTyping(element) {
    const text = element.textContent;
    element.textContent = '';
    let index = 0;
    const speed = 30; // milliseconds per character
    typingInProgress = true;

    function type() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            typingTimeout = setTimeout(type, speed);
        } else {
            typingInProgress = false;
        }
    }

    type();
}

// Observe typing text elements
document.querySelectorAll('.typing-text').forEach(el => {
    typingObserver.observe(el);
});

// Update language toggle to properly handle typing animation
const originalToggleLanguage = toggleLanguage;
toggleLanguage = function() {
    // Clear any ongoing typing animation
    if (typingTimeout) {
        clearTimeout(typingTimeout);
        typingTimeout = null;
    }
    typingInProgress = false;
    
    originalToggleLanguage();
    
    // Reset typing animation for all text elements
    setTimeout(() => {
        document.querySelectorAll('.typing-text').forEach(el => {
            el.classList.remove('typing-done');
            el.textContent = currentLanguage === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-tr');
            typingObserver.observe(el);
        });
    }, 50);
};

// Update active nav link on scroll
window.addEventListener('scroll', updateActiveNav);

function updateActiveNav() {
    const scrollPosition = window.scrollY;
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`a[href="#${section.id}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
}

// ============ Intersection Observer for Animations ============
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card, .skill-box').forEach(el => {
    observer.observe(el);
});

// ============ Advanced Scroll Animations ============
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = `float-up 0.8s ease-out forwards`;
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card, .skill-box, section').forEach(el => {
    scrollObserver.observe(el);
});

// ============ Mouse Position Tracking for Shapes ============
let mousePos = { x: 0, y: 0 };

document.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
    
    // Update morphing shapes
    document.querySelectorAll('.morphing-shape').forEach((shape, index) => {
        const offset = index * 50;
        shape.style.transform = `translate(${(mousePos.x - window.innerWidth / 2) * 0.02}px, ${(mousePos.y - window.innerHeight / 2) * 0.02}px)`;
    });
});

// ============ Enhanced Parallax Scroll Effect ============
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Parallax on hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    // Parallax on shapes
    document.querySelectorAll('.morphing-shape').forEach((shape, index) => {
        shape.style.transform = `translateY(${scrolled * (0.3 + index * 0.1)}px)`;
    });
});

// ============ Parallax Effect ============
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.stars');
    if (parallax) {
        parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// ============ CTA Button Actions ============
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function() {
        const targetId = this.textContent.includes('Explore') ? '#projects' : '#contact';
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ============ Enhanced Mouse Cursor Effect ============
const cursorFollower = document.createElement('div');
cursorFollower.style.cssText = `
    position: fixed;
    width: 30px;
    height: 30px;
    border: 2px solid rgba(240, 147, 251, 0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: screen;
    display: none;
    box-shadow: 0 0 20px rgba(240, 147, 251, 0.6), inset 0 0 20px rgba(102, 126, 234, 0.3);
`;
document.body.appendChild(cursorFollower);

const cursorCore = document.createElement('div');
cursorCore.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    background: rgba(102, 126, 234, 0.8);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9998;
    display: none;
    box-shadow: 0 0 15px rgba(102, 126, 234, 1);
`;
document.body.appendChild(cursorCore);

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;
let coreX = 0, coreY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorFollower.style.display = 'block';
    cursorCore.style.display = 'block';
});

function animateCursor() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    coreX += (mouseX - coreX) * 0.25;
    coreY += (mouseY - coreY) * 0.25;
    
    cursorFollower.style.left = (followerX - 15) + 'px';
    cursorFollower.style.top = (followerY - 15) + 'px';
    cursorCore.style.left = (coreX - 4) + 'px';
    cursorCore.style.top = (coreY - 4) + 'px';
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// ============ Interactive Cube ============
const cube = document.querySelector('.cube');
let rotationX = 0;
let rotationY = 0;
let autoRotate = true;

// Auto rotation
function autoCubeRotation() {
    if (autoRotate) {
        rotationX += 0.5;
        rotationY += 0.5;
        cube.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
    }
    requestAnimationFrame(autoCubeRotation);
}

autoCubeRotation();

// Mouse control
document.addEventListener('mousemove', (e) => {
    if (!autoRotate) return;
    const x = (window.innerHeight / 2 - e.clientY) * 0.1;
    const y = (e.clientX - window.innerWidth / 2) * 0.1;
    cube.style.transform = `rotateX(${rotationX + x}deg) rotateY(${rotationY + y}deg)`;
});

// ============ Particle Background Effect ============
function createParticles() {
    const particleContainer = document.querySelector('.hero');
    const particleCount = 80;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 1;
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(102, 126, 234, ${Math.random() * 0.6 + 0.2});
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 15 + 8}s linear infinite, pulse3d ${Math.random() * 4 + 2}s ease-in-out infinite;
            opacity: ${Math.random() * 0.6 + 0.2};
            box-shadow: 0 0 ${size * 3}px rgba(102, 126, 234, 0.9), 0 0 ${size * 6}px rgba(240, 147, 251, 0.5);
        `;
        particleContainer.appendChild(particle);
    }
}

// Create particles only on large screens
if (window.innerWidth > 768) {
    createParticles();
}

// Add animation keyframes
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes pulse3d {
        0%, 100% { 
            transform: scale(1) translateZ(0);
            opacity: 0.2;
        }
        50% { 
            transform: scale(1.8) translateZ(30px);
            opacity: 1;
        }
    }

    @keyframes orbitAround {
        0% { transform: rotate(0deg) translateX(150px) rotate(0deg); }
        100% { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
    }

    @keyframes shimmer {
        0% { background-position: -1000px 0; }
        100% { background-position: 1000px 0; }
    }

    @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
    }

    @keyframes floatingText {
        0%, 100% { 
            transform: translateY(0px) rotateZ(0deg);
            opacity: 0.6;
        }
        50% { 
            transform: translateY(-20px) rotateZ(5deg);
            opacity: 1;
        }
    }

    @keyframes colorShift {
        0% { filter: hue-rotate(0deg); }
        50% { filter: hue-rotate(30deg); }
        100% { filter: hue-rotate(0deg); }
    }

    @keyframes expandPulse {
        0% { 
            transform: scale(0);
            opacity: 1;
        }
        100% { 
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyles);

// ============ Smooth Project Card Hover ============
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
});

// ============ Counter Animation ============
function animateCounters() {
    const cards = document.querySelectorAll('.card-number');
    
    cards.forEach(card => {
        const target = parseInt(card.textContent);
        const isPercent = card.textContent.includes('%');
        const duration = 2000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            if (isPercent) {
                card.textContent = Math.floor(target * progress) + '%';
            } else if (card.textContent.includes('+')) {
                card.textContent = Math.floor(target * progress) + '+';
            } else {
                card.textContent = Math.floor(target * progress);
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        // Start animation when card comes into view
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animate();
                    observer.unobserve(entry.target);
                }
            });
        });

        observer.observe(card);
    });
}

animateCounters();

// ============ Advanced Typing with Glow Effect ============
function glowingType(element, text, speed = 50) {
    let index = 0;
    element.innerHTML = '';

    function type() {
        if (index < text.length) {
            const span = document.createElement('span');
            span.textContent = text.charAt(index);
            span.style.cssText = `
                animation: letterGlow 0.3s ease-out;
            `;
            element.appendChild(span);
            index++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Apply typing effect on load
window.addEventListener('load', () => {
    const title = document.querySelector('.hero-title');
    if (title) {
        const originalText = title.textContent;
        glowingType(title, originalText, 30);
    }
});

// Add glow animation
const glowKeyframes = document.createElement('style');
glowKeyframes.textContent = `
    @keyframes letterGlow {
        0% {
            opacity: 0;
            text-shadow: 0 0 10px rgba(240, 147, 251, 1);
            transform: scale(0.5);
        }
        100% {
            opacity: 1;
            text-shadow: 0 0 0px rgba(240, 147, 251, 0);
            transform: scale(1);
        }
    }
`;
document.head.appendChild(glowKeyframes);

// ============ Scroll Reveal Animation ============
const revealStyle = document.createElement('style');
revealStyle.textContent = `
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slideInDown {
        from {
            opacity: 0;
            transform: translateY(-30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(revealStyle);

// ============ Mobile Menu Toggle ============
function initMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    
    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.style.display = 'none';
        });
    });
}

window.addEventListener('load', initMobileMenu);

// ============ Smooth Scroll on Load ============
window.addEventListener('load', () => {
    updateActiveNav();
});

// ============ Floating Animation Fix ============
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { 
            transform: translateY(0px);
        }
        50% { 
            transform: translateY(-20px);
        }
    }
`;
document.head.appendChild(style);

// ============ Random Star Generation ============
function generateRandomStars() {
    const starsContainer = document.querySelector('.stars');
    if (!starsContainer) return;

    const starsHTML = `
        <svg style="position: absolute; width: 100%; height: 100%; top: 0; left: 0;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
    `;

    let svg = starsHTML;
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * 1920;
        const y = Math.random() * 1080;
        const size = Math.random() * 2;
        const opacity = Math.random() * 0.7 + 0.3;
        svg += `<circle cx="${x}" cy="${y}" r="${size}" fill="white" opacity="${opacity}"/>`;
    }

    svg += '</svg>';
    starsContainer.innerHTML = svg;
}

// generateRandomStars();

// ============ Add CSS Variables Support ============
if (!CSS.supports('--main-color', 'white')) {
    console.warn('CSS Variables not supported');
}

// ============ Preload Animations ============
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    console.log('%c🌟 Portfolio loaded with 3D magic!', 'color: #667eea; font-size: 14px; font-weight: bold;');
});

// ============ Performance Optimization ============
// Use requestAnimationFrame for smooth animations
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateActiveNav();
            ticking = false;
        });
        ticking = true;
    }
});

console.log('%c✨ Welcome to the 3D Portfolio Experience!', 'color: #f093fb; font-size: 16px; font-weight: bold;');
console.log('%c💜 Enjoy the animations!', 'color: #667eea; font-size: 14px;');

// ============ 3D Tilt Effect on Skill Boxes ============
document.querySelectorAll('.skill-box').forEach(box => {
    box.addEventListener('mousemove', (e) => {
        const rect = box.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 15;
        const rotateY = ((x - centerX) / centerX) * 15;
        
        box.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.05)`;
        box.style.boxShadow = `0 30px 60px rgba(240, 147, 251, 0.5)`;
    });

    box.addEventListener('mouseleave', () => {
        box.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-15px) scale(1.05)';
        box.style.boxShadow = '0 20px 50px rgba(240, 147, 251, 0.4)';
    });
});

// ============ Enhanced Card Animations ============
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'perspective(1000px) rotateX(-15deg) translateY(-20px) scale(1.08)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(-15px) rotateX(-10deg) scale(1.05)';
    });
});

// ============ Button Ripple Effect ============
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
        `;
        
        if (!document.querySelector('style[data-ripple]')) {
            const rippleKeyframes = document.createElement('style');
            rippleKeyframes.setAttribute('data-ripple', 'true');
            rippleKeyframes.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(rippleKeyframes);
        }
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// ============ Link Hover Electricity ============
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('mouseenter', () => {
        link.style.textShadow = '0 0 10px rgba(102, 126, 234, 1), 0 0 20px rgba(240, 147, 251, 0.8)';
    });
    
    link.addEventListener('mouseleave', () => {
        link.style.textShadow = 'none';
    });
});

// ============ Section Title Glow ============
document.querySelectorAll('.section-title').forEach(title => {
    title.addEventListener('mouseenter', () => {
        title.style.textShadow = '0 0 20px rgba(240, 147, 251, 0.8), 0 0 40px rgba(102, 126, 234, 0.6)';
        title.style.animation = 'colorShift 2s ease infinite';
    });
    
    title.addEventListener('mouseleave', () => {
        title.style.textShadow = 'none';
        title.style.animation = 'none';
    });
});

// ============ Project Image Hover Animation ============
document.querySelectorAll('.project-image').forEach(image => {
    image.addEventListener('mouseenter', () => {
        image.style.animation = 'imageZoom 0.5s ease-out';
        image.style.filter = 'brightness(1.3) contrast(1.2)';
    });
    
    image.addEventListener('mouseleave', () => {
        image.style.animation = 'none';
        image.style.filter = 'brightness(1) contrast(1)';
    });
});

// Add image zoom animation
if (!document.querySelector('style[data-image-zoom]')) {
    const imageZoomStyle = document.createElement('style');
    imageZoomStyle.setAttribute('data-image-zoom', 'true');
    imageZoomStyle.textContent = `
        @keyframes imageZoom {
            from { transform: scale(1) rotate(0deg); }
            to { transform: scale(1.1) rotate(3deg); }
        }
    `;
    document.head.appendChild(imageZoomStyle);
}

// ============ Skill Progress Bar Animation ============
const skillProgressObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                const progress = bar.getAttribute('data-progress');
                // Check if already animated
                if (bar.style.width === '0%' || bar.style.width === '') {
                    setTimeout(() => {
                        bar.style.width = progress + '%';
                    }, 200);
                }
            });
            skillProgressObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.skill-category').forEach(category => {
    skillProgressObserver.observe(category);
});
