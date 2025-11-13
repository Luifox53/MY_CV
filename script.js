// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Hamburger Menu Toggle
function toggleMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.getElementById('navMenu');
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

function closeMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.getElementById('navMenu');
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (!navbar.contains(event.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Language Toggle
let currentLanguage = localStorage.getItem('portfolio-language') || 'en';

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'tr' : 'en';
    localStorage.setItem('portfolio-language', currentLanguage);
    updatePageLanguage();
}

function updatePageLanguage() {
    const lang = currentLanguage;
    
    // Update all elements with data-en and data-tr attributes
    document.querySelectorAll('[data-en][data-tr]').forEach(element => {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            // For form elements, update placeholder
            const placeholderKey = `data-placeholder-${lang}`;
            if (element.hasAttribute(placeholderKey)) {
                element.placeholder = element.getAttribute(placeholderKey);
            }
        } else if (element.tagName === 'A') {
            // For links, update text content
            element.textContent = element.getAttribute(`data-${lang}`);
        } else {
            // For other elements
            element.textContent = element.getAttribute(`data-${lang}`);
        }
    });
    
    // Update title
    const titleEn = 'Enes - Computer Engineering Portfolio';
    const titleTr = 'Enes - Bilgisayar Mühendisliği Portfolyosu';
    document.title = lang === 'en' ? titleEn : titleTr;
    
    // Update language button text
    const langButton = document.querySelector('.language-toggle');
    if (langButton) {
        langButton.textContent = lang === 'en' ? 'TR' : 'EN';
    }
}

// Initialize language on page load
window.addEventListener('DOMContentLoaded', updatePageLanguage);

// Code Animation Function
function animateCode(type) {
    const codeAnimation = document.getElementById('codeAnimation');
    codeAnimation.innerHTML = '';

    const codeSnippets = {
        hello: [
            'console.log("Hello, I\'m Enes!");',
            'console.log("Computer Engineering Student");',
            'console.log("3rd Year | University");',
            'console.log("Let\'s build something amazing! 🚀");'
        ],
        projects: [
            'const projects = [',
            '  { name: "YEDOKS", tech: ["IoT", "Microcontroller"] },',
            '  { name: "Transfer-Reservation Site", tech: ["PHP", "Web"] },',
            '  { name: "DB Management System", tech: ["MySQL", "Dia Diagram"] }',
            '];',
            'projects.forEach(p => console.log(p.name));'
        ],
        social: [
            'const socialMedia = {',
            '  instagram: "https://www.instagram.com/ens.kandemir",',
            '  linkedin: "https://linkedin.com/in/muhammed-enes-kandemir-5829602a1",',
            '  facebook: "https://www.facebook.com/muhammedenes.kandemir"',
            '};',
            'console.log("Let\'s connect! 🤝");'
        ]
    };

    const lines = codeSnippets[type] || codeSnippets.hello;
    
    lines.forEach((line, index) => {
        setTimeout(() => {
            const codeLine = document.createElement('div');
            codeLine.className = 'code-line';
            
            // For social media links, make them clickable
            if (type === 'social' && line.includes('https://')) {
                // Extract the URL
                const urlMatch = line.match(/"(https:\/\/[^"]+)"/);
                if (urlMatch) {
                    const url = urlMatch[1];
                    const platform = line.includes('instagram') ? 'Instagram' : 
                                   line.includes('linkedin') ? 'LinkedIn' : 'Facebook';
                    
                    const linkElement = document.createElement('a');
                    linkElement.href = url;
                    linkElement.target = '_blank';
                    linkElement.style.color = '#DC143C';
                    linkElement.style.cursor = 'pointer';
                    linkElement.style.textDecoration = 'underline';
                    linkElement.style.transition = 'color 0.3s';
                    linkElement.textContent = line;
                    
                    linkElement.addEventListener('mouseenter', function() {
                        this.style.color = '#fff';
                        this.style.textShadow = '0 0 15px #DC143C';
                    });
                    
                    linkElement.addEventListener('mouseleave', function() {
                        this.style.color = '#DC143C';
                        this.style.textShadow = 'none';
                    });
                    
                    codeLine.appendChild(linkElement);
                } else {
                    codeLine.textContent = line;
                }
            } else {
                codeLine.textContent = line;
            }
            
            codeAnimation.appendChild(codeLine);
        }, index * 200);
    });

    // Trigger button animation
    event.target.classList.add('btn-click');
    setTimeout(() => event.target.classList.remove('btn-click'), 200);
}

