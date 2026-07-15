/* ========================================
   Esencia Café - Landing Page Scripts
   ======================================== */

document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // HEADER SCROLL EFFECT
    // ========================================
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    function handleHeaderScroll() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }
    
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    
    // ========================================
    // MOBILE MENU
    // ========================================
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');
    
    function toggleMobileMenu() {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }
    
    menuBtn.addEventListener('click', toggleMobileMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // ========================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ========================================
    // MENU TABS
    // ========================================
    const menuTabs = document.querySelectorAll('.menu__tab');
    const menuGrids = document.querySelectorAll('.menu__grid');
    
    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update active tab
            menuTabs.forEach(t => t.classList.remove('menu__tab--active'));
            tab.classList.add('menu__tab--active');
            
            // Show target content
            menuGrids.forEach(grid => {
                grid.classList.remove('menu__grid--active');
                if (grid.dataset.tabContent === targetTab) {
                    grid.classList.add('menu__grid--active');
                    // Re-trigger animations for visible items
                    const items = grid.querySelectorAll('.menu__item');
                    items.forEach((item, index) => {
                        item.classList.remove('visible');
                        setTimeout(() => {
                            item.classList.add('visible');
                        }, index * 100);
                    });
                }
            });
        });
    });
    
    // ========================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ========================================
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.differential, .menu__item, .moment, .testimonial, .featured__content'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // ========================================
    // ACTIVE NAV LINK ON SCROLL
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav-link');
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    
    // ========================================
    // PARALLAX EFFECT FOR HERO (subtle)
    // ========================================
    const heroImg = document.querySelector('.hero__img');
    
    function handleParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        
        if (heroImg && scrolled < window.innerHeight) {
            heroImg.style.transform = `scale(1.05) translateY(${rate}px)`;
        }
    }
    
    window.addEventListener('scroll', handleParallax, { passive: true });
    
    // ========================================
    // ANIMATE COUNTERS (for rating)
    // ========================================
    const ratingScore = document.querySelector('.testimonials__rating-score');
    let hasAnimated = false;
    
    function animateRating() {
        if (hasAnimated) return;
        
        const rect = ratingScore.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            hasAnimated = true;
            let current = 0;
            const target = 5.0;
            const increment = target / 30;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                ratingScore.textContent = current.toFixed(1);
            }, 50);
        }
    }
    
    window.addEventListener('scroll', animateRating, { passive: true });
    
    // ========================================
    // LAZY LOAD IMAGES (fallback for browsers without native support)
    // ========================================
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            img.src = img.src; // Trigger load
        });
    }
    
    // ========================================
    // HIDE WHATSAPP FLOAT ON FOOTER
    // ========================================
    const whatsappFloat = document.querySelector('.whatsapp-float');
    const footer = document.querySelector('.footer');
    
    function checkWhatsAppVisibility() {
        if (!footer) return;
        
        const footerRect = footer.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (footerRect.top < windowHeight - 100) {
            whatsappFloat.style.opacity = '0';
            whatsappFloat.style.pointerEvents = 'none';
        } else {
            whatsappFloat.style.opacity = '1';
            whatsappFloat.style.pointerEvents = 'auto';
        }
    }
    
    window.addEventListener('scroll', checkWhatsAppVisibility, { passive: true });
    
    // ========================================
    // INITIAL CALLS
    // ========================================
    handleHeaderScroll();
    updateActiveNav();
    checkWhatsAppVisibility();
    
    // Trigger animations for elements already in view
    setTimeout(() => {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('visible');
            }
        });
    }, 100);
});