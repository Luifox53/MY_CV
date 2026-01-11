document.addEventListener('DOMContentLoaded', () => {
    initStyles();
    initAnimations(); // Önce bu
    initLanguage();   // Sonra bu (observeTyping hazır olsun)
    initNavigation();
    initMouseEffects();
    initParticles();
    adjustHeroMargin();
});

// ============ 1. Style Injection ============
function initStyles() {
    if (document.querySelector('#dynamic-js-styles')) return;

    const styles = `
        @keyframes pulse3d { 0%, 100% { transform: scale(1) translateZ(0); opacity: 0.2; } 50% { transform: scale(1.8) translateZ(30px); opacity: 1; } }
        @keyframes letterGlow { 0% { opacity: 0; text-shadow: 0 0 10px rgba(240, 147, 251, 1); transform: scale(0.5); } 100% { opacity: 1; text-shadow: 0 0 0px rgba(240, 147, 251, 0); transform: scale(1); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes ripple { to { transform: scale(4); opacity: 0; } }
        @keyframes imageZoom { from { transform: scale(1) rotate(0deg); } to { transform: scale(1.1) rotate(3deg); } }
        @keyframes float-up { 0% { opacity: 0; transform: translateY(30px); } 100% { opacity: 1; transform: translateY(0); } }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.id = 'dynamic-js-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    if (!CSS.supports('--main-color', 'white')) {
        console.warn('CSS Variables not supported');
    }
}

// ============ 2. Animations (Typing Fix) ============
function initAnimations() {
    // --- A. Typing Animation (DÜZELTİLDİ: Çakışma Önleme) ---
    const typingObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('typing-done')) {
                animateTyping(entry.target);
                entry.target.classList.add('typing-done');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    // Global erişim için
    window.observeTyping = (elements) => {
        elements.forEach(el => {
            // Varsa eski animasyonu durdur
            if (el.typingTimeout) {
                clearTimeout(el.typingTimeout);
                el.typingTimeout = null;
            }
            el.classList.remove('typing-done');
            typingObserver.observe(el);
        });
    };

    document.querySelectorAll('.typing-text').forEach(el => typingObserver.observe(el));

    function animateTyping(element) {
        // 1. Önceki işlemi temizle (BUG FIX)
        if (element.typingTimeout) {
            clearTimeout(element.typingTimeout);
        }

        const text = element.textContent; // Güncel metni al
        element.textContent = ''; // İçini boşalt
        let index = 0;

        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                // 2. Timeout ID'sini elementin üzerine kaydet
                element.typingTimeout = setTimeout(type, 30);
            } else {
                element.typingTimeout = null;
            }
        }
        type();
    }

    // --- B. Skill Bars ---
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => bar.style.width = '0%');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const bar = entry.target;
            const targetWidth = bar.getAttribute('data-progress');

            if (entry.isIntersecting) {
                bar.style.transition = 'width 1.5s cubic-bezier(0.2, 1, 0.2, 1)'; 
                setTimeout(() => { bar.style.width = targetWidth + '%'; }, 100);
            } else {
                bar.style.transition = 'width 0.2s ease-out'; 
                bar.style.width = '0%';
            }
        });
    }, { threshold: 0.1 });

    skillBars.forEach(bar => skillObserver.observe(bar));

    // --- C. Hero Title Glow ---
    const title = document.querySelector('.hero-title');
    if (title && !title.querySelector('span')) {
        const originalText = title.textContent;
        title.innerHTML = '';
        [...originalText].forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animation = `letterGlow 0.3s ease-out ${i * 0.05}s forwards`;
            title.appendChild(span);
        });
    }

    // --- D. Scroll Reveals ---
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!entry.target.style.animation) {
                    entry.target.style.animation = 'slideInUp 0.8s ease forwards';
                }
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.project-card, .skill-box, .education-item, .project-item, .info-item').forEach(el => {
        revealObserver.observe(el);
    });

    // --- E. Number Counters ---
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.card-number').forEach(el => counterObserver.observe(el));

    function animateCounter(card) {
        const targetStr = card.textContent;
        const target = parseInt(targetStr);
        if (isNaN(target)) return;
        
        const suffix = targetStr.replace(/[0-9]/g, '');
        const duration = 2000;
        const startTime = Date.now();

        function update() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 4); 
            card.textContent = Math.floor(target * ease) + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        update();
    }
}

// ============ 3. Language Logic ============
function initLanguage() {
    let currentLanguage = localStorage.getItem('language') || 'en';
    const langToggle = document.querySelector('.language-toggle');
    const langText = document.querySelector('.language-toggle .lang-text');

    function updateContent() {
        if (langText) langText.textContent = currentLanguage === 'en' ? 'TR' : 'EN';
        else if (langToggle) langToggle.textContent = currentLanguage === 'en' ? 'TR' : 'EN';
        
        document.querySelectorAll('[data-en][data-tr]').forEach(element => {
            const text = currentLanguage === 'en' ? element.getAttribute('data-en') : element.getAttribute('data-tr');
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.hasAttribute('data-placeholder-en')) {
                    element.placeholder = currentLanguage === 'en' 
                        ? element.getAttribute('data-placeholder-en') 
                        : element.getAttribute('data-placeholder-tr');
                }
            } else if (element.classList.contains('typing-text')) {
                 // DÜZELTME: Eski timeout'u temizle
                 if (element.typingTimeout) {
                     clearTimeout(element.typingTimeout);
                     element.typingTimeout = null;
                 }
                 // Yeni metni hazırla ve animasyonu başlat
                 element.textContent = text;
                 if (window.observeTyping) {
                    window.observeTyping([element]);
                 }
            } else {
                element.textContent = text;
            }
        });
    }

    if (langToggle) {
        const newLangToggle = langToggle.cloneNode(true);
        langToggle.parentNode.replaceChild(newLangToggle, langToggle);

        newLangToggle.addEventListener('click', () => {
            currentLanguage = currentLanguage === 'en' ? 'tr' : 'en';
            localStorage.setItem('language', currentLanguage);
            updateContent();
        });
    }

    updateContent();
}

// ============ 4. Navigation & Menu ============
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger && navMenu) {
        hamburger.removeAttribute('onclick'); // HTML hatasını temizle

        const newHamburger = hamburger.cloneNode(true);
        hamburger.parentNode.replaceChild(newHamburger, hamburger);
        
        newHamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            newHamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        var activeHamburger = newHamburger;
    } else {
        var activeHamburger = document.querySelector('.hamburger');
    }

    function closeMenu() {
        if (activeHamburger && navMenu) {
            activeHamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !activeHamburger.contains(e.target)) {
                closeMenu();
            }
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
                closeMenu();
            }
        });
    });

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollPosition = window.scrollY;
                const sections = document.querySelectorAll('section[id]');
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop - 150;
                    const sectionHeight = section.clientHeight;
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        navLinks.forEach(link => link.classList.remove('active'));
                        const activeLink = document.querySelector(`a[href="#${section.id}"]`);
                        if (activeLink) activeLink.classList.add('active');
                    }
                });
                
                const stars = document.querySelector('.stars');
                if (stars) stars.style.transform = `translateY(${scrollPosition * 0.5}px)`;

                ticking = false;
            });
            ticking = true;
        }
    });
}

// ============ 5. Hero Margin Adjustment ============
function adjustHeroMargin() {
    const navbar = document.querySelector('.navbar');
    const hero = document.querySelector('.hero');
    if (navbar && hero) {
        hero.style.marginTop = navbar.offsetHeight + 'px';
    }
}
window.addEventListener('resize', adjustHeroMargin);

// ============ 6. Mouse Effects (Mobil Düzeltmesi Eklendi) ============
function initMouseEffects() {
    // KESİN ÇÖZÜM: Ekran 768px veya daha darsa (Mobil/Tablet) bu fonksiyonu durdur.
    // Böylece ne özel cursor çıkar, ne de kartlar titrer.
    if (window.innerWidth <= 768) return;

    const cursorFollower = document.createElement('div');
    const cursorCore = document.createElement('div');
    
    Object.assign(cursorFollower.style, {
        position: 'fixed', width: '30px', height: '30px',
        border: '2px solid rgba(240, 147, 251, 0.5)', borderRadius: '50%',
        pointerEvents: 'none', zIndex: '9999', mixBlendMode: 'screen',
        display: 'none', transition: 'transform 0.1s'
    });
    
    Object.assign(cursorCore.style, {
        position: 'fixed', width: '8px', height: '8px',
        background: 'rgba(102, 126, 234, 0.8)', borderRadius: '50%',
        pointerEvents: 'none', zIndex: '9998', display: 'none'
    });

    document.body.append(cursorFollower, cursorCore);

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let coreX = 0, coreY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorFollower.style.display = 'block';
        cursorCore.style.display = 'block';
        
        document.querySelectorAll('.morphing-shape').forEach((shape, index) => {
            shape.style.transform = `translate(${(mouseX - window.innerWidth/2) * 0.02}px, ${(mouseY - window.innerHeight/2) * 0.02}px)`;
        });

        const cube = document.querySelector('.cube');
        if (cube) {
             const rotX = (window.innerHeight / 2 - mouseY) * 0.1;
             const rotY = (mouseX - window.innerWidth / 2) * 0.1;
             cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
        }
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

    // Skill Box 3D Tilt Efekti
    document.querySelectorAll('.skill-box').forEach(box => {
        box.addEventListener('mousemove', (e) => {
            const rect = box.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateX = ((y - rect.height/2) / rect.height/2) * 15;
            const rotateY = ((x - rect.width/2) / rect.width/2) * 15;
            box.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.05)`;
        });
        box.addEventListener('mouseleave', () => {
            box.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(-15px) scale(1.05)';
        });
    });

    // Buton Ripple Efekti
    document.querySelectorAll('.cta-button').forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute; width: ${size}px; height: ${size}px;
                background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 70%);
                border-radius: 50%; left: ${x}px; top: ${y}px;
                pointer-events: none; animation: ripple 0.6s ease-out;
            `;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
            
            const targetId = this.textContent.includes('Explore') ? '#projects' : '#contact';
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                window.scrollTo({ top: target.offsetTop - navHeight, behavior: 'smooth' });
            }
        });
    });
    
    // Proje Resim Zoom Efekti
    document.querySelectorAll('.project-image').forEach(image => {
        image.addEventListener('mouseenter', () => {
            image.style.animation = 'imageZoom 0.5s ease-out';
            image.style.filter = 'brightness(1.3) contrast(1.2)';
        });
        image.addEventListener('mouseleave', () => {
            image.style.animation = 'none';
            image.style.filter = '';
        });
    });
}

// ============ 7. Particles ============
function initParticles() {
    if (window.innerWidth <= 768) return;
    const particleContainer = document.querySelector('.hero');
    if (!particleContainer) return;

    for (let i = 0; i < 60; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 1;
        particle.style.cssText = `
            position: absolute; width: ${size}px; height: ${size}px;
            background: rgba(102, 126, 234, ${Math.random() * 0.6 + 0.2});
            border-radius: 50%;
            top: ${Math.random() * 100}%; left: ${Math.random() * 100}%;
            animation: float ${Math.random() * 15 + 8}s linear infinite, pulse3d ${Math.random() * 4 + 2}s ease-in-out infinite;
            opacity: ${Math.random() * 0.6 + 0.2}; pointer-events: none;
        `;
        particleContainer.appendChild(particle);
    }
}