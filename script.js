/* 
==============================================
   Muhammed Enes Kandemir - Portfolyo JS
============================================== 
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize AOS Animation
    AOS.init({
        once: true,
        offset: 50,
        duration: 800,
        easing: 'ease-in-out-cubic'
    });

    // 2. Set Current Year in Footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // 3. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Mobile Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const closeMenu = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    hamburger.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });

    closeMenu.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });

    // 5. Active Nav Link on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 6. tsParticles Initialization (Hero Background)
    tsParticles.load("tsparticles", {
        fpsLimit: 60,
        particles: {
            color: {
                value: ["#4F46E5", "#7C3AED", "#818CF8"]
            },
            links: {
                color: "#A78BFA",
                distance: 150,
                enable: true,
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 1.5,
                direction: "none",
                random: false,
                straight: false,
                outModes: "out"
            },
            number: {
                density: {
                    enable: true,
                    area: 800
                },
                value: 60
            },
            opacity: {
                value: 0.3
            },
            shape: {
                type: "circle"
            },
            size: {
                value: { min: 1, max: 3 }
            }
        },
        interactivity: {
            events: {
                onHover: {
                    enable: true,
                    mode: "grab"
                },
                onClick: {
                    enable: true,
                    mode: "push"
                }
            },
            modes: {
                grab: {
                    distance: 140,
                    links: {
                        opacity: 0.5
                    }
                },
                push: {
                    quantity: 3
                }
            }
        },
        detectRetina: true
    });

    // 7. Typed.js Initialization
    const typeStrings = {
        tr: ["Bilgisayar Mühendisliği Öğrencisi", "Yazılım Geliştirici", "IoT Meraklısı", "Web Developer"],
        en: ["Computer Engineering Student", "Software Developer", "IoT Enthusiast", "Web Developer"]
    };
    
    let typed = new Typed('#typed', {
        strings: typeStrings.tr,
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 1500,
        loop: true
    });

    // 8. CountUp.js Initialization & Intersection Observer for Stats
    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const projectsCount = new countUp.CountUp('stat-projects', 15, { duration: 2.5 });
                const techCount = new countUp.CountUp('stat-tech', 12, { duration: 2.5 });
                const yearCount = new countUp.CountUp('stat-year', 3, { duration: 2.5 });
                const coffeeCount = new countUp.CountUp('stat-coffee', 1240, { duration: 2.5 });

                if (!projectsCount.error) projectsCount.start();
                if (!techCount.error) techCount.start();
                if (!yearCount.error) yearCount.start();
                if (!coffeeCount.error) coffeeCount.start();
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const aboutStats = document.querySelector('.about-stats');
    if (aboutStats) {
        statsObserver.observe(aboutStats);
    }

    // 9. Skill Bar Animation Observer
    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.getAttribute('data-width');
                bar.style.width = targetWidth;
                observer.unobserve(bar);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.skill-bar').forEach(bar => {
        skillObserver.observe(bar);
    });

    // 10. EmailJS Contact Form
    // ================================================================
    // EmailJS Ayarları — Aşağıdaki 3 değeri kendi bilgilerinle doldur
    // emailjs.com adresinden ücretsiz hesap açarak bu değerleri alabilirsin
    // ================================================================
    const EMAILJS_PUBLIC_KEY  = 'YTXA7kEwATDqxkViq';   // Account > General > Public Key
    const EMAILJS_SERVICE_ID  = 'service_lqvvqa4';   // Email Services > Service ID
    const EMAILJS_TEMPLATE_ID = 'template_yskn8wd';  // Email Templates > Template ID
    // ================================================================

    // EmailJS'i başlat (yukarıdaki key doldurulduktan sonra aktif olur)
    if (EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const btn = this.querySelector('.submit-btn');
            const originalBtnText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
            btn.disabled = true;

            // EmailJS ayarları girilmediyse sahte demo modu
            if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
                setTimeout(() => {
                    formMessage.textContent = '⚠️ Demo Modu: EmailJS ayarları henüz yapılmadı. Gerçek mail göndermek için script.js içindeki EMAILJS_PUBLIC_KEY, EMAILJS_SERVICE_ID ve EMAILJS_TEMPLATE_ID değerlerini doldurun.';
                    formMessage.className = 'form-message error';
                    btn.innerHTML = originalBtnText;
                    btn.disabled = false;
                    setTimeout(() => { formMessage.style.display = 'none'; }, 7000);
                }, 500);
                return;
            }

            // Gerçek EmailJS gönderimi
            emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
                .then(function() {
                    formMessage.textContent = '✅ Mesajınız başarıyla gönderildi! Size en kısa sürede dönüş yapacağım.';
                    formMessage.className = 'form-message success';
                    contactForm.reset();
                }, function(error) {
                    formMessage.textContent = '❌ Bir hata oluştu. Lütfen daha sonra tekrar deneyin veya bana doğrudan mail atın.';
                    formMessage.className = 'form-message error';
                    console.error('EmailJS Error:', error);
                })
                .finally(function() {
                    btn.innerHTML = originalBtnText;
                    btn.disabled = false;
                    setTimeout(() => { formMessage.style.display = 'none'; }, 6000);
                });
        });
    }

    // 11. Language Switcher (Basic Dictionary approach)
    const dict = {
        tr: {
            "nav.home": "Anasayfa",
            "nav.about": "Hakkımda",
            "nav.skills": "Yetenekler",
            "nav.education": "Eğitim",
            "nav.projects": "Projeler",
            "nav.contact": "İletişim",
            "hero.greeting": "Merhaba, Ben",
            "hero.iam": "Ben bir ",
            "hero.desc": "Yenilikçi teknolojilerle problemleri çözen, öğrenmeye ve gelişmeye aç tutkulu bir mühendis adayıyım.",
            "hero.contact": "İletişime Geç",
            "hero.download": "CV İndir <i class=\"fas fa-download\"></i>",
            "about.subtitle": "Benimle Tanışın",
            "about.title": "Hakkımda",
            "about.role": "Bilgisayar Mühendisliği Öğrencisi",
            "about.p1": "Artvin Çoruh Üniversitesi'nde Bilgisayar Mühendisliği 3. sınıf öğrencisiyim. Teknolojiye olan tutkumla, hem donanım hem de yazılım alanlarında kendimi geliştiriyorum.",
            "about.p2": "Özellikle Nesnelerin İnterneti (IoT), web geliştirme ve veri yönetimi konularında projelere imza atıyorum. Karmaşık problemleri basit ve etkili kodlarla çözmeyi seviyor, sürekli öğrenme odaklı çalışıyorum.",
            "about.email": "E-posta:",
            "about.location": "Konum:",
            "about.locationVal": "İstanbul, Türkiye",
            "about.phone": "Telefon:",
            "stats.projects": "Tamamlanan Proje",
            "stats.tech": "Öğrenilen Teknoloji",
            "stats.year": "Üniversite Yılı",
            "stats.coffee": "İçilen Kahve",
            "skills.subtitle": "Neler Yapabilirim?",
            "skills.title": "Yetenekler",
            "skills.cat1": "Programlama Dilleri",
            "skills.cat2": "Web & Diğer",
            "skills.cat3": "Profesyonel Yetenekler",
            "skills.soft1": "Problem Çözme (%93)",
            "skills.soft2": "Proje Yürütücülüğü (%87)",
            "skills.soft3": "İngilizce (B2 / %80)",
            "skills.soft4": "Takım Çalışması",
            "skills.soft5": "Analitik Düşünme",
            "education.subtitle": "Akademik Geçmişim",
            "education.title": "Eğitim",
            "education.uni": "Lisans - Bilgisayar Mühendisliği (3. Sınıf)",
            "education.uniDesc": "Algoritmalar, Veri Yapıları, IoT, Web Geliştirme ve Yazılım Mühendisliği alanlarında akademik çalışmalar ve projeler.",
            "education.hs": "Lise - Mezun",
            "education.hsDesc": "Sayısal bölüm. Temel matematik ve fen bilimleri altyapısı.",
            "projects.subtitle": "Son Çalışmalarım",
            "projects.title": "Projeler",
            "projects.type1": "Öne Çıkan Proje - Akıllı Sulama Sistemi",
            "projects.desc1": "Yenilenebilir enerjiye dayalı otonom, akıllı ve veri odaklı kampüs sulama sistemi.",
            "projects.type2": "Canlı Proje - VIP Transfer Rezervasyon",
            "projects.desc2": "Antalya içi VIP transfere ihtiyacı olan müşterilerin araç rezervasyonu yapmasına olanak sağlayan web sitesi.",
            "projects.type3": "Akademik Proje - Veritabanı Yönetim Aracı",
            "projects.desc3": "Veri organizasyonu ve analizi için kapsamlı araçlara sahip veritabanı yönetim sistemi.",
            "contact.subtitle": "Bana Ulaşın",
            "contact.title": "İletişim",
            "contact.infoTitle": "İletişim Bilgileri",
            "contact.infoDesc": "Projeleriniz için görüşmek veya sadece merhaba demek isterseniz bana ulaşabilirsiniz.",
            "contact.phone": "Telefon",
            "contact.locTitle": "Konum",
            "contact.formName": "Adınız Soyadınız",
            "contact.formSubject": "Konu",
            "contact.formMsg": "Mesajınız",
            "contact.send": "Gönder",
            "footer.rights": "Tüm hakları saklıdır."
        },
        en: {
            "nav.home": "Home",
            "nav.about": "About",
            "nav.skills": "Skills",
            "nav.education": "Education",
            "nav.projects": "Projects",
            "nav.contact": "Contact",
            "hero.greeting": "Hello, I'm",
            "hero.iam": "I am a ",
            "hero.desc": "A passionate engineering student eager to learn and develop, solving problems with innovative technologies.",
            "hero.contact": "Get in Touch",
            "hero.download": "Download CV <i class=\"fas fa-download\"></i>",
            "about.subtitle": "Get to Know Me",
            "about.title": "About Me",
            "about.role": "Computer Engineering Student",
            "about.p1": "I am a 3rd-year Computer Engineering student at Artvin Çoruh University. With my passion for technology, I am developing myself in both hardware and software fields.",
            "about.p2": "I specifically undertake projects in Internet of Things (IoT), web development, and data management. I enjoy solving complex problems with simple and effective codes and work with a focus on continuous learning.",
            "about.email": "Email:",
            "about.location": "Location:",
            "about.locationVal": "Istanbul, Turkey",
            "about.phone": "Phone:",
            "stats.projects": "Completed Projects",
            "stats.tech": "Technologies Learned",
            "stats.year": "University Year",
            "stats.coffee": "Coffees Consumed",
            "skills.subtitle": "What Can I Do?",
            "skills.title": "Skills",
            "skills.cat1": "Programming Languages",
            "skills.cat2": "Web & Others",
            "skills.cat3": "Professional Skills",
            "skills.soft1": "Problem Solving (93%)",
            "skills.soft2": "Project Management (87%)",
            "skills.soft3": "English (B2 / 80%)",
            "skills.soft4": "Teamwork",
            "skills.soft5": "Analytical Thinking",
            "education.subtitle": "My Academic Background",
            "education.title": "Education",
            "education.uni": "Bachelor's - Computer Engineering (3rd Year)",
            "education.uniDesc": "Academic studies and projects in Algorithms, Data Structures, IoT, Web Development, and Software Engineering.",
            "education.hs": "High School - Graduate",
            "education.hsDesc": "Science department. Basic mathematics and natural sciences background.",
            "projects.subtitle": "My Recent Works",
            "projects.title": "Projects",
            "projects.type1": "Featured Project - Smart Irrigation System",
            "projects.desc1": "Autonomous, smart, and data-driven campus irrigation system based on renewable energy.",
            "projects.type2": "Live Project - VIP Transfer Reservation",
            "projects.desc2": "A website allowing customers needing VIP transfers in Antalya to book vehicles.",
            "projects.type3": "Academic Project - Database Management Tool",
            "projects.desc3": "A database management system with comprehensive tools for data organization and analysis.",
            "contact.subtitle": "Get In Touch",
            "contact.title": "Contact",
            "contact.infoTitle": "Contact Information",
            "contact.infoDesc": "If you want to discuss your projects or just say hello, you can reach out to me.",
            "contact.phone": "Phone",
            "contact.locTitle": "Location",
            "contact.formName": "Full Name",
            "contact.formSubject": "Subject",
            "contact.formMsg": "Your Message",
            "contact.send": "Send",
            "footer.rights": "All rights reserved."
        }
    };

    const langTrBtns = document.querySelectorAll('#lang-tr, #mobile-lang-tr');
    const langEnBtns = document.querySelectorAll('#lang-en, #mobile-lang-en');
    
    function setLanguage(lang) {
        // Update HTML lang attribute to fix text-transform: uppercase localization issues (e.g., 'i' to 'İ')
        document.documentElement.lang = lang;

        // Update Typed.js
        typed.destroy();
        typed = new Typed('#typed', {
            strings: typeStrings[lang],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 1500,
            loop: true
        });

        // Update Text Elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (dict[lang][key]) {
                el.innerHTML = dict[lang][key];
            }
        });

        // Update Active Buttons
        if (lang === 'tr') {
            langTrBtns.forEach(btn => btn.classList.add('active'));
            langEnBtns.forEach(btn => btn.classList.remove('active'));
        } else {
            langEnBtns.forEach(btn => btn.classList.add('active'));
            langTrBtns.forEach(btn => btn.classList.remove('active'));
        }

        // Update Input Placeholders manually if needed (using floating labels here, so labels were updated)
    }

    langTrBtns.forEach(btn => {
        btn.addEventListener('click', () => setLanguage('tr'));
    });

    langEnBtns.forEach(btn => {
        btn.addEventListener('click', () => setLanguage('en'));
    });
});