// Profile Photo Upload
function changeProfilePhoto() {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const profileImage = document.getElementById('profileImage');
            profileImage.src = event.target.result;
            
            // Add animation
            profileImage.style.animation = 'none';
            setTimeout(() => {
                profileImage.style.animation = 'profileLoad 0.5s ease-out';
            }, 10);
        };
        
        reader.readAsDataURL(file);
    };
    
    input.click();
}

// Add animation for profile load
const style = document.createElement('style');
style.textContent = `
    @keyframes profileLoad {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    .btn-click {
        animation: buttonPress 0.2s ease-out;
    }
    
    @keyframes buttonPress {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(0.95);
        }
        100% {
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

// Smooth fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    observer.observe(section);
});

// Add fade-in animation
const fadeInStyle = document.createElement('style');
fadeInStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(fadeInStyle);

// Enhanced input functionality for editable elements
document.querySelectorAll('.editable, .editable-inline').forEach(element => {
    element.addEventListener('blur', function() {
        // Save content if needed (can be extended to save to localStorage)
        console.log('Content updated:', this.textContent);
    });
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !this.classList.contains('editable')) {
            this.blur();
        }
    });
});

// Contact form handling
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const formData = new FormData(this);
    
    // Show success message
    alert('Thank you for your message! I will get back to you soon.');
    
    // Reset form
    this.reset();
    
    // You can send this data to a backend service
    console.log('Form submitted:', Object.fromEntries(formData));
});

// Active navigation highlight
window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.style.color = 'var(--light-red)';
        } else {
            link.style.color = 'var(--white)';
        }
    });
});

// Add hover effects to skill tags
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(2deg)';
    });
    
    tag.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Add hover effects to project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
});


// Animate skill tags on hover
document.querySelectorAll('.skill-tag').forEach(tag => {
    tag.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.borderRadius = '50%';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        
        // Position ripple
        const rect = this.getBoundingClientRect();
        ripple.style.left = (e.clientX - rect.left - 10) + 'px';
        ripple.style.top = (e.clientY - rect.top - 10) + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        from {
            opacity: 1;
            transform: scale(0);
        }
        to {
            opacity: 0;
            transform: scale(4);
        }
    }
    
    .skill-tag {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(rippleStyle);

// Save content to localStorage
function saveContent() {
    const content = {};
    
    // Save editable elements
    document.querySelectorAll('.editable, .editable-inline').forEach(element => {
        const key = element.getAttribute('data-key') || element.className;
        content[key] = element.textContent;
    });
    
    // Save input fields
    document.querySelectorAll('.editable-input').forEach(input => {
        const label = input.previousElementSibling.textContent;
        content[label] = input.value;
    });
    
    localStorage.setItem('portfolioContent', JSON.stringify(content));
}

// Load content from localStorage
function loadContent() {
    const saved = localStorage.getItem('portfolioContent');
    if (saved) {
        const content = JSON.parse(saved);
        
        document.querySelectorAll('.editable, .editable-inline').forEach(element => {
            const key = element.getAttribute('data-key') || element.className;
            if (content[key]) {
                element.textContent = content[key];
            }
        });
        
        document.querySelectorAll('.editable-input').forEach(input => {
            const label = input.previousElementSibling.textContent;
            if (content[label]) {
                input.value = content[label];
            }
        });
    }
}

// Auto-save content every 30 seconds
setInterval(saveContent, 30000);

// Load content when page loads
window.addEventListener('load', loadContent);

// Save content when user leaves
window.addEventListener('beforeunload', saveContent);

// Add event listeners to save on change
document.querySelectorAll('.editable, .editable-inline, .editable-input').forEach(element => {
    element.addEventListener('change', saveContent);
    element.addEventListener('blur', saveContent);
});
